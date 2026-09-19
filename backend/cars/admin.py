from django.contrib import admin
from .models import Car, UserProfile, Booking, Enquiry
from django.utils import timezone

@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    list_display = ('make', 'model', 'year', 'type', 'status',
                    'price', 'city', 'owner', 'available')
    list_filter = ('status', 'type', 'fuel_type', 'city', 'available')
    search_fields = ('make', 'model', 'owner__username')
    actions = ['approve_listings', 'reject_listings']

    def approve_listings(self, request, queryset):
        count = queryset.update(status='approved', rejection_reason='',
                                reviewed_by=request.user,
                                reviewed_at=timezone.now())
        self.message_user(request, f'{count} listing(s) approved.')
    approve_listings.short_description = 'Approve selected listings'

    def reject_listings(self, request, queryset):
        count = queryset.update(status='rejected',
                                reviewed_by=request.user,
                                reviewed_at=timezone.now())
        self.message_user(request, f'{count} listing(s) rejected.')
    reject_listings.short_description = 'Reject selected listings'

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('car', 'user', 'start_date', 'end_date', 'total_price', 'status')
    list_filter = ('status',)


@admin.register(Enquiry)
class EnquiryAdmin(admin.ModelAdmin):
    list_display = ('car', 'user', 'status', 'created_at')
    list_filter = ('status',)


admin.site.register(UserProfile)