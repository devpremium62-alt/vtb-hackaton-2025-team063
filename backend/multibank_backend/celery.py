import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "multibank_backend.settings")

app = Celery("multibank_backend")
app.config_from_object("django.conf:settings", namespace="CELERY")

app.conf.beat_schedule = {
    "cleanup-expired-tokens": {
        "task": "banks.tasks.cleanup_expired_tokens",
        "schedule": crontab(hour=3, minute=0),
    },
    "cleanup-expired-consents": {
        "task": "banks.tasks.cleanup_expired_consents",
        "schedule": crontab(hour=4, minute=0),
    },
    "cleanup-expired-sharings": {
        "task": "banks.tasks.cleanup_expired_sharings",
        "schedule": crontab(hour=5, minute=0),
    },
    "rotate-audit-logs": {
        "task": "banks.tasks.rotate_audit_logs",
        "schedule": crontab(0, 0, day_of_month="1"),
    },
}

app.autodiscover_tasks()
