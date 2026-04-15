from cloudinary.models import CloudinaryField
from django.contrib.auth.models import AbstractUser
from django.db import models


class BaseModel(models.Model):
    class Meta:
        abstract = True

    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class User(AbstractUser, BaseModel):
    class UserRole(models.TextChoices):
        DOCTOR = "DOCTOR", "Bác sĩ"
        PATIENT = "PATIENT", "Bệnh nhân"
        ADMIN = "ADMIN", "Admin"

    active = None
    date_joined = None
    last_login = None
    is_staff = models.BooleanField(default=False, editable=False)
    role = models.CharField(
        max_length=20, choices=UserRole.choices, default=UserRole.PATIENT
    )
    phone = models.TextField(max_length=10, null=False)
    avatar = CloudinaryField(null=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class PatientProfile(BaseModel):
    class Gender(models.TextChoices):
        MALE = "MALE", "Nam"
        FEMALE = "FEMALE", "Nữ"

    class BloodType(models.TextChoices):
        A = "A", "A"
        B = "B", "B"
        AB = "AB", "AB"
        O = "O", "O"

    user = models.OneToOneField(User, on_delete=models.PROTECT, primary_key=True)
    gender = models.CharField(max_length=10, choices=Gender.choices)
    dob = models.DateField(null=False)
    weight = models.FloatField(null=False)
    height = models.IntegerField(null=False)
    allergies = models.TextField(null=True)
    chronic_diseases = models.TextField(null=True)
    blood_type = models.CharField(max_length=2, choices=BloodType.choices, null=True)
    address = models.TextField(null=True)


class Specialty(BaseModel):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    image = CloudinaryField(
        null=True, default="Pngtree_doctor_check_the_eye_health_5315645_y7jg2j.png"
    )

    def __str__(self):
        return self.name


class Doctor(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.PROTECT, primary_key=True, related_name="doctor_profile"
    )
    specialty = models.ForeignKey(Specialty, on_delete=models.PROTECT)
    background = models.TextField(null=True)

    def __str__(self):
        return f"Bác sĩ {self.user.first_name} {self.user.last_name}"


class DoctorSchedule(BaseModel):
    doctor = models.ForeignKey(Doctor, on_delete=models.PROTECT)
    start_time = models.DateTimeField(null=False)
    hours = models.IntegerField(default=1)
    duration = models.IntegerField(default=15)


class DiseaseCategory(BaseModel):
    name = models.CharField(max_length=100)


class Disease(BaseModel):
    name = models.CharField(max_length=100)
    disease_category = models.ForeignKey(DiseaseCategory, on_delete=models.PROTECT)

    def __str__(self):
        return self.name


class Appointment(BaseModel):
    class AppointmentStatus(models.TextChoices):
        SCHEDULED = "SCHEDULED", "Đã đặt lịch"
        COMPLETED = "COMPLETED", "Đã khám"
        CANCELED = "CANCELED", "Đã hủy"

    user = models.ForeignKey(User, on_delete=models.PROTECT)
    doctor = models.ForeignKey(
        Doctor, on_delete=models.PROTECT, related_name="doctor_appointments"
    )
    status = models.CharField(
        max_length=20,
        choices=AppointmentStatus.choices,
        default=AppointmentStatus.SCHEDULED,
    )
    start = models.DateTimeField()
    reason = models.TextField(null=True, blank=True)
    symptoms = models.TextField(null=True, blank=True)
    diagnosis = models.ForeignKey(Disease, on_delete=models.PROTECT, default=6)
    note = models.TextField(blank=True, null=True)
    active_start = models.DateTimeField(null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["doctor", "active_start"],
                name="unique_appointment_doctor_active_start",
            ),
            models.UniqueConstraint(
                fields=["user", "active_start"],
                name="unique_appointment_user_active_start",
            ),
        ]

    def save(self, *args, **kwargs):
        if self.status == Appointment.AppointmentStatus.CANCELED:
            self.active_start = None
            self.active = False
        else:
            self.active_start = self.start
        super().save(*args, **kwargs)


class Prescription(BaseModel):
    class PrescriptionStatus(models.TextChoices):
        PENDING = "PENDING", "Chờ xử lý"
        PAID = "PAID", "Đã thanh toán"
        DISPENSED = "DISPENSED", "Đã phát thuốc"

    appointment = models.ForeignKey(Appointment, on_delete=models.PROTECT)
    status = models.CharField(
        max_length=20,
        choices=PrescriptionStatus.choices,
        default=PrescriptionStatus.PENDING,
    )


class PrescriptionDetail(BaseModel):
    class Instruction(models.TextChoices):
        BEFORE_MEAL = "BEFORE_MEAL", "Trước bữa ăn"
        AFTER_MEAL = "AFTER_MEAL", "Sau bữa ăn"

    prescription = models.ForeignKey(
        Prescription, on_delete=models.PROTECT, related_name="details"
    )
    medicine = models.ForeignKey("Medicine", on_delete=models.PROTECT, null=True)
    quantity = models.IntegerField()
    dose = models.IntegerField(null=False, default=1)
    frequency = models.IntegerField(null=False, default=1)
    duration_day = models.IntegerField(null=False, default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    instruction = models.CharField(
        null=True, max_length=20, choices=Instruction.choices
    )


class MedicineCategory(BaseModel):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Medicine(BaseModel):
    name = models.CharField(max_length=100)
    category = models.ForeignKey(MedicineCategory, on_delete=models.PROTECT)
    stock = models.IntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=50)
    expired = models.DateField()

    def __str__(self):
        return self.name


class Service(BaseModel):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


class AppointmentService(BaseModel):
    appointment = models.ForeignKey(
        Appointment, on_delete=models.PROTECT, related_name="services"
    )
    service = models.ForeignKey(Service, on_delete=models.PROTECT)
    quantity = models.IntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)


class Payment(BaseModel):
    class PaymentStatus(models.TextChoices):
        PENDING = "PENDING", "Đang đợi thanh toán"
        PAID = "PAID", "Đã thanh toán"

    appointment = models.OneToOneField(
        Appointment, on_delete=models.PROTECT, related_name="payment"
    )
    status = models.CharField(
        max_length=10, choices=PaymentStatus.choices, default=PaymentStatus.PENDING
    )
    total_amount = models.DecimalField(null=False, max_digits=10, decimal_places=2)


class ChatRoom(BaseModel):
    appointment = models.OneToOneField(
        Appointment, on_delete=models.PROTECT, related_name="chat_room"
    )

    def __str__(self):
        return f"Phòng chat của lịch khám {self.appointment.id}"


class VideoCallLog(BaseModel):
    class CallStatus(models.TextChoices):
        CONNTECTED = "CONNTECTED", "Đã kết nối"
        COMPLETED = "COMPLETED", "Đã kết thúc"
        MISSED = "MISSED", "Gọi nhỡ"
        REJECTED = "REJECTED", "Đã từ chối"
        FAILED = "FAILED", "Đã thất bại"

    room = models.ForeignKey(
        ChatRoom, on_delete=models.PROTECT, related_name="video_calls"
    )
    caller = models.ForeignKey(
        User, on_delete=models.PROTECT, related_name="outgoing_calls"
    )
    receiver = models.ForeignKey(
        User, on_delete=models.PROTECT, related_name="incoming_calls"
    )
    start = models.DateTimeField(null=False)
    end = models.DateTimeField(null=True, blank=True)
