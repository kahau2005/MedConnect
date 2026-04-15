from datetime import timedelta

from rest_framework import serializers
from rest_framework.fields import CurrentUserDefault, HiddenField
from rest_framework.serializers import ModelSerializer

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


class PrescriptionSerializer(ModelSerializer):
    class Meta:
        model = Prescription
        fields = "__all__"
        read_only_fields = [
            "id",
            "appointment",
            "active",
            "created_at",
            "updated_at",
        ]


class PrescriptionDetailSerializer(ModelSerializer):
    class Meta:
        model = PrescriptionDetail
        fields = "__all__"
        extra_kwargs = {
            "prescription": {"read_only": True},
        }


class AppointmentSerializer(ModelSerializer):
    class Meta:
        extra_kwargs = {
            "user": {"read_only": True},
            "status": {"read_only": True},
        }
        model = Appointment
        fields = ["id", "user", "doctor", "status", "start"]

    def validate(self, attrs):
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
            "user": {"read_only": True},
            "doctor": {"read_only": True},
            "start": {"read_only": True},
            "status": {"read_only": False},
        }

    def validate_status(self, value):
        if self.instance:
            if self.instance.status != Appointment.AppointmentStatus.SCHEDULED:
                raise serializers.ValidationError(
                    "Chỉ có thể cập nhật lịch khám ở trạng thái SCHEDULED"
                )
            if value != Appointment.AppointmentStatus.CANCELED:
                raise serializers.ValidationError(
                    "Chỉ được chuyển sang trạng thái CANCELED"
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


class MedicineSerializer(ModelSerializer):
    class Meta:
        model = Medicine
        fields = ["id", "name", "stock", "unit_price"]


class DetailMedicineSerializer(ModelSerializer):
    class Meta:
        model = Medicine
        fields = "__all__"


class MedicineCategorySerializer(ModelSerializer):
    class Meta:
        model = MedicineCategory
        fields = "__all__"


class DoctorSerializer(ModelSerializer):
    first_name = serializers.CharField(source="user.first_name", read_only=True)
    last_name = serializers.CharField(source="user.last_name", read_only=True)
    avatar = serializers.ImageField(source="user.avatar", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Doctor
        fields = ["user_id", "first_name", "last_name", "email", "avatar"]


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
    by_age_groups = PatientAgeGroupSerializer(many=True)
    by_genders = PatientGenderSerializer(many=True)
    by_specialties = PatientSpecialtySerializer(many=True)
