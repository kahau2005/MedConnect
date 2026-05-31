from datetime import datetime

from django.contrib import admin
from django.db.models import Case, CharField, Count, Sum, Value, When
from django.db.models.functions import ExtractYear, Now, TruncMonth
from django.template.response import TemplateResponse
from django.urls import path
from django.utils.safestring import mark_safe
from django_celery_beat.admin import (
    ClockedScheduleAdmin,
    CrontabScheduleAdmin,
    PeriodicTaskAdmin,
)
from django_celery_beat.models import (
    ClockedSchedule,
    CrontabSchedule,
    IntervalSchedule,
    PeriodicTask,
    SolarSchedule,
)

from medconnectapp.models import (
    Appointment,
    AppointmentService,
    PatientProfile,
    Payment,
)

from . import models


class MyAdminSite(admin.AdminSite):
    site_header = "MedConnectApp"

    def get_urls(self):
        return [
            path("stats/", self.admin_view(self.stats), name="admin-stats")
        ] + super().get_urls()

    def stats(self, request):
        age_expression = ExtractYear(Now()) - ExtractYear("dob")
        age_groups = list(
            PatientProfile.objects.filter(active=True)
            .annotate(age=age_expression)
            .annotate(
                age_group=Case(
                    When(age__lt=18, then=Value("Trẻ em (dưới 18)")),
                    When(age__gte=18, age__lte=30, then=Value("Thanh niên (18 - 30)")),
                    When(age__gt=30, age__lte=60, then=Value("Trung niên (30 - 60)")),
                    When(age__gt=60, then=Value("Cao tuổi (trên 60)")),
                    output_field=CharField(),
                )
            )
            .values("age_group")
            .annotate(total=Count("user_id"))
            .order_by("age_group")
        )

        gender_distribution = list(
            PatientProfile.objects.filter(active=True)
            .values("gender")
            .annotate(total=Count("user_id"))
            .order_by("gender")
        )

        specialty_distribution = list(
            Appointment.objects.filter(active=True)
            .values("doctor__specialty__name")
            .annotate(total=Count("user_id", distinct=True))
            .order_by("doctor__specialty__name")
        )

        from_date = request.GET.get("from_date")
        to_date = request.GET.get("to_date")

        service_qs = AppointmentService.objects.filter(active=True)
        disease_qs = Appointment.objects.filter(
            active=True, status=Appointment.AppointmentStatus.COMPLETED
        )

        payment_qs = Payment.objects.filter(
            status=Payment.PaymentStatus.PAID, active=True
        )

        if from_date:
            try:
                parsed = datetime.strptime(from_date, "%Y-%m-%d").date()
                service_qs = service_qs.filter(appointment__start__date__gte=parsed)
                disease_qs = disease_qs.filter(start__date__gte=parsed)
                payment_qs = payment_qs.filter(created_at__date__gte=parsed)
            except Exception:
                pass

        if to_date:
            try:
                parsed = datetime.strptime(to_date, "%Y-%m-%d").date()
                service_qs = service_qs.filter(appointment__start__date__lte=parsed)
                disease_qs = disease_qs.filter(start__date__lte=parsed)
                payment_qs = payment_qs.filter(created_at__date__lte=parsed)
            except Exception:
                pass

        services = list(
            service_qs.values("service__name")
            .annotate(total_quantity=Sum("quantity"))
            .order_by("-total_quantity")
        )

        diseases = list(
            disease_qs.values("diagnosis__name")
            .annotate(total_appointments=Count("id"))
            .order_by("-total_appointments")
        )

        total_revenue = payment_qs.aggregate(total=Sum("total_amount"))["total"] or 0

        revenue_by_date = list(
            payment_qs.annotate(date=TruncMonth("created_at"))
            .values("date")
            .annotate(daily_total=Sum("total_amount"))
            .order_by("date")
        )

        context = {
            **self.each_context(request),
            "age_groups": age_groups,
            "genders": gender_distribution,
            "specialties": specialty_distribution,
            "services": services,
            "diseases": diseases,
            "total_revenue": total_revenue,
            "revenue_by_date": revenue_by_date,
            "from_date": from_date or "",
            "to_date": to_date or "",
        }

        return TemplateResponse(request, "admin/stats.html", context)


class MyServiceAdmin(admin.ModelAdmin):
    readonly_fields = ["image_view"]

    def image_view(self, service):
        if service.image:
            return mark_safe(f"<img src='{service.image.url}' width='400' />")
        return None


class MyUserAdmin(admin.ModelAdmin):
    readonly_fields = ["image_view"]

    def image_view(self, user):
        if user.avatar:
            return mark_safe(f"<img src='{user.avatar.url}' width='400' />")
        return None


class MySpecialtyAdmin(admin.ModelAdmin):
    readonly_fields = ["image_view"]

    def image_view(self, specialty):
        if specialty.image:
            return mark_safe(f"<img src='{specialty.image.url}' width='200' />")
        return None


admin_site = MyAdminSite()

admin_site.register(models.Specialty, MySpecialtyAdmin)
admin_site.register(models.User, MyUserAdmin)
admin_site.register(models.Doctor, admin.ModelAdmin)
admin_site.register(models.PatientProfile, admin.ModelAdmin)
admin_site.register(models.DoctorSchedule, admin.ModelAdmin)
admin_site.register(models.MedicineCategory, admin.ModelAdmin)
admin_site.register(models.Medicine, admin.ModelAdmin)
admin_site.register(models.Disease, admin.ModelAdmin)
admin_site.register(models.Service, MyServiceAdmin)
admin_site.register(models.Appointment, admin.ModelAdmin)
admin_site.register(models.Prescription, admin.ModelAdmin)
admin_site.register(models.PrescriptionDetail, admin.ModelAdmin)
admin_site.register(models.AppointmentService, admin.ModelAdmin)
admin_site.register(models.Payment, admin.ModelAdmin)
admin_site.register(models.ChatRoom, admin.ModelAdmin)
admin_site.register(PeriodicTask, PeriodicTaskAdmin)
admin_site.register(IntervalSchedule)
admin_site.register(CrontabSchedule, CrontabScheduleAdmin)
admin_site.register(SolarSchedule)
admin_site.register(ClockedSchedule, ClockedScheduleAdmin)
admin_site.register(models.MedicineAlert, admin.ModelAdmin)
