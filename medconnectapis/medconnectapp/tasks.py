from medconnectapp.models import Medicine, MedicineAlert
from datetime import timedelta
from celery import shared_task
from django.utils import timezone
import logging


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
            is_resolved=False,
            defaults={
                "message": f"Thuốc {med.name} sắp hết hàng. Số lượng còn lại: {med.stock} {med.unit}"
            },
        )

    expiring_meds = Medicine.objects.filter(
        active=True, expired__gte=today, expired__lte=warning_expire_date
    )

    for med in expiring_meds:
        MedicineAlert.objects.get_or_create(
            medicine=med,
            alert_type=MedicineAlert.AlertType.EXPIRING,
            is_resolved=False,
            defaults={
                "message": f"Thuốc {med.name} sắp hết hạn. Hạn sử dụng đến {med.expired}"
            },
        )

    return "Đã kiểm tra xong thuốc"
