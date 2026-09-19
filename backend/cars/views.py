from rest_framework import viewsets
from django.db.models import Q
from .models import Car, Booking, Enquiry
from .serializers import (CarSerializer, RegisterSerializer, UserSerializer,
                          BookingSerializer, EnquirySerializer)
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from django.utils import timezone
from django.contrib.auth.models import User

class CarViewSet(viewsets.ModelViewSet):
    serializer_class = CarSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        # Owners only ever touch their own cars on write actions
        if self.action in ['my_cars', 'update', 'partial_update', 'destroy']:
            return Car.objects.filter(owner=self.request.user)

        qs = Car.objects.filter(status='approved', available=True)
        car_type = self.request.query_params.get('type')
        city = self.request.query_params.get('city')
        search = self.request.query_params.get('search')
        if car_type:
            qs = qs.filter(type=car_type)
        if city:
            qs = qs.filter(city__iexact=city)
        if search:
            qs = qs.filter(Q(make__icontains=search) | Q(model__icontains=search))
        return qs

    def perform_create(self, serializer):
        profile = self.request.user.userprofile
        if profile.role not in ('owner', 'dealer'):
            raise PermissionDenied(
                'Only car owners can list cars. Update your account to get started.'
            )
        serializer.save(owner=self.request.user, status='pending')

    def perform_update(self, serializer):
        # Any edit sends the listing back for review
        serializer.save(status='pending', rejection_reason='',
                        reviewed_by=None, reviewed_at=None)

    @action(detail=False, methods=['get'], url_path='my-cars',
            permission_classes=[permissions.IsAuthenticated])
    def my_cars(self, request):
        cars = Car.objects.filter(owner=request.user).order_by('-created_at')
        return Response(CarSerializer(cars, many=True).data)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)

    def perform_destroy(self, instance):
        instance.status = 'cancelled'
        instance.save()


class EnquiryViewSet(viewsets.ModelViewSet):
    serializer_class = EnquirySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Enquiry.objects.filter(user=self.request.user)