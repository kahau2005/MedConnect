from rest_framework import pagination


class AppointmentPaginator(pagination.LimitOffsetPagination):
    default_limit = 8
    max_limit = 40


class DoctorPaginator(pagination.LimitOffsetPagination):
    default_limit = 8
    max_limit = 40


class ServicePaginator(pagination.LimitOffsetPagination):
    default_limit = 8
    max_limit = 40
