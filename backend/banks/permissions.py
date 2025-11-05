from rest_framework.permissions import BasePermission
from django.utils import timezone
from .models import BankToken


class IsBankOrUserAuthenticated(BasePermission):
    """
    Разрешение, пропускает если:
    - request.user.is_authenticated == True (пользователь), либо
    - request.auth является валидным BankToken.
    """

    def has_permission(self, request, view):
        if getattr(request, "user", None) and request.user.is_authenticated:
            return True

        auth = getattr(request, "auth", None)
        if (isinstance(auth, BankToken)
                and auth.is_active
                and auth.expires_at
                and auth.expires_at > timezone.now()):
            return True

        return False

    def has_object_permission(self, request, view, obj):
        return self.has_permission(request, view)
