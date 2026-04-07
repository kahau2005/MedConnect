from django.contrib.auth.base_user import AbstractBaseUser
from django.db import models
from cloudinary.models import CloudinaryField
from django.contrib.auth.models import AbstractUser


class UserRole(models.TextChoices):
    DOCTOR = "DOC", "Doctor"
    PATIENT = "PAT", "Patient"
    ADMIN = "ADMIN", "Admin"


class AppointmentStatus(models.TextChoices):
    SCHEDULED = "SCHEDULED", "Scheduled"
    COMPLETED = "COMPLETED", "Completed"
    CANCELED = "CANCELED", "Canceled"


class PrescriptionStatus(models.TextChoices):
    ACTIVE = "ACTIVE", "Active"
    INACTIVE = "INACTIVE", "Inactive"


class DiseaseCategory(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=100)


class User(AbstractUser):
    date_joined = None
    last_login = None
    is_staff = models.BooleanField(default=False, editable=False)
    role = models.CharField(
        max_length=10, choices=UserRole.choices, default=UserRole.PATIENT
    )
    active = models.BooleanField(default=True)
    avatar = CloudinaryField(null=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.get_role_display()})"


class Specialty(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    image = CloudinaryField(null=True)

    def __str__(self):
        return self.name


class Doctor(models.Model):
    id = models.IntegerField(primary_key=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    specialty = models.ForeignKey(Specialty, on_delete=models.CASCADE)

    def __str__(self):
        return (
            f"Dr. {self.user.first_name} {self.user.last_name} - {self.specialty.name}"
        )


class Disease(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=100)
    disease_category = models.ForeignKey(DiseaseCategory, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Appointment(models.Model):
    id = models.IntegerField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    doctor = models.ForeignKey(
        Doctor, on_delete=models.CASCADE, related_name="doctor_appointments"
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
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Appointment for {self.user} with {self.doctor} on {self.start}"


class Prescription(models.Model):
    id = models.IntegerField(primary_key=True)
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    status = models.CharField(
        max_length=20,
        choices=PrescriptionStatus.choices,
        default=PrescriptionStatus.ACTIVE,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    note = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Prescription for {self.appointment} by {self.doctor}"


class PrescriptionDetail(models.Model):
    id = models.IntegerField(primary_key=True)
    prescription = models.ForeignKey(
        Prescription, on_delete=models.CASCADE, related_name="details"
    )
    quantity = models.IntegerField()
    dose = models.CharField(max_length=100)
    frequency = models.CharField(max_length=100)
    duration_day = models.CharField(max_length=100)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    instruction = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.quantity} x {self.dose} for {self.prescription}"


class MedicineCategory(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Medicine(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=100)
    category = models.ForeignKey(MedicineCategory, on_delete=models.CASCADE)
    stock = models.IntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=50)
    expired = models.DateField()

    def __str__(self):
        return self.name


class ServiceCategory(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Service(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=100)
    category = models.ForeignKey(ServiceCategory, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True, null=True)
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class AppointmentService(models.Model):
    id = models.IntegerField(primary_key=True)
    appointment = models.ForeignKey(
        Appointment, on_delete=models.CASCADE, related_name="services"
    )
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.service.name} for {self.appointment}"


class Payment(models.Model):
    id = models.IntegerField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE)
    service_fee = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Payment for {self.appointment} by {self.user}"
