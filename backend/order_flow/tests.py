from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from users.models import User, Customer
from store.models import Product, Inventory
from order_flow.models import Order, OrderItem
from django.core.exceptions import ObjectDoesNotExist
from delivery.models import Location  # Import the Location model


class OrderViewSetTests(APITestCase):
    def setUp(self):
        self.client = APIClient()

        # Create location instances
        self.location1 = Location.objects.create(name='Location 1', latitude=0.000000, longitude=0.000000)
        self.location2 = Location.objects.create(name='Location 2', latitude=0.000000, longitude=0.000000)

        # Create admin user
        self.admin_user = User.objects.create_superuser('admin', 'admin@example.com', 'password')

        # Create customer user and customer
        self.customer_user = User.objects.create_user('customer', 'customer@example.com', 'password')
        self.customer = Customer.objects.create(user=self.customer_user, name='Customer 1', location=self.location1)

        # Create product
        self.product = Product.objects.create(name='Product 1', price=10.00, product_code=123, location=self.location2)

        # Create order and order item
        self.order = Order.objects.create(customer=self.customer, user=self.customer_user, status='pending')
        self.order_item = OrderItem.objects.create(order=self.order, product=self.product, quantity=2)

        # Create inventory item
        self.inventory_item = Inventory.objects.create(product=self.product, quantity=10)


    def test_all_order_details(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(reverse('order_flow:order-list') + 'order-details/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Add more assertions here to check the response data

    def test_customer_order_history(self):
        self.client.force_authenticate(user=self.customer_user)
        Order.objects.create(customer=self.customer, user=self.customer_user, status='pending')
        response = self.client.get(reverse('order_flow:order-list') + 'order-history/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Add more assertions here to check the response data

    def test_update_order_status(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.patch(reverse('order_flow:order-detail', args=[self.order.order_id]) + 'update-status/',
                                     {'status': 'shipped'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.order.refresh_from_db()
        self.assertEqual(self.order.status, 'shipped')

    def test_create_order(self):
        self.client.force_authenticate(user=self.customer_user)
        data = {
            'items': [
                {'product_code': self.product.product_code, 'quantity': 1}
            ]
        }
        response = self.client.post(reverse('order_flow:order-list') + 'create-order/', data, format='json')
        print(response)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Add more assertions here to check the response data

    def test_customer_order_details(self):
        self.client.force_authenticate(user=self.customer_user)
        response = self.client.get(reverse('order_flow:order-list') + 'customer-order-details/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Add more assertions here to check the response data

    def test_pending_orders(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(reverse('order_flow:order-list') + 'pending-orders/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Add more assertions here to check the response data

    def test_invalid_status_update(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.patch(reverse('order_flow:order-detail', args=[self.order.order_id]) + 'update-status/',
                                     {'status': 'invalid_status'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_no_orders_for_user(self):
        self.client.force_authenticate(user=self.customer_user)
        Order.objects.filter(customer__user=self.customer_user).delete()
        response = self.client.get(reverse('order_flow:order-list') + 'customer-order-details/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
