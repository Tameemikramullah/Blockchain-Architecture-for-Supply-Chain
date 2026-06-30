# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, OrderItemViewSet
app_name="order_flow"
router = DefaultRouter()
router.register(r'orders', OrderViewSet)
router.register(r'order-items', OrderItemViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('', include(router.urls)),
    path('orders/<int:pk>/update-status/', OrderViewSet.as_view({'patch': 'update_order_status'}),
         name='update_order_status'),
    path('orders/order-details/', OrderViewSet.as_view({'get': 'all_order_details'}), name='all_order_details'),
    path('orders/customer-order-history/', OrderViewSet.as_view({'get': 'customer_order_history'}),
         name='customer_order_history'),
    path('orders/customer-order-details/', OrderViewSet.as_view({'get': 'customer_order_details'}),
         name='customer_order_details'),
    path('orders/pending-orders/', OrderViewSet.as_view({'get': 'pending_orders'}), name='pending_orders'),
    path('orders/create-order/', OrderViewSet.as_view({'post': 'create_order'}), name='create_order'),
]