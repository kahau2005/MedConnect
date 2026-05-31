import json

from django.db import IntegrityError, transaction
from django.db.models import (
    Avg,
    Count,
    FloatField,
    OuterRef,
    Prefetch,
    Q,
    Subquery,
    Value,
)
from django.db.models.functions import Coalesce, Concat
from django.utils import timezone
from django.utils.decorators import method_decorator
from django_filters.rest_framework import DjangoFilterBackend
from django_ratelimit.decorators import ratelimit
from oauth2_provider.views.base import TokenView
from rest_framework import generics, parsers, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle

from . import paginators, perms, serializers, utils
from .filters import AppointmentFilter, DoctorFilter
from .models import (
    Appointment,
    AppointmentService,
    ChatMessage,
    ChatRoom,
    Disease,
    DiseaseCategory,
    Doctor,
    DoctorSchedule,
    FCMDevice,
    Medicine,
    MedicineCategory,
    PatientProfile,
    Payment,
    Prescription,
    PrescriptionDetail,
    Review,
    Service,
    Specialty,
    TestResult,
    User,
    VideoCallLog,
)


class AppointmentViewSet(viewsets.GenericViewSet, generics.ListAPIView):
    permission_classes = [perms.AppointmentOwnerOrDoctor]
    pagination_class = paginators.AppointmentPaginator
    filter_backends = [DjangoFilterBackend]
    filterset_class = AppointmentFilter

    def get_queryset(self):
        user = self.request.user
        queryset = Appointment.objects.filter(active=True)

        if user.role == User.UserRole.PATIENT:
            queryset = queryset.filter(user=user)
        elif user.role == User.UserRole.DOCTOR:
            queryset = queryset.filter(Q(user=user) | Q(doctor__user=user))
        elif user.role == User.UserRole.ADMIN:
            queryset = queryset.all()

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
                "-start"
            )

        elif self.action == "chat_rooms":
            queryset = queryset.select_related("user", "doctor__user")

        elif self.action == "doctors":
            queryset = queryset.filter(status=Appointment.AppointmentStatus.COMPLETED)
        return queryset

    def get_serializer_class(self):
        if self.action == "retrieve":
            return serializers.DetailAppointmentSerializer
        if self.action == "prescriptions":
            if self.request.method == "POST":
                return serializers.SimplePrescriptionSerializer
            elif self.request.method == "GET":
                return serializers.PrescriptionSerializer
        if self.action == "partial_update":
            return serializers.AppointmentUpdateSerializer
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
        return super().get_permissions()

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
        completed_appointments = self.get_queryset()

        doctor_ids = completed_appointments.values_list(
            "doctor_id", flat=True
        ).distinct()

        doctors = Doctor.objects.filter(user_id__in=doctor_ids).select_related("user")

        serializer = serializers.DoctorSerializer(doctors, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(
        methods=["get"],
        url_path="status",
        detail=True,
    )
    def status(self, request, pk):
        appointment = self.get_object()
        return Response({"status": appointment.status}, status=status.HTTP_200_OK)

    @action(
        methods=["get"],
        url_path="today",
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
                Appointment.AppointmentStatus.PENDING,
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
                {
                    "start": "Khung giờ này đã có cuộc hẹn khác, vui lòng chọn khung giờ khác"
                }
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

        if appointment.status != Appointment.AppointmentStatus.PENDING:
            return Response(
                {"error": "Chỉ có thể thanh toán cho lịch khám ở trạng thái Đang khám"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        service_total = 0
        for service in appointment.services.all():
            service_total += service.quantity * service.unit_price

        prescription_total = 0
        for prescription in appointment.prescription_set.all():
            for detail in prescription.details.all():
                prescription_total += detail.quantity * detail.unit_price

        total_amount = service_total + prescription_total

        payment, created = Payment.objects.get_or_create(
            appointment=appointment, defaults={"total_amount": total_amount}
        )

        if (
            not created
            and payment.status == Payment.PaymentStatus.PENDING
            and payment.total_amount != total_amount
        ):
            payment.total_amount = total_amount
            payment.save()

        payment.appointment = appointment

        serializer = serializers.PaymentReceiptSerializer(payment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(methods=["post"], url_path="review", detail=True)
    def review(self, request, pk=None):
        appointment = self.get_object()
        if appointment.status != Appointment.AppointmentStatus.COMPLETED:
            return Response(
                {"error": "Chỉ có thể đánh giá sau khi hoàn thành lịch khám"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = serializers.ReviewSerializer(
            data=request.data, context={"appointment": appointment}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save(appointment=appointment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(methods=["post"], url_path="chat-rooms", detail=True)
    def chat_rooms(self, request, pk=None):
        appointment = self.get_object()

        try:
            chat_room, channel_id, created = utils.get_or_create_chatroom(appointment)
        except Exception:
            return Response(
                {"error": "Tạo phòng chat thất bại"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(
            {
                "message": "Phòng chat đã được tạo",
                "chat_room_id": chat_room.id,
                "stream_channel_id": channel_id,
                "stream_channel_type": "messaging",
            },
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


class AppointmentServiceViewSet(viewsets.GenericViewSet):
    queryset = AppointmentService.objects.filter(active=True).select_related(
        "appointment"
    )
    serializer_class = serializers.AppointmentServiceSerializer
    permission_classes = [perms.AppointmentDoctor]

    def get_throttles(self):
        self.throttle_scope = "appointment_service"
        return [ScopedRateThrottle()]

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
                    serializers.TestResultSerializer(result).data,
                    status=status.HTTP_200_OK,
                )
            except TestResult.DoesNotExist:
                return Response(
                    {"error": "Không tìm thấy kết quả xét nghiệm cho dịch vụ này"},
                    status=status.HTTP_404_NOT_FOUND,
                )

        serializer = serializers.TestResultSerializer(
            data=request.data,
            context={"request": request, "appointment_service": appointment_service},
        )
        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except IntegrityError:
            return Response(
                {"error": "Kết quả xét nghiệm cho dịch vụ này đã tồn tại"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class PrescriptionViewSet(viewsets.GenericViewSet, generics.RetrieveAPIView):
    queryset = Prescription.objects.filter(active=True)
    permission_classes = [perms.AppointmentDoctor]

    def get_serializer_class(self):
        if self.action in ["details"]:
            return serializers.PrescriptionDetailSerializer
        elif self.action in ["partial_update"]:
            return serializers.SimplePrescriptionSerializer
        return serializers.PrescriptionSerializer

    def get_throttles(self):
        if self.action == "details":
            self.throttle_scope = "prescription_details"
        else:
            self.throttle_scope = "prescription"
        return [ScopedRateThrottle()]

    def partial_update(self, request, pk=None):
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
        serializer = self.get_serializer(
            data=request.data,
            many=True,
            context={"prescription": prescription},
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class PrescriptionDetailViewSet(viewsets.GenericViewSet):
    queryset = PrescriptionDetail.objects.filter(active=True)
    serializer_class = serializers.PrescriptionDetailSerializer
    permission_classes = [perms.AppointmentDoctor]
    throttle_scope = "prescription_details"

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
    serializer_class = serializers.DiseaseCategorySerializer
    permission_classes = [perms.IsDoctorOrAdmin]
    throttle_scope = "disease_category"


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
        if self.action == "popular_services":
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
    permission_classes = [perms.IsDoctorOrAdmin]
    throttle_scope = "medicine"

    def get_queryset(self):
        queryset = Medicine.objects.filter(active=True)
        
        category_id = self.request.query_params.get("category_id")
        if category_id:
            queryset = queryset.filter(category_id=category_id)
            
        kw = self.request.query_params.get("kw")
        if kw:
            queryset = queryset.filter(name__icontains=kw)
            
        return queryset

    def get_serializer_class(self):
        if self.action == "retrieve":
            return serializers.DetailMedicineSerializer
        return serializers.MedicineSerializer


class MedicineCategoryViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = MedicineCategory.objects.filter(active=True)
    serializer_class = serializers.MedicineCategorySerializer
    permission_classes = [perms.IsDoctorOrAdmin]
    throttle_scope = "medicine_category"


@method_decorator(ratelimit(key="ip", rate="5/m"), name="dispatch")
class RateLimitLoginView(TokenView):
    pass


class UserViewSet(viewsets.GenericViewSet, generics.CreateAPIView):
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
            try:
                profile = PatientProfile.objects.get(user=request.user)
                return Response(
                    serializers.DetailPatientProfileSerializer(profile).data,
                    status=status.HTTP_200_OK,
                )
            except PatientProfile.DoesNotExist:
                return Response(
                    {"error": "Người dùng chưa có hồ sơ bệnh nhân"},
                    status=status.HTTP_404_NOT_FOUND,
                )

        if request.method == "POST":
            if PatientProfile.objects.filter(user=request.user).exists():
                return Response(
                    {"error": "Người dùng đã có hồ sơ bệnh nhân, không cần tạo mới"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            serializer = serializers.PatientProfileSerializer(
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
                    {"error": "Người dùng chưa có hồ sơ bệnh nhân"},
                    status=status.HTTP_404_NOT_FOUND,
                )
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
        return Response({"message": "Đăng ký thiết bị thành công"})


class DoctorViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Doctor.objects.filter(user__is_active=True)
    serializer_class = serializers.DoctorSerializer
    pagination_class = paginators.DoctorPaginator
    filter_backends = [DjangoFilterBackend]
    filterset_class = DoctorFilter
    throttle_scope = "doctor"

    def get_queryset(self):
        return super().get_queryset().select_related("user", "specialty")

    @action(
        methods=["get"], url_path="popular", detail=False, permission_classes=[AllowAny]
    )
    def popular(self, request):
        queryset = self.get_queryset()

        top_comment_subquery = (
            Review.objects.filter(
                appointment__doctor_id=OuterRef("user_id"), comment__isnull=False
            )
            .exclude(comment__exact="")
            .order_by("-rating", "-created_at")
            .values("comment")[:1]
        )
        top_comment_user = (
            Review.objects.filter(
                appointment__doctor_id=OuterRef("user_id"),
                comment__isnull=False,
            )
            .exclude(comment__exact="")
            .order_by("-rating", "-created_at")
            .annotate(
                full_name=Concat(
                    "appointment__user__first_name",
                    Value(" "),
                    "appointment__user__last_name",
                )
            )
            .values("full_name")[:1]
        )

        popular_doctors = queryset.annotate(
            appointment_count=Count(
                "doctor_appointments",
                filter=Q(
                    doctor_appointments__active=True,
                    doctor_appointments__status=Appointment.AppointmentStatus.COMPLETED,
                ),
            ),
            avg_rating=Coalesce(
                Avg("doctor_appointments__review__rating"),
                0.0,
                output_field=FloatField(),
            ),
            comment_content=Subquery(top_comment_subquery),
            comment_user=Subquery(top_comment_user),
        ).order_by("-avg_rating", "-appointment_count")[:4]

        serializer = self.get_serializer(popular_doctors, many=True)
        return Response(serializer.data)


class DoctorScheduleViewSet(viewsets.ViewSet):
    queryset = DoctorSchedule.objects.filter(active=True)
    serializer_class = serializers.DoctorScheduleSerializer
    permission_classes = [perms.IsDoctor]
    throttle_scope = "doctor_schedule"

    def list(self, request):
        doctor = request.user.doctor_profile
        schedules = self.queryset.filter(
            doctor=doctor,
            start_time__date=timezone.localdate(),
        ).order_by("start_time")
        serializer = self.serializer_class(schedules, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PaymentViewSet(viewsets.GenericViewSet):
    permission_classes = [perms.AppointmentOwner]
    queryset = Payment.objects.filter(active=True).select_related("appointment")
    serializer_class = serializers.PaymentReceiptSerializer
    throttle_scope = "payment"

    @action(methods=["post"], url_path="zalopay", detail=True)
    def pay(self, request, pk=None):
        payment = self.get_object()

        if payment.status == Payment.PaymentStatus.PAID:
            return Response(
                {"error": "Hóa đơn đã được thanh toán"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if payment.total_amount == 0:
            payment.status = Payment.PaymentStatus.PAID
            payment.save()

            payment.appointment.prescription_set.filter(active=True).update(
                status=Prescription.PrescriptionStatus.PAID
            )
            return Response(
                {
                    "message": "Thanh toán thành công! Không có khoản phí nào cần thanh toán."
                },
                status=status.HTTP_200_OK,
            )

        callback_url = request.build_absolute_uri("/payments/zalopay-callback/")
        description = f"Thanh toán hóa đơn cho lịch khám #{payment.appointment.id}"
        zalopay_res = utils.create_order(
            order_id=payment.id,
            amount=int(payment.total_amount),
            description=description,
            callback_url=callback_url,
        )

        if zalopay_res.get("return_code") == 1:
            payment.app_trans_id = zalopay_res["app_trans_id"]
            payment.save()

            return Response(
                {
                    "order_url": zalopay_res["order_url"],
                    "zp_trans_token": zalopay_res["zp_trans_token"],
                    "app_trans_id": zalopay_res["app_trans_id"],
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"error": "Tạo đơn hàng thất bại", "detail": zalopay_res},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(
        methods=["post"],
        url_path="zalopay-callback",
        detail=False,
        permission_classes=[AllowAny],
    )
    def callback(self, request):
        res = {}
        try:
            is_valid, data = utils.verify_callback(request.data)
            if not is_valid:
                res["return_code"] = -1
                res["return_message"] = f"Xác thực callback thất bại: {data}"
                return Response(res)

            app_trans_id = data["app_trans_id"]
            zp_trans_id = data["zp_trans_id"]
            payment_id = app_trans_id.split("_")[-1]

            with transaction.atomic():
                payment = Payment.objects.select_related("appointment").get(
                    id=payment_id
                )

                payment.status = Payment.PaymentStatus.PAID
                payment.zp_trans_id = zp_trans_id
                payment.app_trans_id = app_trans_id
                payment.save(
                    update_fields=[
                        "status",
                        "app_trans_id",
                        "zp_trans_id",
                        "updated_at",
                    ]
                )

                appointment = payment.appointment
                appointment.status = Appointment.AppointmentStatus.COMPLETED
                appointment.save(update_fields=["status", "updated_at"])
                appointment.prescription_set.filter(active=True).update(
                    status=Prescription.PrescriptionStatus.PAID
                )

            res["return_code"] = 1
            res["return_message"] = "Thanh toán thành công"

        except Payment.DoesNotExist:
            res["return_code"] = 0
            res["return_message"] = "Không tìm thấy đơn thanh toán"
        except Exception as e:
            res["return_code"] = 0
            res["return_message"] = str(e)

        return Response(res, status=status.HTTP_200_OK)


class StreamViewSet(viewsets.GenericViewSet):
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

    @action(
        methods=["post"],
        url_path="webhook",
        detail=False,
        permission_classes=[AllowAny],
    )
    def webhook(self, request):
        if not utils.verify_stream_webhook(request):
            return Response(
                {"error": "Chữ ký Stream không hợp lệ"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        data = json.loads(request.body)
        event_type = data.get("type")

        if event_type and event_type.startswith("message."):
            msg_json = data.get("message", {})
            channel_id = data.get("channel_id", "")
            appointment_id = channel_id.split("_")[-1]

            try:
                room = ChatRoom.objects.get(appointment_id=appointment_id)

                if event_type == "message.new":
                    ChatMessage.objects.update_or_create(
                        room=room,
                        chat_type=ChatMessage.MessageType.TEXT,
                        sender_id=msg_json["user"]["id"],
                        stream_id=msg_json["id"],
                        defaults={"content": msg_json["text"]},
                    )
                elif event_type == "message.updated":
                    ChatMessage.objects.filter(stream_id=msg_json["id"]).update(
                        content=msg_json["text"]
                    )
                elif event_type == "message.deleted":
                    ChatMessage.objects.filter(stream_id=msg_json["id"]).update(
                        active=False
                    )

            except ChatRoom.DoesNotExist:
                pass

        elif event_type == "call.ended":
            call_json = data.get("call", {})
            channel_id = data.get("call_cid", "")

            appointment_id = channel_id.split("_")[-1]

            caller_id = call_json.get("created_by", {}).get("id")

            try:
                room = ChatRoom.objects.select_related("appointment__doctor").get(
                    appointment_id=appointment_id
                )
                appointment = room.appointment

                if caller_id and str(caller_id) == str(appointment.user_id):
                    receiver_id = appointment.doctor.user_id
                else:
                    receiver_id = appointment.user_id

                session = call_json.get("session", {})
                start = (
                    session.get("started_at")
                    or call_json.get("starts_at")
                    or data.get("created_at")
                )
                end = (
                    session.get("ended_at")
                    or call_json.get("ended_at")
                    or data.get("created_at")
                )
                with transaction.atomic():
                    call_log = VideoCallLog.objects.create(
                        room=room,
                        caller_id=caller_id,
                        receiver_id=receiver_id,
                        status=VideoCallLog.CallStatus.COMPLETED,
                        start=start,
                        end=end,
                    )
                    ChatMessage.objects.create(
                        room=room,
                        chat_type=ChatMessage.MessageType.CALL,
                        sender_id=caller_id,
                        call_log=call_log,
                        content="Cuộc gọi video đã kết thúc",
                    )
            except ChatRoom.DoesNotExist:
                pass

        return Response({}, status=status.HTTP_200_OK)
