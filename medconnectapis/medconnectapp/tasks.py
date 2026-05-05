from datetime import timedelta
from django_tasks import task
from django.utils import timezone
from .models import Appointment, Medicine, User
from .utils import send_push_notification


@task(queue_name="default")
def appointment_reminder():
    now = timezone.now()
    tommorrow = now + timedelta(days=1)

    appointments = Appointment.objects.filter(
        active=True,
        status=Appointment.AppointmentStatus.SCHEDULED,
        start__date=tommorrow.date(),
    ).select_related("user", "doctor", "doctor__user")

    for app in appointments:
        time_str = app.start.strftime("%H:%M %d/%m/%Y")
        title = "Nhắc lịch khám MedConnect"
        body = f"Bạn có lịch khám với bác sĩ {app.doctor.user.first_name} {app.doctor.user.last_name} vào lúc {time_str}"
        send_push_notification(
            app.user, title, body, data={"appointment_id": str(app.id)}
        )
