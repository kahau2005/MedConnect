from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from .models import (
    Specialty,
    User,
    Medicine,
    MedicineCategory,
    PatientProfile,
    DiseaseCategory,
    Disease,
    Appointment,
    Service,
    Doctor,
    DoctorSchedule,
    Prescription,
    PrescriptionDetail,
)
from rest_framework.fields import HiddenField, CurrentUserDefault


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
        extra_kwargs = {"user": {"read_only": True}}
        model = Appointment
        fields = ["id", "user", "doctor", "status", "start"]

    def validate_status(self, value):
        if self.instance:
            if value != Appointment.AppointmentStatus.CANCELED.value:
                raise serializers.ValidationError("Invalid status")
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
