from rest_framework import pagination


class AppointmentPaginator(pagination.LimitOffsetPagination):
    default_limit = 8
    max_limit = 20


class DoctorPaginator(pagination.LimitOffsetPagination):
    default_limit = 8
    max_limit = 20
