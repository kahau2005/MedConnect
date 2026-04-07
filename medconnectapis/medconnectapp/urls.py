from django.urls import include, path
from rest_framework.routers import DefaultRouter

from medconnectapp import views

r = DefaultRouter()
urlpatterns = [
    path("", include(r.urls))
]
