from rest_framework import serializers
from .models import Account, Transaction, Balance


class BalanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Balance
        fields = [
            "balance_type",
            "amount",
            "currency",
            "credit_limit",
            "credit_used",
            "last_updated",
        ]


class AccountSerializer(serializers.ModelSerializer):
    bank_name = serializers.CharField(source="bank.name", read_only=True)
    team_id = serializers.CharField(
        source="user_profile.team_id", read_only=True)
    current_balance = serializers.DecimalField(
        source="balance", max_digits=15, decimal_places=2, read_only=True
    )
    balances = BalanceSerializer(many=True, read_only=True)

    class Meta:
        model = Account
        fields = [
            "id",
            "user_profile",
            "team_id",
            "bank",
            "bank_name",
            "account_id",
            "account_type",
            "currency",
            "current_balance",
            "available_balance",
            "credit_limit",
            "status",
            "nickname",
            "iban",
            "opened_date",
            "closed_date",
            "last_sync",
            "balances",
        ]
        read_only_fields = ["last_sync"]


class TransactionSerializer(serializers.ModelSerializer):
    account_number = serializers.CharField(
        source="account.account_id",
        read_only=True
        )
    bank_name = serializers.CharField(
        source="account.bank.name",
        read_only=True
        )

    class Meta:
        model = Transaction
        fields = [
            "id",
            "account",
            "account_number",
            "bank_name",
            "transaction_id",
            "bank_transaction_id",
            "amount",
            "currency",
            "type",
            "status",
            "description",
            "merchant_name",
            "merchant_account",
            "booking_date",
            "value_date",
            "category",
            "transaction_code",
            "reference",
        ]


class AccountCreateSerializer(serializers.Serializer):
    bank_name = serializers.CharField(max_length=100)
    account_type = serializers.ChoiceField(choices=Account.ACCOUNT_TYPES)
    nickname = serializers.CharField(
        max_length=100, required=False, allow_blank=True
        )
    initial_balance = serializers.DecimalField(
        max_digits=15, decimal_places=2, default=0, min_value=0
    )


class AccountStatusUpdateSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Account.ACCOUNT_STATUS)


class AccountCloseSerializer(serializers.Serializer):
    action = serializers.ChoiceField(
        choices=[("TRANSFER", "TRANSFER"), ("DONATE", "DONATE")]
        )
    destination_account_id = serializers.CharField(
        required=False, allow_blank=True
        )
