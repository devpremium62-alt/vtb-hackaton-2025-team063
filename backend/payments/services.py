from decimal import Decimal
from django.utils import timezone
from banks.clients import BankClientFactory
from banks.models import Bank
from .models import Payment, PaymentConsent, PaymentLimit


class PaymentService:
    def __init__(self, user_profile):
        self.user_profile = user_profile

    def create_payment(self, payment_data):
        bank_name = payment_data["bank_name"]
        client = BankClientFactory.get_client(bank_name)
        limit_check = self._check_payment_limits(payment_data["amount"])
        if not limit_check["allowed"]:
            raise Exception(limit_check["reason"])
        consent = None
        if payment_data.get("payment_consent_id"):
            consent = self._validate_consent(
                payment_data["payment_consent_id"],
                payment_data["amount"],
                payment_data["creditor_account"],
            )
        try:
            api_payment_data = {
                "data": {
                    "initiation": {
                        "instructedAmount": {
                            "amount": str(payment_data["amount"]),
                            "currency": payment_data.get("currency", "RUB"),
                        },
                        "debtorAccount": {
                            "schemeName": "RU.CBR.PAN",
                            "identification": payment_data["debtor_account"],
                        },
                        "creditorAccount": {
                            "schemeName": "RU.CBR.PAN",
                            "identification": payment_data["creditor_account"],
                        },
                        "creditorName": payment_data["creditor_name"],
                    }
                }
            }
            if payment_data.get("creditor_bank_code"):
                api_payment_data["data"]["initiation"]["creditorAccount"][
                    "bank_code"
                ] = payment_data["creditor_bank_code"]

            if payment_data.get("description"):
                api_payment_data["data"]["initiation"][
                    "remittanceInformation"
                ] = {"unstructured": payment_data["description"]}

            headers = {}
            if payment_data.get("consent_id"):
                headers["X-Consent-Id"] = payment_data["consent_id"]
            if payment_data.get("payment_consent_id"):
                headers["X-Payment-Consent-Id"] = payment_data[
                    "payment_consent_id"
                ]

            result = client.create_payment(
                payment_data=api_payment_data,
                client_id=self.user_profile.team_id,
                headers=headers,
            )

            bank = Bank.objects.get(name=bank_name)
            debtor_bank = bank
            creditor_bank = Bank.objects.filter(
                name=payment_data.get("creditor_bank_code", "").upper()
            ).first()

            payment = Payment.objects.create(
                user_profile=self.user_profile,
                bank=bank,
                payment_id=result.get("data", {}).get("paymentId", ""),
                consent_id=payment_data.get("consent_id", ""),
                payment_type="EXTERNAL" if creditor_bank else "INTERNAL",
                amount=payment_data["amount"],
                currency=payment_data.get("currency", "RUB"),
                debtor_account=payment_data["debtor_account"],
                debtor_bank=debtor_bank,
                creditor_account=payment_data["creditor_account"],
                creditor_name=payment_data["creditor_name"],
                creditor_bank=creditor_bank,
                description=payment_data.get("description", ""),
                reference=payment_data.get("reference", ""),
                status=(result.get("data", {}).get("status") or "PENDING"),
                raw_data=result,
            )

            self._update_payment_limits(payment_data["amount"])
            if consent:
                consent.mark_used(payment_data["amount"])
            return payment
        except Exception as exc:
            raise Exception(f"Ошибка создания платежа: {str(exc)}")

    def _validate_consent(self, consent_id, amount, creditor_account):
        """Проверка валидности согласия на платеж"""
        try:
            consent = PaymentConsent.objects.get(
                consent_id=consent_id,
                user_profile=self.user_profile,
                status="AUTHORISED",
            )
        except PaymentConsent.DoesNotExist:
            raise Exception(
                "Согласие на платеж не найдено или не авторизовано"
            )
        can_use, reason = consent.can_be_used(amount, creditor_account)
        if not can_use:
            raise Exception(f"Согласие не может быть использовано: {reason}")
        return consent

    def _check_payment_limits(self, amount):
        limit, _ = PaymentLimit.objects.get_or_create(
            user_profile=self.user_profile
        )
        limit.reset_if_needed()
        amt = Decimal(amount)

        if amt > limit.per_transaction_limit:
            return {
                "allowed": False,
                "reason": (
                    f"Превышен лимит на одну операцию: "
                    f"{limit.per_transaction_limit}"
                ),
            }
        if (limit.daily_used + amt) > limit.daily_limit:
            return {
                "allowed": False,
                "reason": f"Превышен дневной лимит: {limit.daily_limit}",
            }
        if (limit.weekly_used + amt) > limit.weekly_limit:
            return {
                "allowed": False,
                "reason": f"Превышен недельный лимит: {limit.weekly_limit}",
            }
        if (limit.monthly_used + amt) > limit.monthly_limit:
            return {
                "allowed": False,
                "reason": f"Превышен месячный лимит: {limit.monthly_limit}",
            }
        return {"allowed": True}

    def _update_payment_limits(self, amount):
        limit = PaymentLimit.objects.get(user_profile=self.user_profile)
        amt = Decimal(amount)
        limit.daily_used += amt
        limit.weekly_used += amt
        limit.monthly_used += amt
        limit.save()

    def get_payment_status(self, payment):
        client = BankClientFactory.get_client(payment.bank.name)
        try:
            status_data = client.get_payment_status(payment.payment_id)
            payment.status = status_data.get("data", {}).get(
                "status", payment.status
            )
            if payment.status == "COMPLETED" and not payment.executed_at:
                payment.executed_at = timezone.now()
            payment.raw_data = status_data
            payment.save()
            return payment
        except Exception as exc:
            raise Exception(f"Ошибка получения статуса платежа: {str(exc)}")


