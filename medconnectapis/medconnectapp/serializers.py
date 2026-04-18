from datetime import timedelta

from django.db import transaction
from rest_framework import serializers
from rest_framework.fields import CurrentUserDefault, HiddenField
from rest_framework.serializers import ListSerializer, ModelSerializer

from .models import (
    Appointment,
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
    User,
)


class PrescriptionDetailListSerializer(serializers.ListSerializer):
    class Meta:
        model = PrescriptionDetail
        fields = "__all__"
        extra_kwargs = {
            "prescription": {"read_only": True},
            "unit_price": {"read_only": True},
        }

    def create(self, validated_data):
        prescription = self.context.get("prescription")

        medicine_ids = [
            item.get("medicine_id") for item in validated_data if "medicine_id" in item
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
                medicine_id = item.get("medicine_id")
                quantity = item.get("quantity", 1)
                medicine = medicine_map.get(medicine_id)

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
                    dose=item.get("dose", 1),
                    frequency=item.get("frequency", 1),
                    duration_day=item.get("duration_day", 1),
                    instruction=item.get("instruction"),
                )
                details.append(detail)

            Medicine.objects.bulk_update(medicine_map.values(), ["stock"])
        return details


class PrescriptionDetailSerializer(ModelSerializer):
    medicine = serializers.IntegerField(source="medicine_id")
    id = serializers.IntegerField(required=False)

    class Meta:
        model = PrescriptionDetail
        fields = "__all__"
        extra_kwargs = {
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
            meds_to_lock = list(
                set([m for m in [old_medicine_id, new_medicine_id] if m])
            )
            medicines = Medicine.objects.filter(id__in=meds_to_lock).select_for_update()
            med_map = {m.id: m for m in medicines}

            old_med = med_map.get(old_medicine_id)
            new_med = med_map.get(new_medicine_id)

            if not new_med:
                raise serializers.ValidationError(
                    {"medicine": f"Không tìm thấy thuốc #{new_medicine_id}"}
                )

            if old_med:
                old_med.stock += old_quantity

            if new_med.stock < new_quantity:
                raise serializers.ValidationError(
                    {
                        "quantity": f"Thuốc '{new_med.name}' không đủ tồn kho (chỉ còn {new_med.stock} {new_med.unit})."
                    }
                )

            new_med.stock -= new_quantity

            if old_med and old_med.id != new_med.id:
                old_med.save()
            new_med.save()

            validated_data["unit_price"] = new_med.unit_price
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
        if doctor and start:
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
            if value != Appointment.AppointmentStatus.CANCELED:
                raise serializers.ValidationError(
                    {"status": "Chỉ được chuyển sang trạng thái CANCELED"}
                )
        return value


class DetailAppointmentSerializer(ModelSerializer):
    class Meta:
        extra_kwargs = {"user": {"read_only": True}}
        model = Appointment
        fields = "__all__"


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
    first_name = serializers.CharField(source="user.first_name", read_only=True)
    last_name = serializers.CharField(source="user.last_name", read_only=True)
    avatar = serializers.ImageField(source="user.avatar", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Doctor
        fields = ["user_id", "first_name", "last_name", "email", "avatar", "background"]


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
