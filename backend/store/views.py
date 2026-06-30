from rest_framework import viewsets, status
from .models import Product, Inventory, Supplier
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import ProductSerializer, InventorySerializer, SupplierSerializer
from rest_framework import serializers
from order_flow.models import Order
from django.db.models import Count
from .permissions import IsStaff
from .blockchain import add_product_to_blockchain
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    @action(detail=False, methods=['post'], url_path='create-product')
    def create_product(self, request):
        product_serializer = self.get_serializer(data=request.data)
        print(request.data)
        if product_serializer.is_valid():
            product = product_serializer.save()
            print(product)
            inventory_data = {
                'product': product.product_code,
                'quantity': request.data.get('quantity', 0)
            }
            inventory_serializer = InventorySerializer(data=inventory_data)
            if inventory_serializer.is_valid():
                inventory = inventory_serializer.save()
                
                # Add product to blockchain
                try:
                    tx_receipt = add_product_to_blockchain(
                        product,
                        inventory.quantity  # Use the saved inventory object
                    )
                    blockchain_tx_hash = tx_receipt['transactionHash'].hex() if tx_receipt else None
                    print("Successfully added to blockchain.")
                    print(blockchain_tx_hash)
                except Exception as e:
                    # Handle blockchain error
                    print(f"Blockchain error: {e}")
                    blockchain_tx_hash = None
                
                # Return response with blockchain information
                return Response({
                    'product': product_serializer.data,
                    'inventory': inventory_serializer.data,
                    'blockchain_tx_hash': blockchain_tx_hash
                }, status=status.HTTP_201_CREATED)
            else:
                print(inventory_serializer.errors)
                return Response(inventory_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(product_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['put'], url_path='update-product')
    def update_product(self, request, pk=None):
        product = self.get_object()
        serializer = self.get_serializer(product, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], url_path='products-with-location')
    def products_with_location(self, request):
        products = Product.objects.all().select_related('location')
        product_list = []
        for product in products:
            product_data = {
                'product_code': product.product_code,
                'name': product.name,
                'price': product.price,
                'location_name': product.location.name  # Assuming 'location' has a 'name' attribute
            }

            product_list.append(product_data)
            print(product_list)
        return Response(product_list)

class InventoryViewSet(viewsets.ModelViewSet):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer
    @action(detail=True, methods=['get'], url_path='details')
    def inventory_details(self, request, pk=None):
        inventory_item = self.get_object()
        inventory_serializer = self.get_serializer(inventory_item)
        product = inventory_item.product
        product_serializer = ProductSerializer(product)

        inventory_details = {
            'inventory_item': inventory_serializer.data,
            'product_details': product_serializer.data
        }
        return Response(inventory_details)

    @action(detail=False, methods=['get'], url_path='inventory-report')
    def inventory_report(self, request):
        inventory_data = self.queryset.values('product__name', 'product__product_code', 'quantity')
        order_history = Order.objects.values('status').annotate(count=Count('status'))
        report = {
            'inventory_levels': list(inventory_data),
            'order_history': list(order_history)
        }
        return Response(report)

class SupplierViewset(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
