import hashlib
import hmac
import json
import os

import firebase_admin
import requests
from django.conf import settings
from django.utils import timezone
from firebase_admin import credentials, messaging
from getstream.models import ChannelInput, ChannelMemberRequest, UserRequest
from getstream.stream import Stream

ZALOPAY_CONFIG = {
    "APP_ID": settings.ZALOPAY_APP_ID,
    "KEY1": settings.ZALOPAY_KEY1,
    "KEY2": settings.ZALOPAY_KEY2,
    "ENDPOINT": "https://sb-openapi.zalopay.vn/v2",
}


def create_order(
    order_id,
    amount,
    description=None,
    callback_url="https://medconnect-aca.icydesert-d50d1a9e.southeastasia.azurecontainerapps.io/payments/zalopay-callback/",
):
    app_id = ZALOPAY_CONFIG["APP_ID"]
    key1 = ZALOPAY_CONFIG["KEY1"]
    endpoint = f"{ZALOPAY_CONFIG['ENDPOINT']}/create"
    trans_id = f"{timezone.now().strftime('%y%m%d_%H%M%S')}_{order_id}"
    now = timezone.now()
    app_time = int(now.timestamp() * 1000)

    embed_data = json.dumps({})
    item = json.dumps([])

    params = {
        "app_id": app_id,
        "app_trans_id": trans_id,
        "app_user": "demo_user",
        "app_time": app_time,
        "amount": int(amount),
        "description": description,
        "item": item,
        "embed_data": embed_data,
        "bank_code": "",
        "callback_url": callback_url,
    }

    data_str = f"{app_id}|{trans_id}|{params.get('app_user')}|{amount}|{app_time}|{embed_data}|{item}"

    mac = hmac.new(
        key1.encode("utf-8"), data_str.encode("utf-8"), hashlib.sha256
    ).hexdigest()
    params["mac"] = mac

    response = requests.post(endpoint, data=params)
    result = response.json()

    result["app_trans_id"] = trans_id
    return result


def verify_callback(data):
    mac = data.get("mac")
    data_str = data.get("data")

    if not mac or not data_str:
        return False, "Thiếu mac hoặc data trong request"

    mac_key2 = hmac.new(
        ZALOPAY_CONFIG["KEY2"].encode("utf-8"), data_str.encode("utf-8"), hashlib.sha256
    ).hexdigest()

    if hmac.compare_digest(mac, mac_key2):
        return True, json.loads(data_str)
    return False, "Mac nhận được không đúng"


if not firebase_admin._apps:
    cred_path = os.path.join(settings.BASE_DIR, "firebase-credentials.json")
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)


def send_push_notification(tokens, title, body, data=None):
    if not tokens:
        return None

    if isinstance(tokens, str):
        tokens = [tokens]

    android_conf = messaging.AndroidConfig(
        priority="high",
    )

    message = messaging.MulticastMessage(
        notification=messaging.Notification(
            title=title,
            body=body,
        ),
        data=data or {},
        tokens=tokens,
        android=android_conf,
    )
    response = messaging.send_each_for_multicast(message)
    return response


def get_or_create_chatroom(appointment):
    channel_id = f"appointment_{appointment.id}"
    doctor_id = str(appointment.doctor_id)
    patient_id = str(appointment.user_id)
    doctor_fullname = (
        f"{appointment.doctor.user.first_name} {appointment.doctor.user.last_name}"
    )
    patient_fullname = f"{appointment.user.first_name} {appointment.user.last_name}"

    chat_client.upsert_users(
        UserRequest(id=doctor_id, name=doctor_fullname, role="user"),
        UserRequest(id=patient_id, name=patient_fullname, role="user"),
    )
    channel = chat_client.chat.channel("messaging", channel_id)
    channel.get_or_create(
        data=ChannelInput(
            created_by_id=doctor_id,
            members=[
                ChannelMemberRequest(user_id=doctor_id),
                ChannelMemberRequest(user_id=patient_id),
            ],
            custom={
                "name": f"Appointment {channel_id}",
                "appointment_id": appointment.id,
            },
        )
    )
    return channel_id


def verify_stream_webhook(request):
    signature = request.headers.get("x-signature")
    body = request.body

    if not signature or not body:
        return False

    expected_signature = hmac.new(
        settings.STREAM_API_SECRET.encode("utf-8"), msg=body, digestmod=hashlib.sha256
    ).hexdigest()

    return hmac.compare_digest(signature, expected_signature)


chat_client = Stream(
    api_key=settings.STREAM_API_KEY, api_secret=settings.STREAM_API_SECRET
)
