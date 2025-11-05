from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from dateutil import parser as date_parser

from banks.models import UserBankProfile
from .models import Account, Transaction
from .serializers import (
    AccountSerializer,
    TransactionSerializer,
    AccountStatusUpdateSerializer,
    AccountCreateSerializer,
    AccountCloseSerializer,
    BalanceSerializer,
)
from .services import AccountService, TransactionService


class AccountViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = AccountSerializer

    def get_queryset(self):
        user_profile = get_object_or_404(UserBankProfile, user=self.request.user)
        consent_id = self.request.headers.get("X-Consent-Id")
        requesting_bank = self.request.headers.get("X-Requesting-Bank")
        if consent_id and requesting_bank:
            return self._get_interbank_accounts(
                user_profile, consent_id, requesting_bank
                )
        else:
            return Account.objects.filter(
                user_profile=user_profile
            ).prefetch_related("balances")

    @action(detail=False, methods=["post"])
    def create_account(self, request):
        user_profile = get_object_or_404(UserBankProfile, user=request.user)
        serializer = AccountCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        bank_name = getattr(user_profile, 'default_bank', 'vbank')
        account_service = AccountService(user_profile)
        try:
            account = account_service.create_account(
                bank_name=bank_name,
                account_type=serializer.validated_data['account_type'],
                nickname=request.data.get('nickname', ''),
                initial_balance=serializer.validated_data['initial_balance']
            )
            return Response(
                AccountSerializer(account).data,
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response(
                {"error": f"Ошибка создания счета: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=["put"])
    def close(self, request, pk=None):
        account = self.get_object()
        user_profile = get_object_or_404(UserBankProfile, user=request.user)
        if account.user_profile != user_profile:
            return Response(
                {"error": "Доступ запрещен"},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = AccountCloseSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        account_service = AccountService(user_profile)
        try:
            result = account_service.close_account(
                account=account,
                action=serializer.validated_data['action'],
                destination_account_id=serializer.validated_data.get(
                    'destination_account_id'
                    )
            )
            account.refresh_from_db()

            return Response({
                "status": "success",
                "account_id": account.account_id,
                "action": serializer.validated_data['action'],
                "bank_response": result,
                "new_status": account.status,
                "closed_date": account.closed_date
            })

        except Exception as e:
            return Response(
                {"error": f"Ошибка закрытия счета: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=["post"])
    def sync(self, request):
        user_profile = get_object_or_404(UserBankProfile, user=request.user)
        account_service = AccountService(user_profile)

        bank_name = request.data.get("bank_name")
        consent_id = request.headers.get("X-Consent-Id")
        requesting_bank = request.headers.get("X-Requesting-Bank")

        if bank_name:
            try:
                accounts = account_service.sync_accounts_from_bank(
                    bank_name,
                    consent_id=consent_id,
                    requesting_bank=requesting_bank
                )
                return Response(
                    {"status": "success",
                     "synced_accounts": len(accounts),
                     "bank": bank_name
                     }
                )
            except Exception as e:
                return Response(
                    {"error": str(e)}, status=status.HTTP_400_BAD_REQUEST
                )

        from banks.models import Consent

        consents = Consent.objects.filter(
            user_profile=user_profile, status="AUTHORISED"
        )
        total_synced = 0
        errors = []

        for consent in consents:
            try:
                accounts = account_service.sync_accounts_from_bank(
                    consent.bank.name,
                    consent_id=consent.consent_id,
                    requesting_bank=requesting_bank
                )
                total_synced += len(accounts)
            except Exception as e:
                errors.append(f"{consent.bank.name}: {str(e)}")

        response_data = {
            "status": "partial_success" if errors else "success",
            "total_synced_accounts": total_synced
        }
        if errors:
            response_data["errors"] = errors

        return Response(response_data)

    @action(detail=True, methods=["get"])
    def balances(self, request, pk=None):
        account = self.get_object()
        user_profile = get_object_or_404(UserBankProfile, user=request.user)
        consent_id = request.headers.get("X-Consent-Id")
        requesting_bank = request.headers.get("X-Requesting-Bank")
        if consent_id and requesting_bank:
            if not self._check_interbank_access(account, consent_id, requesting_bank):
                return Response({"error": "Доступ запрещен"}, status=status.HTTP_403_FORBIDDEN)
        else:
            if account.user_profile != user_profile:
                return Response({"error": "Доступ запрещен"}, status=status.HTTP_403_FORBIDDEN)
        serializer = BalanceSerializer(account.balances.all(), many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["put"])
    def status(self, request, pk=None):
        account = self.get_object()
        user_profile = get_object_or_404(UserBankProfile, user=request.user)

        if account.user_profile != user_profile:
            return Response(
                {"error": "Доступ запрещен"}, status=status.HTTP_403_FORBIDDEN
            )

        serializer = AccountStatusUpdateSerializer(data=request.data)
        if serializer.is_valid():
            new_status = serializer.validated_data["status"]

            if new_status == "CLOSED" and account.balance != 0:
                return Response(
                    {"error": "Нельзя закрыть счет с ненулевым балансом."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            account.status = new_status
            if account.status == "CLOSED":
                from django.utils import timezone
                account.closed_date = timezone.now()
            account.save()

            return Response(AccountSerializer(account).data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["get"])
    def transactions(self, request, pk=None):
        account = self.get_object()
        user_profile = get_object_or_404(UserBankProfile, user=request.user)

        if account.user_profile != user_profile:
            return Response(
                {"error": "Доступ запрещен"}, status=status.HTTP_403_FORBIDDEN
            )

        account_service = AccountService(user_profile)

        try:
            page = int(request.query_params.get("page", 1))
        except ValueError:
            return Response(
                {"error": "page должен быть целым числом"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            limit = min(int(request.query_params.get("limit", 50)), 500)
        except ValueError:
            return Response(
                {"error": "limit должен быть целым числом"},
                status=status.HTTP_400_BAD_REQUEST
            )

        from_date = None
        to_date = None
        try:
            if request.query_params.get("from_date"):
                from_date = date_parser.isoparse(
                    request.query_params["from_date"]
                )
            if request.query_params.get("to_date"):
                to_date = date_parser.isoparse(
                    request.query_params["to_date"]
                )
        except (ValueError, TypeError):
            return Response(
                {"error": "Неверный формат даты, используйте ISO8601"},
                status=status.HTTP_400_BAD_REQUEST
            )

        consent_id = request.headers.get("X-Consent-Id")
        requesting_bank = request.headers.get("X-Requesting-Bank")

        try:
            transactions = account_service.get_account_transactions(
                account,
                page,
                limit,
                from_date,
                to_date,
                consent_id=consent_id,
                requesting_bank=requesting_bank
            )
            serializer = TransactionSerializer(transactions, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class TransactionViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = TransactionSerializer

    def get_queryset(self):
        user_profile = get_object_or_404(
            UserBankProfile, user=self.request.user
        )
        return Transaction.objects.filter(
            account__user_profile=user_profile
        ).select_related("account", "account__bank")

    @action(detail=False, methods=["get"])
    def analytics(self, request):
        user_profile = get_object_or_404(UserBankProfile, user=request.user)

        try:
            days = int(request.query_params.get("days", 30))
        except ValueError:
            return Response(
                {"error": "days должен быть целым числом"},
                status=status.HTTP_400_BAD_REQUEST
            )

        spending_patterns = TransactionService.analyze_spending_patterns(
            user_profile, days
        )

        return Response(
            {
                "period_days": days,
                "spending_by_category": spending_patterns,
                "categories": TransactionService.get_transaction_categories(),
            }
        )
