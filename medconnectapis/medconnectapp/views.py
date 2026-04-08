from rest_framework import viewsets, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Specialty, ServiceCategory, Service
from .serializers import SpecialtySerializer, ServiceCategorySerializer, ServiceSerializer, DetailServiceSerializer


class SpecialtyViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Specialty.objects.all()
    serializer_class = SpecialtySerializer

class ServiceCategoryViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = ServiceCategory.objects.all().filter(active=True)
    serializer_class = ServiceCategorySerializer


class ServiceViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Service.objects.all().filter(active=True)
    def get_serializer_class(self):
        if self.action == "retrieve":
            return DetailServiceSerializer
        return ServiceSerializer
