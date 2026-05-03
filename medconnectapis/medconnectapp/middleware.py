import json

from django.conf import settings


class OAuthMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path == "/o/token/" and request.method == "POST":
            try:
                body = json.loads(request.body)
                body["grant_type"] = "password"
                body["client_id"] = settings.CLIENT_ID
                body["client_secret"] = settings.CLIENT_SECRET
                request._body = json.dumps(body).encode("utf-8")
            except json.JSONDecodeError:
                pass
        return self.get_response(request)
