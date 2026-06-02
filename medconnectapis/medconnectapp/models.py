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
        DOCTOR = "DOCTOR"
        PATIENT = "PATIENT"
        ADMIN = "ADMIN"

    active = None
    date_joined = None
    last_login = None
    is_staff = models.BooleanField(default=False, editable=False)
    role = models.CharField(
        max_length=20, choices=UserRole.choices, default=UserRole.PATIENT
    )
    phone = models.CharField(max_length=10, null=False)
    avatar = CloudinaryField(default="d4outkeghzi4x3tsuclc.jpg")

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class PatientProfile(BaseModel):
    class Gender(models.TextChoices):
        MALE = "MALE"
        FEMALE = "FEMALE"

    class BloodType(models.TextChoices):
        A = "A"
        B = "B"
        AB = "AB"
        O = "O"

    user = models.OneToOneField(
        User, on_delete=models.PROTECT, primary_key=True, related_name="patient_profile"
    )
    gender = models.CharField(max_length=10, choices=Gender.choices)
    dob = models.DateField(null=False)
    weight = models.FloatField(null=False)
    height = models.IntegerField(null=False)
    allergies = models.TextField(null=True, blank=True)
    chronic_diseases = models.TextField(null=True, blank=True)
    blood_type = models.CharField(max_length=2, choices=BloodType.choices, null=True)
    address = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"


class Specialty(BaseModel):
    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
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
    background = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"Bác sĩ {self.user.first_name} {self.user.last_name}"


class DoctorSchedule(BaseModel):
    doctor = models.ForeignKey(Doctor, on_delete=models.PROTECT)
    start_time = models.DateTimeField(null=False)
    hours = models.IntegerField(default=1)
    duration = models.IntegerField(default=15)


class Disease(BaseModel):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Appointment(BaseModel):
    class AppointmentStatus(models.TextChoices):
        SCHEDULED = "SCHEDULED"
        PENDING = "PENDING"
        COMPLETED = "COMPLETED"
        CANCELED = "CANCELED"

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
    diagnosis = models.ForeignKey(Disease, on_delete=models.PROTECT, default=1)


class Review(BaseModel):
    appointment = models.OneToOneField(
        Appointment, on_delete=models.PROTECT, related_name="review"
    )
    rating = models.IntegerField(null=False)
    comment = models.TextField(null=True, blank=True)


class Prescription(BaseModel):
    class PrescriptionStatus(models.TextChoices):
        PENDING = "PENDING"
        PAID = "PAID"
        DISPENSED = "DISPENSED"

    appointment = models.ForeignKey(Appointment, on_delete=models.PROTECT)
    status = models.CharField(
        max_length=20,
        choices=PrescriptionStatus.choices,
        default=PrescriptionStatus.PENDING,
    )


class PrescriptionDetail(BaseModel):
    class Instruction(models.TextChoices):
        BEFORE_MEAL = "BEFORE_MEAL"
        AFTER_MEAL = "AFTER_MEAL"

    prescription = models.ForeignKey(
        Prescription, on_delete=models.PROTECT, related_name="details"
    )
    medicine = models.ForeignKey("Medicine", on_delete=models.PROTECT, default=1)
    quantity = models.IntegerField(null=False, default=1)
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
    category = models.ForeignKey(
        MedicineCategory, on_delete=models.PROTECT, related_name="medicines", default=1
    )
    stock = models.IntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=50)
    expired = models.DateField()

    def __str__(self):
        return self.name


class Service(BaseModel):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(null=True, blank=True)
    image = CloudinaryField(default="Orthopedic-pana_feiopk.png")

    def __str__(self):
        return self.name


class AppointmentService(BaseModel):
    appointment = models.ForeignKey(
        Appointment, on_delete=models.PROTECT, related_name="services"
    )
    service = models.ForeignKey(Service, on_delete=models.PROTECT)
    quantity = models.IntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)


class TestResult(BaseModel):
    class ResultType(models.TextChoices):
        BLOOD = "BLOOD"
        URINE = "URINE"
        XRAY = "XRAY"
        ULTRASOUND = "ULTRASOUND"
        OTHER = "OTHER"

    appointment_service = models.OneToOneField(
        AppointmentService, on_delete=models.PROTECT, related_name="test_result"
    )
    result_type = models.CharField(
        max_length=20, choices=ResultType.choices, default=ResultType.OTHER
    )
    tested_by = models.ForeignKey(
        Doctor, on_delete=models.PROTECT, related_name="test_results"
    )
    result_data = models.JSONField(null=True, blank=True)
    conclusion = models.TextField(null=True, blank=True)


class Payment(BaseModel):
    class PaymentStatus(models.TextChoices):
        PENDING = "PENDING"
        PAID = "PAID"
        FAILED = "FAILED"

    appointment = models.OneToOneField(
        Appointment, on_delete=models.PROTECT, related_name="payment"
    )
    status = models.CharField(
        max_length=10, choices=PaymentStatus.choices, default=PaymentStatus.PENDING
    )
    total_amount = models.DecimalField(null=False, max_digits=10, decimal_places=2)
    app_trans_id = models.CharField(max_length=255, null=True, blank=True, unique=True)
    zp_trans_id = models.CharField(max_length=255, null=True, blank=True)


class FCMDevice(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="fcm_devices")
    token = models.CharField(max_length=255, unique=True)
    device_type = models.CharField(max_length=20, null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.device_type}"


class MedicineAlert(BaseModel):
    class AlertType(models.TextChoices):
        LOW_STOCK = "LOW_STOCK"
        EXPIRING = "EXPIRING"

    medicine = models.ForeignKey(
        Medicine, on_delete=models.CASCADE, related_name="alerts"
    )
    alert_type = models.CharField(max_length=20, choices=AlertType)
    message = models.TextField()

    def __str__(self):
        return f"{self.get_alert_type_display()} - {self.medicine.name}"
