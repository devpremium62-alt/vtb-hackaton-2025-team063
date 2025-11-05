from rest_framework import serializers
from .models import (
    Product,
    ProductAgreement,
    ProductApplication,
    ProductCategory,
    ProductAgreementConsent,
)


class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = ["id", "name", "description", "icon", "order", "is_active"]


class ProductSerializer(serializers.ModelSerializer):

    productId = serializers.CharField(source="product_id", read_only=True)
    productType = serializers.CharField(source="product_type", read_only=True)
    productName = serializers.CharField(source="name", read_only=True)
    description = serializers.CharField(read_only=True)
    interestRate = serializers.DecimalField(
        source="interest_rate", max_digits=5, decimal_places=2, read_only=True
    )
    minAmount = serializers.DecimalField(
        source="min_amount", max_digits=15, decimal_places=2, read_only=True
    )
    maxAmount = serializers.DecimalField(
        source="max_amount", max_digits=15, decimal_places=2, read_only=True
    )
    termMonths = serializers.IntegerField(source="term_months", read_only=True)

    bank_name = serializers.CharField(source="bank.name", read_only=True)
    category_name = serializers.SerializerMethodField()
    is_promotional = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "productId",
            "productType",
            "productName",
            "description",
            "interestRate",
            "minAmount",
            "maxAmount",
            "termMonths",
            "currency",
            "features",
            "id",
            "bank",
            "bank_name",
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

    agreementId = serializers.CharField(source="agreement_id", read_only=True)
    productId = serializers.CharField(source="product.product_id", read_only=True)
    productName = serializers.CharField(source="product.name", read_only=True)
    amount = serializers.DecimalField(max_digits=15, decimal_places=2)
    interestRate = serializers.DecimalField(
        source="interest_rate", max_digits=5, decimal_places=2, read_only=True
    )
    termMonths = serializers.IntegerField(source="term_months", read_only=True)
    openedDate = serializers.DateTimeField(source="opened_date", read_only=True)
    maturityDate = serializers.DateTimeField(source="maturity_date", read_only=True)
    currentBalance = serializers.DecimalField(
        source="current_balance", max_digits=15, decimal_places=2, read_only=True
    )

    bank_name = serializers.CharField(source="product.bank.name", read_only=True)
    team_id = serializers.CharField(source="user_profile.team_id", read_only=True)
    days_until_maturity = serializers.SerializerMethodField()

    class Meta:
        model = ProductAgreement
        fields = [
            "agreementId",
            "productId",
            "productName",
            "status",
            "amount",
            "interestRate",
            "termMonths",
            "openedDate",
            "maturityDate",
            "currentBalance",
            "id",
            "user_profile",
            "team_id",
            "product",
            "bank_name",
            "closed_date",
            "linked_account",
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


class ProductAgreementConsentRequestSerializer(serializers.Serializer):
    requesting_bank = serializers.CharField()
    client_id = serializers.CharField()
    read_product_agreements = serializers.BooleanField(default=False)
    open_product_agreements = serializers.BooleanField(default=False)
    close_product_agreements = serializers.BooleanField(default=False)
    allowed_product_types = serializers.ListField(
        child=serializers.CharField(), required=False, allow_null=True
    )
    max_amount = serializers.DecimalField(
        max_digits=15, decimal_places=2, required=False, allow_null=True
    )
    valid_until = serializers.DateTimeField(required=False, allow_null=True)
    reason = serializers.CharField(required=False, allow_null=True)


class ProductAgreementConsentSerializer(serializers.ModelSerializer):
    consentId = serializers.CharField(source="consent_id", read_only=True)
    status = serializers.CharField(read_only=True)
    creationDateTime = serializers.DateTimeField(source="created_at", read_only=True)
    statusUpdateDateTime = serializers.DateTimeField(source="updated_at", read_only=True)
    permissions = serializers.SerializerMethodField()
    expirationDateTime = serializers.DateTimeField(source="valid_until", read_only=True)

    class Meta:
        model = ProductAgreementConsent
        fields = [
            "consentId",
            "status",
            "creationDateTime",
            "statusUpdateDateTime",
            "permissions",
            "expirationDateTime",
            "requesting_bank",
            "client_id",
            "allowed_product_types",
            "max_amount",
            "reason",
        ]

    def get_permissions(self, obj):
        permissions = []
        if obj.read_product_agreements:
            permissions.append("ReadProductAgreements")
        if obj.open_product_agreements:
            permissions.append("OpenProductAgreements")
        if obj.close_product_agreements:
            permissions.append("CloseProductAgreements")
        return permissions


class ProductAgreementRequestSerializer(serializers.Serializer):
    product_id = serializers.CharField()
    amount = serializers.DecimalField(max_digits=15, decimal_places=2)
    term_months = serializers.IntegerField(required=False, allow_null=True)
    source_account_id = serializers.CharField(required=False, allow_null=True)


class CloseAgreementRequestSerializer(serializers.Serializer):
    repayment_account_id = serializers.CharField(required=False, allow_null=True)
    repayment_amount = serializers.DecimalField(
        max_digits=15, decimal_places=2, required=False, allow_null=True
    )
