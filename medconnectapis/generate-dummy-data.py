import os
import random
import re
import unicodedata
from datetime import datetime, timedelta

import django
from faker import Faker

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "medconnectapis.settings")
django.setup()

from django.contrib.auth import get_user_model

from medconnectapp.models import (
    Appointment,
    AppointmentService,
    ChatMessage,
    ChatRoom,
    Disease,
    DiseaseCategory,
    Doctor,
    DoctorSchedule,
    Medicine,
    MedicineCategory,
    PatientProfile,
    Payment,
    Prescription,
    PrescriptionDetail,
    Service,
    Specialty,
    TestResult,
    VideoCallLog,
)

User = get_user_model()
fake = Faker("vi_VN")


def remove_vietnamese_diacritics(text):
    text = unicodedata.normalize("NFD", text)
    text = "".join(c for c in text if unicodedata.category(c) != "Mn")
    text = text.replace("đ", "d").replace("Đ", "D")
    text = re.sub(r"[^a-zA-Z0-9\s_]", "", text)
    text = text.lower().strip()
    text = re.sub(r"[\s_]+", "_", text)
    return text


def get_random_choice(choices_list):
    return random.choice([choice[0] for choice in choices_list])


def create_base_users(count=200):
    print(f"Đang tạo {count} users...")
    users = []

    for i in range(count):
        first_name = fake.first_name()
        last_name = fake.last_name()

        first_name_slug = remove_vietnamese_diacritics(first_name)
        last_name_slug = remove_vietnamese_diacritics(last_name)

        username = f"{first_name_slug}_{last_name_slug}_{i + 10000}"
        email = f"{username}@medconnect.test"

        role_rand = random.random()
        if role_rand < 0.8:
            role = User.UserRole.PATIENT
        elif role_rand < 0.95:
            role = User.UserRole.DOCTOR
        else:
            role = User.UserRole.ADMIN

        user = User.objects.create_user(
            username=username,
            email=email,
            password="123456",
            first_name=first_name,
            last_name=last_name,
            phone=f"0{random.randint(300000000, 999999999)}",
            role=role,
            is_staff=(role in [User.UserRole.ADMIN, User.UserRole.DOCTOR]),
        )
        users.append(user)

    print(f"Đã tạo xong {len(users)} users.")
    return users


def create_specialties_and_doctors(users):

    specialties_names = [
        "Nội khoa",
        "Ngoại khoa",
        "Nhi khoa",
        "Sản phụ khoa",
        "Tim mạch",
        "Da liễu",
        "Răng hàm mặt",
    ]
    specialties = []
    for name in specialties_names:
        spec, created = Specialty.objects.get_or_create(
            name=name, defaults={"description": fake.text(max_nb_chars=100)}
        )
        specialties.append(spec)

    doctors = []
    doctor_users = [u for u in users if u.role == User.UserRole.DOCTOR]

    for user in doctor_users:
        if not hasattr(user, "doctor_profile"):
            specialty = random.choice(specialties)
            Doctor.objects.create(
                user=user, specialty=specialty, background=fake.text(max_nb_chars=200)
            )
            doctors.append(user.doctor_profile)

    return doctors


def create_patient_profiles(users):
    patients = []
    patient_users = [u for u in users if u.role == User.UserRole.PATIENT]

    for user in patient_users:
        if not hasattr(user, "patient_profile"):
            PatientProfile.objects.create(
                user=user,
                gender=get_random_choice(PatientProfile.Gender.choices),
                dob=fake.date_of_birth(minimum_age=18, maximum_age=80),
                weight=random.uniform(45, 90),
                height=random.randint(150, 185),
                blood_type=get_random_choice(PatientProfile.BloodType.choices)
                if random.random() > 0.2
                else None,
                address=fake.address(),
            )
            patients.append(user.patient_profile)

    return patients


def create_medicines_and_services():
    med_cats = ["Kháng sinh", "Giảm đau", "Vitamin", "Tim mạch", "Tiêu hóa"]
    categories = []
    for name in med_cats:
        cat, _ = MedicineCategory.objects.get_or_create(name=name)
        categories.append(cat)

    medicines = []
    for i in range(50):
        med = Medicine.objects.create(
            name=f"Thuốc {fake.word()} {i}",
            category=random.choice(categories),
            stock=random.randint(10, 1000),
            unit_price=random.uniform(5000, 500000),
            unit=random.choice(["Viên", "Hộp", "Chai", "Ống"]),
            expired=fake.date_between(start_date="+1y", end_date="+5y"),
        )
        medicines.append(med)

    services = []
    service_names = [
        "Khám tổng quát",
        "Xét nghiệm máu",
        "Siêu âm",
        "Chụp X-quang",
        "Tiêm vắc xin",
    ]
    for name in service_names:
        srv = Service.objects.create(
            name=name,
            price=random.uniform(50000, 500000),
            description=fake.text(max_nb_chars=50),
        )
        services.append(srv)

    print(f"Đã tạo xong {len(medicines)} medicines và {len(services)} services.")
    return medicines, services


