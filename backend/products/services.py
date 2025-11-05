from decimal import Decimal
from django.utils import timezone
from banks.clients import BankClientFactory
from banks.models import Bank
from accounts.models import Account
from .models import (
    Product,
    ProductAgreement,
    ProductApplication,
    ProductAgreementConsent,
)


class ProductService:
    def __init__(self, user_profile):
        self.user_profile = user_profile

    def sync_products_from_bank(self, bank_name):
        client = BankClientFactory.get_client(bank_name)
        try:
            products_data = client.get_products()
            synced_products = []
            for product_data in products_data.get("products", []):
                product = self._update_or_create_product(
                    bank_name, product_data
                )
                synced_products.append(product)
            return synced_products
        except Exception as exc:
            raise Exception(
                f"Ошибка синхронизации продуктов из {bank_name}: {str(exc)}"
            )

    def _update_or_create_product(self, bank_name, product_data):
        bank = Bank.objects.get(name=bank_name)
        product, _created = Product.objects.update_or_create(
            bank=bank,
            product_id=product_data["product_id"],
            defaults={
                "product_type": product_data.get(
                    "product_type", "ACCOUNT"
                ).upper(),
                "name": product_data.get("name", ""),
                "description": product_data.get("description", ""),
                "short_description": product_data.get("short_description", ""),
                "interest_rate": product_data.get("interest_rate"),
                "min_amount": product_data.get("min_amount"),
                "max_amount": product_data.get("max_amount"),
                "term_months": product_data.get("term_months"),
                "currency": product_data.get("currency", "RUB"),
                "features": product_data.get("features", []),
                "requirements": product_data.get("requirements", {}),
                "documents_required": product_data.get(
                    "documents_required", []
                ),
                "status": product_data.get("status", "ACTIVE").upper(),
                "is_featured": product_data.get("is_featured", False),
                "promotion_end": product_data.get("promotion_end"),
                "raw_data": product_data,
            },
        )
        return product

    def create_application(self, product, application_data):
        try:
            application = ProductApplication.objects.create(
                user_profile=self.user_profile,
                product=product,
                application_id=(
                    f"app_{self.user_profile.team_id}_{product.id}_"
                    f"{timezone.now().timestamp()}"
                ),
                requested_amount=application_data.get("requested_amount"),
                requested_term=application_data.get("requested_term"),
                purpose=application_data.get("purpose", ""),
                application_data=application_data.get("application_data", {}),
            )
            return application
        except Exception as exc:
            raise Exception(f"Ошибка создания заявки: {str(exc)}")

    def submit_application(self, application):
        client = BankClientFactory.get_client(application.product.bank.name)
        try:
            application_data = {
                "product_id": application.product.product_id,
                "client_id": self.user_profile.team_id,
            }
            if application.requested_amount is not None:
                application_data["amount"] = str(application.requested_amount)
            if application.requested_term:
                application_data["term_months"] = application.requested_term
            if application.purpose:
                application_data["purpose"] = application.purpose
            application_data.update(application.application_data or {})
            result = client.submit_product_application(application_data)

            application.application_id = result.get(
                "application_id", application.application_id
            )
            application.status = result.get("status", "SUBMITTED")
            application.submitted_at = timezone.now()
            application.save()
            return application
        except Exception as exc:
            raise Exception(f"Ошибка отправки заявки: {str(exc)}")


class ProductAgreementService:
    def __init__(self, user_profile):
        self.user_profile = user_profile

    def open_agreement(self, product, agreement_data):
        client = BankClientFactory.get_client(product.bank.name)
        try:
            api_data = {
                "product_id": product.product_id,
                "client_id": self.user_profile.team_id,
                "amount": str(agreement_data["amount"]),
            }
            if agreement_data.get("term_months"):
                api_data["term_months"] = agreement_data["term_months"]
            if agreement_data.get("source_account_id"):
                api_data["source_account_id"] = agreement_data[
                    "source_account_id"
                ]
            result = client.open_product_agreement(api_data)
            agreement = ProductAgreement.objects.create(
                user_profile=self.user_profile,
                product=product,
                agreement_id=result["agreement_id"],
                amount=agreement_data["amount"],
                interest_rate=result.get("interest_rate"),
                term_months=agreement_data.get("term_months"),
                maturity_date=result.get("maturity_date"),
                linked_account=self._get_linked_account(result),
                raw_data=result,
            )
            return agreement
        except Exception as exc:
            raise Exception(f"Ошибка открытия договора: {str(exc)}")

    def _get_linked_account(self, agreement_data):
        if "linked_account_id" in agreement_data:
            try:
                return Account.objects.get(
                    account_id=agreement_data["linked_account_id"]
                )
            except Account.DoesNotExist:
                return None
        return None

    def close_agreement(self, agreement, close_data):
        client = BankClientFactory.get_client(agreement.product.bank.name)
        try:
            api_data = {}
            if close_data.get("repayment_account_id"):
                api_data["repayment_account_id"] = close_data[
                    "repayment_account_id"
                ]
            if close_data.get("repayment_amount"):
                api_data["repayment_amount"] = str(
                    close_data["repayment_amount"]
                )
            client.close_product_agreement(
                agreement_id=agreement.agreement_id, close_data=api_data
            )

            agreement.status = "CLOSED"
            agreement.closed_date = timezone.now()
            agreement.save()
            return agreement
        except Exception as exc:
            raise Exception(f"Ошибка закрытия договора: {str(exc)}")


