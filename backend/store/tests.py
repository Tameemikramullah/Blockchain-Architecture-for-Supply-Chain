from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Product, Inventory
from .serializers import ProductSerializer, InventorySerializer
from delivery.models import Location

class ProductViewSetTestCase(APITestCase):
    def setUp(self):
        # Create a product for testing
        self.location = Location.objects.create(name="location10", latitude=11.11, longitude=11.12)
        self.product = Product.objects.create(name='Test Product', product_code='123', price=100, location=self.location)

    def test_update_product(self):
        url = reverse('store:product-update-product', kwargs={'pk': self.product.product_code})
        data = {'name': 'Updated Product', 'product_code': '123', 'price': 150, 'location':self.location}
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.product.refresh_from_db()
        self.assertEqual(self.product.name, 'Updated Product')
        self.assertEqual(self.product.price, 150)

class InventoryViewSetTestCase(APITestCase):
    def setUp(self):
        # Create a product and inventory for testing
        self.location = Location.objects.create(name="location10", latitude=11.11, longitude=11.12)
        self.product = Product.objects.create(name='Test Product', product_code='123', price=100, location=self.location)
        self.inventory = Inventory.objects.create(product=self.product, quantity=10)

    def test_inventory_details(self):
        url = reverse('store:inventory-details', kwargs={'pk': self.inventory.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        expected_data = {
            'inventory_item': InventorySerializer(self.inventory).data,
            'product_details': ProductSerializer(self.product).data
        }
        self.assertEqual(response.data, expected_data)

    def test_inventory_report(self):
        url = reverse('store:inventory-report')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
