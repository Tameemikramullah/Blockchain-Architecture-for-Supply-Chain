from rest_framework import serializers
from .models import Product, Inventory, Supplier
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.response import Response

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class InventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventory
        fields = ['id', 'product', 'quantity']

    def validate_quantity(self, value):
        if value < 0:
            raise serializers.ValidationError("Quantity cannot be negative.")
        # Add additional validation logic here
        return value
class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model=Supplier
        fields = '__all__'