from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from banks.models import UserBankProfile
from .models import Payment, PaymentConsent, PaymentLimit
from .serializers import (
    PaymentSerializer,
    PaymentCreateSerializer,
    PaymentConsentSerializer,
    PaymentConsentCreateSerializer,
    PaymentLimitSerializer,
)
from .services import PaymentService, PaymentConsentService


class PaymentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = PaymentSerializer

    def get_queryset(self):
        user_profile = get_object_or_404(UserBankProfile, user=self.request.user)
        return Payment.objects.filter(user_profile=user_profile).select_related(
            "bank", "debtor_bank", "creditor_bank"
        )

    def create(self, request):
        user_profile = get_object_or_404(UserBankProfile, user=request.user)
        serializer = PaymentCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        payment_service = PaymentService(user_profile)
        try:
            payment = payment_service.create_payment(serializer.validated_data)
            return Response(
                PaymentSerializer(payment).data, status=status.HTTP_201_CREATED
            )
        except Exception as exc:
            return Response({"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["get"])
    def status(self, request, pk=None):
        payment = self.get_object()
        user_profile = get_object_or_404(UserBankProfile, user=request.user)
        if payment.user_profile != user_profile:
            return Response({"error": "Доступ запрещен"}, status=status.HTTP_403_FORBIDDEN)

        payment_service = PaymentService(user_profile)
        try:
            payment = payment_service.get_payment_status(payment)
            return Response(PaymentSerializer(payment).data)
        except Exception as exc:
            return Response({"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)


class PaymentConsentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = PaymentConsentSerializer

    def get_queryset(self):
        user_profile = get_object_or_404(UserBankProfile, user=self.request.user)
        return PaymentConsent.objects.filter(user_profile=user_profile).select_related(
            "bank"
        )

    def create(self, request):
        user_profile = get_object_or_404(UserBankProfile, user=request.user)
        serializer = PaymentConsentCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        consent_service = PaymentConsentService(user_profile)
        try:
            consent = consent_service.create_consent(serializer.validated_data)
            return Response(
                PaymentConsentSerializer(consent).data, status=status.HTTP_201_CREATED
            )
        except Exception as exc:
            return Response({"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["post"])
    def revoke(self, request, pk=None):
        consent = self.get_object()
        user_profile = get_object_or_404(UserBankProfile, user=request.user)
        if consent.user_profile != user_profile:
            return Response({"error": "Доступ запрещен"}, status=status.HTTP_403_FORBIDDEN)

        # TODO: реализовать вызов API банка для отзыва согласия
        consent.status = "REVOKED"
        consent.save()
        return Response({"status": "consent revoked"})


class PaymentLimitViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = PaymentLimitSerializer

    def get_queryset(self):
        user_profile = get_object_or_404(UserBankProfile, user=self.request.user)
        return PaymentLimit.objects.filter(user_profile=user_profile)

    @action(detail=True, methods=["get"])
    def reset(self, request, pk=None):
        limit = self.get_object()
        user_profile = get_object_or_404(UserBankProfile, user=request.user)
        if limit.user_profile != user_profile:
            return Response({"error": "Доступ запрещен"}, status=status.HTTP_403_FORBIDDEN)

        limit.daily_used = 0
        limit.weekly_used = 0
        limit.monthly_used = 0
        limit.save()
        return Response(PaymentLimitSerializer(limit).data)