class ProductRecommendationService:
    def __init__(self, user_profile):
        self.user_profile = user_profile

    def get_personalized_offers(self):
        user_analysis = self._analyze_user_profile()
        suitable_products = self._find_suitable_products(user_analysis)
        offers = []
        for product in suitable_products:
            offer = self._create_personal_offer(product, user_analysis)
            if offer:
                offers.append(offer)
        return offers

    def _analyze_user_profile(self):
        from accounts.models import Account

        analysis = {
            "total_balance": 0.0,
            "average_monthly_income": 0.0,
            "average_monthly_spending": 0.0,
            "savings_ratio": 0.0,
            "risk_tolerance": "LOW",
            "product_preferences": [],
        }
        accounts = Account.objects.filter(
            user_profile=self.user_profile, status="ACTIVE"
        )
        for account in accounts:
            analysis["total_balance"] += float(
                getattr(account, "balance", 0) or 0
            )
        return analysis

    def _find_suitable_products(self, user_analysis):
        products = Product.objects.filter(status="ACTIVE")
        return [
            p for p in products if self._is_product_suitable(p, user_analysis)
        ]

    def _is_product_suitable(self, product, user_analysis):
        if product.min_amount and user_analysis["total_balance"] < float(
            product.min_amount
        ):
            return False
        if product.product_type == "DEPOSIT":
            return user_analysis["savings_ratio"] > 0.1
        if product.product_type == "LOAN":
            return user_analysis["average_monthly_income"] > 50000
        return True

    def _create_personal_offer(self, product, user_analysis):
        personalized_rate = self._calculate_personalized_rate(
            product, user_analysis
        )
        personalized_amount = self._calculate_personalized_amount(
            product, user_analysis
        )
        if personalized_rate is not None and personalized_amount is not None:
            return {
                "product_id": product.id,
                "personalized_rate": personalized_rate,
                "personalized_amount": personalized_amount,
                "reason": self._get_offer_reason(product, user_analysis),
                "expiration_date": timezone.now()
                + timezone.timedelta(days=30),
            }
        return None

    def _calculate_personalized_rate(self, product, user_analysis):
        base_rate = product.interest_rate
        if base_rate is None:
            return None
        try:
            base = Decimal(str(base_rate))
        except Exception:
            return base_rate
        if user_analysis["total_balance"] > 1_000_000:
            return base * Decimal("0.9")
        return base

    def _calculate_personalized_amount(self, product, user_analysis):
        total = user_analysis["total_balance"] or 0.0
        if product.max_amount:
            return min(float(product.max_amount), total * 0.8)
        return total * 0.8

    def _get_offer_reason(self, product, user_analysis):
        reasons = {
            "DEPOSIT": "На основе ваших сберегательных привычек",
            "LOAN": "Идеально подходит для ваших финансовых целей",
            "CARD": "Соответствует вашим расходным паттернам",
        }
        return reasons.get(product.product_type, "Персональное предложение")


class ProductAgreementConsentService:

    def create_consent_request(self, user_profile, consent_data):
        """Создание запроса на согласие"""
        try:
            consent = ProductAgreementConsent.objects.create(
                user_profile=user_profile,
                requesting_bank=consent_data["requesting_bank"],
                client_id=consent_data["client_id"],
                read_product_agreements=consent_data.get(
                    "read_product_agreements", False
                ),
                open_product_agreements=consent_data.get(
                    "open_product_agreements", False
                ),
                close_product_agreements=consent_data.get(
                    "close_product_agreements", False
                ),
                allowed_product_types=consent_data.get(
                    "allowed_product_types", []
                ),
                max_amount=consent_data.get("max_amount"),
                valid_until=consent_data.get(
                    "valid_until", timezone.now() + timezone.timedelta(days=90)
                ),
                reason=consent_data.get("reason", ""),
                status="APPROVED",
            )
            return consent
        except Exception as exc:
            raise Exception(f"Ошибка создания согласия: {str(exc)}")

    def validate_consent(
        self,
        consent_id,
        requesting_bank,
        client_id,
        permission_type,
        product_type=None,
        amount=None,
    ):
        """Валидация согласия для межбанковых операций"""
        try:
            consent = ProductAgreementConsent.objects.get(
                consent_id=consent_id,
                requesting_bank=requesting_bank,
                client_id=client_id,
            )

            return consent.has_permission(
                permission_type, product_type, amount
            )
        except ProductAgreementConsent.DoesNotExist:
            return False

    def approve_consent(self, consent):
        """Одобрение согласия"""
        if consent.status != "PENDING":
            raise Exception("Согласие уже обработано")
        consent.status = "APPROVED"
        consent.updated_at = timezone.now()
        consent.save()
        return consent

    def reject_consent(self, consent):
        """Отклонение согласия"""
        if consent.status != "PENDING":
            raise Exception("Согласие уже обработано")
        consent.status = "REJECTED"
        consent.updated_at = timezone.now()
        consent.save()
        return consent

    def revoke_consent(self, consent):
        """Отзыв согласия"""
        consent.status = "REVOKED"
        consent.updated_at = timezone.now()
        consent.save()
        return consent
