import django_filters
from django.db.models import Q

from .models import Doctor


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
