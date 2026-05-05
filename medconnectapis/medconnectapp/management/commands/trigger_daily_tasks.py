from django.core.management.base import BaseCommand
from medconnectapp.tasks import appointment_reminder


class Command(BaseCommand):
    help = "Add tasks to queue"

    def handle(self, *args, **options):
        appointment_reminder.enqueue()
        self.stdout.write(
            self.style.SUCCESS(
                "Đã đẩy các task kiểm tra định kỳ vào hàng đợi thành công!"
            )
        )
