from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
import uuid


class User(AbstractUser):
    phone = models.CharField(max_length=15, unique=True)
    photo = models.TextField(blank=True, null=True)  # base64 encoded image
    invitation_code = models.CharField(max_length=20, blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    username = None
    email = models.EmailField(blank=True, null=True)

    USERNAME_FIELD = 'phone'
    REQUIRED_FIELDS = ['first_name']

    class Meta:
        db_table = "auth_users"

    def __str__(self):
        return f"{self.phone} - {self.first_name}"


class Bank(models.Model):
    BANK_CHOICES = [
        ("VBANK", "Virtual Bank"),
        ("ABANK", "Alpha Bank"),
        ("SBANK", "Secure Bank"),
        ("CUSTOM", "Custom Bank"),
    ]

    name = models.CharField(max_length=10, choices=BANK_CHOICES)
    custom_name = models.CharField(max_length=100, blank=True, null=True)
    base_url = models.URLField()
    client_id = models.CharField(max_length=100)
    client_secret = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["name", "custom_name"],
                name="uniq_bank_name_custom"
                )
        ]

    def __str__(self):
        if self.name == "CUSTOM" and self.custom_name:
            return self.custom_name
        return self.get_name_display()

    def save(self, *args, **kwargs):
        if self.name != "CUSTOM":
            self.custom_name = None
        super().save(*args, **kwargs)


class UserBankProfile(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="bank_profile"
        )
    team_id = models.CharField(max_length=50, unique=True)
    shared_accounts = models.ManyToManyField(
        "self", through="AccountSharing", symmetrical=False, blank=True
        )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} ({self.team_id})"


class AccountSharing(models.Model):
    SHARING_STATUS = [
        ("PENDING", "Ожидает подтверждения"),
        ("ACTIVE", "Активно"),
        ("REJECTED", "Отклонено"),
        ("EXPIRED", "Истекло"),
    ]

    sharer = models.ForeignKey(
        UserBankProfile, on_delete=models.CASCADE, related_name="shared_out"
        )
    receiver = models.ForeignKey(
        UserBankProfile, on_delete=models.CASCADE, related_name="shared_in"
        )
    status = models.CharField(
        max_length=20, choices=SHARING_STATUS, default="PENDING"
        )
    permissions = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    token = models.UUIDField(default=uuid.uuid4, unique=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["sharer", "receiver"], name="uniq_sharing_pair"
                )
        ]

    def is_expired(self):
        if self.expires_at:
            return timezone.now() >= self.expires_at
        return False

    def clean(self):
        if self.sharer == self.receiver:
            from django.core.exceptions import ValidationError
            raise ValidationError("Нельзя делиться аккаунтом с самим собой")


class BankToken(models.Model):
    TOKEN_TYPE = [("CLIENT", "Client Token"), ("BANK", "Bank Token")]

    user_profile = models.ForeignKey(
        UserBankProfile, on_delete=models.CASCADE, null=True, blank=True
        )
    bank = models.ForeignKey(Bank, on_delete=models.CASCADE)
    access_token = models.TextField()
    token_type = models.CharField(max_length=50, default="bearer")
    scope = models.CharField(max_length=200, blank=True)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user_profile", "bank", "token_type"],
                name="uniq_token_per_profile_bank_type"
                )
        ]

    def is_expired(self):
        return timezone.now() >= self.expires_at

    def __str__(self):
        user_info = (
            self.user_profile.team_id if self.user_profile else "System"
            )
        return f"{user_info} - {self.bank} Token"


class Consent(models.Model):
    CONSENT_STATUS = [
        ("AWAITING_AUTHORISATION", "Ожидает авторизации"),
        ("AUTHORISED", "Авторизовано"),
        ("REJECTED", "Отклонено"),
        ("REVOKED", "Отозвано"),
        ("EXPIRED", "Истекло"),
    ]

    user_profile = models.ForeignKey(UserBankProfile, on_delete=models.CASCADE)
    bank = models.ForeignKey(Bank, on_delete=models.CASCADE)
    consent_id = models.CharField(max_length=100, unique=True)
    client_id = models.CharField(max_length=100)
    status = models.CharField(max_length=30, choices=CONSENT_STATUS)
    permissions = models.JSONField(default=list)
    expiration_date_time = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.consent_id} - {self.get_status_display()}"


class UserAccount(models.Model):
    user_profile = models.ForeignKey(UserBankProfile, on_delete=models.CASCADE)
    bank = models.ForeignKey(Bank, on_delete=models.CASCADE)
    account_id = models.CharField(max_length=100)
    account_data = models.JSONField()
    last_sync = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user_profile", "bank", "account_id"],
                name="uniq_useraccount"
                )
        ]

    def __str__(self):
        return f"{self.user_profile.team_id} - {self.account_id}"
