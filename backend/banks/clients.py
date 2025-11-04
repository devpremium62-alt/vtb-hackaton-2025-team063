import requests
from datetime import timedelta
from django.conf import settings
from django.utils import timezone
from .models import Bank, BankToken


class BaseBankClient:
    def __init__(self, bank_name, timeout: int = 10):
        self.bank_name = bank_name
        self.config = settings.BANK_API_CONFIG.get(bank_name, {})
        self.base_url = self.config.get("base_url", "")
        self.session = requests.Session()
        self.timeout = timeout

    def _get_token(self):
        try:
            bank = Bank.objects.get(name=self.bank_name)
        except Bank.DoesNotExist:
            raise Exception(f"Bank {self.bank_name} not configured")

        token_obj = BankToken.objects.filter(
            bank=bank,
            expires_at__gt=timezone.now(),
            is_active=True,
            user_profile__isnull=True,
        ).first()
        if token_obj:
            return token_obj.access_token

        token_data = self._request_token()
        expires_at = timezone.now() + timedelta(
            seconds=int(token_data.get("expires_in", 86400))
            )

        token_obj = BankToken.objects.create(
            bank=bank,
            access_token=token_data["access_token"],
            token_type=token_data.get("token_type", "bearer"),
            expires_at=expires_at,
            is_active=True,
            user_profile=None,
        )
        return token_obj.access_token

    def _request_token(self, client_id=None, client_secret=None):
        url = f"{self.base_url}/auth/bank-token"
        data = {
            "client_id": client_id or self.config.get("client_id"),
            "client_secret": client_secret or self.config.get("client_secret"),
        }
        response = self.session.post(url, data=data, timeout=self.timeout)
        response.raise_for_status()
        data = response.json()
        if "access_token" not in data:
            raise ValueError("Token response missing access_token")
        return data

    def _make_request(self, method, endpoint, **kwargs):
        token = self._get_token()
        url = f"{self.base_url}{endpoint}"
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
            }

        requesting_bank = kwargs.pop("requesting_bank", None)
        consent_id = kwargs.pop("consent_id", None)
        extra_headers = kwargs.pop("headers", {}) or {}
        if requesting_bank:
            headers["X-Requesting-Bank"] = requesting_bank
        if consent_id:
            headers["X-Consent-Id"] = consent_id

        headers.update(extra_headers)

        response = self.session.request(
            method, url, headers=headers, timeout=self.timeout, **kwargs
            )
        response.raise_for_status()
        if response.status_code == 204:
            return {}
        return response.json()


class VBankClient(BaseBankClient):
    def __init__(self):
        super().__init__("VBANK")

    def get_products(self):
        return self._make_request("GET", "/products")

    def get_accounts(
        self, client_id=None, consent_id=None, requesting_bank=None
    ):
        params = {}
        if client_id:
            params["client_id"] = client_id
        return self._make_request(
            "GET",
            "/accounts",
            params=params,
            consent_id=consent_id,
            requesting_bank=requesting_bank
            )

    def get_account_details(
        self, account_id, consent_id=None, requesting_bank=None
    ):
        return self._make_request(
            "GET",
            f"/accounts/{account_id}",
            consent_id=consent_id,
            requesting_bank=requesting_bank
            )

    def get_account_balance(
        self, account_id, consent_id=None, requesting_bank=None
    ):
        return self._make_request(
            "GET",
            f"/accounts/{account_id}/balances",
            consent_id=consent_id,
            requesting_bank=requesting_bank
            )

    def get_account_transactions(
        self,
        account_id,
        page=1,
        limit=50,
        from_date=None,
        to_date=None,
        consent_id=None,
        requesting_bank=None
    ):
        params = {"page": page, "limit": limit}
        if from_date:
            params["from_booking_date_time"] = (
                from_date.isoformat() if hasattr(from_date, "isoformat")
                else str(from_date)
            )
        if to_date:
            params["to_booking_date_time"] = (
                to_date.isoformat() if hasattr(to_date, "isoformat")
                else str(to_date)
                )
        return self._make_request(
            "GET",
            f"/accounts/{account_id}/transactions",
            params=params, consent_id=consent_id,
            requesting_bank=requesting_bank
            )

    def create_account(self, account_data, client_id=None):
        params = {}
        if client_id:
            params["client_id"] = client_id
        return self._make_request(
            "POST", "/accounts", json=account_data, params=params
            )

    def close_account(self, account_id, close_data, client_id=None):
        params = {}
        if client_id:
            params["client_id"] = client_id
        return self._make_request(
            "PUT",
            f"/accounts/{account_id}/close",
            json=close_data,
            params=params
            )

    def create_consent(self, client_id, permissions, reason, requesting_bank):
        data = {
            "client_id": client_id,
            "permissions": permissions,
            "reason": reason,
            "requesting_bank": requesting_bank,
            "requesting_bank_name": "Open Banking App",
        }
        return self._make_request(
            "POST", "/account-consents/request",
            json=data,
            requesting_bank=requesting_bank
            )

    def create_payment(self, payment_data, client_id=None, consent_id=None):
        params = {}
        if client_id:
            params["client_id"] = client_id
        return self._make_request(
            "POST", "/payments",
            son=payment_data,
            params=params,
            consent_id=consent_id
            )

    def get_payment_status(self, payment_id):
        return self._make_request("GET", f"/payments/{payment_id}/status")


class BankClientFactory:
    @staticmethod
    def get_client(bank_name):
        clients = {
            "VBANK": VBankClient, "ABANK": VBankClient, "SBANK": VBankClient
            }
        client_class = clients.get(bank_name)
        if not client_class:
            raise ValueError(f"Unsupported bank: {bank_name}")
        return client_class()
