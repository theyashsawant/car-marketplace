from rest_framework import serializers
from .models import Car, UserProfile, Booking, Enquiry
from .models import Car
from django.contrib.auth.models import User
from .models import UserProfile


class CarSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source='owner.username', read_only=True)

    class Meta:
        model = Car
        fields = '__all__'
        read_only_fields = ('owner', 'status', 'rejection_reason',
                            'reviewed_by', 'reviewed_at')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    phone = serializers.CharField(required=False, allow_blank=True)
    role = serializers.ChoiceField(choices=UserProfile.ROLE, default='customer')

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'phone', 'role')

    def create(self, validated_data):
        phone = validated_data.pop('phone', '')
        role = validated_data.pop('role', 'customer')
        user = User.objects.create_user(**validated_data)
        profile = user.userprofile
        profile.phone = phone
        profile.role = role
        profile.save()
        return user


class UserSerializer(serializers.ModelSerializer):
    role = serializers.CharField(source='userprofile.role', read_only=True)
    phone = serializers.CharField(source='userprofile.phone', read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role', 'phone')

class BookingSerializer(serializers.ModelSerializer):
    car_detail = CarSerializer(source='car', read_only=True)

    class Meta:
        model = Booking
        fields = ('id', 'car', 'car_detail', 'start_date', 'end_date',
                  'total_price', 'status', 'created_at')
        read_only_fields = ('total_price', 'status')

    def validate(self, data):
        car = data['car']
        start, end = data['start_date'], data['end_date']

        if car.type != 'rental':
            raise serializers.ValidationError('This car is not available for rental.')
        if end <= start:
            raise serializers.ValidationError('End date must be after start date.')

        clash = Booking.objects.filter(
            car=car,
            status__in=['pending', 'confirmed'],
            start_date__lt=end,
            end_date__gt=start,
        ).exists()
        if clash:
            raise serializers.ValidationError('This car is already booked for those dates.')

        return data

    def create(self, validated_data):
        car = validated_data['car']
        days = (validated_data['end_date'] - validated_data['start_date']).days
        validated_data['total_price'] = car.price * days
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class EnquirySerializer(serializers.ModelSerializer):
    car_detail = CarSerializer(source='car', read_only=True)

    class Meta:
        model = Enquiry
        fields = ('id', 'car', 'car_detail', 'message', 'contact_phone',
                  'status', 'created_at')
        read_only_fields = ('status',)

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)