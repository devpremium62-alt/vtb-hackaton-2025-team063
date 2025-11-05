from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r"banks", views.BankViewSet, basename="bank")
router.register(r"profiles", views.UserProfileViewSet, basename="profile")
router.register(
    r"account-sharing", views.AccountSharingViewSet, basename="account-sharing"
    )

urlpatterns = [
    path("", include(router.urls)),
    path("auth/bank/", views.authenticate_bank, name="authenticate-bank"),
]
