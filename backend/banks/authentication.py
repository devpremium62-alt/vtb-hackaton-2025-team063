from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.utils import timezone
from .models import BankToken


class BankTokenAuthentication(BaseAuthentication):
    """
    Аутентификация по банковскому токену.
    Возвращает (None, bank_token) — request.auth хранит объект BankToken.
    Это не заменяет request.user.
    """

    def authenticate(self, request):
        auth_header = request.META.get("HTTP_AUTHORIZATION", "")
        if not auth_header.startswith("Bearer "):
            return None

        token = auth_header[7:].strip()
        if not token:
            return None

        try:
            token_obj = BankToken.objects.get(
                access_token=token,
                expires_at__gt=timezone.now(),
                is_active=True
                )
            return (None, token_obj)
        except BankToken.DoesNotExist:
            raise AuthenticationFailed("Invalid or expired token")
