from rest_framework import viewsets
from .models import Car
from .serializers import CarSerializer

class CarViewSet(viewsets.ModelViewSet):
    serializer_class = CarSerializer

    def get_queryset(self):
        qs = Car.objects.filter(available=True)
        car_type = self.request.query_params.get('type')
        city = self.request.query_params.get('city')
        if car_type:
            qs = qs.filter(type=car_type)
        if city:
            qs = qs.filter(city__iexact=city)
        return qs