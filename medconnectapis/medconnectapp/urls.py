<<<<<<< HEAD
from rest_framework import routers
from django.urls import path, include
from . import views

router = routers.DefaultRouter()
router.register("specialties", views.SpecialtyViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
=======
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from medconnectapp import views

r = DefaultRouter()
urlpatterns = [
    path("", include(r.urls))
]
>>>>>>> 0e15e53f9c2d45b599d1586e0a822cdb755578c7
