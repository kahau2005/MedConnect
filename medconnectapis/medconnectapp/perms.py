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
    def has_object_permission(self, request, view, appointment):
        return (
            super().has_permission(request, view) and request.user == appointment.user
        )


class AppointmentOwnerOrDoctor(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, appointment):
        return super().has_permission(requeset, view) and (
            request.user == appointment.user
            or (
                request.user.role == User.UserRole.DOCTOR
                and request.user == appointment.doctor.user
            )
        )


class AppointmentDoctor(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, appointment):
        return (
            super().has_permission(request, view)
            and request.user.role == User.UserRole.DOCTOR
            and request.user == appointment.doctor.user
        )
