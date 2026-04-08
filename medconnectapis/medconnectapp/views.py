from rest_framework import generics, parsers, permissions, status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Specialty, User, Medicine, MedicineCategory, PatientProfile
from .serializers import (
    SpecialtySerializer,
    UserSerializer,
    SimpleUserSerializer,
    MedicineSerializer,
    MedicineCategorySerializer,
    DetailMedicineSerializer,
    DetailPatientProfileSerializer,
    PatientProfileSerializer,
)
from rest_framework.decorators import action

from .models import Service
from .serializers import ServiceSerializer, DetailServiceSerializer


class SpecialtyViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Specialty.objects.all()
    serializer_class = SpecialtySerializer


class ServiceViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Service.objects.all().filter(active=True)

    def get_serializer_class(self):
        if self.action == "retrieve":
            return DetailServiceSerializer
        return ServiceSerializer


class MedicineViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    def get_serializer_class(self):
        if self.action == "retrieve":
            return DetailMedicineSerializer
        return MedicineSerializer

    queryset = Medicine.objects.filter(active=True)


class MedicineCategoryViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = MedicineCategory.objects.filter(active=True)
    serializer_class = MedicineCategorySerializer


class PatientProfileViewSet(viewsets.ViewSet, generics.CreateAPIView):
    queryset = PatientProfile.objects.filter(active=True)
    serializer_class = PatientProfileSerializer
    permission_classes = [IsAuthenticated]


class UserViewSet(viewsets.ViewSet, generics.CreateAPIView):
    queryset = User.objects.filter(active=True)
    serializer_class = UserSerializer
    parser_classes = [parsers.MultiPartParser]

    @action(
        methods=["get", "patch"],
        url_path="current-user",
        detail=False,
        permission_classes=[permissions.IsAuthenticated],
    )
    def current_user(self, request):
        u = request.user
        if request.method.__eq__("PATCH"):
            s = SimpleUserSerializer(u, data=request.data)
            s.is_valid(raise_exception=True)
            u = s.save()
        return Response(UserSerializer(u).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"], url_path="current-user/patient-profile")
    def get_patient_profile(self, request, pk):
        user = request.user

        try:
            profile = PatientProfile.objects.filter(user=user)
            serializer = DetailPatientProfileSerializer(profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except PatientProfile.DoesNotExist:
            return Response(
                {"detail": "Người dùng chưa có hồ sơ bệnh nhân."},
                status=status.HTTP_404_NOT_FOUND,
            )
