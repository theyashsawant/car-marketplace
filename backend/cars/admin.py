from django.contrib import admin
from .models import Car, UserProfile, Booking, Enquiry


@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    list_display = ('make', 'model', 'year', 'type', 'price', 'city', 'available')
    list_filter = ('type', 'fuel_type', 'city', 'available')
    search_fields = ('make', 'model')


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('car', 'user', 'start_date', 'end_date', 'total_price', 'status')
    list_filter = ('status',)


@admin.register(Enquiry)
class EnquiryAdmin(admin.ModelAdmin):
    list_display = ('car', 'user', 'status', 'created_at')
    list_filter = ('status',)


admin.site.register(UserProfile)