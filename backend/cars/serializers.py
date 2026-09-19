from rest_framework import serializers
from .models import Car
from django.contrib.auth.models import User
from .models import UserProfile

class CarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Car
        fields = '__all__'

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