import re
from datetime import timedelta

import nh3
from django.db import transaction
from django.utils import timezone
from PIL import Image, UnidentifiedImageError
from rest_framework import serializers
from rest_framework.fields import CurrentUserDefault, HiddenField
from rest_framework.serializers import ModelSerializer

from .models import (
    Appointment,
    AppointmentService,
    Disease,
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
)
from medconnectapp import utils


class PrescriptionDetailSerializer(ModelSerializer):
    quantity = serializers.IntegerField(min_value=1)
    dose = serializers.IntegerField(min_value=1)
    frequency = serializers.IntegerField(min_value=1)
    duration_day = serializers.IntegerField(min_value=1)

    class Meta:
        model = PrescriptionDetail
        fields = [
            "id",
            "prescription",
            "medicine",
            "quantity",
            "dose",
            "frequency",
            "duration_day",
            "unit_price",
            "instruction",
            "created_at",
            "updated_at",
        ]
        extra_kwargs = {
            "id": {"read_only": True},
            "prescription": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
            "unit_price": {"read_only": True},
        }

    def to_internal_value(self, data):
        detail = super().to_internal_value(data)
        if "medicine" in data:
            detail["medicine_id"] = int(data["medicine"])
        return detail

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["medicine"] = (
            {"id": instance.medicine_id, "name": instance.medicine.name}
            if instance.medicine_id and instance.medicine
            else None
        )
        return data

    @transaction.atomic
    def create(self, validated_data):
        prescription = self.context["prescription"]
        if prescription.appointment.status != Appointment.AppointmentStatus.PENDING:
            raise serializers.ValidationError("Trạng thái lịch khám không hợp lệ")

        medicine = (
            Medicine.objects.select_for_update()
            .filter(id=validated_data["medicine_id"])
            .first()
        )

        if not medicine:
            raise serializers.ValidationError("Không tìm thấy thuốc cần tạo")

        if validated_data["quantity"] > medicine.stock:
            raise serializers.ValidationError("Không đủ số lượng tồn kho")

        medicine.stock -= validated_data["quantity"]
        medicine.save()

        return PrescriptionDetail.objects.create(
            prescription=prescription,
            medicine_id=validated_data["medicine_id"],
            unit_price=medicine.unit_price,
            quantity=validated_data["quantity"],
            dose=validated_data["dose"],
            frequency=validated_data["frequency"],
            duration_day=validated_data["duration_day"],
            instruction=validated_data["instruction"],
        )

    @transaction.atomic
    def delete(self, instance):
        appointment = instance.prescription.appointment
        if appointment.status != Appointment.AppointmentStatus.PENDING:
            raise serializers.ValidationError("Trạng thái lịch khám không hợp lệ")
        medicine = (
            Medicine.objects.select_for_update().filter(id=instance.medicine_id).first()
        )
        if medicine:
            medicine.stock += instance.quantity
            medicine.save()
        instance.active = False
        instance.save()


class PrescriptionSerializer(ModelSerializer):
    details = PrescriptionDetailSerializer(many=True, read_only=True)

    class Meta:
        model = Prescription
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "appointment": {"read_only": True},
            "active": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
            "status": {"read_only": True},
        }


class SimplePrescriptionSerializer(ModelSerializer):
    class Meta:
        model = Prescription
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "appointment": {"read_only": True},
            "active": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }

    def validate(self, attrs):
        appointment = self.context.get("appointment")
        if appointment and appointment.status != Appointment.AppointmentStatus.PENDING:
            raise serializers.ValidationError("Thêm đơn thuốc trạng thái không hợp lệ")
        return attrs


