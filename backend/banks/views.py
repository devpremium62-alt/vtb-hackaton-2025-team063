from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from django.shortcuts import get_object_or_404

from .models import Bank, UserBankProfile, AccountSharing
from .serializers import (
    AccountSharingSerializer, BankSerializer, UserBankProfileSerializer
    )
from .services import BankManagementService, AccountSharingService
from .clients import BankClientFactory
from .permissions import IsBankOrUserAuthenticated


class BankViewSet(ModelViewSet):
    queryset = Bank.objects.filter(is_active=True)
    serializer_class = BankSerializer
    permission_classes = [IsBankOrUserAuthenticated]

    @action(detail=False, methods=["post"])
    def add_custom_bank(self, request):
        serializer = BankSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST
                )

        data = serializer.validated_data
        try:
            bank = BankManagementService.add_new_bank(
                name=data.get("name"),
                base_url=data.get("base_url"),
                client_id=data.get("client_id"),
                client_secret=data.get("client_secret"),
                custom_name=data.get("custom_name"),
            )
        except Exception as exc:
            return Response(
                {"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST
                )

        return Response(
            BankSerializer(bank).data, status=status.HTTP_201_CREATED
            )


class UserProfileViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = UserBankProfileSerializer

    def get_queryset(self):
        return UserBankProfile.objects.filter(user=self.request.user)


class AccountSharingViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = AccountSharingSerializer

    def get_queryset(self):
        profile = get_object_or_404(UserBankProfile, user=self.request.user)
        return (
            AccountSharing.objects.filter(sharer=profile)
            | AccountSharing.objects.filter(receiver=profile)
            )

    def create(self, request):
        profile = get_object_or_404(UserBankProfile, user=request.user)
        receiver_team_id = request.data.get("receiver_team_id")
        permissions = request.data.get(
            "permissions", ["ReadAccountsDetail", "ReadBalances"]
            )
        expires_in_days = int(request.data.get("expires_in_days", 30))

        try:
            sharing = AccountSharingService.create_sharing_request(
                sharer_profile=profile,
                receiver_team_id=receiver_team_id,
                permissions=permissions,
                expires_in_days=expires_in_days,
            )
        except ValueError as exc:
            return Response(
                {"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST
                )

        response_data = {
            "receiver_team_id": sharing.receiver.team_id,
            "status": sharing.status,
            "sharing_token": sharing.token,
            "confirmation_url": (
                f"/api/banking/sharing/confirm/{sharing.token}/"
                ),
        }
        return Response(response_data, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([IsBankOrUserAuthenticated])
def authenticate_bank(request):
    profile = get_object_or_404(UserBankProfile, user=request.user)
    bank_name = request.data.get("bank_name")
    if not bank_name:
        return Response(
            {"error": "bank_name is required"},
            status=status.HTTP_400_BAD_REQUEST
            )

    client_id = request.data.get("client_id") or profile.team_id
    client_secret = request.data.get("client_secret")

    try:
        client = BankClientFactory.get_client(bank_name)
    except ValueError:
        return Response(
            {"error": f"Unsupported bank: {bank_name}"},
            status=status.HTTP_400_BAD_REQUEST
            )

    try:
        token_data = client._request_token(
            client_id=client_id,
            client_secret=client_secret
            )
    except Exception as exc:
        return Response(
            {"error": f"failed to obtain token: {str(exc)}"},
            status=status.HTTP_502_BAD_GATEWAY
            )

    try:
        bank = Bank.objects.get(name=bank_name)
    except Bank.DoesNotExist:
        return Response(
            {"error": f"Bank {bank_name} not found in system"},
            status=status.HTTP_404_NOT_FOUND
            )

    access_token = token_data.get("access_token")
    if not access_token:
        return Response(
            {"error": "token response missing access_token"},
            status=status.HTTP_502_BAD_GATEWAY
            )

    expires_in = int(token_data.get("expires_in", 86400))
    bank_token = BankManagementService.store_bank_token(
        user_profile=profile,
        bank=bank,
        access_token=access_token,
        token_type="CLIENT",
        expires_in=expires_in,
        scope=token_data.get("scope", ""),
    )

    return Response(
        {"status": "success", "token_id": bank_token.id,
         "expires_at": bank_token.expires_at,
         "bank": bank.name}
        )
