from django.shortcuts import render

# Create your views here.
from rest_framework.response import Response
from rest_framework import permissions, status
from rest_framework.views import APIView
from .models import Product
from .serializers import ProductSerializer

class ProductList(APIView):
    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        products = Product.objects.filter(is_active=True)
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

class ProductDetail(APIView):
    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def get(self, request, id):
        try:
            product = Product.objects.get(id=id)
            serializer = ProductSerializer(product)
            return Response(serializer.data)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
