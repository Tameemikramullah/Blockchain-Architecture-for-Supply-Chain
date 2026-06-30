from django.db.models.signals import post_migrate
from django.dispatch import receiver
from delivery.models import Location
@receiver(post_migrate)
def create_predefined_locations(sender, **kwargs):
    locations = [
        {"name": "New York", "latitude": 40.7128, "longitude": -74.0059},
        {"name": "Los Angeles", "latitude": 34.0522, "longitude": -118.2437},
        {"name": "Chicago", "latitude": 41.8781, "longitude": -87.6298},
        {"name": "Houston", "latitude": 29.7604, "longitude": -95.3698},
        {"name": "Philadelphia", "latitude": 39.9526, "longitude": -75.1652},
        {"name": "Phoenix", "latitude": 33.4484, "longitude": -112.0740},
        {"name": "San Antonio", "latitude": 29.4241, "longitude": -98.4936},
        {"name": "San Diego", "latitude": 32.7157, "longitude": -117.1611},
        {"name": "Dallas", "latitude": 32.7767, "longitude": -96.7970},
        {"name": "San Jose", "latitude": 37.3382, "longitude": -121.8863},
        {"name": "Austin", "latitude": 30.2672, "longitude": -97.7431},
        {"name": "Jacksonville", "latitude": 30.3322, "longitude": -81.6557},
        {"name": "Fort Worth", "latitude": 32.7555, "longitude": -97.3308},
        {"name": "Columbus", "latitude": 39.9612, "longitude": -82.9988},
        {"name": "Charlotte", "latitude": 35.2271, "longitude": -80.8431},
    ]

    for location_data in locations:
        name = location_data["name"]
        latitude = location_data["latitude"]
        longitude = location_data["longitude"]

        location, created = Location.objects.get_or_create(
            name=name,
            defaults={"latitude": latitude, "longitude": longitude}
        )

        if created:
            print(f'Successfully created location "{name}"')
        else:
            print(f'Location "{name}" already exists')