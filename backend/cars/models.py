from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.exceptions import ValidationError

class Car(models.Model):
    CAR_TYPE = [('rental', 'Rental'), ('resale', 'Resale')]
    FUEL = [('petrol', 'Petrol'), ('diesel', 'Diesel'),
            ('cng', 'CNG'), ('electric', 'Electric')]
    TRANSMISSION = [('manual', 'Manual'), ('automatic', 'Automatic')]

    type = models.CharField(max_length=10, choices=CAR_TYPE)
    make = models.CharField(max_length=50)
    model = models.CharField(max_length=50)
    year = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    fuel_type = models.CharField(max_length=10, choices=FUEL, default='petrol')
    transmission = models.CharField(max_length=10, choices=TRANSMISSION, default='manual')
    km_driven = models.IntegerField(default=0)
    seats = models.IntegerField(default=5)
    city = models.CharField(max_length=50, default='Mumbai')
    description = models.TextField(blank=True)
    image_url = models.URLField(blank=True, null=True)
    available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.year} {self.make} {self.model}"


class UserProfile(models.Model):
    ROLE = [
        ('customer', 'Customer'),
        ('owner', 'Car owner'),
        ('dealer', 'Dealer'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=10, choices=ROLE, default='customer')
    phone = models.CharField(max_length=15, blank=True)
    city = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} ({self.role})"


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

class Booking(models.Model):
    STATUS = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    car = models.ForeignKey(Car, on_delete=models.CASCADE, related_name='bookings')
    start_date = models.DateField()
    end_date = models.DateField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=10, choices=STATUS, default='pending')
    admin_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def clean(self):
        if self.end_date <= self.start_date:
            raise ValidationError('End date must be after start date.')

        clash = Booking.objects.filter(
            car=self.car,
            status__in=['pending', 'confirmed'],
            start_date__lt=self.end_date,
            end_date__gt=self.start_date,
        ).exclude(pk=self.pk)

        if clash.exists():
            raise ValidationError('This car is already booked for those dates.')

    def __str__(self):
        return f"{self.car} — {self.user.username} ({self.start_date})"


class Enquiry(models.Model):
    STATUS = [
        ('open', 'Open'),
        ('responded', 'Responded'),
        ('closed', 'Closed'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='enquiries')
    car = models.ForeignKey(Car, on_delete=models.CASCADE, related_name='enquiries')
    message = models.TextField()
    contact_phone = models.CharField(max_length=15, blank=True)
    status = models.CharField(max_length=10, choices=STATUS, default='open')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Enquiry on {self.car} by {self.user.username}"