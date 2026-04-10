import datetime

from django.utils import timezone
from rest_framework import generics, parsers, permissions, status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from . import serializers, perms
from .models import (
    Specialty,
    User,
    Medicine,
    MedicineCategory,
    PatientProfile,
    DiseaseCategory,
    Disease,
    Appointment,
    Prescription,
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
    AppointmentSerializer,
    DetailAppointmentSerializer,
    PrescriptionSerializer,
    PrescriptionDetailSerializer,
)
from rest_framework.decorators import action

from .models import Service
from .serializers import ServiceSerializer, DetailServiceSerializer


class PrescriptionViewSet(viewsets.ViewSet):
    queryset = Prescription.objects.all()

    def get_serializer_class(self):
        if self.action in ["create_details"]:
            return PrescriptionDetailSerializer
        return PrescriptionSerializer

    def partial_update(self, request, pk):
        self.permission_classes = [perms.AppointmentDoctor]
        prescription = self.queryset.get(pk=pk)
        serializers = PrescriptionSerializer(
            prescription, data=request.data, partial=True
        )
        serializers.is_valid(raise_exception=True)
        serializers.save()
        return Response(serializers.data, status=status.HTTP_204_NO_CONTENT)

    @action(
        detail=True,
        methods=["post"],
        url_path="details",
        permission_classes=[perms.AppointmentDoctor],
    )
    def create_detail(self, request, pk):
        prescription = self.queryset.get(pk=pk)

        serializers = PrescriptionDetailSerializer(data=request.data, many=True)
        serializers.is_valid(raise_exception=True)
        serializers.save(prescription=prescription)
        return Response(serializers.data, status=status.HTTP_201_CREATED)

    @action(
        detail=True,
        methods=["patch"],
        url_path="details/(?P<detail_pk>[^/.]+)",
        permission_classes=[perms.AppointmentDoctor],
    )
    def update_partial_detail(self, request, pk, detail_pk):
        prescription = self.queryset.get(pk=pk)
        if not prescription:
            return Response(
                {"msg": "Prescription not found."}, status=status.HTTP_404_NOT_FOUND
            )
        detail = prescription.details.filter(pk=detail_pk).first()
        if not detail:
            return Response(
                {"msg": "Prescription detail not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = PrescriptionDetailSerializer(
            detail, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class AppointmentViewSet(
    viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView
):
    queryset = Appointment.objects.filter(active=True)

    def get_serializer_class(self):
        if self.action in ["retrieve"]:
            return DetailAppointmentSerializer

        if self.action in ["get_prescription"]:
            return PrescriptionSerializer

        return AppointmentSerializer

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def partial_update(self, request, pk):
        appointment = self.get_object()
        serializer = self.get_serializer(appointment, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(
        detail=True,
        methods=["get", "post"],
        url_path="prescriptions",
        permission_classes=[IsAuthenticated],
    )
    def get_prescription(self, request, pk):
        appointment = self.get_object()

        if self.request.method == "GET":
            prescription = appointment.prescription_set.all()
            return Response(
                serializers.PrescriptionSerializer(prescription, many=True).data,
                status=status.HTTP_200_OK,
            )

        data = request.data
        s = self.get_serializer(data=data)
        s.is_valid(raise_exception=True)
        s.save(appointment=appointment)
        return Response(s.data, status=status.HTTP_201_CREATED)


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
    queryset = User.objects.filter(is_active=True)
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

    @action(detail=False, methods=["get"], url_path="current-user/patient-profile")
    def get_patient_profile(self, request):
        user = request.user

        try:
            profile = PatientProfile.objects.get(user=user)
            serializer = DetailPatientProfileSerializer(profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except PatientProfile.DoesNotExist:
            return Response(
                {"detail": "Người dùng chưa có hồ sơ bệnh nhân."},
                status=status.HTTP_404_NOT_FOUND,
            )


class DoctorViewSet(viewsets.ViewSet):
    @action(
        methods=["get"],
        url_path="current-user/schedules",
        detail=False,
        permission_classes=[perms.IsDoctor],
    )
    def get_schedules(self, request):
        doctor = request.user.doctor_profile
        schedules = doctor.doctorschedule_set.filter(
            start_time__date=timezone.localdate()
        )
        return Response(serializers.DoctorScheduleSerializer(schedules, many=True).data)


class ReportViewSet(viewsets.ViewSet):
    pass
