from django.core.management.base import BaseCommand
from banks.models import Bank


class Command(BaseCommand):
    help = "Инициализация базовых данных для банкинга"

    def handle(self, *args, **options):
        banks_data = [
            {"name": "VBANK", "base_url": "https://vbank.open.bankingapi.ru", "client_id": "team200", "client_secret": "your-secret"},
            {"name": "ABANK", "base_url": "https://abank.open.bankingapi.ru", "client_id": "team200", "client_secret": "your-secret"},
            {"name": "SBANK", "base_url": "https://sbank.open.bankingapi.ru", "client_id": "team200", "client_secret": "your-secret"},
        ]

        for bank_data in banks_data:
            bank, created = Bank.objects.get_or_create(name=bank_data["name"], defaults=bank_data)
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created bank: {bank.name}"))
            else:
                self.stdout.write(self.style.WARNING(f"Bank exists: {bank.name}"))

