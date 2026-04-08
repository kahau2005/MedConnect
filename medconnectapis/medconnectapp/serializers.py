from rest_framework.serializers import ModelSerializer
from .models import Specialty, User


class SpecialtySerializer(ModelSerializer):
    class Meta:
        model = Specialty
        fields = "__all__"


class SimpleUserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "email", "phone"]


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
