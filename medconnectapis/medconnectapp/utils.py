import os
import hashlib
import hmac
import requests
import json
from datetime import datetime
from medconnectapp.models import Specialty

# from google import genai

ZALOPAY_CONFIG = {
    "APP_ID": os.getenv("ZALOPAY_APP_ID"),
    "KEY1": os.getenv("ZALOPAY_KEY1"),
    "KEY2": os.getenv("ZALOPAY_KEY2"),
    "ENDPOINT": "https://sb-openapi.zalopay.vn/v2",
}


def create_order(
    order_id,
    amount,
    description="",
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


def query_order(app_trans_id):
    app_id = ZALOPAY_CONFIG["APP_ID"]
    key1 = ZALOPAY_CONFIG["KEY1"]
    endpoint = f"{ZALOPAY_CONFIG['ENDPOINT']}/query"

    data_str = f"{app_id}|{app_trans_id}|{key1}"
    mac = hmac.new(
        key1.encode("utf-8"), data_str.encode("utf-8"), hashlib.sha256
    ).hexdigest()

    params = {"app_id": app_id, "app_trans_id": app_trans_id, "mac": mac}

    response = requests.post(endpoint, data=params)
    return response.json()


# client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
# def get_recommend_specialty(symptoms):
#     specialties = Specialty.objects.all()
#     if not specialties.exists():
#         return None
#
#     specialty_names = [s.name for s in specialties]
#     specialty_list_str = ", ".join(specialty_names)
#
#     prompt = f"""
#     Act as a medical routing assistant.
#     Available specialties in our clinic: [{specialty_list_str}].
#     Patient symptoms: "{symptoms}".
#
#     Analyze the symptoms and determine the most appropriate specialty from the exact list provided.
#     Rules:
#     1. Reply ONLY with the exact name of the specialty.
#     2. Do not add any extra text, punctuation, or explanation.
#     3. If the symptoms do not match any specialty, reply with "General Practice" or "Unknown".
#     """
#
#     try:
#         response = client.models.generate_content(
#             model="gemini-2.5-flash",
#             contents=prompt,
#         )
#         predicted_specialty_name = response.text
#
#         recommended_specialty = Specialty.objects.filter(
#             name__iexact=predicted_specialty_name
#         ).first()
#         return recommended_specialty
#     except Exception as ex:
#         raise Exception(str(ex))
