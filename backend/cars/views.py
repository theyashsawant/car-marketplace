from rest_framework import viewsets
from django.db.models import Q
from .models import Car, Booking, Enquiry
from .serializers import (CarSerializer, RegisterSerializer, UserSerializer,
                          BookingSerializer, EnquirySerializer)
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User


class CarViewSet(viewsets.ModelViewSet):
    serializer_class = CarSerializer

    def get_queryset(self):
        qs = Car.objects.filter(available=True)
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