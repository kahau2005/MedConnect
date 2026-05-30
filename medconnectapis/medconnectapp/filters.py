import django_filters
from django.db.models import Q

from .models import Appointment, Doctor


class AppointmentFilter(django_filters.FilterSet):
    from_date = django_filters.DateFilter(field_name="start", lookup_expr="date__gte")
    to_date = django_filters.DateFilter(field_name="start", lookup_expr="date__lte")
    kw = django_filters.CharFilter(method="filter_keyword")
    doctor_id = django_filters.NumberFilter(field_name="doctor_id")

    class Meta:
        model = Appointment
        fields = ["status", "from_date", "to_date", "kw", "doctor_id"]

    def filter_keyword(self, queryset, name, value):
        if not value:
            return queryset
        return queryset.filter(
            Q(reason__icontains=value)
            | Q(symptoms__icontains=value)
            | Q(diagnosis__name__icontains=value)
        )


class DoctorFilter(django_filters.FilterSet):
    kw = django_filters.CharFilter(method="filter_keyword")
    specialty_id = django_filters.NumberFilter(field_name="specialty_id")

    class Meta:
        model = Doctor
        fields = ["specialty_id", "kw"]

    def filter_keyword(self, queryset, name, value):
        if not value:
            return queryset
        return queryset.filter(
            Q(user__first_name__icontains=value) | Q(user__last_name__icontains=value)
        )
