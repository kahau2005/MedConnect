from django.urls import include, path
from rest_framework import routers


from . import views

router = routers.DefaultRouter()
router.register("prescriptions", views.PrescriptionViewSet, "prescription")
router.register(
    "prescription-details",
    views.PrescriptionDetailViewSet,
    basename="prescription-detail",
)
router.register("appointments", views.AppointmentViewSet, "appointment")
router.register(
    "appointment-services", views.AppointmentServiceViewSet, "appointment-service"
)
router.register("diseases", views.DiseaseViewSet, "disease")
router.register("specialties", views.SpecialtyViewSet, "specialty")
router.register("users", views.UserViewSet, "user")
router.register("services", views.ServiceViewSet, "service")
router.register("medicines", views.MedicineViewSet, "medicine")
router.register(
    "medicine-categories", views.MedicineCategoryViewSet, "medicine-category"
)
router.register("doctors", views.DoctorViewSet, "doctor")
router.register("schedules", views.DoctorScheduleViewSet, "schedule")
router.register("payments", views.PaymentViewSet, "payment")
router.register("stream", views.StreamViewSet, basename="stream")

urlpatterns = [
    path("", include(router.urls)),
]
urlpatterns = [
    path("", include(router.urls)),
]
