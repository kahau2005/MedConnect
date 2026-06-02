from datetime import timedelta

from celery import shared_task
from django.utils import timezone

from medconnectapp.models import Appointment, FCMDevice, Medicine, MedicineAlert, User
from medconnectapp.utils import send_push_notification


@shared_task
def check_medicine_stock_and_expired():
    today = timezone.localdate()
    warning_expire_date = today + timedelta(days=15)
    warning_stock = 20

    low_stock_meds = Medicine.objects.filter(active=True, stock__lte=warning_stock)

    for med in low_stock_meds:
        MedicineAlert.objects.get_or_create(
            medicine=med,
            alert_type=MedicineAlert.AlertType.LOW_STOCK,
            active=True,
            defaults={
                "message": f"Thuốc {med.name} sắp hết hàng. Còn lại {med.stock} {med.unit}"
            },
        )

    expiring_meds = Medicine.objects.filter(
        active=True, expired__gte=today, expired__lte=warning_expire_date
    )

    for med in expiring_meds:
        MedicineAlert.objects.get_or_create(
            medicine=med,
            alert_type=MedicineAlert.AlertType.EXPIRING,
            active=True,
            defaults={
                "message": f"Thuốc {med.name} sắp hết hạn. Hạn đến {med.expired}"
            },
        )

    alert_count = MedicineAlert.objects.filter(active=True).count()

    if alert_count > 0:
        admin_tokens = list(
            FCMDevice.objects.filter(
                user__role=User.UserRole.ADMIN, active=True
            ).values_list("token", flat=True)
        )

        if admin_tokens:
            title = "Thông báo từ kho thuốc"
            body = "Cảnh báo về thuốc sắp hết kho/hết hạn chưa được xử lý."

            send_push_notification(
                tokens=admin_tokens,
                title=title,
                body=body,
                data={"type": "medicine_alert_summary"},
            )


@shared_task
def check_upcoming_appointment():
    today = timezone.localdate()
    notificate_date = today + timedelta(days=3)

    appointments = Appointment.objects.select_related("user", "doctor__user").filter(
        active=True,
        status=Appointment.AppointmentStatus.SCHEDULED,
        start__gt=today,
        start__lte=notificate_date,
    )

    for app in appointments:
        days_left = (timezone.localtime(app.start).date() - today).days
        patient = app.user

        tokens = list(
            FCMDevice.objects.filter(active=True, user=patient).values_list(
                "token", flat=True
            )
        )

        if tokens:
            title = "Nhắc nhở lịch khám"
            body = f"Bạn có lịch khám vào {days_left} ngày tới với {app.doctor}"

            send_push_notification(
                tokens=tokens,
                title=title,
                body=body,
                data={"type": "appointment_remind", "appointment_id": str(app.id)},
            )
