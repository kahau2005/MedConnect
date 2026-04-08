from rest_framework import routers
from django.urls import path, include
from . import views

router = routers.DefaultRouter()
router.register("specialties", views.SpecialtyViewSet)
router.register("services-categories", views.ServiceCategoryViewSet, "service-categories")
router.register("services", views.ServiceViewSet, "services")

urlpatterns = [
    path("", include(router.urls)),
]