class PaymentConsentService:
    def __init__(self, user_profile):
        self.user_profile = user_profile

    def create_consent(self, consent_data):
        bank_name = consent_data["bank_name"]
        client = BankClientFactory.get_client(bank_name)

        try:
            api_consent_data = {
                "requesting_bank": self.user_profile.team_id.split("-")[0],
                "client_id": self.user_profile.team_id,
                "consent_type": consent_data[
                    "consent_type"
                ].lower(),
                "debtor_account": consent_data["debtor_account"],
                "currency": consent_data.get("currency", "RUB"),
            }

            if consent_data.get("reason"):
                api_consent_data["reason"] = consent_data["reason"]

            consent_type = consent_data["consent_type"]

            if consent_type == "SINGLE_USE":
                api_consent_data["amount"] = str(consent_data["amount"])
                if consent_data.get("creditor_account"):
                    api_consent_data["creditor_account"] = consent_data[
                        "creditor_account"
                    ]
                if consent_data.get("creditor_name"):
                    api_consent_data["creditor_name"] = consent_data[
                        "creditor_name"
                    ]
                if consent_data.get("reference"):
                    api_consent_data["reference"] = consent_data["reference"]
            elif consent_type == "MULTI_USE":
                if consent_data.get("max_amount_per_payment"):
                    api_consent_data["max_amount_per_payment"] = str(
                        consent_data["max_amount_per_payment"]
                    )
                if consent_data.get("max_total_amount"):
                    api_consent_data["max_total_amount"] = str(
                        consent_data["max_total_amount"]
                    )
                if consent_data.get("max_uses"):
                    api_consent_data["max_uses"] = consent_data["max_uses"]
                if consent_data.get("allowed_creditor_accounts"):
                    api_consent_data["allowed_creditor_accounts"] = (
                        consent_data["allowed_creditor_accounts"]
                    )
            elif consent_type == "VRP":
                if consent_data.get("vrp_max_individual_amount"):
                    api_consent_data["vrp_max_individual_amount"] = str(
                        consent_data["vrp_max_individual_amount"]
                    )
                if consent_data.get("vrp_daily_limit"):
                    api_consent_data["vrp_daily_limit"] = str(
                        consent_data["vrp_daily_limit"]
                    )
                if consent_data.get("vrp_monthly_limit"):
                    api_consent_data["vrp_monthly_limit"] = str(
                        consent_data["vrp_monthly_limit"]
                    )

            if consent_data.get("valid_from"):
                api_consent_data["valid_from"] = consent_data[
                    "valid_from"
                ].isoformat()
            if consent_data.get("valid_until"):
                api_consent_data["valid_until"] = consent_data[
                    "valid_until"
                ].isoformat()

            result = client.create_payment_consent(api_consent_data)

            bank = Bank.objects.get(name=bank_name)
            consent = PaymentConsent.objects.create(
                user_profile=self.user_profile,
                bank=bank,
                consent_id=result.get("consent_id", ""),
                consent_type=consent_data["consent_type"],
                status=result.get("status", "AWAITING_AUTHORISATION"),
                debtor_account=consent_data["debtor_account"],
                currency=consent_data.get("currency", "RUB"),
                amount=consent_data.get("amount"),
                creditor_account=consent_data.get("creditor_account"),
                creditor_name=consent_data.get("creditor_name"),
                reference=consent_data.get("reference"),
                max_amount_per_payment=consent_data.get(
                    "max_amount_per_payment"
                ),
                max_total_amount=consent_data.get("max_total_amount"),
                max_uses=consent_data.get("max_uses"),
                allowed_creditor_accounts=consent_data.get(
                    "allowed_creditor_accounts", []
                ),
                vrp_max_individual_amount=consent_data.get(
                    "vrp_max_individual_amount"
                ),
                vrp_daily_limit=consent_data.get("vrp_daily_limit"),
                vrp_monthly_limit=consent_data.get("vrp_monthly_limit"),
                valid_from=consent_data.get("valid_from", timezone.now()),
                valid_until=consent_data.get("valid_until"),
                raw_data=result,
            )
            return consent
        except Exception as exc:
            raise Exception(f"Ошибка создания согласия: {str(exc)}")

    def get_consent(self, consent_id):
        """Получение информации о согласии"""
        try:
            consent = PaymentConsent.objects.get(
                consent_id=consent_id, user_profile=self.user_profile
            )
            return consent
        except PaymentConsent.DoesNotExist:
            raise Exception("Согласие не найдено")

    def revoke_consent(self, consent_id):
        """Отзыв согласия"""
        try:
            consent = PaymentConsent.objects.get(
                consent_id=consent_id, user_profile=self.user_profile
            )

            client = BankClientFactory.get_client(consent.bank.name)
            client.revoke_payment_consent(consent_id)

            consent.status = "REVOKED"
            consent.save()

            return consent
        except PaymentConsent.DoesNotExist:
            raise Exception("Согласие не найдено")
