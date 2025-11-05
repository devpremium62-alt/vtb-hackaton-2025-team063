from django.db import models
from django.utils import timezone
from banks.models import UserBankProfile, Bank


class Account(models.Model):
    ACCOUNT_TYPES = [
        ("CHECKING", "Расчетный счет"),
        ("SAVINGS", "Сберегательный счет"),
        ("CREDIT", "Кредитный счет"),
        ("DEPOSIT", "Депозитный счет"),
    ]

    ACCOUNT_STATUS = [
        ("ACTIVE", "Активный"),
        ("CLOSED", "Закрыт"),
        ("BLOCKED", "Заблокирован"),
        ("PENDING", "Ожидает активации"),
    ]

    user_profile = models.ForeignKey(
        UserBankProfile, on_delete=models.CASCADE, db_index=True
    )
    bank = models.ForeignKey(Bank, on_delete=models.CASCADE, db_index=True)
    account_id = models.CharField(max_length=100, db_index=True)
    account_type = models.CharField(
        max_length=20, choices=ACCOUNT_TYPES, default="CHECKING"
    )
    currency = models.CharField(max_length=3, default="RUB")
    balance = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    available_balance = models.DecimalField(
        max_digits=15, decimal_places=2, default=0
    )
    credit_limit = models.DecimalField(
        max_digits=15, decimal_places=2, null=True, blank=True
    )
    status = models.CharField(
        max_length=20, choices=ACCOUNT_STATUS, default="ACTIVE"
        )
    nickname = models.CharField(max_length=100, blank=True)
    iban = models.CharField(max_length=34, blank=True)
    opened_date = models.DateTimeField(default=timezone.now)
    closed_date = models.DateTimeField(null=True, blank=True)
    last_sync = models.DateTimeField(auto_now=True)
    raw_data = models.JSONField(default=dict)

    class Meta:
        db_table = "accounts"
        indexes = [
            models.Index(fields=["user_profile", "bank"]),
            models.Index(fields=["account_id"]),
            models.Index(fields=["status", "account_type"]),
            models.Index(fields=["last_sync"]),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=["user_profile", "bank", "account_id"],
                name="uniq_account_per_bank_per_user_profile",
            )
        ]

    def __str__(self):
        return (
            f"{self.user_profile.team_id} - {self.account_id} "
            f"({self.get_account_type_display()})"
        )


class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ("DEBIT", "Списание"),
        ("CREDIT", "Зачисление"),
    ]
    TRANSACTION_STATUS = [
        ("BOOKED", "Проведена"),
        ("PENDING", "Ожидает проведения"),
        ("CANCELLED", "Отменена"),
        ("FAILED", "Не удалась"),
    ]

    account = models.ForeignKey(
        Account,
        on_delete=models.CASCADE,
        db_index=True, related_name="transactions"
    )
    transaction_id = models.CharField(max_length=100, db_index=True)
    bank_transaction_id = models.CharField(max_length=100, blank=True)
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    currency = models.CharField(max_length=3, default="RUB")
    type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    status = models.CharField(
        max_length=20, choices=TRANSACTION_STATUS, default="BOOKED"
        )
    description = models.TextField(blank=True)
    merchant_name = models.CharField(max_length=255, blank=True)
    merchant_account = models.CharField(max_length=100, blank=True)
    booking_date = models.DateTimeField(db_index=True)
    value_date = models.DateTimeField(null=True, blank=True)
    category = models.CharField(max_length=100, blank=True)
    transaction_code = models.CharField(max_length=50, blank=True)
    reference = models.CharField(max_length=255, blank=True)
    raw_data = models.JSONField(default=dict)

    class Meta:
        db_table = "transactions"
        indexes = [
            models.Index(fields=["account", "booking_date"]),
            models.Index(fields=["booking_date"]),
            models.Index(fields=["type", "status"]),
            models.Index(fields=["merchant_name"]),
        ]
        ordering = ["-booking_date"]
        constraints = [
            models.UniqueConstraint(
                fields=["account", "transaction_id"],
                name="uniq_tx_per_account"
            )
        ]

    def __str__(self):
        return (
            f"{self.account.account_id} - {self.amount} "
            f"{self.currency} - {self.description}"
        )


class Balance(models.Model):
    account = models.ForeignKey(
        Account,
        on_delete=models.CASCADE,
        db_index=True,
        related_name="balances"
    )
    balance_type = models.CharField(max_length=50, default="CLOSING_BOOKED")
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    currency = models.CharField(max_length=3, default="RUB")
    credit_limit = models.DecimalField(
        max_digits=15, decimal_places=2, null=True, blank=True
    )
    credit_used = models.DecimalField(
        max_digits=15, decimal_places=2, null=True, blank=True
    )
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "balances"
        indexes = [models.Index(fields=["account", "last_updated"])]

    def __str__(self):
        return f"{self.account.account_id} - {self.amount} {self.currency}"


class AccountSyncLog(models.Model):
    account = models.ForeignKey(
        Account, on_delete=models.CASCADE, db_index=True
        )
    sync_type = models.CharField(
        max_length=20, choices=[("FULL", "Полная"), ("DELTA", "Дельта")]
        )
    transactions_synced = models.IntegerField(default=0)
    new_transactions = models.IntegerField(default=0)
    sync_start = models.DateTimeField()
    sync_end = models.DateTimeField(null=True, blank=True)
    success = models.BooleanField(default=True)
    error_message = models.TextField(blank=True)

    class Meta:
        db_table = "account_sync_logs"
        indexes = [
            models.Index(fields=["account", "sync_start"]),
            models.Index(fields=["sync_start"])
            ]
