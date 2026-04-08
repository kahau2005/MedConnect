from rest_framework.serializers import ModelSerializer
from .models import Specialty, User
from .models import Specialty, Service


class SpecialtySerializer(ModelSerializer):
    class Meta:
        model = Specialty
        fields = "__all__"


class SimpleUserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "email", "phone", "avatar"]


class UserSerializer(SimpleUserSerializer):
    class Meta:
        model = SimpleUserSerializer.Meta.model
        fields = SimpleUserSerializer.Meta.fields + ["username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.avatar:
            data["avatar"] = instance.avatar.url
        return data

    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(user.password)
        user.save()
        return user

class ServiceSerializer(ModelSerializer):
    class Meta:
        model = Service
        fields = ["name", "category", "price", "description"]

class DetailServiceSerializer(ModelSerializer):
    class Meta:
        model = Service
        fields = "__all__"