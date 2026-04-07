from django.utils.safestring import mark_safe

from medconnectapp.models import ServiceCategory, Specialty
from django import forms
from django.contrib import admin
from ckeditor_uploader.widgets import CKEditorUploadingWidget


class MyAdminSite(admin.AdminSite):
    site_header = "MedConnectApp"


class SpecialtyForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["description"].required = False
        self.fields["image"].required = False

    content = forms.CharField(widget=CKEditorUploadingWidget)

    class Meta:
        model = Specialty
        fields = "__all__"


class MySpecialtyAdmin(admin.ModelAdmin):
    form = SpecialtyForm

    def image_view(self, lesson):
        if lesson.image:
            return mark_safe(f'<img src={lesson.image.url} width=200')
        return None


admin_site = MyAdminSite()

admin_site.register(Specialty, MySpecialtyAdmin)
