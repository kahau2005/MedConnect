from django import forms
from django.contrib import admin
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
    User,
    VideoCallLog,
    MedicineAlert,
)


class MyAdminSite(admin.AdminSite):
    site_header = "MedConnectApp"


class SpecialtyForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["description"].required = False
        self.fields["image"].required = False

    class Meta:
        model = Specialty
        fields = "__all__"


class MySpecialtyAdmin(admin.ModelAdmin):
    form = SpecialtyForm
    readonly_fields = ("image_preview",)

    def image_preview(self, specialty):
        if specialty.image:
            return mark_safe(f'<img src="{specialty.image.url}" width="200" />')


class MedicineAlertAdmin(admin.ModelAdmin):
    list_display = ("alert_type", "medicine", "message", "is_resolved", "created_at")
    list_filter = ("alert_type", "is_resolved", "created_at")
    search_fields = ("medicine__name", "message")
    readonly_fields = ("medicine", "alert_type", "message", "created_at")
    actions = ["mark_as_resolved"]

    def mark_as_resolved(self, request, queryset):
        queryset.update(is_resolved=True)

    mark_as_resolved.short_description = "Đánh dấu đã xử lý"


admin_site = MyAdminSite()

admin_site.register(Specialty, MySpecialtyAdmin)
admin_site.register(User, admin.ModelAdmin)
admin_site.register(Doctor, admin.ModelAdmin)
admin_site.register(PatientProfile, admin.ModelAdmin)
admin_site.register(DoctorSchedule, admin.ModelAdmin)
admin_site.register(MedicineCategory, admin.ModelAdmin)
admin_site.register(Medicine, admin.ModelAdmin)
admin_site.register(DiseaseCategory, admin.ModelAdmin)
admin_site.register(Disease, admin.ModelAdmin)
admin_site.register(Service, admin.ModelAdmin)
admin_site.register(Appointment, admin.ModelAdmin)
admin_site.register(Prescription, admin.ModelAdmin)
admin_site.register(PrescriptionDetail, admin.ModelAdmin)
admin_site.register(AppointmentService, admin.ModelAdmin)
admin_site.register(Payment, admin.ModelAdmin)
admin_site.register(ChatRoom, admin.ModelAdmin)
admin_site.register(VideoCallLog, admin.ModelAdmin)
admin_site.register(ChatMessage, admin.ModelAdmin)
admin_site.register(PeriodicTask, PeriodicTaskAdmin)
admin_site.register(IntervalSchedule)
admin_site.register(CrontabSchedule, CrontabScheduleAdmin)
admin_site.register(SolarSchedule)
admin_site.register(ClockedSchedule, ClockedScheduleAdmin)
admin_site.register(MedicineAlert, MedicineAlertAdmin)
