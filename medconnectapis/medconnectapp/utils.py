import hashlib
import hmac
import json
import os
from datetime import datetime

import firebase_admin
import requests
from django.conf import settings
from firebase_admin import credentials, messaging
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
    callback_url="https://dreaded-chain-securely.ngrok-free.dev/payments/zalopay-callback/",
):
    app_id = ZALOPAY_CONFIG["APP_ID"]
    key1 = ZALOPAY_CONFIG["KEY1"]
    endpoint = f"{ZALOPAY_CONFIG['ENDPOINT']}/create"
    trans_id = f"{datetime.now().strftime('%y%m%d_%H%M%S')}_{order_id}"
    now = datetime.now()
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

    if mac == mac_key2:
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

    message = messaging.MulticastMessage(
        notification=messaging.Notification(
            title=title,
            body=body,
        ),
        data=data or {},
        tokens=tokens,
    )
    response = messaging.send_multicast(message)
    return response


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
