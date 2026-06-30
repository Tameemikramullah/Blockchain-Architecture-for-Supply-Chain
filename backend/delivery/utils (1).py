from django.db.models.signals import post_migrate
from django.dispatch import receiver
from delivery.models import Location
@receiver(post_migrate)
def create_predefined_locations(sender, **kwargs):
    locations = [
        # United Kingdom
        {"name": "London", "latitude": 51.5074, "longitude": -0.1278},
        {"name": "Manchester", "latitude": 53.4808, "longitude": -2.2426},
        {"name": "Birmingham", "latitude": 52.4862, "longitude": -1.8904},
        {"name": "Edinburgh", "latitude": 55.9533, "longitude": -3.1883},
        {"name": "Glasgow", "latitude": 55.8642, "longitude": -4.2518},

        # Ireland
        {"name": "Dublin", "latitude": 53.3498, "longitude": -6.2603},

        # France
        {"name": "Paris", "latitude": 48.8566, "longitude": 2.3522},
        {"name": "Lyon", "latitude": 45.7640, "longitude": 4.8357},
        {"name": "Marseille", "latitude": 43.2965, "longitude": 5.3698},

        # Germany
        {"name": "Berlin", "latitude": 52.5200, "longitude": 13.4050},
        {"name": "Munich", "latitude": 48.1351, "longitude": 11.5820},
        {"name": "Frankfurt", "latitude": 50.1109, "longitude": 8.6821},
        {"name": "Hamburg", "latitude": 53.5511, "longitude": 9.9937},

        # Netherlands
        {"name": "Amsterdam", "latitude": 52.3676, "longitude": 4.9041},
        {"name": "Rotterdam", "latitude": 51.9244, "longitude": 4.4777},

        # Belgium
        {"name": "Brussels", "latitude": 50.8503, "longitude": 4.3517},

        # Switzerland
        {"name": "Zurich", "latitude": 47.3769, "longitude": 8.5417},
        {"name": "Geneva", "latitude": 46.2044, "longitude": 6.1432},

        # Austria
        {"name": "Vienna", "latitude": 48.2082, "longitude": 16.3738},

        # Italy
        {"name": "Rome", "latitude": 41.9028, "longitude": 12.4964},
        {"name": "Milan", "latitude": 45.4642, "longitude": 9.1900},
        {"name": "Naples", "latitude": 40.8518, "longitude": 14.2681},

        # Spain
        {"name": "Madrid", "latitude": 40.4168, "longitude": -3.7038},
        {"name": "Barcelona", "latitude": 41.3851, "longitude": 2.1734},
        {"name": "Valencia", "latitude": 39.4699, "longitude": -0.3763},

        # Portugal
        {"name": "Lisbon", "latitude": 38.7223, "longitude": -9.1393},
        {"name": "Porto", "latitude": 41.1579, "longitude": -8.6291},

        # Denmark
        {"name": "Copenhagen", "latitude": 55.6761, "longitude": 12.5683},

        # Sweden
        {"name": "Stockholm", "latitude": 59.3293, "longitude": 18.0686},
        {"name": "Gothenburg", "latitude": 57.7089, "longitude": 11.9746},

        # Norway
        {"name": "Oslo", "latitude": 59.9139, "longitude": 10.7522},

        # Finland
        {"name": "Helsinki", "latitude": 60.1699, "longitude": 24.9384},

        # Poland
        {"name": "Warsaw", "latitude": 52.2297, "longitude": 21.0122},
        {"name": "Krakow", "latitude": 50.0647, "longitude": 19.9450},

        # Czech Republic
        {"name": "Prague", "latitude": 50.0755, "longitude": 14.4378},

        # Hungary
        {"name": "Budapest", "latitude": 47.4979, "longitude": 19.0402},

        # Romania
        {"name": "Bucharest", "latitude": 44.4268, "longitude": 26.1025},

        # Greece
        {"name": "Athens", "latitude": 37.9838, "longitude": 23.7275},

        # Croatia
        {"name": "Zagreb", "latitude": 45.8150, "longitude": 15.9819},

        # Serbia
        {"name": "Belgrade", "latitude": 44.7866, "longitude": 20.4489},

        # Bulgaria
        {"name": "Sofia", "latitude": 42.6977, "longitude": 23.3219},

        # Lithuania
        {"name": "Vilnius", "latitude": 54.6872, "longitude": 25.2797},

        # Latvia
        {"name": "Riga", "latitude": 56.9496, "longitude": 24.1052},

        # Estonia
        {"name": "Tallinn", "latitude": 59.4370, "longitude": 24.7536},

        # Ukraine
        {"name": "Kyiv", "latitude": 50.4501, "longitude": 30.5234},
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