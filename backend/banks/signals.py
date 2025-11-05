from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import UserBankProfile


@receiver(post_save, sender=User)
def create_user_bank_profile(sender, instance, created, **kwargs):
    if created:
        team_id = f"{instance.username}-1"
        counter = 1
        while UserBankProfile.objects.filter(team_id=team_id).exists():
            counter += 1
            team_id = f"{instance.username}-{counter}"
        UserBankProfile.objects.create(user=instance, team_id=team_id)


@receiver(post_save, sender=User)
def save_user_bank_profile(sender, instance, **kwargs):
    if hasattr(instance, "bank_profile"):
        instance.bank_profile.save()
