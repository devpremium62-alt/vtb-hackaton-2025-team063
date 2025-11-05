from celery import shared_task
from django.utils import timezone
from .models import BankToken, Consent, AccountSharing


@shared_task
def cleanup_expired_tokens():
    expired_tokens = BankToken.objects.filter(
        expires_at__lt=timezone.now(),
        is_active=True
        )
    count = expired_tokens.update(is_active=False)
    return f"Deactivated {count} expired tokens"


@shared_task
def cleanup_expired_consents():
    expired_consents = Consent.objects.filter(
        expiration_date_time__lt=timezone.now(),
        status__in=["AUTHORISED", "AWAITING_AUTHORISATION"]
        )
    count = expired_consents.update(status="EXPIRED")
    return f"Updated {count} expired consents"


@shared_task
def cleanup_expired_sharings():
    expired_sharings = AccountSharing.objects.filter(
        expires_at__lt=timezone.now(), status="ACTIVE"
        )
    count = expired_sharings.update(status="EXPIRED")
    return f"Updated {count} expired sharings"


@shared_task
def rotate_audit_logs():
    # Заглушка: реальная ротация зависит от хранения логов
    return "Audit logs rotated (stub)"
