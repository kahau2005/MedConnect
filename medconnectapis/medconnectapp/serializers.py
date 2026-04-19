from datetime import timedelta

from django.db import transaction
from django.utils import timezone
from rest_framework import serializers
from rest_framework.fields import CurrentUserDefault, HiddenField
from rest_framework.serializers import ListSerializer, ModelSerializer

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


class PrescriptionDetailListSerializer(ListSerializer):
    class Meta:
        model = PrescriptionDetail
        fields = "__all__"
        extra_kwargs = {
            "prescription": {"read_only": True},
            "unit_price": {"read_only": True},
        }

    def create(self, validated_data):
        prescription = self.context["prescription"]

        medicine_ids = [
            item["medicine_id"] for item in validated_data if "medicine_id" in item
        ]

        details = []

        with transaction.atomic():
            medicines = Medicine.objects.filter(id__in=medicine_ids).select_for_update()
            medicine_map = {medicine.id: medicine for medicine in medicines}

            if len(medicine_map) != len(set(medicine_ids)):
                raise serializers.ValidationError(
                    {"medicine": "Có id thuốc không tồn tại"}
                )

            for item in validated_data:
                medicine_id = item["medicine_id"]
                quantity = item["quantity"]
                medicine = medicine_map.get[medicine_id]

                if not medicine:
                    raise serializers.ValidationError(
                        {"medicine": f"Không tìm thấy thuốc #{medicine_id}"}
                    )

                if medicine.stock < quantity:
                    raise serializers.ValidationError(
                        {
                            "quantity": f"Thuốc {medicine.name} không đủ số lượng (chỉ còn {medicine.stock} {medicine.unit})."
                        }
                    )

                medicine.stock -= quantity

                detail = PrescriptionDetail.objects.create(
                    prescription=prescription,
                    medicine_id=medicine_id,
                    unit_price=medicine.unit_price,
                    quantity=quantity,
                    dose=item["dose"],
                    frequency=item["frequency"],
                    duration_day=item["duration_day"],
                    instruction=item["instruction"],
                )
                details.append(detail)

            Medicine.objects.bulk_update(medicine_map.values(), ["stock"])
        return details


class PrescriptionDetailSerializer(ModelSerializer):
    medicine = serializers.IntegerField(source="medicine_id")
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
        list_serializer_class = PrescriptionDetailListSerializer

    @transaction.atomic
    def update(self, instance, validated_data):
        old_medicine_id = instance.medicine_id
        old_quantity = instance.quantity
        new_medicine_id = validated_data.get("medicine_id", old_medicine_id)
        new_quantity = validated_data.get("quantity", old_quantity)

        if new_medicine_id != old_medicine_id or new_quantity != old_quantity:
            medicines_to_lock = list(
                set([m for m in [old_medicine_id, new_medicine_id] if m])
            )
            medicines = Medicine.objects.filter(
                id__in=medicines_to_lock
            ).select_for_update()
            medicine_map = {m.id: m for m in medicines}

            old_medicine = medicine_map.get(old_medicine_id)
            new_medicine = medicine_map.get(new_medicine_id)

            if not new_medicine:
                raise serializers.ValidationError(
                    {"medicine": f"Không tìm thấy thuốc #{new_medicine_id}"}
                )

            if new_medicine.stock < new_quantity:
                raise serializers.ValidationError(
                    {
                        "quantity": f"Thuốc {new_medicine.name} không đủ tồn kho (chỉ còn {new_medicine.stock} {new_medicine.unit})."
                    }
                )
            if old_medicine:
                old_medicine.stock += old_quantity

            new_medicine.stock -= new_quantity
            validated_data["unit_price"] = new_medicine.unit_price

            medicines_to_update = [m for m in [old_medicine, new_medicine] if m]
            if medicines_to_update:
                Medicine.objects.bulk_update(medicines_to_update, ["stock"])

        return super().update(instance, validated_data)


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


class AppointmentSerializer(ModelSerializer):
    class Meta:
        extra_kwargs = {
            "id": {"read_only": True},
            "user": {"read_only": True},
            "status": {"read_only": True},
            "active": {"read_only": True},
        }
        model = Appointment
        fields = ["id", "user", "doctor", "status", "start"]

    def validate(self, attrs):
        request = self.context.get("request")
        if request and request.user:
            user = request.user

            if user and user.role == User.UserRole.PATIENT:
                if not hasattr(user, "patient_profile"):
                    raise serializers.ValidationError(
                        {"err_msg": "Bạn cần cập nhật hồ sơ y tế trước khi đặt lịch"}
                    )

        doctor = attrs.get("doctor")
        start = attrs.get("start")
        if start:
            now = timezone.now()
            if start <= now:
                raise serializers.ValidationError(
                    {"start": "Không được phép đặt lịch ở quá khứ"}
                )

        if doctor:
            schedule = doctor.doctorschedule_set.filter(
                start_time__date=start.date()
            ).first()
            if not schedule:
                raise serializers.ValidationError(
                    {"start": "Bác sĩ không có ca làm việc vào ngày này"}
                )

            shift_end_time = schedule.start_time + timedelta(hours=schedule.hours)
            appointment_end_time = start + timedelta(minutes=schedule.duration)
            if start < schedule.start_time or appointment_end_time > shift_end_time:
                raise serializers.ValidationError(
                    {
                        "start": "Thời gian đặt lịch không nằm trong khung giờ làm việc của bác sĩ."
                    }
                )

            is_overlapping = Appointment.objects.filter(
                doctor=doctor,
                active=True,
                status=Appointment.AppointmentStatus.SCHEDULED,
                start__lt=appointment_end_time,
                start__gt=start - timedelta(minutes=schedule.duration),
            )
            if is_overlapping.exists():
                raise serializers.ValidationError(
                    {"start": "Khung giờ bạn tính đặt đã có người khác đặt trước"}
                )
        return attrs


