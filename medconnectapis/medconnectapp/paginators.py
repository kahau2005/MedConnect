from rest_framework import pagination


class AppointmentPaginator(pagination.LimitOffsetPagination):
    default_limit = 8
    max_limit = 20


class DoctorPaginator(pagination.LimitOffsetPagination):
    default_limit = 8
    max_limit = 20


class MedicinePaginator(pagination.LimitOffsetPagination):
    default_limit = 10
    max_limit = 20
