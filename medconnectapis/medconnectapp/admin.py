from django import forms
from django.contrib import admin
from django.utils.safestring import mark_safe

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
