from geopy import distance


def calculate_distance(location1, location2):
    coords_1 = (location1.latitude, location1.longitude)
    coords_2 = (location2.latitude, location2.longitude)
    return distance.distance(coords_1, coords_2).km


def calculate_delivery_fee(customer_location, product_location):
    distance = calculate_distance(customer_location, product_location)

    # Define your logic for calculating the delivery fee based on the distance
    if distance <= 10:
        delivery_fee = 5.0
    elif distance <= 25:
        delivery_fee = 10.0
    elif distance <= 50:
        delivery_fee = 15.0
    else:
        delivery_fee = 20.0

    return delivery_fee