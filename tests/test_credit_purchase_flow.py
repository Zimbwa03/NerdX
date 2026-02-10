import unittest
from unittest.mock import patch

from app import app
import routes  # noqa: F401 (registers blueprints)
from api.mobile import generate_token


def _auth_headers(user_id: str = "test-user"):
    token = generate_token(user_id)
    return {"Authorization": f"Bearer {token}"}


def _matches_filters(row: dict, filters: dict | None) -> bool:
    if not filters:
        return True
    for key, raw in filters.items():
        value = str(row.get(key, ""))
        if not isinstance(raw, str):
            if value != str(raw):
                return False
            continue
        if raw.startswith("eq."):
            if value != raw[3:]:
                return False
        elif raw.startswith("not.eq."):
            if value == raw[7:]:
                return False
        elif raw.startswith("in.(") and raw.endswith(")"):
            allowed = [v.strip() for v in raw[4:-1].split(",") if v.strip()]
            if value not in allowed:
                return False
        elif raw.startswith("not.in.(") and raw.endswith(")"):
            denied = [v.strip() for v in raw[8:-1].split(",") if v.strip()]
            if value in denied:
                return False
        else:
            # Unknown operator; assume match (keeps the stub minimal).
            continue
    return True


class PaynowApprovalIdempotencyTests(unittest.TestCase):
    def test_approve_paynow_payment_claims_once(self):
        from services.payment_service import PaymentService

        payment_row = {
            "reference_code": "REF123",
            "user_id": "u1",
            "package_id": "lite",
            "status": "paid",  # provider-paid, credits not applied yet
            "credits": 1500,  # units
            "credits_added": 0,
        }
        add_calls = []

        def fake_make_supabase_request(method, table, data=None, select="*", filters=None, limit=None, offset=None, use_service_role=False):
            if table != "payment_transactions":
                return []
            if method == "GET":
                if _matches_filters(payment_row, filters):
                    return [payment_row.copy()]
                return []
            if method == "PATCH":
                if _matches_filters(payment_row, filters):
                    payment_row.update(data or {})
                    return [payment_row.copy()]
                return []
            raise AssertionError(f"Unexpected method: {method}")

        def fake_add_credits(user_id, amount, *args, **kwargs):
            add_calls.append((user_id, amount))
            return True

        with patch("services.payment_service.make_supabase_request", new=fake_make_supabase_request), patch(
            "services.payment_service.add_credits", new=fake_add_credits
        ), patch("services.payment_service.get_user_registration", return_value={"chat_id": "u1"}), patch(
            "services.payment_service.PaymentService.send_paynow_confirmation_message", return_value=None
        ):
            svc = PaymentService()
            first = svc.approve_paynow_payment("REF123")
            self.assertTrue(first.get("success"))
            self.assertEqual(len(add_calls), 1)
            self.assertEqual(payment_row["status"], "approved")
            self.assertEqual(int(payment_row["credits_added"]), 1500)

            second = svc.approve_paynow_payment("REF123")
            self.assertTrue(second.get("success"))
            self.assertEqual(len(add_calls), 1, "second call must not add credits again")


class MobilePaymentStatusSemanticsTests(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()

    def test_paid_false_until_credits_applied(self):
        # status='paid' but credits_added=0 -> paid must be False for mobile UI
        def fake_make_supabase_request(method, table, data=None, select="*", filters=None, limit=None, offset=None, use_service_role=False):
            if method == "GET" and table == "payment_transactions":
                return [
                    {
                        "reference_code": "REFPAID",
                        "user_id": "u1",
                        "status": "paid",
                        "amount": 2.0,
                        "credits": 1500,
                        "credits_added": 0,
                    }
                ]
            return []

        with patch("database.external_db.make_supabase_request", new=fake_make_supabase_request), patch(
            "services.payment_service.payment_service.check_paynow_payment_status", return_value={"success": True}
        ):
            res = self.client.get("/api/mobile/payment/status/REFPAID", headers=_auth_headers("u1"))
            self.assertEqual(res.status_code, 200)
            payload = res.get_json()
            self.assertTrue(payload["success"])
            self.assertFalse(payload["data"]["paid"])
            self.assertEqual(payload["data"]["status"], "paid")

    def test_paid_true_when_credits_added(self):
        # credits_added>0 -> paid must be True and status normalized to approved
        def fake_make_supabase_request(method, table, data=None, select="*", filters=None, limit=None, offset=None, use_service_role=False):
            if method == "GET" and table == "payment_transactions":
                return [
                    {
                        "reference_code": "REFDONE",
                        "user_id": "u1",
                        "status": "paid",
                        "amount": 2.0,
                        "credits": 1500,
                        "credits_added": 1500,
                    }
                ]
            return []

        with patch("database.external_db.make_supabase_request", new=fake_make_supabase_request), patch(
            "services.payment_service.payment_service.check_paynow_payment_status", return_value={"success": True}
        ):
            res = self.client.get("/api/mobile/payment/status/REFDONE", headers=_auth_headers("u1"))
            self.assertEqual(res.status_code, 200)
            payload = res.get_json()
            self.assertTrue(payload["success"])
            self.assertTrue(payload["data"]["paid"])
            self.assertEqual(payload["data"]["status"], "approved")


class SchoolStudentPurchaseBlockedTests(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()

    def test_school_student_cannot_purchase_packages(self):
        with patch(
            "api.mobile.get_user_registration",
            return_value={"chat_id": "u-school", "user_type": "school_student", "email": "s@example.com"},
        ):
            res = self.client.post(
                "/api/mobile/credits/purchase",
                json={"package_id": "lite", "payment_method": "ecocash"},
                headers=_auth_headers("u-school"),
            )
            self.assertEqual(res.status_code, 403)
            payload = res.get_json()
            self.assertFalse(payload["success"])
