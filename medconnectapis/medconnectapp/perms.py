from rest_framework import permissions


class AppointmentDoctor(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, appointment):
        return (
            super().has_permission(request, view) and request.user == appointment.doctor
        )
