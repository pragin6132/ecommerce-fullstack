from rest_framework import serializers
from .models import CustomItem

class CustomItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomItem
        fields = '__all__'
