from decimal import Decimal
from django.db import models
from django.utils import timezone
from banks.models import UserBankProfile, Bank


class Payment(models.Model):
    PAYMENT_STATUS = [
        ("PENDING", "Ожидает выполнения"),
        ("COMPLETED", "Завершен"),
        ("FAILED", "Неудачный"),
        ("CANCELLED", "Отменен"),
        ("REJECTED", "Отклонен банком"),
    ]

    PAYMENT_TYPES = [
        ("INTERNAL", "Внутрибанковский"),
        ("EXTERNAL", "Межбанковский"),
        ("TRANSFER", "Перевод между своими счетами"),
    ]

    user_profile = models.ForeignKey(
        UserBankProfile, on_delete=models.CASCADE, db_index=True
    )
    bank = models.ForeignKey(Bank, on_delete=models.CASCADE, db_index=True)
    payment_id = models.CharField(max_length=100, db_index=True)
    consent_id = models.CharField(max_length=100, blank=True)
    payment_type = models.CharField(
        max_length=20, choices=PAYMENT_TYPES, default="INTERNAL"
    )
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    currency = models.CharField(max_length=3, default="RUB")
    fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    debtor_account = models.CharField(max_length=100)
    debtor_bank = models.ForeignKey(
        Bank,
        on_delete=models.CASCADE,
        related_name="debtor_payments",
        null=True,
        blank=True,
    )

    creditor_account = models.CharField(max_length=100)
    creditor_name = models.CharField(max_length=255)
    creditor_bank = models.ForeignKey(
        Bank,
        on_delete=models.CASCADE,
        related_name="creditor_payments",
        null=True,
        blank=True,
    )

    description = models.TextField(blank=True)
    reference = models.CharField(max_length=255, blank=True)
    status = models.CharField(
        max_length=20, choices=PAYMENT_STATUS, default="PENDING"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    executed_at = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    raw_data = models.JSONField(default=dict)

    class Meta:
        db_table = "payments"
        indexes = [
            models.Index(fields=["user_profile", "created_at"]),
            models.Index(fields=["bank", "payment_id"]),
            models.Index(fields=["status", "created_at"]),
            models.Index(fields=["debtor_account"]),
            models.Index(fields=["creditor_account"]),
        ]
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.payment_id} - {self.amount} {self.currency}"


class PaymentConsent(models.Model):
    CONSENT_TYPES = [
        ("SINGLE_USE", "Одноразовый"),
        ("MULTI_USE", "Многоразовый"),
        ("VRP", "Переменные регулярные платежи"),
    ]

    CONSENT_STATUS = [
        ("AWAITING_AUTHORISATION", "Ожидает авторизации"),
        ("AUTHORISED", "Авторизовано"),
        ("REJECTED", "Отклонено"),
        ("REVOKED", "Отозвано"),
        ("EXPIRED", "Истекло"),
    ]

    user_profile = models.ForeignKey(
        UserBankProfile, on_delete=models.CASCADE, db_index=True
    )
    bank = models.ForeignKey(Bank, on_delete=models.CASCADE, db_index=True)
    consent_id = models.CharField(max_length=100, unique=True, db_index=True)
    consent_type = models.CharField(max_length=20, choices=CONSENT_TYPES)
    status = models.CharField(max_length=30, choices=CONSENT_STATUS)

    debtor_account = models.CharField(max_length=100)
    max_amount_per_payment = models.DecimalField(
        max_digits=15, decimal_places=2, null=True, blank=True
    )
    max_total_amount = models.DecimalField(
        max_digits=15, decimal_places=2, null=True, blank=True
    )
    max_uses = models.IntegerField(null=True, blank=True)
    used_count = models.IntegerField(default=0)
    used_amount = models.DecimalField(
        max_digits=15, decimal_places=2, default=0
    )

    vrp_max_individual_amount = models.DecimalField(
        max_digits=15, decimal_places=2, null=True, blank=True
    )
    vrp_daily_limit = models.DecimalField(
        max_digits=15, decimal_places=2, null=True, blank=True
    )
    vrp_monthly_limit = models.DecimalField(
        max_digits=15, decimal_places=2, null=True, blank=True
    )

    valid_from = models.DateTimeField(default=timezone.now)
    valid_until = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    raw_data = models.JSONField(default=dict)

    class Meta:
        db_table = "payment_consents"
        indexes = [
            models.Index(fields=["user_profile", "consent_type"]),
            models.Index(fields=["status", "valid_until"]),
            models.Index(fields=["debtor_account"]),
        ]

    def is_expired(self):
        if self.valid_until:
            return timezone.now() >= self.valid_until
        return False

    def can_be_used(self, amount):
        amt = Decimal(amount)
        if self.status != "AUTHORISED" or self.is_expired():
            return False
        if self.max_amount_per_payment and amt > self.max_amount_per_payment:
            return False
        if self.max_total_amount and (self.used_amount + amt) > self.max_total_amount:
            return False
        if self.max_uses and self.used_count >= self.max_uses:
            return False
        return True


class PaymentLimit(models.Model):
    user_profile = models.OneToOneField(
        UserBankProfile, on_delete=models.CASCADE, db_index=True
    )
    daily_limit = models.DecimalField(max_digits=15, decimal_places=2, default=100000)
    weekly_limit = models.DecimalField(max_digits=15, decimal_places=2, default=500000)
    monthly_limit = models.DecimalField(
        max_digits=15, decimal_places=2, default=2000000
    )
    per_transaction_limit = models.DecimalField(
        max_digits=15, decimal_places=2, default=50000
    )

    daily_used = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    weekly_used = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    monthly_used = models.DecimalField(max_digits=15, decimal_places=2, default=0)

    last_reset_daily = models.DateField(auto_now_add=True)
    last_reset_weekly = models.DateField(auto_now_add=True)
    last_reset_monthly = models.DateField(auto_now_add=True)

    class Meta:
        db_table = "payment_limits"

    def reset_if_needed(self):
        today = timezone.now().date()
        if today > self.last_reset_daily:
            self.daily_used = 0
            self.last_reset_daily = today
        if today.weekday() == 0 and today > self.last_reset_weekly:
            self.weekly_used = 0
            self.last_reset_weekly = today
        if today.day == 1 and today > self.last_reset_monthly:
            self.monthly_used = 0
            self.last_reset_monthly = today
        self.save()