def create_diseases():
    cats = ["Bệnh truyền nhiễm", "Bệnh mãn tính", "Bệnh hô hấp"]
    categories = []
    for name in cats:
        cat, _ = DiseaseCategory.objects.get_or_create(name=name)
        categories.append(cat)

    diseases = []
    disease_names = [
        "Cúm mùa",
        "Viêm phổi",
        "Tiểu đường",
        "Cao huyết áp",
        "Viêm dạ dày",
        "Sốt xuất huyết",
    ]
    for name in disease_names:
        dis = Disease.objects.create(
            name=name, disease_category=random.choice(categories)
        )
        diseases.append(dis)

    return diseases


def create_appointments_and_related_data(
    doctors, patients, medicines, services, diseases, count=200
):

    valid_patient_users = [p.user for p in patients]
    if not valid_patient_users:
        print("Không có patient nào để tạo appointment!")
        return

    created_count = 0
    batch_size = 100

    while created_count < count:
        try:
            doctor_obj = random.choice(doctors)
            patient_user = random.choice(valid_patient_users)

            start_time = fake.date_time_between(start_date="-30d", end_date="+30d")

            diagnosis = random.choice(diseases) if diseases else None

            appointment = Appointment.objects.create(
                user=patient_user,
                doctor=doctor_obj,
                status=get_random_choice(Appointment.AppointmentStatus.choices),
                start=start_time,
                reason=fake.text(max_nb_chars=100),
                symptoms=fake.text(max_nb_chars=100),
                diagnosis=diagnosis,
                note=fake.text(max_nb_chars=50),
            )

            total_amount = random.uniform(100000, 2000000)
            Payment.objects.create(
                appointment=appointment,
                status=get_random_choice(Payment.PaymentStatus.choices),
                total_amount=total_amount,
            )

            chat_room = ChatRoom.objects.create(appointment=appointment)

            num_services = random.randint(1, 3)
            selected_services = random.sample(
                services, min(num_services, len(services))
            )

            appt_services = []
            for srv in selected_services:
                appt_srv = AppointmentService.objects.create(
                    appointment=appointment,
                    service=srv,
                    quantity=1,
                    unit_price=srv.price,
                )
                appt_services.append(appt_srv)

                if random.random() > 0.5:
                    TestResult.objects.create(
                        appointment_service=appt_srv,
                        result_type=get_random_choice(TestResult.ResultType.choices),
                        tested_by=doctor_obj,
                        result_data=fake.text(max_nb_chars=200),
                        conclusion=fake.text(max_nb_chars=100),
                    )

            if random.random() > 0.3:
                prescription = Prescription.objects.create(
                    appointment=appointment,
                    status=get_random_choice(Prescription.PrescriptionStatus.choices),
                )

                num_meds = random.randint(1, 3)
                selected_meds = random.sample(medicines, min(num_meds, len(medicines)))

                for med in selected_meds:
                    PrescriptionDetail.objects.create(
                        prescription=prescription,
                        medicine=med,
                        quantity=random.randint(1, 10),
                        dose=random.randint(1, 3),
                        frequency=random.randint(1, 4),
                        duration_day=random.randint(3, 14),
                        unit_price=med.unit_price,
                        instruction=get_random_choice(
                            PrescriptionDetail.Instruction.choices
                        ),
                    )

            if random.random() > 0.5:
                for _ in range(random.randint(1, 5)):
                    sender = random.choice([patient_user, doctor_obj.user])
                    ChatMessage.objects.create(
                        room=chat_room,
                        sender=sender,
                        chat_type=ChatMessage.MessageType.TEXT,
                        content=fake.sentence(),
                    )

                if random.random() > 0.7:
                    call_start = start_time + timedelta(minutes=random.randint(-10, 10))
                    call_end = call_start + timedelta(minutes=random.randint(5, 20))
                    vlog = VideoCallLog.objects.create(
                        room=chat_room,
                        caller=patient_user,
                        receiver=doctor_obj.user,
                        status=get_random_choice(VideoCallLog.CallStatus.choices),
                        start=call_start,
                        end=call_end if random.random() > 0.2 else None,
                    )

                    ChatMessage.objects.create(
                        room=chat_room,
                        sender=patient_user,
                        chat_type=ChatMessage.MessageType.CALL,
                        content="Cuộc gọi video đã kết thúc",
                        call_log=vlog,
                    )

            created_count += 1
            if created_count % 100 == 0:
                print(f"Đã tạo xong {created_count} appointments...")

        except Exception as e:
            print(f"Lỗi khi tạo appointment: {e}")

            continue

    print(f"Hoàn thành! Tổng cộng {created_count} appointments đã được tạo.")


if __name__ == "__main__":
    users = create_base_users(200)

    doctors = create_specialties_and_doctors(users)

    patients = create_patient_profiles(users)

    medicines, services = create_medicines_and_services()
    diseases = create_diseases()

    create_appointments_and_related_data(
        doctors, patients, medicines, services, diseases, count=200
    )
