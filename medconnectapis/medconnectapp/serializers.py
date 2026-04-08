from rest_framework.serializers import ModelSerializer
from .models import Specialty


class SpecialtySerializer(ModelSerializer):
    class Meta:
        model = Specialty
        fields = "__all__"
