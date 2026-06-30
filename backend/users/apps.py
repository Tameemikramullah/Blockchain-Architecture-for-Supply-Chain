from django.apps import AppConfig
from django.db.models.signals import post_migrate
from django.dispatch import receiver
import os
class UsersConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "users"

    def ready(self):
        if os.environ.get('RUN_MAIN') == 'true':
            post_migrate.connect(create_staff_group, sender=self)

@receiver(post_migrate)
def create_staff_group(sender, **kwargs):
    from .utils import create_staff_group
    create_staff_group()
