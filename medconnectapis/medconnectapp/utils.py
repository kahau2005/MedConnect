import hashlib
import hmac
import os
import urllib.parse

from google import genai

from medconnectapp.models import Specialty


client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def get_recommend_specialty(symptoms):
    specialties = Specialty.objects.all()
    if not specialties.exists():
        return None

    specialty_names = [s.name for s in specialties]
    specialty_list_str = ", ".join(specialty_names)

    prompt = f"""
    Act as a medical routing assistant.
    Available specialties in our clinic: [{specialty_list_str}].
    Patient symptoms: "{symptoms}".

    Analyze the symptoms and determine the most appropriate specialty from the exact list provided.
    Rules:
    1. Reply ONLY with the exact name of the specialty.
    2. Do not add any extra text, punctuation, or explanation.
    3. If the symptoms do not match any specialty, reply with "General Practice" or "Unknown".
    """

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )
        predicted_specialty_name = response.text

        recommended_specialty = Specialty.objects.filter(
            name__iexact=predicted_specialty_name
        ).first()
        return recommended_specialty
    except Exception as ex:
        raise Exception(str(ex))


class VNPay:
    def __init__(self):
        self.requestData = {}
        self.responseData = {}

    def get_mac(self, secret_key, data):
        hashValue = hmac.new(
            secret_key.encode("utf-8"), data.encode("utf-8"), hashlib.sha512
        ).hexdigest()
        return hashValue

    def get_payment_url(self, vnpay_payment_url, secret_key):
        inputData = sorted(self.requestData.items())
        queryString = ""
        hasData = ""
        seq = 0

        for key, val in inputData:
            if seq == 1:
                queryString = (
                    queryString + "&" + key + "=" + urllib.parse.quote_plus(str(val))
                )
                hasData = (
                    hasData + "&" + str(key) + "=" + urllib.parse.quote_plus(str(val))
                )
            else:
                seq = 1
                queryString = key + "=" + urllib.parse.quote_plus(str(val))
                hasData = str(key) + "=" + urllib.parse.quote_plus(str(val))

        secureHash = self.get_mac(secret_key, hasData)
        return vnpay_payment_url + "?" + queryString + "&vnp_SecureHash=" + secureHash

    def validate_response(self, secret_key):
        vnp_SecureHash = self.responseData.pop("vnp_SecureHash", None)
        self.responseData.pop("vnp_SecureHashType", None)

        inputData = sorted(self.responseData.items())
        hasData = ""
        seq = 0
        for key, val in inputData:
            if str(key).startswith("vnp_"):
                if seq == 1:
                    hasData = (
                        hasData
                        + "&"
                        + str(key)
                        + "="
                        + urllib.parse.quote_plus(str(val))
                    )
                else:
                    seq = 1
                    hasData = str(key) + "=" + urllib.parse.quote_plus(str(val))

        hashValue = self.get_mac(secret_key, hasData)
        return vnp_SecureHash == hashValue


def get_client_ip(request):
    x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded_for:
        ip = x_forwarded_for.split(",")[0]
    else:
        ip = request.META.get("REMOTE_ADDR")
    return ip
