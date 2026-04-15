from rest_framework import routers
from django.urls import path, include
from . import views

router = routers.DefaultRouter()
router.register("prescriptions", views.PrescriptionViewSet, "prescription")
router.register("appointments", views.AppointmentViewSet, "appointment")
router.register(
    "disease-categories", views.DiseaseCategoryViewSet, "disease-categories"
)
router.register("diseases", views.DiseaseViewSet, "disease")
router.register("specialties", views.SpecialtyViewSet, "specialty")
router.register("users", views.UserViewSet, "user")
router.register("services", views.ServiceViewSet, "service")
router.register("medicines", views.MedicineViewSet, "medicine")
router.register("patient-profile", views.PatientProfileViewSet, "patient-profile")
router.register("doctors", views.DoctorViewSet, "doctor")
router.register("reports", views.ReportViewSet, "report")
urlpatterns = [
    path("", include(router.urls)),
]
