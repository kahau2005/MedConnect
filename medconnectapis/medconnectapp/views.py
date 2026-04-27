from datetime import datetime

from django.db import IntegrityError
from django.db.models import Case, Count, Prefetch, Q, Sum, Value, When
from django.db.models.fields import CharField
from django.db.models.functions import ExtractYear, Now
from django.utils import timezone
from rest_framework import generics, parsers, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from . import paginators, perms, serializers, utils
from .models import (
    Appointment,
    AppointmentService,
    Disease,
    DiseaseCategory,
    Doctor,
    DoctorSchedule,
    Medicine,
    MedicineCategory,
    PatientProfile,
    Prescription,
    PrescriptionDetail,
    Service,
    Specialty,
    TestResult,
    User,
)
from .serializers import (
    AppointmentSerializer,
    AppointmentServiceSerializer,
    AppointmentUpdateSerializer,
    DetailAppointmentSerializer,
    DetailMedicineSerializer,
    DetailPatientProfileSerializer,
    DetailServiceSerializer,
    DiseaseCategorySerializer,
    DiseaseSerializer,
    DoctorSerializer,
    MedicineCategorySerializer,
    MedicineSerializer,
    PatientProfileSerializer,
    PrescriptionDetailSerializer,
    PrescriptionSerializer,
    ServicePopularSerializer,
    ServiceSerializer,
    SimplePrescriptionSerializer,
    SimpleUserSerializer,
    SpecialtySerializer,
    TestResultSerializer,
    UserSerializer,
)


