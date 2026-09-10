from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from .models import CustomItem
from .serializers import CustomItemSerializer

class CustomDesignUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = CustomItemSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Custom design uploaded successfully"}, status=201)

        return Response(serializer.errors, status=400)
