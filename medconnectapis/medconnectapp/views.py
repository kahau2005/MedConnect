from rest_framework import viewsets

from .models import Specialty
from .serializers import SpecialtySerializer


# Create your views here.
class SpecialtyViewSet(viewsets.ModelViewSet):
    queryset = Specialty.objects.all()
    serializer_class = SpecialtySerializer
    # permission_classes = [permissions.IsAuthenticated]