class DoctorSerializer(ModelSerializer):
    avg_rating = serializers.FloatField(read_only=True)
    appointment_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Doctor
        fields = [
            "user_id",
            "background",
            "specialty_id",
            "avg_rating",
            "appointment_count",
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        user = instance.user
        data["id"] = instance.user_id
        data["first_name"] = user.first_name
        data["last_name"] = user.last_name
        data["email"] = user.email
        data["avatar"] = user.avatar.url if user and user.avatar else None
        return data


class AppointmentSerializer(ModelSerializer):
    doctor_info = DoctorSerializer(source="doctor", read_only=True)
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        extra_kwargs = {
            "id": {"read_only": True},
            "user": {"read_only": True},
            "status": {"read_only": True},
            "active": {"read_only": True},
            "symptoms": {"read_only": True},
            "diagnosis": {"read_only": True},
            "doctor": {"write_only": True},
        }
        model = Appointment
        fields = [
            "id",
            "user",
            "doctor",
            "doctor_info",
            "status",
            "start",
            "reason",
            "symptoms",
            "diagnosis",
        ]

    def validate(self, attrs):
        request = self.context.get("request")
        if request and request.user:
            user = request.user
            if user.role == User.UserRole.PATIENT:
                if not hasattr(user, "patient_profile"):
                    raise serializers.ValidationError("Thiếu hồ sơ bệnh nhân")

        doctor = attrs.get("doctor")
        start = attrs.get("start")
        if start:
            now = timezone.now()
            if start <= now:
                raise serializers.ValidationError("Đặt lịch khám trong quá khứ")

        if doctor:
            schedule = doctor.doctorschedule_set.filter(
                start_time__date=start.date()
            ).first()
            if not schedule:
                raise serializers.ValidationError("Bác sĩ không làm việc vào ngày này")

            self.duration = schedule.duration

        input_fields = ["reason", "symptoms"]
        for field in input_fields:
            if field in attrs and isinstance(attrs[field], str):
                if nh3.is_html(attrs[field]):
                    raise serializers.ValidationError("Dữ liệu không hợp lệ")
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        start = validated_data.get("start")
        duration = getattr(self, "duration", 15)

        overlapped_appointment = Appointment.objects.select_for_update().filter(
            active=True,
            doctor=validated_data.get("doctor"),
            status=Appointment.AppointmentStatus.SCHEDULED,
            start__lt=start + timedelta(minutes=duration),
            start__gt=start - timedelta(minutes=duration),
        )

        if overlapped_appointment.exists():
            raise serializers.ValidationError("Thời gian đặt trùng với lịch khám khác")
        return super().create(validated_data)


class AppointmentUpdateSerializer(AppointmentSerializer):
    class Meta(AppointmentSerializer.Meta):
        extra_kwargs = {
            "id": {"read_only": True},
            "user": {"read_only": True},
            "doctor": {"read_only": True},
            "start": {"read_only": True},
            "active": {"read_only": True},
            "reason": {"read_only": True},
            "status": {"read_only": False},
            "symptoms": {"read_only": False},
            "diagnosis": {"read_only": False},
        }

    def validate(self, attrs):
        request = self.context.get("request")
        if request and request.user:
            user = request.user

            if user.role == User.UserRole.PATIENT:
                if "symptoms" in attrs or "diagnosis" in attrs:
                    raise serializers.ValidationError(
                        "Bệnh nhân không có quyền cập nhật"
                    )

        return super().validate(attrs)

    def validate_status(self, value):
        if not self.instance:
            return value

        user = self.context.get("request").user
        current_status = self.instance.status

        if value == Appointment.AppointmentStatus.COMPLETED:
            raise serializers.ValidationError("Không được tự ý hoàn thành lịch khám")

        if user.role == User.UserRole.PATIENT:
            if value != Appointment.AppointmentStatus.CANCELED:
                raise serializers.ValidationError(
                    "Bệnh nhân chỉ có quyền hủy lịch khám"
                )

        elif user.role == User.UserRole.DOCTOR:
            if current_status != Appointment.AppointmentStatus.SCHEDULED:
                raise serializers.ValidationError("Trạng thái lịch khám không hợp lệ")

        return value


class ReviewSerializer(ModelSerializer):
    class Meta:
        model = Review
        fields = "__all__"
        extra_kwargs = {
            "appointment": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }

    def validate(self, attrs):
        appointment = self.context.get("appointment")
        if not appointment:
            raise serializers.ValidationError("Thiếu thông tin lịch khám")

        if appointment.status != Appointment.AppointmentStatus.COMPLETED:
            raise serializers.ValidationError("Trạng thái lịch khám không hợp lệ")
        return super().validate(attrs)

    def validate_comment(self, value):
        if value:
            if nh3.is_html(value):
                raise serializers.ValidationError("Comment không hợp lệ")
        return value


class TestResultSerializer(ModelSerializer):
    class Meta:
        model = TestResult
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "appointment_service": {"read_only": True},
            "tested_by": {"read_only": True},
            "active": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }

    def validate(self, attrs):
        if "conclusion" in attrs and isinstance(attrs["conclusion"], str):
            if nh3.is_html(attrs["conclusion"]):
                raise serializers.ValidationError("Dữ liệu không hợp lệ")
        return attrs

    def create(self, validated_data):
        request = self.context["request"]
        appointment_service = self.context["appointment_service"]
        appointment = appointment_service.appointment
        if appointment.status != Appointment.AppointmentStatus.PENDING:
            raise serializers.ValidationError("Trạng thái lịch khám không hợp lệ")
        validated_data["tested_by"] = request.user.doctor_profile
        return super().create(
            {**validated_data, "appointment_service": appointment_service}
        )


