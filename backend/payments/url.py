from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r"payments", views.PaymentViewSet, basename="payment")
router.register(r"consents", views.PaymentConsentViewSet, basename="payment-consent")
router.register(r"limits", views.PaymentLimitViewSet, basename="payment-limit")

urlpatterns = [path("", include(router.urls))]
