from rest_framework import serializers
from .models import Payment, PaymentConsent, PaymentLimit


class PaymentSerializer(serializers.ModelSerializer):
    bank_name = serializers.CharField(source="bank.name", read_only=True)
    team_id = serializers.CharField(source="user_profile.team_id", read_only=True)
    debtor_bank_name = serializers.CharField(
        source="debtor_bank.name", read_only=True
    )
    creditor_bank_name = serializers.CharField(
        source="creditor_bank.name", read_only=True
    )

    class Meta:
        model = Payment
        fields = [
            "id",
            "user_profile",
            "team_id",
            "bank",
            "bank_name",
            "payment_id",
            "consent_id",
            "payment_type",
            "amount",
            "currency",
            "fee",
            "debtor_account",
            "debtor_bank",
            "debtor_bank_name",
            "creditor_account",
            "creditor_name",
            "creditor_bank",
            "creditor_bank_name",
            "description",
            "reference",
            "status",
            "created_at",
            "executed_at",
            "updated_at",
        ]
        read_only_fields = ["status", "created_at", "executed_at", "updated_at"]


class PaymentCreateSerializer(serializers.Serializer):
    bank_name = serializers.CharField(max_length=50)
    amount = serializers.DecimalField(max_digits=15, decimal_places=2, min_value=0.01)
    currency = serializers.CharField(max_length=3, default="RUB")
    debtor_account = serializers.CharField(max_length=100)
    creditor_account = serializers.CharField(max_length=100)
    creditor_name = serializers.CharField(max_length=255)
    creditor_bank_code = serializers.CharField(
        max_length=50, required=False, allow_blank=True
    )
    description = serializers.CharField(required=False, allow_blank=True)
    reference = serializers.CharField(required=False, allow_blank=True)
    consent_id = serializers.CharField(required=False, allow_blank=True)


class PaymentConsentSerializer(serializers.ModelSerializer):
    bank_name = serializers.CharField(source="bank.name", read_only=True)
    team_id = serializers.CharField(source="user_profile.team_id", read_only=True)
    is_expired = serializers.SerializerMethodField()

    class Meta:
        model = PaymentConsent
        fields = [
            "id",
            "user_profile",
            "team_id",
            "bank",
            "bank_name",
            "consent_id",
            "consent_type",
            "status",
            "debtor_account",
            "max_amount_per_payment",
            "max_total_amount",
            "max_uses",
            "used_count",
            "used_amount",
            "vrp_max_individual_amount",
            "vrp_daily_limit",
            "vrp_monthly_limit",
            "valid_from",
            "valid_until",
            "is_expired",
            "created_at",
            "updated_at",
        ]

    def get_is_expired(self, obj):
        return obj.is_expired()


class PaymentConsentCreateSerializer(serializers.Serializer):
    CONSENT_TYPES = [
        ("SINGLE_USE", "Одноразовый"),
        ("MULTI_USE", "Многоразовый"),
        ("VRP", "Переменные регулярные платежи"),
    ]

    bank_name = serializers.CharField(max_length=50)
    consent_type = serializers.ChoiceField(choices=CONSENT_TYPES)
    debtor_account = serializers.CharField(max_length=100)
    amount = serializers.DecimalField(
        max_digits=15, decimal_places=2, required=False, allow_null=True
    )
    max_amount_per_payment = serializers.DecimalField(
        max_digits=15, decimal_places=2, required=False, allow_null=True
    )
    max_total_amount = serializers.DecimalField(
        max_digits=15, decimal_places=2, required=False, allow_null=True
    )
    max_uses = serializers.IntegerField(
        min_value=1, required=False, allow_null=True
    )
    valid_until = serializers.DateTimeField(required=False, allow_null=True)


class PaymentLimitSerializer(serializers.ModelSerializer):
    team_id = serializers.CharField(source="user_profile.team_id", read_only=True)

    class Meta:
        model = PaymentLimit
        fields = [
            "id",
            "user_profile",
            "team_id",
            "daily_limit",
            "weekly_limit",
            "monthly_limit",
            "per_transaction_limit",
            "daily_used",
            "weekly_used",
            "monthly_used",
            "last_reset_daily",
            "last_reset_weekly",
            "last_reset_monthly",
        ]
