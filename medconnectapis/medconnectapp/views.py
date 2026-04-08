from rest_framework import viewsets, generics
from . import serializers
from .models import Specialty, DiseaseCategory, Disease
from .serializers import SpecialtySerializer


class SpecialtyViewSet(viewsets.ModelViewSet):
    queryset = Specialty.objects.all()
    serializer_class = SpecialtySerializer
    # permission_classes = [permissions.IsAuthenticated]
