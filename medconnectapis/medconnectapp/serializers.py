from rest_framework.serializers import ModelSerializer
from .models import Specialty, ServiceCategory, Service


class SpecialtySerializer(ModelSerializer):
    class Meta:
        model = Specialty
        fields = "__all__"

class ServiceCategorySerializer(ModelSerializer):
    class Meta:
        model = ServiceCategory
        fields = "__all__"
class ServiceSerializer(ModelSerializer):
    class Meta:
        model = Service
        fields = ["name", "category", "price", "description"]

class DetailServiceSerializer(ModelSerializer):
    class Meta:
        model = Service
        fields = "__all__"