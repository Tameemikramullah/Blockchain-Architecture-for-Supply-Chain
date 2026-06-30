from django.shortcuts import render
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.contrib.auth.models import User,Group
from django.contrib.auth import login, authenticate, logout
from django.views import View
from .forms import UserForm
from .permissions import IsStaff
import json
from .models import Profile, Customer
from  delivery.models import Location
from django.contrib import messages
# rest framework imports
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status, viewsets
from .permissions import IsStaff
from .serializers import CustomerSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
# Create your views here.


# login api view
class LoginAPIView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        username = request.data.get('username', None)
        password = request.data.get('password', None)

        user = User.objects.filter(username=username).first()
        if user is not None and user.check_password(password):
            # If credentials are correct, return the token pair
            serializer = CustomTokenObtainPairSerializer(data=request.data)
            if serializer.is_valid():
                return Response(serializer.validated_data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # If authentication fails, return an error
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)
class StaffLoginView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(request, username=username, password=password)

        if user is not None and user.is_staff:
            serializer = CustomTokenObtainPairSerializer(data=request.data)
            if serializer.is_valid():
                return Response(serializer.validated_data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(View):
    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        print(data)
        form = UserForm(data)

        if form.is_valid():
            # Check if the passwords match
            password1 = form.cleaned_data['password1']
            password2 = form.cleaned_data['password2']
            if password1 != password2:
                return JsonResponse({'password2': ['Passwords do not match.']}, status=400)

            # Check if the user already exists
            username = form.cleaned_data['username']
            email = form.cleaned_data['email']
            if User.objects.filter(username=username).exists() or User.objects.filter(email=email).exists():
                return JsonResponse(
                    {'non_field_errors': ['An account with the same username or email already exists.']}, status=400)

            # Validate the password
            try:
                validate_password(password1, user=None)
            except ValidationError as e:
                return JsonResponse({'password1': list(e.messages)}, status=400)

            # Create the user and profile
            user = form.save(commit=False)
            user.set_password(password1)
            user.save()
            Profile.objects.create(user=user, phone=data['phone'], first_name=data['first_name'],last_name=data['last_name'] )
            # Assign the user to the 'Customer' group
            customer_group, created = Group.objects.get_or_create(name='Customer')
            customer_group.user_set.add(user)
            # Get the location from the request data
            location_id = data.get('location')
            location = Location.objects.get(id=location_id)

            # Create or update the customer
            customer, created = Customer.objects.get_or_create(
                user=user,
                defaults={
                    'name': f"{data.get('first_name', '')} {data.get('last_name', '')}",
                    'email': email,
                    'phone': data.get('phone', ''),
                    'location': location,
                }
            )
            # You may want to return a token here for the frontend to use
            return JsonResponse({'detail': 'Registration successful.'}, status=201)
        else:
            print(form.errors.as_json())
            errors = {field: error[0] for field, error in form.errors.items()}
            return JsonResponse(errors, status=400)


# Custom serializer to add extra responses in the token claim
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        # More custom fields can be added here
        return token


class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = (AllowAny,)
    serializer_class = CustomTokenObtainPairSerializer


class UserDataView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        profile, created = Profile.objects.get_or_create(user=user, defaults={
            'first_name': user.username,
            'phone': '',
            'bio': '',
        })
        profile = Profile.objects.filter(user=user).first()
        groups = user.groups.all().values_list('name', flat=True)
        print(groups)
        data = {
            'username': user.username,
            'firstname': user.first_name,
            'lastname': user.last_name,
            'email': user.email,
            'phone': profile.phone,
            'bio': profile.bio,
            'avatar': request.build_absolute_uri(profile.avatar.url) if profile.avatar else None,
            'groups': list(groups),
            'is_staff': user.is_staff,
        }
        return Response(data)

    def put(self, request, *args, **kwargs):
        user = request.user
        if user.is_anonymous:
            return Response({'error': 'Not authenticated.'}, status=status.HTTP_401_UNAUTHORIZED)
        profile = Profile.objects.filter(user=user).first()
        if not profile:
            return Response({'error': 'Profile not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Update user and profile fields from request data
        user.username = request.data.get('username', user.username)
        user.first_name = request.data.get('firstname', user.first_name)
        user.last_name = request.data.get('lastname', user.last_name)
        user.email = request.data.get('email', user.email)
        profile.phone = request.data.get('phone', profile.phone)
        profile.bio = request.data.get('bio', profile.bio)

        # Save updated user and profile
        user.save()
        profile.save()

        return Response({'status': 'User data updated.'})
@method_decorator(csrf_exempt, name='dispatch')
class LogoutAPIView(View):
    def post(self, request, *args, **kwargs):
        # Invalidate the session or token
        logout(request)
        # Return a success response
        return JsonResponse({'detail': 'Logged out successfully'}, status=200)

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer