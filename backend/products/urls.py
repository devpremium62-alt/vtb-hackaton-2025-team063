from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r"products", views.ProductViewSet, basename="product")
router.register(
    r"agreements", views.ProductAgreementViewSet, basename="product-agreement"
)
router.register(
    r"applications",
    views.ProductApplicationViewSet,
    basename="product-application",
)
router.register(
    r"product-agreement-consents",
    views.ProductAgreementConsentViewSet,
    basename="product-agreement-consent",
)

urlpatterns = [
    path("", include(router.urls)),
    path("product-agreement-consents/request",
         views.ProductAgreementConsentViewSet.as_view({'post': 'create'}),
         name="product-agreement-consent-request"),
]
