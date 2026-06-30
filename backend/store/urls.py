from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, InventoryViewSet, SupplierSerializer

app_name ="store"

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'inventories', InventoryViewSet)
# router.register(r'suppliers', SupplierSerializer)

urlpatterns = [
    path('', include(router.urls)),
    path('inventory-report/', InventoryViewSet.as_view({'get': 'inventory_report'}), name='inventory-report'),
    path('inventory-details/<int:pk>/', InventoryViewSet.as_view({'get': 'inventory_details'}), name='inventory-details'),
]