class AppointmentUpdateSerializer(AppointmentSerializer):
    class Meta(AppointmentSerializer.Meta):
        extra_kwargs = {
            "id": {"read_only": True},
            "user": {"read_only": True},
            "doctor": {"read_only": True},
            "start": {"read_only": True},
            "active": {"read_only": True},
            "status": {"read_only": False},
        }

    def validate_status(self, value):
        if self.instance:
            if self.instance.status != Appointment.AppointmentStatus.SCHEDULED:
                raise serializers.ValidationError(
                    {"status": "Chỉ có thể cập nhật lịch khám ở trạng thái SCHEDULED"}
                )
            if (
                value != Appointment.AppointmentStatus.CANCELED
                or value != Appointment.AppointmentStatus.COMPLETED
            ):
                raise serializers.ValidationError(
                    {"status": "Cập nhật trạng thái không hợp lệ"}
                )
        return value


class DetailAppointmentSerializer(ModelSerializer):
    class Meta:
        model = Appointment
        fields = "__all__"
        extra_kwargs = {"user": {"read_only": True}}


class AppointmentServiceSerializer(ModelSerializer):
    class Meta:
        model = AppointmentService
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "appointment": {"read_only": True},
            "active": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
            "unit_price": {"read_only": True},
        }

    def create(self, validated_data):
        appointment = self.context["appointment"]
        service = validated_data["service"]
        quantity = validated_data["quantity"]

        return AppointmentService.objects.create(
            appointment=appointment,
            service=service,
            quantity=quantity,
            unit_price=service.price,
        )

    def update(self, instance, validated_data):
        service = validated_data.get("service", instance.service)
        quantity = validated_data.get("quantity", instance.quantity)

        instance.service = service
        instance.quantity = quantity
        instance.unit_price = service.price
        instance.save()
        return instance


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

    def create(self, validated_data):
        request = self.context["request"]
        validated_data["tested_by"] = request.user.doctor_profile
        return super().create(validated_data)


class DiseaseCategorySerializer(ModelSerializer):
    class Meta:
        model = DiseaseCategory
        fields = "__all__"


class DiseaseSerializer(ModelSerializer):
    class Meta:
        model = Disease
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


class DetailPatientProfileSerializer(ModelSerializer):
    class Meta:
        model = PatientProfile
        fields = "__all__"


class SimpleUserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "email", "phone", "avatar"]


class UserSerializer(SimpleUserSerializer):
    class Meta:
        model = SimpleUserSerializer.Meta.model
        fields = SimpleUserSerializer.Meta.fields + ["username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

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
        fields = ["name", "price", "description"]


class DetailServiceSerializer(ModelSerializer):
    class Meta:
        model = Service
        fields = "__all__"


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


class DoctorSerializer(ModelSerializer):
    class Meta:
        model = Doctor
        fields = ["user_id", "background", "specialty_id"]

    def to_representation(self, instance):
        data = super().to_representation(instance)

        user = instance.user
        data["id"] = instance.user_id
        data["first_name"] = user.first_name
        data["last_name"] = user.last_name
        data["email"] = user.email
        data["avatar"] = user.avatar.url if user and user.avatar else None
        return data


class DoctorScheduleSerializer(ModelSerializer):
    class Meta:
        model = DoctorSchedule
        fields = "__all__"


class PatientAgeGroupSerializer(serializers.Serializer):
    age_group = serializers.CharField()
    total = serializers.IntegerField()


class PatientGenderSerializer(serializers.Serializer):
    gender = serializers.CharField()
    total = serializers.IntegerField()


class PatientSpecialtySerializer(serializers.Serializer):
    specialty_id = serializers.IntegerField()
    specialty_name = serializers.CharField()
    total = serializers.IntegerField()


class ReportPatientSerializer(serializers.Serializer):
    age_groups = PatientAgeGroupSerializer(many=True)
    genders = PatientGenderSerializer(many=True)
    specialties = PatientSpecialtySerializer(many=True)
