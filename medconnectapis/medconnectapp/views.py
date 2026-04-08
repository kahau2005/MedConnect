from rest_framework import viewsets, generics, parsers, status
from rest_framework.response import Response
from .models import Specialty, DiseaseCategory, Disease, User
from .serializers import SpecialtySerializer, UserSerializer, SimpleUserSerializer
from rest_framework import viewsets, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Specialty, Service
from .serializers import SpecialtySerializer, ServiceCategorySerializer, ServiceSerializer, DetailServiceSerializer

class SpecialtyViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Specialty.objects.all()
    serializer_class = SpecialtySerializer




class ServiceViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Service.objects.all().filter(active=True)
    def get_serializer_class(self):
        if self.action == "retrieve":
            return DetailServiceSerializer
        return ServiceSerializer


class UserViewSet(viewsets.ViewSet, generics.CreateAPIView):
    queryset = User.objects.filter(active=True)
    serializer_classs = UserSerializer
    parse_classes = [parsers.MultiPartParser]

    def current_user(self, request):
        u = request.user
        if request.method.__eq__("PATCH"):
            s = SimpleUserSerializer(u, data=request.data)
            s.is_valid()
            u = s.save()
        return Response(UserSerializer(u).data, status=status.HTTP_200_OK)
