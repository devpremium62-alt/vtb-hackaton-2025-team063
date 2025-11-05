from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Bank, BankToken, Consent, UserBankProfile, AccountSharing


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name"]


class UserBankProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = UserBankProfile
        fields = ["id", "user", "team_id", "created_at"]


class BankSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bank
        fields = [
            "id", "name", "custom_name", "base_url", "is_active", "created_at"
            ]


class BankTokenSerializer(serializers.ModelSerializer):
    bank_name = serializers.CharField(source="bank.name", read_only=True)
    is_expired = serializers.SerializerMethodField()

    class Meta:
        model = BankToken
        fields = [
            "id",
            "bank",
            "bank_name",
            "token_type",
            "scope", "expires_at",
            "is_expired",
            "is_active",
            "created_at"
            ]

    def get_is_expired(self, obj):
        return obj.is_expired()


class ConsentSerializer(serializers.ModelSerializer):
    bank_name = serializers.CharField(
        source="bank.name", read_only=True
        )
    team_id = serializers.CharField(
        source="user_profile.team_id", read_only=True
        )

    class Meta:
        model = Consent
        fields = [
            "id",
            "bank",
            "bank_name",
            "team_id",
            "consent_id",
            "client_id",
            "status",
            "permissions",
            "expiration_date_time",
            "created_at",
            "updated_at"
            ]


class AccountSharingSerializer(serializers.ModelSerializer):
    sharer_team_id = serializers.CharField(
        source="sharer.team_id", read_only=True
        )
    receiver_team_id = serializers.CharField(
        source="receiver.team_id", read_only=True
        )
    sharer_username = serializers.CharField(
        source="sharer.user.username", read_only=True
        )
    receiver_username = serializers.CharField(
        source="receiver.user.username", read_only=True
        )
    is_expired = serializers.BooleanField(read_only=True)

    class Meta:
        model = AccountSharing
        fields = [
            "id",
            "sharer",
            "receiver",
            "sharer_team_id",
            "receiver_team_id",
            "sharer_username",
            "receiver_username",
            "status",
            "permissions",
            "created_at",
            "expires_at",
            "is_expired",
            "token",
        ]
        read_only_fields = ["token"]
