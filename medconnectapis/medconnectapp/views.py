from django.db.models import (
    Avg,
    Count,
    Prefetch,
    Q,
)
from django.db.models.functions import Round
from django.utils import timezone
from django_filters.rest_framework.backends import DjangoFilterBackend
from rest_framework import filters, generics, parsers, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle

from . import paginators, perms, serializers, utils
from .models import (
    Appointment,
    AppointmentService,
    Disease,
    Doctor,
    FCMDevice,
    Medicine,
    MedicineCategory,
    PatientProfile,
    Payment,
    Prescription,
    PrescriptionDetail,
    Service,
    Specialty,
    User,
)


class AppointmentViewSet(
    viewsets.ViewSet,
    generics.ListAPIView,
    generics.RetrieveAPIView,
    generics.UpdateAPIView,
):
    pagination_class = paginators.AppointmentPaginator
    filter_backends = [
        filters.SearchFilter,
        DjangoFilterBackend,
    ]
    filterset_fields = {
        "status": ["exact"],
        "start": ["date"],
    }
    search_fields = [
        "doctor__user__first_name",
        "doctor__user__last_name",
        "diagnosis__name",
        "symptoms",
        "reason",
    ]

    def get_queryset(self):
        user = self.request.user
        queryset = Appointment.objects.filter(active=True)

        if user.role == User.UserRole.DOCTOR:
            queryset = queryset.filter(Q(user=user) | Q(doctor__user=user))
        else:
            queryset = queryset.filter(user=user)

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

        elif self.action == "checkout":
            queryset = queryset.select_related("user", "doctor__user").prefetch_related(
                Prefetch(
                    "services",
                    queryset=AppointmentService.objects.filter(
                        active=True
                    ).select_related("service"),
                ),
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
            )

        elif self.action in ["list", "today"]:
            queryset = queryset.select_related("user", "doctor__user").order_by(
                "-start", "-id"
            )

        elif self.action == "chat_rooms":
            queryset = queryset.select_related("user", "doctor__user")

        elif self.action == "doctors":
            queryset = queryset.filter(status=Appointment.AppointmentStatus.COMPLETED)
        return queryset

    def get_serializer_class(self):
        if self.action == "retrieve":
            return serializers.DetailAppointmentSerializer
        elif self.action == "prescriptions":
            if self.request.method == "POST":
                return serializers.SimplePrescriptionSerializer
            elif self.request.method == "GET":
                return serializers.PrescriptionSerializer
        elif self.action == "partial_update":
            return serializers.AppointmentUpdateSerializer
        elif self.action == "checkout":
            return serializers.PaymentCheckoutSerializer
        return serializers.AppointmentSerializer

    def get_permissions(self):
        if self.action == "create":
            return [IsAuthenticated()]
        elif (
            self.action in ["services", "prescriptions"]
            and self.request.method == "POST"
        ):
            return [perms.AppointmentDoctor()]
        elif self.action in ["partial_update", "chat_rooms"]:
            return [perms.AppointmentOwnerOrDoctor()]
        elif self.action in ["review", "checkout"]:
            return [perms.AppointmentOwner()]
        elif self.action == "today":
            return [perms.IsDoctor()]
        return [perms.AppointmentOwnerOrDoctor()]

    def get_throttles(self):
        if self.action == "create":
            self.throttle_scope = "booking"
        elif self.action == "checkout":
            self.throttle_scope = "checkout"
        elif self.action in [
            "list",
            "retrieve",
            "today",
            "status",
            "doctors",
            "video_call_info",
        ]:
            self.throttle_scope = "appointment_read"
        elif self.action == "partial_update":
            self.throttle_scope = "appointment_update"
        elif self.action == "prescriptions":
            self.throttle_scope = "appointment_prescriptions"
        elif self.action == "services":
            self.throttle_scope = "appointment_services_action"
        elif self.action == "review":
            self.throttle_scope = "appointment_review"
        elif self.action == "chat_rooms":
            self.throttle_scope = "appointment_chat_rooms"
        else:
            self.throttle_scope = "appointment"

        return [ScopedRateThrottle()]

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(
        methods=["get"],
        url_path="doctors",
        detail=False,
    )
    def doctors(self, request):
        completed_appointments = self.get_queryset()

        doctor_ids = completed_appointments.values_list(
            "doctor_id", flat=True
        ).distinct()

        doctors = Doctor.objects.filter(user_id__in=doctor_ids).select_related("user")
        serializer = serializers.DoctorSerializer(doctors, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(
        methods=["get"],
        url_path="today",
        detail=False,
    )
    def today(self, request):
        queryset = self.get_queryset().filter(
            doctor_id=request.user.id,
            start__date=timezone.localdate(),
            status__in=[
                Appointment.AppointmentStatus.SCHEDULED,
                Appointment.AppointmentStatus.PENDING,
                Appointment.AppointmentStatus.COMPLETED,
            ],
        )
        serializer = self.get_serializer(queryset, many=True)
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
                    queryset=PrescriptionDetail.objects.filter(
                        active=True
                    ).select_related("medicine"),
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
                serializers.AppointmentServiceSerializer(q, many=True).data,
                status=status.HTTP_200_OK,
            )

        serializer = serializers.AppointmentServiceSerializer(
            data=request.data, context={"appointment": appointment}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(methods=["post"], url_path="checkout", detail=True)
    def checkout(self, request, pk=None):
        appointment = self.get_object()
        serializer = self.get_serializer(data={}, context={"appointment": appointment})
        serializer.is_valid(raise_exception=True)
        payment = serializer.save()
        return Response(
            serializers.PaymentSerializer(payment).data, status=status.HTTP_201_CREATED
        )

    @action(methods=["post"], url_path="chat-rooms", detail=True)
    def chat_rooms(self, request, pk=None):
        appointment = self.get_object()
        channel_id = utils.get_or_create_chatroom(appointment)
        return Response(
            {
                "message": "Phòng chat đã được tạo",
                "stream_channel_id": channel_id,
                "stream_channel_type": "messaging",
            },
            status=status.HTTP_201_CREATED,
        )

    @action(methods=["post"], url_path="review", detail=True)
    def review(self, request, pk=None):
        appointment = self.get_object()
        serializer = serializers.ReviewSerializer(
            data=request.data, context={"appointment": appointment}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save(appointment=appointment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class AppointmentServiceViewSet(viewsets.ViewSet, generics.UpdateAPIView):
    queryset = AppointmentService.objects.filter(active=True).select_related(
        "appointment"
    )
    serializer_class = serializers.AppointmentServiceSerializer
    permission_classes = [perms.AppointmentDoctor]
    throttle_scope = "appointment_service"

    @action(methods=["get", "post"], url_path="results", detail=True)
    def test_results(self, request, pk=None):
        appointment_service = self.get_object()
        if request.method == "GET":
            result = appointment_service.test_result
            return Response(
                serializers.TestResultSerializer(result).data,
                status=status.HTTP_200_OK,
            )

        serializer = serializers.TestResultSerializer(
            data=request.data,
            context={"request": request, "appointment_service": appointment_service},
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class PrescriptionViewSet(viewsets.ViewSet, generics.RetrieveAPIView):
    permission_classes = [perms.AppointmentDoctor]

    def get_queryset(self):
        queryset = Prescription.objects.filter(active=True)

        if self.action == "retrieve":
            queryset = queryset.prefetch_related(
                Prefetch(
                    "details",
                    queryset=PrescriptionDetail.objects.filter(
                        active=True
                    ).select_related("medicine"),
                )
            )
        return queryset

    def get_serializer_class(self):
        if self.action in ["details"]:
            return serializers.PrescriptionDetailSerializer
        return serializers.PrescriptionSerializer

    def get_throttles(self):
        if self.action == "details":
            self.throttle_scope = "prescription_details"
        else:
            self.throttle_scope = "prescription"
        return [ScopedRateThrottle()]

    @action(detail=True, methods=["post"], url_path="details")
    def details(self, request, pk=None):
        prescription = self.get_object()
        serializer = self.get_serializer(
            data=request.data,
            context={"prescription": prescription},
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class PrescriptionDetailViewSet(viewsets.GenericViewSet):
    queryset = PrescriptionDetail.objects.filter(active=True).select_related(
        "prescription__appointment", "medicine"
    )
    serializer_class = serializers.PrescriptionDetailSerializer
    permission_classes = [perms.AppointmentDoctor]
    throttle_scope = "prescription_details"

    def destroy(self, request, pk=None):
        detail = self.get_object()
        serializer = self.get_serializer(detail)
        serializer.delete(detail)
        return Response(status=status.HTTP_204_NO_CONTENT)


class DiseaseViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Disease.objects.filter(active=True)
    serializer_class = serializers.DiseaseSerializer
    permission_classes = [perms.IsDoctorOrAdmin]
    throttle_scope = "disease"


class SpecialtyViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Specialty.objects.filter(active=True)
    serializer_class = serializers.SpecialtySerializer
    throttle_scope = "specialty"


class ServiceViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Service.objects.filter(active=True)
    throttle_scope = "service"

    def get_serializer_class(self):
        if self.action == "retrieve":
            return serializers.DetailServiceSerializer
        elif self.action == "popular_services":
            return serializers.ServicePopularSerializer
        return serializers.ServiceSerializer

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
    queryset = Medicine.objects.filter(active=True)
    permission_classes = [perms.IsDoctorOrAdmin]
    pagination_class = paginators.MedicinePaginator
    throttle_scope = "medicine"
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = {
        "category_id": ["exact"],
    }
    search_fields = ["name"]

    def get_serializer_class(self):
        if self.action == "retrieve":
            return serializers.DetailMedicineSerializer
        return serializers.MedicineSerializer


class MedicineCategoryViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = MedicineCategory.objects.filter(active=True)
    serializer_class = serializers.MedicineCategorySerializer
    permission_classes = [perms.IsDoctorOrAdmin]
    throttle_scope = "medicine_category"


class UserViewSet(viewsets.ViewSet, generics.CreateAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = serializers.UserSerializer
    parser_classes = [parsers.MultiPartParser, parsers.JSONParser]

    def get_throttles(self):
        if self.action == "create":
            self.throttle_scope = "register"
        elif self.action == "current_user":
            self.throttle_scope = "current_user"
        elif self.action == "patient_profile":
            self.throttle_scope = "patient_profile"
        return [ScopedRateThrottle()]

    @action(
        methods=["get", "patch"],
        url_path="current-user",
        detail=False,
        permission_classes=[permissions.IsAuthenticated],
    )
    def current_user(self, request):
        u = request.user
        if request.method == "PATCH":
            s = serializers.SimpleUserSerializer(u, data=request.data)
            s.is_valid(raise_exception=True)
            u = s.save()
        return Response(serializers.UserSerializer(u).data, status=status.HTTP_200_OK)

    @action(
        detail=False,
        methods=["get", "post", "patch"],
        url_path="current-user/patient-profile",
        permission_classes=[IsAuthenticated],
    )
    def patient_profile(self, request):
        if request.method == "GET":
            profile = PatientProfile.objects.get(user=request.user)
            return Response(
                serializers.DetailPatientProfileSerializer(profile).data,
                status=status.HTTP_200_OK,
            )

        if request.method == "POST":
            if PatientProfile.objects.filter(user=request.user).exists():
                return Response(
                    {"err": "Đã có hồ sơ rồi"}, status=status.HTTP_400_BAD_REQUEST
                )
            serializer = serializers.PatientProfileSerializer(
                data=request.data, context={"request": self.request}
            )
            serializer.is_valid(raise_exception=True)
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        if request.method == "PATCH":
            profile = PatientProfile.objects.get(user=request.user)
            serializer = serializers.PatientProfileSerializer(
                profile, data=request.data, partial=True
            )
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

    @action(
        methods=["post"],
        url_path="register-device",
        detail=False,
        permission_classes=[permissions.IsAuthenticated],
    )
    def register_device(self, request):
        serializer = serializers.FCMDeviceSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        token = serializer.validated_data["token"]
        device_type = serializer.validated_data["device_type"]

        FCMDevice.objects.update_or_create(
            token=token,
            defaults={"user": request.user, "device_type": device_type, "active": True},
        )
        return Response(status=status.HTTP_200_OK)


class DoctorViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Doctor.objects.filter(user__is_active=True).select_related(
        "user", "specialty"
    )
    serializer_class = serializers.DoctorSerializer
    pagination_class = paginators.DoctorPaginator
    filter_backends = [
        filters.OrderingFilter,
        filters.SearchFilter,
        DjangoFilterBackend,
    ]
    filterset_fields = {"specialty_id": ["exact"]}
    search_fields = ["user__first_name", "user__last_name"]
    throttle_scope = "doctor"

    @action(
        methods=["get"], url_path="popular", detail=False, permission_classes=[AllowAny]
    )
    def popular(self, request):
        queryset = self.get_queryset()
        doctors = queryset.annotate(
            appointment_count=Count(
                "doctor_appointments",
                filter=Q(
                    doctor_appointments__active=True,
                    doctor_appointments__status=Appointment.AppointmentStatus.COMPLETED,
                ),
            ),
            avg_rating=Round(Avg("doctor_appointments__review__rating"), 2),
        ).order_by("-avg_rating", "-appointment_count")[:5]
        serializer = self.get_serializer(doctors, many=True)
        return Response(serializer.data)


class PaymentViewSet(viewsets.GenericViewSet):
    queryset = Payment.objects.filter(active=True).select_related("appointment")
    permission_classes = [perms.AppointmentOwner]
    throttle_scope = "payment"

    def get_serializer_class(self):
        if self.action == "pay":
            return serializers.ZaloPaySerializer
        if self.action == "callback":
            return serializers.ZaloPayCallbackSerializer
        return serializers.PaymentSerializer

    @action(methods=["post"], url_path="zalopay", detail=True)
    def pay(self, request, pk=None):
        payment = self.get_object()
        serializer = self.get_serializer(data={}, context={"payment": payment})
        serializer.is_valid(raise_exception=True)
        res = serializer.save()

        if res is None:
            return Response(
                "Không cần thanh toán",
                status=status.HTTP_200_OK,
            )

        return Response(
            {
                "order_url": res["order_url"],
                "zp_trans_token": res["zp_trans_token"],
                "app_trans_id": res["app_trans_id"],
            },
            status=status.HTTP_200_OK,
        )

    @action(
        methods=["post"],
        url_path="zalopay-callback",
        detail=False,
        permission_classes=[AllowAny],
    )
    def callback(self, request):
        res = {}
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            res["return_code"] = -1
            res["return_message"] = "Xác thực callback thất bại"
            return Response(res, status=status.HTTP_200_OK)

        try:
            serializer.save()
            res["return_code"] = 1
            res["return_message"] = "Thanh toán thành công"
        except Exception:
            res["return_code"] = 0
            res["return_message"] = "Có lỗi khi thanh toán"
        return Response(res, status=status.HTTP_200_OK)


class StreamViewSet(viewsets.ViewSet):
    serializer_class = None

    @action(
        methods=["get"],
        url_path="token",
        detail=False,
        permission_classes=[IsAuthenticated],
    )
    def token(self, request):
        user_id = str(request.user.id)
        token = utils.chat_client.create_token(user_id, expiration=3600)

        return Response(
            {
                "stream_token": token,
                "user_id": user_id,
                "role": request.user.role,
                "full_name": f"{request.user.first_name} {request.user.last_name}".strip(),
            },
            status=status.HTTP_200_OK,
        )
