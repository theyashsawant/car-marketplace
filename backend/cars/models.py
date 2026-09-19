from django.db import models

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