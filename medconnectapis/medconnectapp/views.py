from rest_framework import generics, parsers, permissions, status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from . import serializers
from .models import (
    Specialty,
    User,
    Medicine,
    MedicineCategory,
    PatientProfile,
    DiseaseCategory,
    Disease,
)
from .serializers import (
    SpecialtySerializer,
    UserSerializer,
    SimpleUserSerializer,
    MedicineSerializer,
    MedicineCategorySerializer,
    DetailMedicineSerializer,
    DetailPatientProfileSerializer,
    PatientProfileSerializer,
    DiseaseCategorySerializer,
    DiseaseSerializer,
)
from rest_framework.decorators import action

from .models import Service
from .serializers import ServiceSerializer, DetailServiceSerializer


class DiseaseCategoryViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = DiseaseCategory.objects.filter(active=True)
    serializer_class = DiseaseCategorySerializer


class DiseaseViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Disease.objects.filter(active=True)
    serializer_class = DiseaseSerializer


class SpecialtyViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Specialty.objects.filter(active=True)
    serializer_class = SpecialtySerializer

    @action(methods=["get"], url_path="doctors", detail=True)
    def get_doctors(self, request, pk=None):
        specialty = self.get_object()
        doctors = specialty.doctor_set.all()
        return Response(serializers.DoctorSerializer(doctors, many=True).data)


class ServiceViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Service.objects.filter(active=True)

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