class AppointmentServiceSerializer(ModelSerializer):
    test_result = TestResultSerializer(read_only=True)

    class Meta:
        model = AppointmentService
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "appointment": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
            "unit_price": {"read_only": True},
        }

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.service_id and instance.service:
            data["service"] = {
                "id": instance.service_id,
                "name": instance.service.name,
            }
        else:
            data["service"] = None

        return data

    def create(self, validated_data):
        appointment = self.context["appointment"]
        service = validated_data["service"]
        quantity = validated_data["quantity"]

        if appointment.status != Appointment.AppointmentStatus.PENDING:
            raise serializers.ValidationError("Trạng thái lịch khám không hợp lệ")
        return AppointmentService.objects.create(
            appointment=appointment,
            service=service,
            quantity=quantity,
            unit_price=service.price,
        )

    def update(self, instance, validated_data):
        appointment = instance.appointment
        service = validated_data.get("service", instance.service)
        quantity = validated_data.get("quantity", instance.quantity)
        active = validated_data.get("active", instance.active)

        if appointment.status != Appointment.AppointmentStatus.PENDING:
            raise serializers.ValidationError("Trạng thái lịch khám không hợp lệ")

        instance.service = service
        instance.quantity = quantity
        instance.unit_price = service.price
        instance.active = active
        instance.save()
        return instance


class DiseaseSerializer(ModelSerializer):
    class Meta:
        model = Disease
        fields = "__all__"


class DetailAppointmentSerializer(ModelSerializer):
    prescriptions = PrescriptionSerializer(
        many=True, read_only=True, source="prescription_set"
    )
    services = AppointmentServiceSerializer(many=True, read_only=True)
    diagnosis = DiseaseSerializer(many=False, read_only=True)

    class Meta:
        model = Appointment
        fields = "__all__"
        extra_kwargs = {"user": {"read_only": True}}


class DetailServiceSerializer(ModelSerializer):
    class Meta:
        model = Service
        fields = "__all__"


class SpecialtySerializer(ModelSerializer):
    class Meta:
        model = Specialty
        fields = "__all__"

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.image:
            data["image"] = instance.image.url
        return data


class PatientProfileSerializer(ModelSerializer):
    user = HiddenField(default=CurrentUserDefault())

    class Meta:
        model = PatientProfile
        fields = [
            "user",
            "gender",
            "dob",
            "weight",
            "height",
            "allergies",
            "chronic_diseases",
            "blood_type",
            "address",
        ]

    def validate_dob(self, value):
        if value >= timezone.localdate():
            raise serializers.ValidationError("Ngày sinh phải trong quá khứ.")
        return value

    def validate(self, attrs):
        input_fields = ["allergies", "chronic_diseases", "address"]
        for field in input_fields:
            if field in attrs and isinstance(attrs[field], str):
                if nh3.is_html(attrs[field]):
                    raise serializers.ValidationError(f"Dữ liệu không hợp lệ")
        return attrs


class DetailPatientProfileSerializer(ModelSerializer):
    class Meta:
        model = PatientProfile
        fields = "__all__"


class SimpleUserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "email", "phone", "avatar", "role"]

    def validate_phone(self, value):
        if not re.match(r"^\d{10}$", value):
            raise serializers.ValidationError("Số điện thoại không hợp lệ")
        return value

    def validate_avatar(self, value):
        if value:
            if not value.content_type.startswith("image/"):
                raise serializers.ValidationError("Định dạng file avatar không hợp lệ")
            if value.size > 10 * 1024 * 1024:
                raise serializers.ValidationError("Ảnh có kích thước quá lớn")
            try:
                img = Image.open(value)
                img.verify()
                value.seek(0)
            except UnidentifiedImageError, AttributeError, Exception:
                raise serializers.ValidationError("File tải lên không phải là ảnh")
        return value

    def validate(self, attrs):
        input_fields = ["first_name", "last_name"]
        for field in input_fields:
            if field in attrs and isinstance(attrs[field], str):
                if nh3.is_html(attrs[field]):
                    raise serializers.ValidationError(f"Dữ liệu không hợp lệ")
        return attrs


class UserSerializer(SimpleUserSerializer):
    class Meta:
        model = SimpleUserSerializer.Meta.model
        fields = SimpleUserSerializer.Meta.fields + ["username", "password"]
        extra_kwargs = {
            "password": {"write_only": True, "required": True},
            "username": {"required": True, "allow_blank": False},
            "first_name": {"required": True, "allow_blank": False},
            "last_name": {"required": True, "allow_blank": False},
            "email": {"required": True, "allow_blank": False},
        }

    def validate(self, attrs):
        attrs = super().validate(attrs)

        if "username" in attrs and isinstance(attrs["username"], str):
            if nh3.is_html(attrs["username"]):
                raise serializers.ValidationError("Dữ liệu không hợp lệ")
        return attrs

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.avatar:
            data["avatar"] = instance.avatar.url
        return data

    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(user.password)
        user.save()
        return user


