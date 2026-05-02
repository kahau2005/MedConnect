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
    Payment,
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
                    "status": "Thuốc chỉ có thể được kê vào đơn thuốc khi lịch khám ở trạng thái ĐANG KHÁM "
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
                    {"medicine": "Có id thuốc không tồn tại"}
                )

            for item in validated_data:
                medicine_id = item["medicine_id"]
                quantity = item["quantity"]
                medicine = medicine_map.get(medicine_id)

                if not medicine:
                    raise serializers.ValidationError(
                        {"medicine": f"Thuốc #{medicine_id} không tồn tại"}
                    )

                if medicine.stock < quantity:
                    raise serializers.ValidationError(
                        {
                            "quantity": f"Thuốc {medicine.name} không đủ số lượng (chỉ còn {medicine.stock} {medicine.unit} trong kho)."
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
            raise serializers.ValidationError({"medicine": "ID thuốc không hợp lệ"})
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
                    "status": "Thuốc chỉ có thể được cập nhật khi lịch khám ở trạng thái ĐANG KHÁM"
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
                    {"medicine": f"{new_medicine_id} không tồn tại"}
                )

            if new_medicine.stock < new_quantity:
                raise serializers.ValidationError(
                    {
                        "quantity": f"Thuốc {new_medicine.name} không đủ số lượng (chỉ còn {new_medicine.stock} {new_medicine.unit} trong kho)."
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
                    "status": "Đơn thuốc chỉ có thể được tạo khi lịch khám ở trạng thái ĐANG KHÁM"
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
        fields = [
            "id",
            "user",
            "doctor",
            "status",
            "start",
            "reason",
            "symptoms",
            "note",
        ]

    def validate(self, attrs):
        request = self.context.get("request")
        if request and request.user:
            user = request.user

            if not hasattr(user, "patient_profile"):
                raise serializers.ValidationError(
                    {"error": "Vui lòng tạo hồ sơ bệnh nhân trước khi đặt lịch khám"}
                )

        doctor = attrs.get("doctor")
        start = attrs.get("start")
        if start:
            now = timezone.now()
            if start <= now:
                raise serializers.ValidationError(
                    {"start": "Không thể đặt lịch khám ở thời điểm quá khứ"}
                )

        if doctor:
            schedule = doctor.doctorschedule_set.filter(
                start_time__date=start.date()
            ).first()
            if not schedule:
                raise serializers.ValidationError(
                    {
                        "start": "Bác sĩ không làm việc vào ngày đã chọn, vui lòng chọn ngày khác"
                    }
                )

            shift_end_time = schedule.start_time + timedelta(hours=schedule.hours)
            appointment_end_time = start + timedelta(minutes=schedule.duration)
            if start < schedule.start_time or appointment_end_time > shift_end_time:
                raise serializers.ValidationError(
                    {
                        "start": "Thời gian bắt đầu không hợp lệ, vui lòng chọn thời gian trong ca làm việc của bác sĩ"
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
                    {
                        "start": "Thời gian đã có lịch khám khác, vui lòng chọn thời gian khác"
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
                Appointment.AppointmentStatus.SCHEDULED.value,
                Appointment.AppointmentStatus.PENDING.value,
            ):
                raise serializers.ValidationError(
                    "Chỉ có thể cập nhật trạng thái khi lịch khám ở trạng thái ĐÃ ĐẶT LỊCH hoặc ĐANG KHÁM"
                )
            if value not in (
                Appointment.AppointmentStatus.PENDING.value,
                Appointment.AppointmentStatus.COMPLETED.value,
                Appointment.AppointmentStatus.CANCELED.value,
            ):
                raise serializers.ValidationError("Trạng thái cập nhật không hợp lệ")
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
                    "status": "Kết quả xét nghiệm chỉ có thể được tạo khi lịch khám ở trạng thái ĐANG KHÁM"
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
                    "status": "Dịch vụ chỉ có thể được thêm vào lịch khám khi lịch khám ở trạng thái ĐANG KHÁM"
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
                    "status": "Dịch vụ chỉ có thể được cập nhật khi lịch khám ở trạng thái ĐANG KHÁM"
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
    specialty_id = serializers.IntegerField(source="doctor__specialty_id")
    specialty_name = serializers.CharField(source="doctor__specialty__name")
    total = serializers.IntegerField()


class ReportPatientSerializer(serializers.Serializer):
    age_groups = PatientAgeGroupSerializer(many=True)
    genders = PatientGenderSerializer(many=True)
    specialties = PatientSpecialtySerializer(many=True)


class ServiceUsageSerializer(serializers.Serializer):
    service_id = serializers.IntegerField()
    service_name = serializers.CharField(source="service__name")
    total_quantity = serializers.IntegerField()
    total_appointments = serializers.IntegerField()


class ReportServiceSerializer(serializers.Serializer):
    services = ServiceUsageSerializer(many=True)


class DiseaseStatsSerializer(serializers.Serializer):
    disease_id = serializers.IntegerField(source="diagnosis_id")
    disease_name = serializers.CharField(source="diagnosis__name")
    total_appointments = serializers.IntegerField()


class ReportDiseaseListSerializer(serializers.ListSerializer):
    def to_representation(self, data):
        grouped_data = {}

        for row in data:
            cat_id = row["diagnosis__disease_category__id"]

            if cat_id not in grouped_data:
                grouped_data[cat_id] = {
                    "id": cat_id,
                    "category_name": row["diagnosis__disease_category__name"],
                    "total_appointments": 0,
                    "diseases": [],
                }

            grouped_data[cat_id]["diseases"].append(row)

            grouped_data[cat_id]["total_appointments"] += row["total_appointments"]

        return super().to_representation(grouped_data.values())


class ReportDiseaseSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    category_name = serializers.CharField()
    total_cases = serializers.IntegerField(source="total_appointments")
    diseases = DiseaseStatsSerializer(many=True)

    class Meta:
        list_serializer_class = ReportDiseaseListSerializer


class PaymentReceiptSerializer(ModelSerializer):
    items = serializers.SerializerMethodField()

    class Meta:
        model = Payment
        fields = ["id", "status", "total_amount", "items", "created_at", "updated_at"]

    def get_items(self, obj):
        items = []
        for appointment_service in obj.appointment.services.all():
            items.append(
                {
                    "name": appointment_service.service.name,
                    "quantity": appointment_service.quantity,
                    "unit_price": appointment_service.unit_price,
                    "type": "SERVICE",
                }
            )

        for prescription in obj.appointment.prescription_set.all():
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
