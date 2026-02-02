"""
Local test for Teacher Mode image flow: attachments/analyze -> teacher/message with context_pack_id.
Run from repo root: python -m pytest tests/test_teacher_mode_image_flow.py -v -s
Or: python tests/test_teacher_mode_image_flow.py
"""
import base64
import io
import unittest
from unittest.mock import patch, MagicMock

from app import app
import routes  # noqa: F401
from api.mobile import generate_token


def _auth_headers(user_id: str = "test-user"):
    token = generate_token(user_id)
    return {"Authorization": f"Bearer {token}"}


def _tiny_png_bytes() -> bytes:
    return base64.b64decode(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8"
        "/w8AAn8B9oWZ2QAAAABJRU5ErkJggg=="
    )


class TeacherModeImageFlowTests(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()

    def test_attachments_analyze_one_image_returns_200_or_clear_error(self):
        """POST /attachments/analyze with one valid PNG: expect 200 + pack or 500 with message."""
        data = {
            "prompt": "What is in this image?",
            "chat_id": "test-session-123",
            "images": (io.BytesIO(_tiny_png_bytes()), "image.png", "image/png"),
        }
        # Flask test client: for one file use tuple (file, filename, content_type)
        res = self.client.post(
            "/api/mobile/attachments/analyze",
            data=data,
            content_type="multipart/form-data",
            headers=_auth_headers(),
        )
        self.assertIn(
            res.status_code,
            (200, 500),
            f"Expected 200 or 500, got {res.status_code}: {res.get_data(as_text=True)}",
        )
        body = res.get_json() or {}
        if res.status_code == 200:
            self.assertTrue(body.get("success"), body)
            self.assertIn("data", body)
            self.assertIn("id", body["data"], "Context pack should have id")
            print(f"  -> Context pack id: {body['data']['id']}")
        else:
            self.assertFalse(body.get("success"))
            msg = body.get("message", "")
            self.assertTrue(
                msg,
                "500 should return a message (e.g. Vertex AI not available / Image analysis failed)",
            )
            print(f"  -> Error (expected if Vertex not configured): {msg}")

    @patch("api.mobile.get_user_credits")
    @patch("api.mobile.advanced_credit_service")
    @patch("utils.session_manager.session_manager")
    def test_teacher_message_accepts_empty_message_when_context_pack_id_set(
        self, mock_sm, mock_credit_svc, mock_get_credits
    ):
        """teacher/message with message='' and context_pack_id should be accepted (400 if pack missing)."""
        mock_get_credits.return_value = 100
        mock_credit_svc.check_and_deduct_credits.return_value = {
            "success": True,
            "credits_remaining": 90,
        }
        session_id = "flow-test-session"
        mock_sm.get_data.return_value = {
            "session_id": session_id,
            "subject": "Biology",
            "grade_level": "O-Level",
            "topic": "",
            "conversation_history": [],
        }

        res = self.client.post(
            "/api/mobile/teacher/message",
            json={
                "session_id": session_id,
                "message": "",
                "context_pack_id": "nonexistent-pack-id",
            },
            headers=_auth_headers(),
        )
        # Without a real pack we get 400 Invalid or expired context pack
        self.assertEqual(res.status_code, 400, res.get_data(as_text=True))
        body = res.get_json() or {}
        self.assertIn("message", body)
        self.assertIn("context pack", body["message"].lower())
        print(f"  -> teacher/message with empty message + bad context_pack_id: 400 as expected: {body['message']}")

    @patch("api.mobile.get_user_credits")
    @patch("api.mobile.advanced_credit_service")
    @patch("utils.session_manager.session_manager")
    @patch("services.context_pack_service.context_pack_service")
    @patch("services.vertex_service.vertex_service")
    def test_teacher_message_injects_context_pack_into_prompt(
        self, mock_vertex, mock_cp_svc, mock_sm, mock_credit_svc, mock_get_credits
    ):
        """When context_pack_id is set, teacher/message loads pack and injects summary into prompt."""
        mock_get_credits.return_value = 100
        mock_credit_svc.check_and_deduct_credits.return_value = {
            "success": True,
            "credits_remaining": 90,
        }
        session_id = "flow-test-session"
        mock_sm.get_data.return_value = {
            "session_id": session_id,
            "subject": "Biology",
            "grade_level": "O-Level",
            "topic": "",
            "conversation_history": [],
        }
        pack_id = "mock-pack-123"
        combined_summary = "The image shows a cell diagram with nucleus and mitochondria."
        mock_cp_svc.get_context_pack.return_value = {
            "id": pack_id,
            "combined_summary": combined_summary,
            "images": [
                {
                    "per_image_summary": "Cell diagram",
                    "extracted_text": "nucleus, mitochondria",
                }
            ],
        }
        mock_vertex.is_available.return_value = True
        mock_vertex.generate_text.return_value = {
            "success": True,
            "text": "Based on the cell diagram you shared, the nucleus contains the genetic material...",
        }

        res = self.client.post(
            "/api/mobile/teacher/message",
            json={
                "session_id": session_id,
                "message": "Explain this image",
                "context_pack_id": pack_id,
            },
            headers=_auth_headers(),
        )
        self.assertEqual(res.status_code, 200, res.get_data(as_text=True))
        body = res.get_json() or {}
        self.assertTrue(body.get("success"))
        self.assertIn("data", body)
        self.assertIn("response", body["data"])
        # Prompt passed to Vertex should contain the context pack summary
        call_args = mock_vertex.generate_text.call_args
        self.assertIsNotNone(call_args)
        full_prompt = call_args[0][0] if call_args[0] else (call_args[1] or {}).get("full_prompt", "")
        self.assertIn(
            combined_summary,
            full_prompt,
            "Teacher prompt should include context pack combined_summary",
        )
        print(f"  -> teacher/message with context_pack: 200, prompt includes image summary.")


def run_flow_manually():
    """Run the real attachments/analyze flow (no mocks). Use for local sanity check."""
    from app import app
    import routes  # noqa: F401

    client = app.test_client()
    headers = _auth_headers()

    print("1. POST /api/mobile/attachments/analyze (1 image)...")
    data = {
        "prompt": "What is in this image?",
        "chat_id": "manual-test",
        "images": (io.BytesIO(_tiny_png_bytes()), "image.png", "image/png"),
    }
    res = client.post(
        "/api/mobile/attachments/analyze",
        data=data,
        content_type="multipart/form-data",
        headers=headers,
    )
    print(f"   Status: {res.status_code}, Body: {res.get_json()}")
    if res.status_code != 200:
        print("   (Vertex AI may not be configured locally; 500 is acceptable.)")
        return
    pack_id = res.get_json()["data"]["id"]
    print(f"   Context pack id: {pack_id}")

    print("2. POST /api/mobile/teacher/start...")
    start_res = client.post(
        "/api/mobile/teacher/start",
        json={"subject": "Biology", "grade_level": "O-Level", "topic": ""},
        headers=headers,
    )
    if start_res.status_code != 200:
        print(f"   Status: {start_res.status_code} (credits may be required). Body: {start_res.get_json()}")
        return
    session_id = start_res.get_json()["data"]["session_id"]
    print(f"   Session id: {session_id}")

    print("3. POST /api/mobile/teacher/message (with context_pack_id, message empty then with text)...")
    msg_res = client.post(
        "/api/mobile/teacher/message",
        json={"session_id": session_id, "message": "Explain this image", "context_pack_id": pack_id},
        headers=headers,
    )
    print(f"   Status: {msg_res.status_code}, Response: {msg_res.get_json()}")
    print("Done.")


if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == "flow":
        run_flow_manually()
    else:
        unittest.main()
