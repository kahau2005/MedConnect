from django.db import models
from cloudinary.models import CloudinaryField
from django.contrib.auth.models import AbstractUser


class BaseModel(models.Model):
    class Meta:
        abstract = True

    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class DiseaseCategory(BaseModel):
    name = models.CharField(max_length=100)


class User(AbstractUser, BaseModel):
    class UserRole(models.TextChoices):
        DOCTOR = "DOCTOR", "Bác sĩ"
        PATIENT = "PATIENT", "Bệnh nhân"
        ADMIN = "ADMIN", "Admin"

    date_joined = None
    last_login = None
    is_staff = models.BooleanField(default=False, editable=False)
    role = models.CharField(
        max_length=10, choices=UserRole.choices, default=UserRole.PATIENT
    )
    phone = models.TextField(max_length=10, null=False)
    avatar = CloudinaryField(null=True)

    def __str__(self):
        return self.first_name + self.last_name


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
    image = CloudinaryField(null=True)

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


class DoctorWeeklySchedule(BaseModel):
    doctor = models.ForeignKey(Doctor, on_delete=models.PROTECT)
    start_time = models.DateTimeField(null=False)
    duration = models.IntegerField(default=1)


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
    reason = models.TextField(blank=True, null=True)
    symptoms = models.TextField(blank=True, null=True)
    diagnosis = models.TextField(blank=True, null=True)
    note = models.TextField(blank=True, null=True)


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
    instruction = models.TextField(null=True, choices=Instruction.choices)


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
    status = models.TextField(
        max_length=10, choices=PaymentStatus.choices, default=PaymentStatus.PENDING
    )
    total_amount = models.DecimalField(null=False, max_digits=10, decimal_places=2)
