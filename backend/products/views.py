from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from banks.models import UserBankProfile
from .models import Product, ProductAgreement, ProductApplication, ProductCategory
from .serializers import (
    ProductSerializer,
    ProductAgreementSerializer,
    ProductApplicationSerializer,
    ProductApplicationCreateSerializer,
    ProductCategorySerializer,
    ProductOfferSerializer,
)
from .services import (
    ProductService,
    ProductAgreementService,
    ProductRecommendationService,
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
        user_profile = get_object_or_404(UserBankProfile, user=self.request.user)
        return ProductAgreement.objects.filter(user_profile=user_profile).select_related(
            "product", "product__bank", "linked_account"
        )

    @action(detail=True, methods=["post"])
    def close(self, request, pk=None):
        agreement = self.get_object()
        user_profile = get_object_or_404(UserBankProfile, user=request.user)
        if agreement.user_profile != user_profile:
            return Response({"error": "Доступ запрещен"}, status=status.HTTP_403_FORBIDDEN)
        service = ProductAgreementService(user_profile)
        try:
            agreement = service.close_agreement(agreement, request.data)
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
