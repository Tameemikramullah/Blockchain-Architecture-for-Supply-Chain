from django.apps import AppConfig
from django.db.models.signals import post_migrate
from django.dispatch import receiver

class DeliveryConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "delivery"

    def ready(self):
        from .utils import create_predefined_locations
        post_migrate.connect(create_predefined_locations, sender=self)

