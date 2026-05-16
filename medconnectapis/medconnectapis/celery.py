import os
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "medconnectapis.settings")

app = Celery("medconnectapis")

app.config_from_object("django.conf:settings", namespace="CELERY")

app.autodiscover_tasks()
