# views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import Order, OrderItem
from store.models import Product, Inventory
from users.models import Customer
from .serializers import OrderSerializer, OrderItemSerializer
from .permissions import IsStaff
from .utils import calculate_delivery_fee
from django.core.exceptions import ObjectDoesNotExist
from django.http import JsonResponse
from django.db import transaction
from django.shortcuts import get_object_or_404
class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    STATUS_CHOICES = {
        'pending': 'Pending',
        'processing': 'Processing',
        'shipped': 'Shipped',
        'delivered': 'Delivered',
    }


    @action(detail=False, methods=['get'], url_path='order-details')
    def all_order_details(self, request):
        orders = Order.objects.all()
        all_orders_details = []
        for order in orders:
            order_items = order.items.all()
            order_item_serializer = OrderItemSerializer(order_items, many=True)
            total_cost = sum(item.product.price * item.quantity for item in order_items)
            customer_name = order.customer.name
            customer_email = order.customer.email
            customer_phone = order.customer.phone
            products = [
                {
                    'name': item.product.name,
                    'price': float(item.product.price),
                    'quantity': item.quantity
                }
                for item in order_items
            ]
            order_details = {
                'order': OrderSerializer(order).data,
                'order_items': order_item_serializer.data,
                'total_cost': total_cost,
                'customer_name': customer_name,
                'customer_email': customer_email,
                'customer_phone': customer_phone,
                'products': products,
            }
            all_orders_details.append(order_details)
            print(order_details)
        return Response(all_orders_details)

    @action(detail=False, methods=['get'], url_path='order-history',permission_classes=[IsAuthenticated])
    def customer_order_history(self, request):
        # Filter orders by the logged-in customer
        customer_orders = self.queryset.filter(customer__user=request.user)
        serializer = self.get_serializer(customer_orders, many=True)

        return Response(serializer.data)

    @action(detail=True, methods=['patch'], url_path='update-status')
    def update_order_status(self, request, pk=None):
        with transaction.atomic():
            order = self.get_object()
            status = request.data.get('status', None)
            if status and status in self.STATUS_CHOICES.keys():
                if status == 'shipped':
                    for item in order.items.all():
                        inventory_item = Inventory.objects.select_for_update().get(product=item.product)
                        if inventory_item.quantity < item.quantity:
                            raise ValidationError({'error': 'Insufficient stock to ship the order'})
                        inventory_item.quantity -= item.quantity
                        inventory_item.save()
                order.status = status
                order.save()
                return Response({'status': 'order status updated', 'order_id': order.order_id})
            else:
                return Response({'error': 'Invalid status'}, status=400)

    @action(detail=False, methods=['get'], url_path='customer-order-details', permission_classes=[IsAuthenticated])
    def customer_order_details(self, request):
        try:
            # Filter orders by the logged-in customer and those not delivered
            orders = self.queryset.filter(customer__user=request.user, status__in=['pending', 'processing', 'shipped'])
        except ObjectDoesNotExist:
            return Response({'error': 'No orders found for the user.'}, status=status.HTTP_404_NOT_FOUND)

        order_details = []
        for order in orders:
            order_items = order.items.all()
            order_item_serializer = OrderItemSerializer(order_items, many=True)
            total_cost = sum(item.product.price * item.quantity for item in order_items)
            order_details.append({
                'order': OrderSerializer(order).data,
                'order_items': order_item_serializer.data,
                'total_cost': total_cost
            })
            print(order_details)

        return Response(order_details)

    @action(detail=False, methods=['get'], url_path='pending-orders')
    def pending_orders(self, request):
        pending_orders = Order.objects.filter(status='pending')
        pending_orders_details = []
        for order in pending_orders:
            order_items = order.items.all()
            order_item_serializer = OrderItemSerializer(order_items, many=True)
            total_cost = sum(item.product.price * item.quantity for item in order_items)
            customer_name = order.customer.name
            order_details = {
                'order_id': order.order_id,
                'order_date': order.order_date,
                'status': order.status,
                'customer_name': customer_name,
                'total_cost': total_cost,
                'order_items': order_item_serializer.data,
            }
            pending_orders_details.append(order_details)
            print(order_details)
        return Response(pending_orders_details)

    from django.http import JsonResponse
    from django.core.exceptions import ObjectDoesNotExist

    @action(detail=False, methods=['post'], url_path="create-order", permission_classes=[IsAuthenticated])
    def create_order(self, request, *args, **kwargs):
        with transaction.atomic():
            data = request.data
            customer = Customer.objects.get(user=request.user)
            order = Order.objects.create(customer=customer, user=request.user, status='pending')
            for item in data['items']:
                product = get_object_or_404(Product, product_code=item['product_code'])
                product_location = product.location
                customer_location = customer.location
                delivery_fee = calculate_delivery_fee(customer_location, product_location)
                try:
                    inventory_item = Inventory.objects.select_for_update().get(product=product)
                except ObjectDoesNotExist:
                    return JsonResponse({'error': f'Stock for product {product.name} does not exist.'
                                                  f'(Out of stock) contact support for further details'},
                                        status=400)
                if item['quantity'] > inventory_item.quantity:
                    return JsonResponse({'error': f'Not enough stock for product {product.product_code}'}, status=400)
                OrderItem.objects.create(order=order, product=product, quantity=item['quantity'],
                                         delivery_fee=delivery_fee)
                inventory_item.quantity -= item['quantity']
                inventory_item.save()
            order_serializer = self.get_serializer(order)
            return JsonResponse({'status': 'order created', 'order': order_serializer.data})


class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer


