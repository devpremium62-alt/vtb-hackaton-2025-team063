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

            result = client.create_payment(
                payment_data=api_payment_data,
                client_id=self.user_profile.team_id,
                consent_id=payment_data.get("consent_id"),
            )

            bank = Bank.objects.get(name=bank_name)
            debtor_bank = bank
            creditor_bank = Bank.objects.filter(
                name=payment_data.get("creditor_bank_code")
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
            return payment

        except Exception as exc:
            raise Exception(f"Ошибка создания платежа: {str(exc)}")

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
            payment.status = status_data.get(
                "data", {}
            ).get("status", payment.status)
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
                "consent_type": consent_data["consent_type"],
                "debtor_account": consent_data["debtor_account"],
            }

            if (
                consent_data["consent_type"] == "SINGLE_USE"
                and consent_data.get("amount") is not None
            ):
                api_consent_data["amount"] = str(consent_data["amount"])
            elif consent_data["consent_type"] == "MULTI_USE":
                if consent_data.get("max_amount_per_payment"):
                    api_consent_data[
                        "max_amount_per_payment"
                    ] = str(consent_data["max_amount_per_payment"])
                if consent_data.get("max_total_amount"):
                    api_consent_data[
                        "max_total_amount"
                    ] = str(consent_data["max_total_amount"])
                if consent_data.get("max_uses"):
                    api_consent_data["max_uses"] = consent_data["max_uses"]

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
                max_amount_per_payment=consent_data.get("max_amount_per_payment"),
                max_total_amount=consent_data.get("max_total_amount"),
                max_uses=consent_data.get("max_uses"),
                valid_until=consent_data.get("valid_until"),
                raw_data=result,
            )
            return consent

        except Exception as exc:
            raise Exception(f"Ошибка создания согласия: {str(exc)}")
