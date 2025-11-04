from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.utils import timezone
from banks.models import UserBankProfile, Bank


class Product(models.Model):
    PRODUCT_TYPES = [
        ("DEPOSIT", "Вклад"),
        ("LOAN", "Кредит"),
        ("CARD", "Карта"),
        ("ACCOUNT", "Счет"),
        ("INVESTMENT", "Инвестиционный продукт"),
        ("INSURANCE", "Страхование"),
    ]

    PRODUCT_STATUS = [
        ("ACTIVE", "Активный"),
        ("INACTIVE", "Неактивный"),
        ("COMING_SOON", "Скоро будет"),
        ("ARCHIVED", "В архиве"),
    ]

    bank = models.ForeignKey(Bank, on_delete=models.CASCADE, db_index=True)
    product_id = models.CharField(max_length=100, db_index=True)
    product_type = models.CharField(max_length=20, choices=PRODUCT_TYPES)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    short_description = models.CharField(max_length=500, blank=True)

    interest_rate = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True
    )
    min_amount = models.DecimalField(
        max_digits=15, decimal_places=2, null=True, blank=True
    )
    max_amount = models.DecimalField(
        max_digits=15, decimal_places=2, null=True, blank=True
    )
    term_months = models.IntegerField(null=True, blank=True)
    currency = models.CharField(max_length=3, default="RUB")

    features = ArrayField(models.CharField(max_length=200), default=list, blank=True)
    requirements = models.JSONField(default=dict)
    documents_required = ArrayField(
        models.CharField(max_length=100), default=list, blank=True
    )

    status = models.CharField(max_length=20, choices=PRODUCT_STATUS, default="ACTIVE")
    is_featured = models.BooleanField(default=False)
    promotion_end = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    raw_data = models.JSONField(default=dict)

    class Meta:
        db_table = "products"
        indexes = [
            models.Index(fields=["bank", "product_type"]),
            models.Index(fields=["product_type", "status"]),
            models.Index(fields=["is_featured", "status"]),
            models.Index(fields=["promotion_end"]),
        ]
        unique_together = ["bank", "product_id"]

    def __str__(self):
        return f"{self.bank.name} - {self.name}"


class ProductAgreement(models.Model):
    AGREEMENT_STATUS = [
        ("ACTIVE", "Активный"),
        ("CLOSED", "Закрыт"),
        ("PENDING", "Ожидает активации"),
        ("SUSPENDED", "Приостановлен"),
        ("EXPIRED", "Истек"),
    ]

    user_profile = models.ForeignKey(
        UserBankProfile, on_delete=models.CASCADE, db_index=True
    )
    product = models.ForeignKey(Product, on_delete=models.CASCADE, db_index=True)
    agreement_id = models.CharField(max_length=100, db_index=True)
    status = models.CharField(max_length=20, choices=AGREEMENT_STATUS, default="ACTIVE")

    amount = models.DecimalField(max_digits=15, decimal_places=2)
    interest_rate = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True
    )
    term_months = models.IntegerField(null=True, blank=True)
    opened_date = models.DateTimeField(default=timezone.now)
    closed_date = models.DateTimeField(null=True, blank=True)
    maturity_date = models.DateTimeField(null=True, blank=True)

    linked_account = models.ForeignKey(
        "accounts.Account",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        db_index=True,
    )

    current_balance = models.DecimalField(
        max_digits=15, decimal_places=2, default=0
    )
    interest_accrued = models.DecimalField(
        max