from django.urls import path,include
from django.contrib.auth import views as auth_views
from rest_framework.routers import DefaultRouter
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView

router = DefaultRouter()
router.register(r'api/customers', views.CustomerViewSet)

urlpatterns = [
    path('api/token/', views.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/register/', views.RegisterView.as_view(), name='register'),
    path('api/logout/', views.LogoutAPIView.as_view(), name='logout'),
    path('api/login', views.LoginAPIView.as_view(), name="login"),
    path('api/staff/login/', views.StaffLoginView.as_view(), name="staff-login"),
    path('api/user-data/', views.UserDataView.as_view(), name='user-data'),
    path('', include(router.urls)),
]
