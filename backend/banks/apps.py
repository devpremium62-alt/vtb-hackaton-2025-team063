from django.apps import AppConfig


class BanksConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "banks"

    def ready(self):
        import banks.signals  # noqa: F401
