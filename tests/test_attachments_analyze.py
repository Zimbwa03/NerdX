import base64
import io
import unittest

from app import app
import routes  # noqa: F401  (registers blueprints)
from api.mobile import generate_token


def _auth_headers(user_id: str = "test-user"):
    token = generate_token(user_id)
    return {"Authorization": f"Bearer {token}"}


def _tiny_png_bytes() -> bytes:
    # 1x1 transparent PNG
    return base64.b64decode(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8"
        "/w8AAn8B9oWZ2QAAAABJRU5ErkJggg=="
    )


class AttachmentsAnalyzeTests(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()

    def test_requires_multipart(self):
        res = self.client.post(
            "/api/mobile/attachments/analyze",
            json={"prompt": "hello"},
            headers=_auth_headers(),
        )
        self.assertEqual(res.status_code, 400)

    def test_requires_at_least_one_image(self):
        res = self.client.post(
            "/api/mobile/attachments/analyze",
            data={"prompt": "hello"},
            content_type="multipart/form-data",
            headers=_auth_headers(),
        )
        self.assertEqual(res.status_code, 400)

    def test_rejects_too_many_images(self):
        images = []
        for i in range(11):
            images.append((io.BytesIO(_tiny_png_bytes()), f"img_{i}.png", "image/png"))

        res = self.client.post(
            "/api/mobile/attachments/analyze",
            data={"prompt": "hello", "images": images},
            content_type="multipart/form-data",
            headers=_auth_headers(),
        )
        self.assertEqual(res.status_code, 400)

    def test_rejects_invalid_mime(self):
        # Send a .txt as an "image"
        res = self.client.post(
            "/api/mobile/attachments/analyze",
            data={
                "prompt": "hello",
                "images": (io.BytesIO(b"not an image"), "x.txt", "text/plain"),
            },
            content_type="multipart/form-data",
            headers=_auth_headers(),
        )
        self.assertEqual(res.status_code, 400)


if __name__ == "__main__":
    unittest.main()

