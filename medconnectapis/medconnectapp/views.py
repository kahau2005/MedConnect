from django.db.models import Case, Count, Value, When
from django.db.models.fields import CharField
from django.db.models.functions import ExtractYear, Now
from django.utils import timezone
from rest_framework import generics, parsers, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from . import perms, serializers, utils
from .models import (
    Appointment,
    Disease,
    DiseaseCategory,
    Medicine,
    MedicineCategory,
    PatientProfile,
    Prescription,
    Service,
    Specialty,
    User,
)
from .serializers import (
    AppointmentSerializer,
    DetailAppointmentSerializer,
    DetailMedicineSerializer,
    DetailPatientProfileSerializer,
    DetailServiceSerializer,
    DiseaseCategorySerializer,
    DiseaseSerializer,
    MedicineCategorySerializer,
    MedicineSerializer,
    PatientProfileSerializer,
    PrescriptionDetailSerializer,
    PrescriptionSerializer,
    ServiceSerializer,
    SimpleUserSerializer,
    SpecialtySerializer,
    UserSerializer,
)


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

    @action(
        methods=["post"],
        url_path="recommend",
        detail=False,
        permission_classes=[IsAuthenticated],
    )
    def recommend(self, request):
        symptoms = request.data.get("symptoms")
        if not symptoms:
            return Response(
                {"err_msg": "Vui lòng cung cấp triệu chứng"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        specialty = utils.get_recommend_specialty(symptoms=symptoms)
        if specialty:
            return Response(
                SpecialtySerializer(specialty).data, status=status.HTTP_200_OK
            )
        return Response(
            {"err_msg": "Không tìm thấy chuyên khoa phù hợp!"},
            status=status.HTTP_404_NOT_FOUND,
        )


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
    @action(
        methods=["get"],
        url_path="patients",
        detail=False,
        permission_classes=[perms.IsAdmin],
    )
    def report_patients(self, request):
        age_expression = ExtractYear(Now()) - ExtractYear("dob")
        age_groups = (
            PatientProfile.objects.filter(active=True)
            .annotate(age=age_expression)
            .annotate(
                age_group=(
                    Case(
                        When(age__lt=18, then=Value("Trẻ em (< 18)")),
                        When(
                            age__gte=18, age__lte=30, then=Value("Thanh niên (18 - 30)")
                        ),
                        When(
                            age__gt=30, age__lte=60, then=Value("Trung niên (30 - 60)")
                        ),
                        When(age__gt=60, then=Value("Cao tuổi (> 60)")),
                        output_field=CharField(),
                    )
                )
            )
            .values("age_group")
            .annotate(total=Count("user_id"))
            .order_by("age_group")
        )
        gender_distribution = (
            PatientProfile.objects.filter(active=True)
            .values("gender")
            .annotate(total=Count("user_id"))
            .order_by("gender")
        )
        specialty_distribution = (
            Appointment.objects.filter(active=True)
            .values("doctor__specialty_id", "doctor__specialty__name")
            .annotate(total=Count("user_id", distinct=True))
            .order_by("doctor__specialty__name")
        )

        res = {
            "by_age_groups": list(age_groups),
            "by_genders": list(gender_distribution),
            "by_specialties": [
                {
                    "specialty_id": row["doctor__specialty_id"],
                    "specialty_name": row["doctor__specialty__name"],
                    "total": row["total"],
                }
                for row in specialty_distribution
            ],
        }
        serializer = serializers.ReportPatientSerializer(res)
        return Response(serializer.data, status=status.HTTP_200_OK)
