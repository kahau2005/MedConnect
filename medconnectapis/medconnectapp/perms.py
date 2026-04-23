from rest_framework import permissions

from medconnectapp.models import User


class IsDoctor(permissions.IsAuthenticated):
    def has_permission(self, request, view):
        return (
            super().has_permission(request, view)
            and request.user.role == User.UserRole.DOCTOR
        )


class IsAdmin(permissions.IsAuthenticated):
    def has_permission(self, request, view):
        return (
            super().has_permission(request, view)
            and request.user.role == User.UserRole.ADMIN
        )


class IsDoctorOrAdmin(permissions.IsAuthenticated):
    def has_permission(self, request, view):
        return super().has_permission(request, view) and (
            request.user.role == User.UserRole.ADMIN
            or request.user.role == User.UserRole.DOCTOR
        )


class AppointmentOwner(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, obj):
        appointment = obj.appointment if hasattr(obj, "appointment") else obj
        return (
            super().has_permission(request, view)
            and request.user.id == appointment.user_id
        )


class AppointmentOwnerOrDoctor(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, obj):
        appointment = obj.appointment if hasattr(obj, "appointment") else obj
        return super().has_permission(request, view) and (
            request.user.id == appointment.user_id
            or (
                request.user.role == User.UserRole.DOCTOR
                and request.user.id == appointment.doctor_id
            )
        )


class AppointmentDoctor(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, obj):
        if hasattr(obj, "appointment"):
            appointment = obj.appointment
        elif hasattr(obj, "prescription"):
            appointment = obj.prescription.appointment
        else:
            appointment = obj
        return (
            super().has_permission(request, view)
            and request.user.role == User.UserRole.DOCTOR
            and request.user.id == appointment.doctor_id
        )
