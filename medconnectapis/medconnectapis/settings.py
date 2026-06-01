import os
from pathlib import Path

import cloudinary
import pymysql
from dotenv import load_dotenv

from medconnectapp.apps import MedconnectappConfig

BASE_DIR = Path(__file__).resolve().parent.parent

env_path = os.path.join(BASE_DIR, ".env")
load_dotenv(env_path)

DEBUG = True


OAUTH2_PROVIDER = {
    "OAUTH2_BACKEND_CLASS": "oauth2_provider.oauth2_backends.JSONOAuthLibCore"
}

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.humanize",
    "ckeditor_uploader",
    "rest_framework",
    "drf_yasg",
    "django_filters",
    "oauth2_provider",
    "medconnectapp.apps.MedconnectappConfig",
    "corsheaders",
    "django_celery_beat",
]

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "oauth2_provider.contrib.rest_framework.OAuth2Authentication",
    ),
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.ScopedRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "register": "3/m",
        "current_user": "10/m",
        "patient_profile": "10/m",
        "checkout": "3/m",
        "payment": "3/m",
        "booking": "10/h",
        "appointment_read": "20/m",
        "appointment_update": "20/m",
        "appointment_prescriptions": "10/m",
        "appointment_services_action": "20/m",
        "appointment_review": "20/m",
        "appointment_chat_rooms": "20/m",
        "appointment_service": "10/m",
        "appointment": "20/m",
        "prescription": "10/m",
        "prescription_details": "5/m",
        "disease": "10/m",
        "specialty": "10/m",
        "service": "10/m",
        "medicine_category": "10/m",
        "medicine": "10/m",
        "doctor": "10/m",
        "doctor_schedule": "10/m",
        "report": "10/m",
    },
}

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "medconnectapp.middleware.OAuthMiddleware",
]

STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

CORS_ALLOW_ALL_ORIGINS = True
ALLOWED_HOSTS = ["*"]

MEDIA_ROOT = "%s/medconnectapp/static/" % BASE_DIR
CKEDITOR_UPLOAD_PATH = "images/ckeditors/"
ROOT_URLCONF = "medconnectapis.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [os.path.join(BASE_DIR, "medconnectapp", "templates")],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]


WSGI_APPLICATION = "medconnectapis.wsgi.application"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": os.environ.get("DB_NAME", "medconnectdb"),
        "USER": os.environ.get("DB_USER", "root"),
        "PASSWORD": os.environ.get("DB_PASSWORD", "root"),
        "HOST": os.environ.get("DB_HOST", ""),
        "PORT": "3306",
        "OPTIONS": {
            "ssl": {"ssl-mode": "REQUIRED"},
        },
    }
}
SECRET_KEY = os.environ.get("SECRET_KEY")
AUTH_USER_MODEL = "medconnectapp.User"

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
)

DATA_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024

CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")

ZALOPAY_APP_ID = os.getenv("ZALOPAY_APP_ID")
ZALOPAY_KEY1 = os.getenv("ZALOPAY_KEY1")
ZALOPAY_KEY2 = os.getenv("ZALOPAY_KEY2")

CELERY_BROKER_URL = os.environ.get("CELERY_BROKER_URL", "redis://localhost:6379/0")
CELERY_RESULT_BACKEND = None
CELERY_TIMEZONE = "Asia/Ho_Chi_Minh"
CELERY_BEAT_SCHEDULER = "django_celery_beat.schedulers:DatabaseScheduler"
CELERY_BROKER_TRANSPORT_OPTIONS = {
    "polling_interval": 30,
}
CELERY_BEAT_MAX_LOOP_INTERVAL = 30
CELERY_WORKER_PREFETCH_MULTIPLIER = 1
CELERY_WORKER_CONCURRENCY = 1

STREAM_API_KEY = os.getenv("STREAM_API_KEY")
STREAM_API_SECRET = os.getenv("STREAM_API_SECRET")

pymysql.version_info = (2, 2, 7)
pymysql.install_as_MySQLdb()


AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


STATIC_URL = "static/"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

CSRF_TRUSTED_ORIGINS = [
    "https://medconnect-aca.icydesert-d50d1a9e.southeastasia.azurecontainerapps.io"
]
