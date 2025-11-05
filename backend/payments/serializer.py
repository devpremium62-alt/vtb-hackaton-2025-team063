from rest_framework import serializers
from .models import Payment, PaymentConsent, PaymentLimit


class PaymentSerializer(serializers.ModelSerializer):
    bank_name = serializers.CharField(source="bank.name", read_only=True)
    team_id = serializers.CharField(
        source="user_profile.team_id", read_only=True
    )
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
        read_only_fields = [
            "status",
            "created_at",
            "executed_at",
            "updated_at",
        ]


class PaymentCreateSerializer(serializers.Serializer):
    bank_name = serializers.CharField(max_length=50)
    amount = serializers.DecimalField(
        max_digits=15, decimal_places=2, min_value=0.01
    )
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
    payment_consent_id = serializers.CharField(
        required=False, allow_blank=True
    )

    def validate(self, data):
        if data.get("consent_id") and data.get("payment_consent_id"):
            raise serializers.ValidationError(
                "Укажите только один из consent_id или payment_consent_id"
            )
        return data


class PaymentConsentSerializer(serializers.ModelSerializer):
    bank_name = serializers.CharField(source="bank.name", read_only=True)
    team_id = serializers.CharField(
        source="user_profile.team_id", read_only=True
    )
    is_expired = serializers.SerializerMethodField()
    can_be_used = serializers.SerializerMethodField()

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
            "currency",
            "amount",
            "creditor_account",
            "creditor_name",
            "reference",
            "max_amount_per_payment",
            "max_total_amount",
            "max_uses",
            "used_count",
            "used_amount",
            "allowed_creditor_accounts",
            "vrp_max_individual_amount",
            "vrp_daily_limit",
            "vrp_monthly_limit",
            "valid_from",
            "valid_until",
            "is_expired",
            "can_be_used",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "used_count",
            "used_amount",
            "created_at",
            "updated_at",
        ]

    def get_is_expired(self, obj):
        return obj.is_expired()

    def get_can_be_used(self, obj):
        can_use, reason = obj.can_be_used()
        return {"allowed": can_use, "reason": reason}


class PaymentConsentCreateSerializer(serializers.Serializer):
    CONSENT_TYPES = [
        ("SINGLE_USE", "Одноразовый"),
        ("MULTI_USE", "Многоразовый"),
        ("VRP", "Переменные регулярные платежи"),
    ]

    bank_name = serializers.CharField(max_length=50)
    consent_type = serializers.ChoiceField(choices=CONSENT_TYPES)
    debtor_account = serializers.CharField(max_length=100)
    currency = serializers.CharField(
        max_length=3, default="RUB", required=False
    )

    amount = serializers.DecimalField(
        max_digits=15, decimal_places=2, required=False, allow_null=True
    )
    creditor_account = serializers.CharField(
        max_length=100, required=False, allow_blank=True, allow_null=True
    )
    creditor_name = serializers.CharField(
        max_length=255, required=False, allow_blank=True, allow_null=True
    )
    reference = serializers.CharField(
        required=False, allow_blank=True, allow_null=True
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
    allowed_creditor_accounts = serializers.ListField(
        child=serializers.CharField(max_length=100),
        required=False,
        allow_empty=True,
    )

    vrp_max_individual_amount = serializers.DecimalField(
        max_digits=15, decimal_places=2, required=False, allow_null=True
    )
    vrp_daily_limit = serializers.DecimalField(
        max_digits=15, decimal_places=2, required=False, allow_null=True
    )
    vrp_monthly_limit = serializers.DecimalField(
        max_digits=15, decimal_places=2, required=False, allow_null=True
    )

    valid_from = serializers.DateTimeField(required=False, allow_null=True)
    valid_until = serializers.DateTimeField(required=False, allow_null=True)
    reason = serializers.CharField(required=False, allow_blank=True)

    def validate(self, data):
        consent_type = data.get("consent_type")

        if consent_type == "SINGLE_USE":
            if not data.get("amount"):
                raise serializers.ValidationError(
                    "Для одноразового согласия обязателен amount"
                )
            if not data.get("creditor_account"):
                raise serializers.ValidationError(
                    "Для одноразового согласия обязателен creditor_account"
                )
        elif consent_type == "MULTI_USE":
            if not data.get("max_amount_per_payment"):
                raise serializers.ValidationError(
                    "Для многоразового согласия обязателен max_amount_per_payment"
                )
            if not data.get("max_total_amount"):
                raise serializers.ValidationError(
                    "Для многоразового согласия обязателен max_total_amount"
                )
        elif consent_type == "VRP":
            if not data.get("vrp_max_individual_amount"):
                raise serializers.ValidationError(
                    "Для VRP согласия обязателен vrp_max_individual_amount"
                )
            if not data.get("vrp_daily_limit"):
                raise serializers.ValidationError(
                    "Для VRP согласия обязателен vrp_daily_limit"
                )
        return data


class PaymentLimitSerializer(serializers.ModelSerializer):
    team_id = serializers.CharField(
        source="user_profile.team_id", read_only=True
    )

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
