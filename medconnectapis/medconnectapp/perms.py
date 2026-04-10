from rest_framework import permissions

from medconnectapp.models import User


class IsDoctor(permissions.IsAuthenticated):
    def has_permission(self, request, view):
        return (
            super().has_permission(request, view)
            and request.user.role == User.UserRole.DOCTOR
        )
