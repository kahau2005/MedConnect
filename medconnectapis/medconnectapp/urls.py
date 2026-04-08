from rest_framework import routers
from django.urls import path, include
from . import views

router = routers.DefaultRouter()
router.register("specialties", views.SpecialtyViewSet, "specialty")
router.register("users", views.UserViewSet, "user")
router.register("services", views.ServiceViewSet, "services")
router.register("medicines", views.MedicineViewSet, "medicines")
router.register(
    "medicine-categories", views.MedicineCategoryViewSet, "medicine-categories"
)
router.register("patient-profile", views.PatientProfileViewSet, "patient-profile")
urlpatterns = [
    path("", include(router.urls)),
]
