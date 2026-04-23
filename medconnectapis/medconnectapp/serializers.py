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
        appointment = prescription.appointment
        if appointment.status != Appointment.AppointmentStatus.PENDING:
            raise serializers.ValidationError(
                {
                    "status": "Medicines can only be prescribed when the appointment is in PENDING status"
                }
            )

        medicine_ids = [
            item["medicine_id"] for item in validated_data if "medicine_id" in item
        ]

        details = []

        with transaction.atomic():
            medicines = Medicine.objects.filter(id__in=medicine_ids).select_for_update()
            medicine_map = {medicine.id: medicine for medicine in medicines}

            if len(medicine_map) != len(set(medicine_ids)):
                raise serializers.ValidationError(
                    {"medicine": "There are some medicine IDs that do not exist"}
                )

            for item in validated_data:
                medicine_id = item["medicine_id"]
                quantity = item["quantity"]
                medicine = medicine_map.get(medicine_id)

                if not medicine:
                    raise serializers.ValidationError(
                        {"medicine": f"Medicine #{medicine_id} does not exist"}
                    )

                if medicine.stock < quantity:
                    raise serializers.ValidationError(
                        {
                            "quantity": f"{medicine.name} does not have enough stock (only {medicine.stock} {medicine.unit} left)."
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


class PrescriptionDetailMedicineSerializer(ModelSerializer):
    class Meta:
        model = Medicine
        fields = ["id", "name"]


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
        list_serializer_class = PrescriptionDetailListSerializer

    def to_internal_value(self, data):
        obj = super().to_internal_value(data)
        medicine_val = data.get("medicine", serializers.empty)
        try:
            medicine_id = int(medicine_val)
        except TypeError, ValueError:
            raise serializers.ValidationError({"medicine": "Invalid medicine ID"})
        obj["medicine_id"] = medicine_id
        return obj

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.medicine_id and instance.medicine:
            data["medicine"] = {
                "id": instance.medicine_id,
                "name": instance.medicine.name,
            }
        else:
            data["medicine"] = None

        return data

    @transaction.atomic
    def update(self, instance, validated_data):
        appointment = instance.prescription.appointment
        if appointment.status != Appointment.AppointmentStatus.PENDING:
            raise serializers.ValidationError(
                {
                    "status": "Prescribed medicines can only be updated when the appointment is in PENDING status"
                }
            )

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
                    {"medicine": f"{new_medicine_id} not found"}
                )

            if new_medicine.stock < new_quantity:
                raise serializers.ValidationError(
                    {
                        "quantity": f"{new_medicine.name} does not have enough stock (only {new_medicine.stock} {new_medicine.unit} left)."
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

    def validate(self, attrs):
        appointment = self.context.get("appointment")
        if appointment and appointment.status != Appointment.AppointmentStatus.PENDING:
            raise serializers.ValidationError(
                {
                    "status": "Prescription can only be added when the appointment is in PENDING status"
                }
            )
        return attrs


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

            if not hasattr(user, "patient_profile"):
                raise serializers.ValidationError(
                    {
                        "error": "Please complete your patient profile before booking an appointment."
                    }
                )

        doctor = attrs.get("doctor")
        start = attrs.get("start")
        if start:
            now = timezone.now()
            if start <= now:
                raise serializers.ValidationError(
                    {"start": "Can not book an appointment in the past"}
                )

        if doctor:
            schedule = doctor.doctorschedule_set.filter(
                start_time__date=start.date()
            ).first()
            if not schedule:
                raise serializers.ValidationError(
                    {
                        "start": "The doctor does not have a schedule on the selected date."
                    }
                )

            shift_end_time = schedule.start_time + timedelta(hours=schedule.hours)
            appointment_end_time = start + timedelta(minutes=schedule.duration)
            if start < schedule.start_time or appointment_end_time > shift_end_time:
                raise serializers.ValidationError(
                    {"start": "The selected time is outside the doctor working hours"}
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
                    {
                        "start": "The doctor already has an appointment at the selected time"
                    }
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
            if self.instance.status not in (
                Appointment.AppointmentStatus.SCHEDULED,
                Appointment.AppointmentStatus.PENDING,
            ):
                raise serializers.ValidationError(
                    {
                        "status": "Only appointments with status SCHEDULED or PENDING can be updated"
                    }
                )
            if value not in (
                Appointment.AppointmentStatus.PENDING.value,
                Appointment.AppointmentStatus.COMPLETED.value,
                Appointment.AppointmentStatus.CANCELED.value,
            ):
                raise serializers.ValidationError({"status": "Invalid status update"})
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

    def create(self, validated_data):
        request = self.context["request"]
        appointment_service = self.context["appointment_service"]
        appointment = appointment_service.appointment
        if appointment.status != Appointment.AppointmentStatus.PENDING:
            raise serializers.ValidationError(
                {
                    "status": "Test result can only be added to the appointment in PENDING status"
                }
            )
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
            raise serializers.ValidationError(
                {
                    "status": "Services can only be added when the appointment in PENDING status"
                }
            )
        return AppointmentService.objects.create(
            appointment=appointment,
            service=service,
            quantity=quantity,
            unit_price=service.price,
        )

    def update(self, instance, validated_data):
        appointment = self.context["appointment"]
        service = validated_data.get("service", instance.service)
        quantity = validated_data.get("quantity", instance.quantity)
        active = validated_data.get("active", instance.active)

        if appointment.status != Appointment.AppointmentStatus.PENDING:
            raise serializers.ValidationError(
                {
                    "status": "Services can only be updated when the appointment in PENDING status"
                }
            )

        instance.service = service
        instance.quantity = quantity
        instance.unit_price = service.price
        instance.active = active
        instance.save()
        return instance


class DiseaseCategorySerializer(ModelSerializer):
    class Meta:
        model = DiseaseCategory
        fields = "__all__"


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
