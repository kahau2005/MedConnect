from rest_framework import routers
from django.urls import path, include
from . import views

router = routers.DefaultRouter()
router.register("specialties", views.SpecialtyViewSet, "specialty")
router.register("users", views.UserViewSet, "user")

urlpatterns = [
    path("", include(router.urls)),
]
