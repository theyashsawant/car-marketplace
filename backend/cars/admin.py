from django.contrib import admin
from .models import Car

@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    list_display = ('make', 'model', 'year', 'type', 'price', 'city', 'available')
    list_filter = ('type', 'fuel_type', 'city', 'available')
    search_fields = ('make', 'model')