from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from banks.models import UserBankProfile
from .models import (
    Product,
    ProductAgreement,
    ProductApplication,
    ProductCategory,
    ProductAgreementConsent
)
from .serializers import (
    ProductSerializer,
    ProductAgreementSerializer,
    ProductApplicationSerializer,
    ProductApplicationCreateSerializer,
    ProductCategorySerializer,
    ProductOfferSerializer,
    ProductAgreementConsentRequestSerializer,
    ProductAgreementConsentSerializer,
    ProductAgreementRequestSerializer,
    CloseAgreementRequestSerializer,
)
from .services import (
    ProductService,
    ProductAgreementService,
    ProductRecommendationService,
    ProductAgreementConsentService,
)


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = Product.objects.filter(status="ACTIVE").select_related("bank")
        product_type = self.request.query_params.get("product_type")
        if product_type:
            queryset = queryset.filter(product_type=product_type.upper())
        bank_name = self.request.query_params.get("bank_name")
        if bank_name:
            queryset = queryset.filter(bank__name=bank_name.upper())
        featured = self.request.query_params.get("featured")
        if featured and featured.lower() == "true":
            queryset = queryset.filter(is_featured=True)
        return queryset

    @action(detail=False, methods=["get"])
    def categories(self, request):
        categories = ProductCategory.objects.filter(is_active=True)
        serializer = ProductCategorySerializer(categories, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def recommendations(self, request):
        user_profile = get_object_or_404(UserBankProfile, user=request.user)
        service = ProductRecommendationService(user_profile)
        try:
            offers = service.get_personalized_offers()
            serializer = ProductOfferSerializer(offers, many=True)
            return Response(serializer.data)
        except Exception as exc:
            return Response({"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["post"])
    def apply(self, request, pk=None):
        product = self.get_object()
        user_profile = get_object_or_404(UserBankProfile, user=request.user)
        serializer = ProductApplicationCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        service = ProductService(user_profile)
        try:
            application = service.create_application(product, serializer.validated_data)
            application = service.submit_application(application)
            return Response(
                ProductApplicationSerializer(application).data,
                status=status.HTTP_201_CREATED,
            )
        except Exception as exc:
            return Response({"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)


class ProductAgreementViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ProductAgreementSerializer

    def get_queryset(self):
        consent_id = self.request.headers.get('X-Product-Agreement-Consent-Id')
        requesting_bank = self.request.headers.get('X-Requesting-Bank')
        client_id = self.request.query_params.get('client_id')

        if requesting_bank and client_id:
            if not consent_id:
                return Response(
                    {"error": "Consent required for cross-bank requests"},
                    status=status.HTTP_403_FORBIDDEN
                )

            try:
                user_profile = UserBankProfile.objects.get(team_id=client_id)
            except UserBankProfile.DoesNotExist:
                return Response(
                    {"error": "Client not found"},
                    status=status.HTTP_404_NOT_FOUND
                )

            consent_service = ProductAgreementConsentService()
            if not consent_service.validate_consent(
                consent_id, requesting_bank, client_id, "read"
            ):
                return Response(
                    {"error": "Invalid or expired consent"},
                    status=status.HTTP_403_FORBIDDEN
                )
            return ProductAgreement.objects.filter(
                user_profile=user_profile
            ).select_related("product", "product__bank", "linked_account")

        user_profile = get_object_or_404(UserBankProfile, user=self.request.user)
        return ProductAgreement.objects.filter(user_profile=user_profile).select_related(
            "product", "product__bank", "linked_account"
        )

    def create(self, request):
        """Создание договора с поддержкой межбанковых запросов"""
        serializer = ProductAgreementRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        consent_id = request.headers.get('X-Product-Agreement-Consent-Id')
        requesting_bank = request.headers.get('X-Requesting-Bank')
        client_id = request.query_params.get('client_id')

        if requesting_bank and client_id:
            if not consent_id:
                return Response(
                    {"error": "Consent required for cross-bank requests"},
                    status=status.HTTP_403_FORBIDDEN
                )

            try:
                user_profile = UserBankProfile.objects.get(team_id=client_id)
            except UserBankProfile.DoesNotExist:
                return Response(
                    {"error": "Client not found"},
                    status=status.HTTP_404_NOT_FOUND
                )

            consent_service = ProductAgreementConsentService()
            product = get_object_or_404(Product, product_id=serializer.validated_data['product_id'])

            if not consent_service.validate_consent(
                consent_id, requesting_bank, client_id, "open",
                product_type=product.product_type,
                amount=serializer.validated_data['amount']
            ):
                return Response(
                    {"error": "Consent does not allow this operation"},
                    status=status.HTTP_403_FORBIDDEN
                )
        else:
            user_profile = get_object_or_404(UserBankProfile, user=request.user)

        service = ProductAgreementService(user_profile)
        try:
            product = get_object_or_404(Product, product_id=serializer.validated_data['product_id'])
            agreement = service.open_agreement(product, serializer.validated_data)
            return Response(
                ProductAgreementSerializer(agreement).data,
                status=status.HTTP_201_CREATED,
            )
        except Exception as exc:
            return Response({"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["post"])
    def close(self, request, pk=None):
        agreement = self.get_object()
        user_profile = get_object_or_404(UserBankProfile, user=request.user)
        consent_id = request.headers.get('X-Product-Agreement-Consent-Id')
        requesting_bank = request.headers.get('X-Requesting-Bank')

        if requesting_bank:
            if not consent_id:
                return Response(
                    {"error": "Consent required for cross-bank requests"},
                    status=status.HTTP_403_FORBIDDEN
                )

            consent_service = ProductAgreementConsentService()
            if not consent_service.validate_consent(
                consent_id, requesting_bank, agreement.user_profile.team_id, "close"
            ):
                return Response(
                    {"error": "Consent does not allow closing agreements"},
                    status=status.HTTP_403_FORBIDDEN
                )
        else:
            if agreement.user_profile != user_profile:
                return Response({"error": "Доступ запрещен"}, status=status.HTTP_403_FORBIDDEN)

        serializer = CloseAgreementRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        service = ProductAgreementService(user_profile)
        try:
            agreement = service.close_agreement(agreement, serializer.validated_data)
            return Response(ProductAgreementSerializer(agreement).data)
        except Exception as exc:
            return Response({"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)


class ProductApplicationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ProductApplicationSerializer

    def get_queryset(self):
        user_profile = get_object_or_404(UserBankProfile, user=self.request.user)
        return ProductApplication.objects.filter(user_profile=user_profile).select_related(
            "product", "product__bank"
        )

    @action(detail=True, methods=["post"])
    def submit(self, request, pk=None):
        application = self.get_object()
        user_profile = get_object_or_404(UserBankProfile, user=request.user)
        if application.user_profile != user_profile:
            return Response({"error": "Доступ запрещен"}, status=status.HTTP_403_FORBIDDEN)
        if application.status != "DRAFT":
            return Response({"error": "Заявка уже отправлена"}, status=status.HTTP_400_BAD_REQUEST)
        service = ProductService(user_profile)
        try:
            application = service.submit_application(application)
            return Response(ProductApplicationSerializer(application).data)
        except Exception as exc:
            return Response({"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)


class ProductAgreementConsentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ProductAgreementConsentSerializer

    def get_queryset(self):
        user_profile = get_object_or_404(UserBankProfile, user=self.request.user)
        return ProductAgreementConsent.objects.filter(user_profile=user_profile)

    def create(self, request):
        """Создание запроса на согласие"""
        serializer = ProductAgreementConsentRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user_profile = get_object_or_404(UserBankProfile, user=request.user)
        service = ProductAgreementConsentService()

        try:
            consent = service.create_consent_request(
                user_profile, serializer.validated_data
            )
            return Response(
                ProductAgreementConsentSerializer(consent).data,
                status=status.HTTP_201_CREATED
            )
        except Exception as exc:
            return Response({"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["post"])
    def approve(self, request, pk=None):
        """Одобрение согласия (для банка-владельца)"""
        consent = self.get_object()
        service = ProductAgreementConsentService()

        try:
            consent = service.approve_consent(consent)
            return Response(ProductAgreementConsentSerializer(consent).data)
        except Exception as exc:
            return Response({"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["post"])
    def reject(self, request, pk=None):
        """Отклонение согласия (для банка-владельца)"""
        consent = self.get_object()
        service = ProductAgreementConsentService()

        try:
            consent = service.reject_consent(consent)
            return Response(ProductAgreementConsentSerializer(consent).data)
        except Exception as exc:
            return Response({"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
