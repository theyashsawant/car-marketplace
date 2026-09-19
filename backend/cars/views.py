from rest_framework import viewsets
from django.db.models import Q
from .models import Car
from .serializers import CarSerializer

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