class AppointmentViewSet(viewsets.GenericViewSet, generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    pagination_class = paginators.AppointmentPaginator

    def get_queryset(self):
        user = self.request.user
        queryset = Appointment.objects.filter(active=True)

        if self.action == "retrieve":
            queryset = queryset.select_related("diagnosis").prefetch_related(
                Prefetch(
                    "prescription_set",
                    queryset=Prescription.objects.filter(active=True).prefetch_related(
                        Prefetch(
                            "details",
                            queryset=PrescriptionDetail.objects.filter(
                                active=True
                            ).select_related("medicine"),
                        )
                    ),
                ),
                Prefetch(
                    "services",
                    queryset=AppointmentService.objects.filter(
                        active=True
                    ).select_related("test_result", "service"),
                ),
            )
            return queryset

        if self.action in ["list", "today"]:
            queryset = queryset.select_related("user", "doctor")
            if user.role == User.UserRole.PATIENT:
                queryset = queryset.filter(user=user)
            elif user.role == User.UserRole.DOCTOR:
                queryset = queryset.filter(Q(user=user) | Q(doctor__user=user))

            status_param = self.request.query_params.get("status")
            from_date = self.request.query_params.get("from_date")
            to_date = self.request.query_params.get("to_date")
            kw = self.request.query_params.get("kw")
            doctor_id = self.request.query_params.get("doctor_id")

            if status_param:
                queryset = queryset.filter(status=status_param)
            if from_date:
                try:
                    parsed_from_date = datetime.strptime(from_date, "%Y-%m-%d").date()
                    queryset = queryset.filter(start__date__gte=parsed_from_date)
                except Exception:
                    raise ValueError({"from_date": "Invalid from date"})
            if to_date:
                try:
                    parsed_to_date = datetime.strptime(to_date, "%Y-%m-%d").date()
                    queryset = queryset.filter(start__date__lte=parsed_to_date)
                except Exception:
                    raise ValueError({"to_date": "Invalid to date"})
            if kw:
                queryset = queryset.filter(
                    Q(reason__icontains=kw)
                    | Q(symptoms__icontains=kw)
                    | Q(note__icontains=kw)
                    | Q(diagnosis__name__icontains=kw)
                )
            if doctor_id:
                queryset = queryset.filter(doctor_id=doctor_id)
        return queryset

    def get_serializer_class(self):
        if self.action == "retrieve":
            return DetailAppointmentSerializer
        if self.action == "prescriptions":
            if self.request.method == "POST":
                return SimplePrescriptionSerializer
            elif self.request.method == "GET":
                return PrescriptionSerializer
        if self.action == "partial_update":
            return AppointmentUpdateSerializer
        return AppointmentSerializer

    def get_permissions(self):
        if self.action in ["prescriptions"]:
            if self.request.method == "GET":
                return [perms.AppointmentOwnerOrDoctor()]
            elif self.request.method == "POST":
                return [perms.AppointmentDoctor()]
        elif self.action in ["partial_update"]:
            return [perms.AppointmentOwnerOrDoctor()]
        elif self.action in ["services"]:
            if self.request.method == "GET":
                return [perms.AppointmentOwnerOrDoctor()]
            elif self.request.method == "POST":
                return [perms.AppointmentDoctor()]
        return super().get_permissions()

    def retrieve(self, request, pk=None):
        appointment = self.get_object()
        serializer = self.get_serializer(appointment)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(
        methods=["get"],
        url_path="doctors",
        detail=False,
    )
    def doctors(self, request):
        completed_appointments = Appointment.objects.filter(
            active=True,
            user=request.user,
            status=Appointment.AppointmentStatus.COMPLETED,
        )

        doctor_ids = completed_appointments.values_list(
            "doctor_id", flat=True
        ).distinct()
        doctors = Doctor.objects.filter(user_id__in=doctor_ids).select_related("user")

        serializer = DoctorSerializer(doctors, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(
        methods=["get"],
        url_name="today",
        detail=False,
        permission_classes=[perms.IsDoctor],
    )
    def today(self, request):
        queryset = self.get_queryset()
        today = timezone.localdate()
        queryset = queryset.filter(
            doctor_id=request.user.id,
            start__date=today,
            status__in=[
                Appointment.AppointmentStatus.SCHEDULED,
                Appointment.AppointmentStatus.COMPLETED,
            ],
        ).order_by("start")
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            serializer.save(user=request.user)
        except IntegrityError:
            raise ValidationError(
                {"start": "This time slot has just been booked by another patient"}
            )
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def partial_update(self, request, pk=None):
        appointment = self.get_object()
        serializer = self.get_serializer(appointment, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(
        detail=True,
        methods=["get", "post"],
        url_path="prescriptions",
    )
    def prescriptions(self, request, pk):
        appointment = self.get_object()

        if self.request.method == "GET":
            prescriptions = appointment.prescription_set.filter(
                active=True
            ).prefetch_related(
                Prefetch(
                    "details",
                    queryset=PrescriptionDetail.objects.select_related("medicine"),
                )
            )
            return Response(
                self.get_serializer(prescriptions, many=True).data,
                status=status.HTTP_200_OK,
            )

        data = request.data
        s = self.get_serializer(data=data, context={"appointment": appointment})
        s.is_valid(raise_exception=True)
        s.save(appointment=appointment)
        return Response(s.data, status=status.HTTP_201_CREATED)

    @action(methods=["get", "post"], url_path="services", detail=True)
    def services(self, request, pk=None):
        appointment = self.get_object()

        if request.method == "GET":
            q = appointment.services.filter(active=True).select_related(
                "service", "test_result"
            )
            return Response(
                AppointmentServiceSerializer(q, many=True).data,
                status=status.HTTP_200_OK,
            )
        serializer = AppointmentServiceSerializer(
            data=request.data, context={"appointment": appointment}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class AppointmentServiceViewSet(viewsets.GenericViewSet):
    queryset = AppointmentService.objects.filter(active=True).select_related(
        "appointment"
    )
    serializer_class = AppointmentServiceSerializer
    permission_classes = [perms.AppointmentDoctor]

    def partial_update(self, request, pk=None):
        service = self.get_object()
        appointment = service.appointment
        serializer = self.get_serializer(
            service,
            data=request.data,
            partial=True,
            context={"appointment": appointment},
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=["get", "post"], url_path="results", detail=True)
    def test_results(self, request, pk=None):
        appointment_service = self.get_object()
        if request.method == "GET":
            try:
                result = appointment_service.test_result
                return Response(
                    TestResultSerializer(result).data, status=status.HTTP_200_OK
                )
            except TestResult.DoesNotExist:
                return Response(
                    {"error": "No test result found for this appointment service"},
                    status=status.HTTP_404_NOT_FOUND,
                )
        serializer = TestResultSerializer(
            data=request.data,
            context={"request": request, "appointment_service": appointment_service},
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class PrescriptionViewSet(viewsets.GenericViewSet, generics.RetrieveAPIView):
    queryset = Prescription.objects.filter(active=True)
    permission_classes = [perms.AppointmentDoctor]

    def get_serializer_class(self):
        if self.action in ["details"]:
            return PrescriptionDetailSerializer
        elif self.action in ["partial_update"]:
            return SimplePrescriptionSerializer
        return PrescriptionSerializer

    def partial_update(self, request, pk):
        prescription = self.get_object()
        serializer = self.get_serializer(prescription, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(
        detail=True,
        methods=["post"],
        url_path="details",
    )
    @action(detail=True, methods=["post"], url_path="details")
    def details(self, request, pk=None):
        prescription = self.get_object()
        s = self.get_serializer(
            data=request.data,
            many=True,
            context={"prescription": prescription},
        )
        s.is_valid(raise_exception=True)
        s.save()
        return Response(s.data, status=status.HTTP_201_CREATED)


class PrescriptionDetailViewSet(viewsets.GenericViewSet):
    queryset = PrescriptionDetail.objects.filter(active=True)
    serializer_class = PrescriptionDetailSerializer
    permission_classes = [perms.AppointmentDoctor]

    def partial_update(self, request, pk=None):
        detail = self.get_object()
        serializer = self.get_serializer(detail, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class DiseaseCategoryViewSet(
    viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView
):
    queryset = DiseaseCategory.objects.filter(active=True)
    serializer_class = DiseaseCategorySerializer
    permission_classes = [perms.IsDoctorOrAdmin]


class DiseaseViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Disease.objects.filter(active=True)
    serializer_class = DiseaseSerializer
    permission_classes = [perms.IsDoctorOrAdmin]


class SpecialtyViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Specialty.objects.filter(active=True)
    serializer_class = SpecialtySerializer
    pagination_class = paginators.SpecialtyPaginator

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
                {"error": "Please provide symptoms for recommendation"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            specialty = utils.get_recommend_specialty(symptoms=symptoms)
            if specialty:
                return Response(
                    SpecialtySerializer(specialty).data, status=status.HTTP_200_OK
                )
            return Response(
                {"error": "No suitable specialty found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as ex:
            print(ex)
            return Response(
                {"error": str(ex)},
                status=status.HTTP_404_NOT_FOUND,
            )


class ServiceViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Service.objects.filter(active=True)
    pagination_class = paginators.ServicePaginator

    def get_serializer_class(self):
        if self.action == "retrieve":
            return DetailServiceSerializer
        if self.action == "popular_services":
            return ServicePopularSerializer
        return ServiceSerializer

    @action(methods=["get"], url_path="popular", detail=False)
    def popular_services(self, request):
        popular = (
            Service.objects.filter(active=True, appointmentservice__active=True)
            .annotate(total=Count("appointmentservice__id"))
            .filter(total__gt=0)
            .order_by("-total")[:5]
        )

        serializer = self.get_serializer(popular, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class MedicineViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    def get_serializer_class(self):
        if self.action == "retrieve":
            return DetailMedicineSerializer
        return MedicineSerializer

    queryset = Medicine.objects.filter(active=True)
    permission_classes = [perms.IsDoctorOrAdmin]


class MedicineCategoryViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = MedicineCategory.objects.filter(active=True)
    serializer_class = MedicineCategorySerializer
    permission_classes = [perms.IsDoctorOrAdmin]


class UserViewSet(viewsets.ViewSet, generics.CreateAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserSerializer
    parser_classes = [parsers.MultiPartParser, parsers.JSONParser]

    @action(
        methods=["get", "patch"],
        url_path="current-user",
        detail=False,
        permission_classes=[permissions.IsAuthenticated],
    )
    def current_user(self, request):
        u = request.user
        if request.method == "PATCH":
            s = SimpleUserSerializer(u, data=request.data)
            s.is_valid(raise_exception=True)
            u = s.save()
        return Response(UserSerializer(u).data, status=status.HTTP_200_OK)

    @action(
        detail=False,
        methods=["get", "post", "patch"],
        url_path="current-user/patient-profile",
        permission_classes=[IsAuthenticated],
    )
    def patient_profile(self, request):
        if request.method == "GET":
            try:
                profile = PatientProfile.objects.get(user=request.user)
                return Response(
                    DetailPatientProfileSerializer(profile).data,
                    status=status.HTTP_200_OK,
                )
            except PatientProfile.DoesNotExist:
                return Response(
                    {"error": "User does not have a patient profile yet"},
                    status=status.HTTP_404_NOT_FOUND,
                )

        if request.method == "POST":
            if PatientProfile.objects.filter(user=request.user).exists():
                return Response(
                    {"error": "User already has a patient profile"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            serializer = PatientProfileSerializer(
                data=request.data, context={"request": self.request}
            )
            serializer.is_valid(raise_exception=True)
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        if request.method == "PATCH":
            try:
                profile = PatientProfile.objects.get(user=request.user)
            except PatientProfile.DoesNotExist:
                return Response(
                    {"error": "User does not have a patient profile yet"},
                    status=status.HTTP_404_NOT_FOUND,
                )
            serializer = PatientProfileSerializer(
                profile, data=request.data, partial=True
            )
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)


class DoctorViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Doctor.objects.filter(user__is_active=True)
    serializer_class = DoctorSerializer
    pagination_class = paginators.DoctorPaginator

    def get_queryset(self):
        queryset = super().get_queryset().select_related("user", "specialty")
        specialty_id = self.request.query_params.get("specialty_id")
        kw = self.request.query_params.get("kw")

        if specialty_id:
            queryset = queryset.filter(specialty_id=specialty_id)
        if kw:
            queryset = queryset.filter(
                Q(user__first_name__icontains=kw) | Q(user__last_name__icontains=kw)
            )
        return queryset


class DoctorScheduleViewSet(viewsets.ViewSet):
    queryset = DoctorSchedule.objects.filter(active=True)
    serializer_class = serializers.DoctorScheduleSerializer
    permission_classes = [perms.IsDoctor]

    def list(self, request):
        doctor = request.user.doctor_profile
        schedules = self.queryset.filter(
            doctor=doctor,
            start_time__date=timezone.localdate(),
        ).order_by("start_time")
        serializer = self.serializer_class(schedules, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ReportViewSet(viewsets.ViewSet):
    permission_classes = [perms.IsAdmin]

    @action(methods=["get"], url_path="patients", detail=False)
    def report_patients(self, request):
        age_expression = ExtractYear(Now()) - ExtractYear("dob")

        age_groups = (
            PatientProfile.objects.filter(active=True)
            .annotate(age=age_expression)
            .annotate(
                age_group=Case(
                    When(age__lt=18, then=Value("Trẻ em (< 18)")),
                    When(age__gte=18, age__lte=30, then=Value("Thanh niên (18 - 30)")),
                    When(age__gt=30, age__lte=60, then=Value("Trung niên (30 - 60)")),
                    When(age__gt=60, then=Value("Cao tuổi (> 60)")),
                    output_field=CharField(),
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

        raw_data = {
            "age_groups": list(age_groups),
            "genders": list(gender_distribution),
            "specialties": list(specialty_distribution),
        }

        serializer = serializers.ReportPatientSerializer(raw_data)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=["get"], url_path="services", detail=False)
    def report_services(self, request):
        queryset = AppointmentService.objects.filter(active=True)

        from_date = request.query_params.get("from_date")
        to_date = request.query_params.get("to_date")

        if from_date:
            try:
                parsed = datetime.strptime(from_date, "%Y-%m-%d").date()
                queryset = queryset.filter(appointment__start__date__gte=parsed)
            except Exception:
                raise ValueError({"from_date": "Invalid from date"})

        if to_date:
            try:
                parsed = datetime.strptime(to_date, "%Y-%m-%d").date()
                queryset = queryset.filter(appointment__start__date__lte=parsed)
            except Exception:
                raise ValueError({"to_date": "Invalid to date"})

        services = (
            queryset.values("service_id", "service__name")
            .annotate(
                total_quantity=Sum("quantity"),
                total_appointments=Count("appointment", distinct=True),
            )
            .order_by("-total_quantity")
        )

        serializer = serializers.ReportServiceSerializer({"services": services})
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=["get"], url_path="diseases", detail=False)
    def report_diseases(self, request):
        queryset = Appointment.objects.filter(active=True)

        from_date = request.query_params.get("from_date")
        to_date = request.query_params.get("to_date")

        if from_date:
            try:
                parsed = datetime.strptime(from_date, "%Y-%m-%d").date()
                queryset = queryset.filter(start__date__gte=parsed)
            except Exception:
                raise ValueError({"from_date": "Invalid from date"})

        if to_date:
            try:
                parsed = datetime.strptime(to_date, "%Y-%m-%d").date()
                queryset = queryset.filter(start__date__lte=parsed)
            except Exception:
                raise ValueError({"to_date": "Invalid to date"})

        disease_raw = (
            queryset.values(
                "diagnosis_id",
                "diagnosis__name",
                "diagnosis__disease_category__id",
                "diagnosis__disease_category__name",
            )
            .annotate(total_appointments=Count("id"))
            .order_by("diagnosis__disease_category__id", "-total_appointments")
        )
        serializer = serializers.ReportDiseaseSerializer(disease_raw, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class TestQRView(APIView):
    permission_classes = []

    def get(self, request):
        amount = request.query_params.get("amount", "50000")
        try:
            amount = int(amount)
        except ValueError:
            return Response({"error": "amount phải là số nguyên"}, status=400)

        if amount <= 0:
            return Response({"error": "amount phải > 0"}, status=400)

        order_id = datetime.now().strftime("%H%M%S")

        result = utils.create_order(
            amount=amount, order_id=order_id, description="Thanh toán test"
        )

        if result.get("return_code") == 1:
            return Response(
                {
                    "order_url": result["order_url"],
                    "order_token": result.get("zp_trans_token"),
                    "app_trans_id": result.get("app_trans_id"),
                    "amount": amount,
                }
            )
        else:
            return Response(
                {"error": "Tạo đơn hàng thất bại", "detail": result}, status=500
            )
