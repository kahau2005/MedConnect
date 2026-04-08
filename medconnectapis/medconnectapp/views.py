from rest_framework import viewsets, generics, parsers, status
from rest_framework.response import Response
from .models import Specialty, DiseaseCategory, Disease, User
from .serializers import SpecialtySerializer, UserSerializer, SimpleUserSerializer


class SpecialtyViewSet(viewsets.ModelViewSet):
    queryset = Specialty.objects.all()
    serializer_class = SpecialtySerializer
    # permission_classes = [permissions.IsAuthenticated]


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
