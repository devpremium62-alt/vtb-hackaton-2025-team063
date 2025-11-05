from datetime import timedelta
from django.utils import timezone
from .models import Bank, BankToken, UserBankProfile, AccountSharing, Consent
from .clients import BankClientFactory


class BankManagementService:
    @staticmethod
    def add_new_bank(
        name, base_url, client_id, client_secret, custom_name=None
    ):
        bank, created = Bank.objects.get_or_create(
            name=name,
            custom_name=custom_name,
            defaults={
                "base_url": base_url,
                "client_id": client_id,
                "client_secret": client_secret
                },
        )
        if not created:
            bank.base_url = base_url
            bank.client_id = client_id
            bank.client_secret = client_secret
            bank.save()
        return bank

    @staticmethod
    def get_user_tokens(user_profile, bank_name=None):
        queryset = BankToken.objects.filter(
            user_profile=user_profile, is_active=True
            )
        if bank_name:
            queryset = queryset.filter(bank__name=bank_name)
        return queryset

    @staticmethod
    def store_bank_token(
        user_profile, bank, access_token, token_type, expires_in, scope=""
    ):
        expires_at = timezone.now() + timedelta(seconds=expires_in)
        token, _ = BankToken.objects.update_or_create(
            user_profile=user_profile,
            bank=bank,
            token_type=token_type,
            defaults={
                "access_token": access_token,
                "expires_at": expires_at,
                "scope": scope,
                "is_active": True
                },
        )
        return token


class AccountSharingService:
    @staticmethod
    def create_sharing_request(
        sharer_profile, receiver_team_id, permissions, expires_in_days=30
    ):
        try:
            receiver_profile = UserBankProfile.objects.get(
                team_id=receiver_team_id
                )
        except UserBankProfile.DoesNotExist:
            raise ValueError(
                f"Пользователь с team_id {receiver_team_id} не найден"
                )

        if sharer_profile == receiver_profile:
            raise ValueError("Нельзя делиться аккаунтом с самим собой")

        expires_at = timezone.now() + timedelta(days=expires_in_days)

        sharing, created = AccountSharing.objects.get_or_create(
            sharer=sharer_profile,
            receiver=receiver_profile,
            defaults={"permissions": permissions, "expires_at": expires_at},
        )
        if not created:
            sharing.permissions = permissions
            sharing.expires_at = expires_at
            sharing.status = "PENDING"
            sharing.save()

        return sharing

    @staticmethod
    def accept_sharing_request(sharing_token, receiver_profile):
        try:
            sharing = AccountSharing.objects.get(
                token=sharing_token,
                receiver=receiver_profile,
                status="PENDING"
                )
        except AccountSharing.DoesNotExist:
            raise ValueError(
                "Запрос на объединение не найден или уже обработан"
                )

        if sharing.is_expired():
            sharing.status = "EXPIRED"
            sharing.save()
            raise ValueError("Срок действия запроса истек")

        sharing.status = "ACTIVE"
        sharing.save()
        return sharing

    @staticmethod
    def reject_sharing_request(sharing_token, receiver_profile):
        try:
            sharing = AccountSharing.objects.get(
                token=sharing_token,
                receiver=receiver_profile,
                status="PENDING"
                )
        except AccountSharing.DoesNotExist:
            raise ValueError("Запрос на объединение не найден")

        sharing.status = "REJECTED"
        sharing.save()
        return sharing

    @staticmethod
    def get_shared_accounts(user_profile):
        shared_out = AccountSharing.objects.filter(
            sharer=user_profile,
            status="ACTIVE"
            ).select_related("receiver", "receiver__user")
        shared_in = AccountSharing.objects.filter(
            receiver=user_profile,
            status="ACTIVE").select_related("sharer", "sharer__user")
        return {"shared_out": shared_out, "shared_in": shared_in}


class BankingService:
    def __init__(self):
        self.client_factory = BankClientFactory()

    def create_consent(
        self, user_profile,
        bank_name, client_id,
        permissions, reason,
        requesting_bank
    ):
        client = self.client_factory.get_client(bank_name)
        result = client.create_consent(
            client_id, permissions, reason, requesting_bank
            )

        bank = Bank.objects.get(name=bank_name)
        consent = Consent.objects.create(
            user_profile=user_profile,
            bank=bank,
            consent_id=result.get("consent_id"),
            client_id=client_id,
            status=result.get("status"),
            permissions=permissions,
            expiration_date_time=result.get("expiration_date_time"),
        )
        return consent

    def get_shared_accounts_data(self, user_profile):
        shared_data = AccountSharingService.get_shared_accounts(user_profile)
        all_accounts = []
        for sharing in shared_data["shared_in"]:
            sharer_profile = sharing.sharer
            permissions = sharing.permissions
            consents = Consent.objects.filter(
                user_profile=sharer_profile, status="AUTHORISED"
                )
            for consent in consents:
                try:
                    client = self.client_factory.get_client(consent.bank.name)
                    accounts = client.get_accounts(
                        client_id=consent.client_id,
                        consent_id=consent.consent_id,
                        requesting_bank=user_profile.team_id
                        )
                    for account in accounts.get("accounts", []):
                        account["shared_by"] = sharer_profile.team_id
                        account["sharing_permissions"] = permissions
                        all_accounts.append(account)
                except Exception:
                    continue
        return all_accounts
