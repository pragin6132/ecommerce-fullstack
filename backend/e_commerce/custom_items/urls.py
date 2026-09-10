from django.urls import path
from .views import CustomDesignUploadView

urlpatterns = [
    path('upload/', CustomDesignUploadView.as_view(), name='custom-upload'),
]
