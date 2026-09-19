from rest_framework import viewsets
from django.db.models import Q
from .models import Car
from .serializers import CarSerializer
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .serializers import RegisterSerializer, UserSerializer

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