class ServiceSerializer(ModelSerializer):
    class Meta:
        model = Service
        fields = ["id", "name", "price", "description", "image"]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.image:
            data["image"] = instance.image.url
        return data


class ServicePopularSerializer(ServiceSerializer):
    total = serializers.IntegerField(read_only=True)

    class Meta(ServiceSerializer.Meta):
        fields = ServiceSerializer.Meta.fields + ["total"]


class MedicineCategorySerializer(ModelSerializer):
    class Meta:
        model = MedicineCategory
        fields = "__all__"


class MedicineSerializer(ModelSerializer):
    class Meta:
        model = Medicine
        fields = ["id", "name", "stock", "unit_price"]


class DetailMedicineSerializer(ModelSerializer):
    class Meta:
        model = Medicine
        fields = "__all__"


class DoctorScheduleSerializer(ModelSerializer):
    class Meta:
        model = DoctorSchedule
        fields = "__all__"


class FCMDeviceSerializer(ModelSerializer):
    token = serializers.CharField(max_length=255)

    class Meta:
        model = FCMDevice
        fields = ["token", "device_type"]


class PaymentCheckoutSerializer(serializers.Serializer):
    def validate(self, attrs):
        appointment = self.context["appointment"]
        if appointment.status != Appointment.AppointmentStatus.PENDING:
            raise serializers.ValidationError("Trạng thái lịch khám không hợp lệ")
        return attrs

    def save(self):
        appointment = self.context["appointment"]

        service_total = 0
        for s in appointment.services.filter(active=True):
            service_total += s.quantity * s.unit_price

        prescription_total = 0
        for p in appointment.prescription_set.filter(active=True):
            for d in p.details.filter(active=True):
                prescription_total += d.quantity * d.unit_price

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
        return payment


class PaymentSerializer(ModelSerializer):
    items = serializers.SerializerMethodField()

    class Meta:
        model = Payment
        fields = ["id", "status", "total_amount", "items", "created_at", "updated_at"]

    def get_items(self, payment):
        items = []
        for appointment_service in payment.appointment.services.filter(active=True):
            items.append(
                {
                    "name": appointment_service.service.name,
                    "quantity": appointment_service.quantity,
                    "unit_price": appointment_service.unit_price,
                    "type": "SERVICE",
                }
            )

        for prescription in payment.appointment.prescription_set.filter(active=True):
            for detail in prescription.details.all():
                items.append(
                    {
                        "name": detail.medicine.name,
                        "quantity": detail.quantity,
                        "unit_price": detail.unit_price,
                        "total": detail.quantity * detail.unit_price,
                        "type": "MEDICINE",
                    }
                )

        return items


class ZaloPaySerializer(serializers.Serializer):
    def validate(self, attrs):
        payment = self.context["payment"]
        if payment.status == Payment.PaymentStatus.PAID:
            raise serializers.ValidationError("Hóa đơn đã được thanh toán")
        return attrs

    def save(self):
        payment = self.context["payment"]

        if payment.total_amount == 0:
            payment.status = Payment.PaymentStatus.PAID
            payment.save()
            payment.appointment.prescription_set.filter(active=True).update(
                status=Prescription.PrescriptionStatus.PAID
            )
            return None

        description = f"Thanh toán lịch khám #{payment.appointment.id}"
        res = utils.create_order(
            order_id=payment.id,
            amount=int(payment.total_amount),
            description=description,
        )

        if res.get("return_code") != 1:
            raise Exception("Có lỗi lúc tạo đơn")

        payment.app_trans_id = res["app_trans_id"]
        payment.save()
        return res


class ZaloPayCallbackSerializer(serializers.Serializer):
    def validate(self, attrs):
        valid, data = utils.verify_callback(self.initial_data)
        if not valid:
            raise serializers.ValidationError("Xác thực callback thất bại")
        self._callback_data = data
        return attrs

    @transaction.atomic
    def save(self):
        data = self._callback_data
        app_trans_id = data["app_trans_id"]
        zp_trans_id = data["zp_trans_id"]
        payment_id = app_trans_id.split("_")[-1]

        payment = Payment.objects.select_related("appointment").get(id=payment_id)
        payment.status = Payment.PaymentStatus.PAID
        payment.zp_trans_id = zp_trans_id
        payment.app_trans_id = app_trans_id
        payment.save()

        appointment = payment.appointment
        appointment.status = Appointment.AppointmentStatus.COMPLETED
        appointment.save()
        appointment.prescription_set.filter(active=True).update(
            status=Prescription.PrescriptionStatus.PAID
        )
