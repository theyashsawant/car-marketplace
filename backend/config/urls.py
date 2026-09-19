from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from cars.views import CarViewSet

router = DefaultRouter()
router.register('cars', CarViewSet, basename='car')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]