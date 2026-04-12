from google import genai
from django.conf import settings
from medconnectapp.models import Specialty

client = genai.Client(api_key=settings.GEMINI_API_KEY)


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
        print(f"Lỗi gọi API: {ex}")
