from rest_framework import serializers
from .models import (
    Product,
    ProductAgreement,
    ProductApplication,
    ProductCategory,
)


class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = ["id", "name", "description", "icon", "order", "is_active"]


class ProductSerializer(serializers.ModelSerializer):
    bank_name = serializers.CharField(source="bank.name", read_only=True)
    category_name = serializers.SerializerMethodField()
    is_promotional = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id",
            "bank",
            "bank_name",
            "product_id",
            "product_type",
            "name",
            "description",
            "short_description",
            "interest_rate",
            "min_amount",
            "max_amount",
            "term_months",
            "currency",
            "features",
            "requirements",
            "documents_required",
            "status",
            "is_featured",
            "promotion_end",
            "category_name",
            "is_promotional",
            "created_at",
            "updated_at",
        ]

    def get_category_name(self, obj):
        category_map = {
            "DEPOSIT": "Вклады",
            "LOAN": "Кредиты",
            "CARD": "Карты",
            "ACCOUNT": "Счета",
            "INVESTMENT": "Инвестиции",
            "INSURANCE": "Страхование",
        }
        return category_map.get(obj.product_type, "Другие продукты")

    def get_is_promotional(self, obj):
        from django.utils import timezone

        return bool(obj.promotion_end and obj.promotion_end > timezone.now())


class ProductAgreementSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    bank_name = serializers.CharField(source="product.bank.name", read_only=True)
    team_id = serializers.CharField(source="user_profile.team_id", read_only=True)
    days_until_maturity = serializers.SerializerMethodField()

    class Meta:
        model = ProductAgreement
        fields = [
            "id",
            "user_profile",
            "team_id",
            "product",
            "product_name",
            "bank_name",
            "agreement_id",
            "status",
            "amount",
            "interest_rate",
            "term_months",
            "opened_date",
            "closed_date",
            "maturity_date",
            "linked_account",
            "current_balance",
            "interest_accrued",
            "next_payment_date",
            "next_payment_amount",
            "days_until_maturity",
            "created_at",
            "updated_at",
        ]

    def get_days_until_maturity(self, obj):
        from django.utils import timezone

        if obj.maturity_date:
            delta = obj.maturity_date - timezone.now()
            return max(0, delta.days)
        return None


class ProductApplicationSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    bank_name = serializers.CharField(source="product.bank.name", read_only=True)
    team_id = serializers.CharField(source="user_profile.team_id", read_only=True)

    class Meta:
        model = ProductApplication
        fields = [
            "id",
            "user_profile",
            "team_id",
            "product",
            "product_name",
            "bank_name",
            "application_id",
            "status",
            "requested_amount",
            "requested_term",
            "purpose",
            "application_data",
            "approved_amount",
            "approved_term",
            "approved_interest_rate",
            "rejection_reason",
            "submitted_at",
            "decided_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["status", "submitted_at", "decided_at"]


class ProductApplicationCreateSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    requested_amount = serializers.DecimalField(
        max_digits=15, decimal_places=2, required=False, allow_null=True
    )
    requested_term = serializers.IntegerField(
        min_value=1, required=False, allow_null=True
    )
    purpose = serializers.CharField(required=False, allow_blank=True)
    application_data = serializers.JSONField(required=False, default=dict)


class ProductOfferSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    personalized_rate = serializers.DecimalField(max_digits=5, decimal_places=2)
    personalized_amount = serializers.DecimalField(max_digits=15, decimal_places=2)
    reason = serializers.CharField()
    expiration_date = serializers.DateTimeField()
