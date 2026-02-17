"""
Lesson Payment Service for NerdX Teacher Marketplace

Handles:
- Student wallet top-ups via EcoCash/Card (reuses Paynow integration)
- Lesson payment deductions ($0.50 per lesson)
- Teacher earnings recording (80% = $0.40 per lesson)
- NerdX commission collection (20% = $0.10 per lesson)
- Teacher payout requests (14-day hold, $5 minimum, EcoCash)
- Cancellation and refund logic
"""

import logging
import uuid
from datetime import datetime, timedelta
from typing import Dict, Optional

from database.external_db import (
    make_supabase_request,
    get_lesson_wallet,
    topup_lesson_wallet,
    deduct_lesson_wallet,
    refund_lesson_wallet,
    record_teacher_earning,
    cancel_teacher_earning,
    get_teacher_earnings_summary,
    get_teacher_earnings_history,
    get_available_earnings_for_payout,
    create_teacher_payout,
    complete_teacher_payout,
    get_teacher_payouts,
    get_wallet_transactions,
    LESSON_FEE,
    LESSON_COMMISSION,
    TEACHER_EARNING_PER_LESSON,
    MINIMUM_PAYOUT,
    PAYOUT_HOLD_DAYS,
)
from services.paynow_service import paynow_service

logger = logging.getLogger(__name__)

# Wallet top-up amounts (quick-select options)
TOPUP_AMOUNTS = [1.00, 2.00, 5.00, 10.00]
LESSON_DURATION_MINUTES = 45
LESSON_WARNING_MINUTES = 40


class LessonPaymentService:
    """Manages lesson wallet payments, teacher earnings, and payouts."""

    def generate_wallet_reference(self, user_id: str) -> str:
        """Generate unique reference for wallet top-up."""
        timestamp = datetime.utcnow().strftime("%m%d%H%M%S")
        user_suffix = str(user_id or "")[-4:]
        rand_suffix = uuid.uuid4().hex[:4].upper()
        return f"NXW{timestamp}{user_suffix}{rand_suffix}"

    # ─── Student Wallet ──────────────────────────────────────────────────────

    def get_wallet_balance(self, user_id: str) -> Dict:
        """Get student's lesson wallet balance and summary."""
        wallet = get_lesson_wallet(user_id)
        if not wallet:
            return {"balance": 0.00, "total_deposited": 0.00, "total_spent": 0.00, "lessons_available": 0}

        balance = float(wallet.get("balance", 0))
        return {
            "balance": round(balance, 2),
            "total_deposited": round(float(wallet.get("total_deposited", 0)), 2),
            "total_spent": round(float(wallet.get("total_spent", 0)), 2),
            "lessons_available": int(balance // LESSON_FEE),
        }

    def initiate_wallet_topup(self, user_id: str, amount: float, payment_method: str,
                               phone_number: str = "", email: str = "") -> Dict:
        """Initiate a wallet top-up via EcoCash or Card using Paynow."""
        if amount <= 0:
            return {"success": False, "message": "Amount must be greater than zero"}

        if amount > 100:
            return {"success": False, "message": "Maximum top-up amount is $100.00"}

        reference = self.generate_wallet_reference(user_id)

        if payment_method == "ecocash":
            if not phone_number or len(phone_number) < 10:
                return {"success": False, "message": "Valid phone number required for EcoCash"}

            if not paynow_service.is_available():
                return {"success": False, "message": "Payment service temporarily unavailable"}

            payment_result = paynow_service.create_usd_ecocash_payment(
                amount=amount,
                phone_number=phone_number,
                email=email or f"{user_id}@nerdx.app",
                reference=reference,
                description=f"NerdX Lesson Wallet Top-Up - ${amount:.2f}"
            )

            if payment_result.get("success"):
                # Save to payment_transactions for tracking
                payment_data = {
                    "user_id": user_id,
                    "package_id": "wallet_topup",
                    "reference_code": reference,
                    "amount": float(amount),
                    "credits": 0,
                    "status": "initiated",
                    "payment_method": "paynow_ecocash_wallet",
                    "credits_added": 0,
                    "poll_url": payment_result.get("poll_url"),
                    "phone_number": phone_number,
                    "email": email,
                    "admin_notes": f"Wallet top-up ${amount:.2f} | Poll: {payment_result.get('poll_url')}",
                }
                try:
                    make_supabase_request("POST", "payment_transactions", payment_data, use_service_role=True)
                except Exception as e:
                    logger.warning(f"Failed to save wallet top-up transaction: {e}")

                return {
                    "success": True,
                    "reference": reference,
                    "poll_url": payment_result.get("poll_url"),
                    "instructions": payment_result.get("instructions", ""),
                    "amount": amount,
                    "payment_method": "ecocash",
                }
            else:
                return {"success": False, "message": payment_result.get("error", "Payment initiation failed")}

        elif payment_method == "visa_mastercard":
            if not paynow_service.is_available():
                return {"success": False, "message": "Payment service temporarily unavailable"}

            payment_result = paynow_service.create_usd_card_payment(
                amount=amount,
                email=email or f"{user_id}@nerdx.app",
                reference=reference,
                description=f"NerdX Lesson Wallet Top-Up - ${amount:.2f}"
            ) if hasattr(paynow_service, 'create_usd_card_payment') else {"success": False, "error": "Card payments not available"}

            if payment_result.get("success"):
                payment_data = {
                    "user_id": user_id,
                    "package_id": "wallet_topup",
                    "reference_code": reference,
                    "amount": float(amount),
                    "credits": 0,
                    "status": "initiated",
                    "payment_method": "paynow_card_wallet",
                    "credits_added": 0,
                    "phone_number": phone_number,
                    "email": email,
                    "admin_notes": f"Card wallet top-up ${amount:.2f}",
                }
                try:
                    make_supabase_request("POST", "payment_transactions", payment_data, use_service_role=True)
                except Exception as e:
                    logger.warning(f"Failed to save card wallet top-up transaction: {e}")

                return {
                    "success": True,
                    "reference": reference,
                    "redirect_url": payment_result.get("redirect_url"),
                    "amount": amount,
                    "payment_method": "visa_mastercard",
                }
            else:
                return {"success": False, "message": payment_result.get("error", "Card payment failed")}
        else:
            return {"success": False, "message": f"Unsupported payment method: {payment_method}"}

    def complete_wallet_topup(self, reference: str) -> Dict:
        """Called when a wallet top-up payment is confirmed (by webhook or polling)."""
        try:
            txns = make_supabase_request(
                "GET", "payment_transactions",
                filters={"reference_code": f"eq.{reference}", "payment_method": "in.(paynow_ecocash_wallet,paynow_card_wallet)"},
                use_service_role=True,
            )
            if not txns or len(txns) == 0:
                return {"success": False, "message": "Transaction not found"}

            txn = txns[0]
            if txn.get("status") == "approved":
                return {"success": True, "message": "Already processed", "already_processed": True}

            user_id = txn["user_id"]
            amount = float(txn["amount"])

            result = topup_lesson_wallet(user_id, amount, reference)
            if not result:
                return {"success": False, "message": "Failed to credit wallet"}

            make_supabase_request(
                "PATCH", "payment_transactions",
                data={"status": "approved", "admin_notes": f"Wallet credited ${amount:.2f}"},
                filters={"reference_code": f"eq.{reference}"},
                use_service_role=True,
            )

            logger.info(f"Wallet top-up completed: user={user_id}, amount=${amount}, ref={reference}")
            return {"success": True, "balance": result["balance"]}
        except Exception as e:
            logger.error(f"Error completing wallet top-up {reference}: {e}")
            return {"success": False, "message": "Server error"}

    # ─── Lesson Payment ──────────────────────────────────────────────────────

    def pay_for_lesson(self, student_user_id: str, booking_id: str, teacher_id: Optional[str] = None) -> Dict:
        """Deduct $0.50 from student wallet and record teacher earning."""
        # Validate booking and ownership so students can only pay for their own confirmed lessons.
        booking_rows = make_supabase_request(
            "GET",
            "lesson_bookings",
            filters={"id": f"eq.{booking_id}"},
            use_service_role=True,
        ) or []
        if not booking_rows:
            return {"success": False, "message": "Booking not found"}

        booking = booking_rows[0]
        booking_student_id = booking.get("student_id")
        booking_teacher_id = booking.get("teacher_id")
        booking_status = (booking.get("status") or "").lower()

        if booking_student_id != student_user_id:
            return {"success": False, "message": "You can only pay for your own booking"}

        if booking_status not in {"confirmed", "completed"}:
            return {"success": False, "message": "Booking must be confirmed before payment"}

        if teacher_id and booking_teacher_id and teacher_id != booking_teacher_id:
            return {"success": False, "message": "Teacher mismatch for this booking"}

        teacher_id = booking_teacher_id or teacher_id
        if not teacher_id:
            return {"success": False, "message": "Booking has no teacher assigned"}

        wallet = get_lesson_wallet(student_user_id)
        if not wallet:
            return {"success": False, "message": "Wallet not found"}

        balance = float(wallet.get("balance", 0))
        if balance < LESSON_FEE:
            return {
                "success": False,
                "message": f"Insufficient wallet balance. You need ${LESSON_FEE:.2f} but have ${balance:.2f}.",
                "insufficient_funds": True,
                "balance": balance,
                "required": LESSON_FEE,
            }

        # Check for duplicate payment
        existing = make_supabase_request(
            "GET", "teacher_earnings",
            filters={"booking_id": f"eq.{booking_id}"},
            use_service_role=True,
        )
        if existing and len(existing) > 0:
            status = existing[0].get("status")
            if status != "cancelled":
                return {"success": False, "message": "Lesson already paid for", "already_paid": True}

        # Deduct from wallet
        deduction = deduct_lesson_wallet(student_user_id, LESSON_FEE, booking_id)
        if not deduction:
            return {"success": False, "message": "Payment deduction failed"}

        # Record teacher earning
        earning = record_teacher_earning(teacher_id, booking_id)
        if not earning:
            # Refund on failure
            refund_lesson_wallet(student_user_id, LESSON_FEE, booking_id, "Auto-refund: earning record failed")
            return {"success": False, "message": "Failed to record earning, payment refunded"}

        return {
            "success": True,
            "message": f"${LESSON_FEE:.2f} deducted for lesson",
            "balance": deduction["balance"],
            "lesson_fee": LESSON_FEE,
            "teacher_earning": TEACHER_EARNING_PER_LESSON,
            "commission": LESSON_COMMISSION,
        }

    def refund_lesson(self, student_user_id: str, booking_id: str, reason: str = "Lesson cancelled") -> Dict:
        """Refund a lesson payment back to student wallet and cancel teacher earning."""
        # Idempotency: if already refunded, return current wallet state.
        existing_refund = make_supabase_request(
            "GET", "wallet_transactions",
            filters={
                "user_id": f"eq.{student_user_id}",
                "reference": f"eq.{booking_id}",
                "type": "eq.refund",
            },
            limit=1,
            use_service_role=True,
        ) or []
        if existing_refund:
            wallet = get_lesson_wallet(student_user_id) or {}
            return {
                "success": True,
                "message": "Lesson already refunded",
                "balance": round(float(wallet.get("balance", 0)), 2),
                "already_refunded": True,
            }

        # Guard: only refund if a lesson payment deduction exists for this booking.
        payment_txn = make_supabase_request(
            "GET", "wallet_transactions",
            filters={
                "user_id": f"eq.{student_user_id}",
                "reference": f"eq.{booking_id}",
                "type": "eq.lesson_payment",
            },
            limit=1,
            use_service_role=True,
        ) or []
        if not payment_txn:
            cancel_teacher_earning(booking_id)
            wallet = get_lesson_wallet(student_user_id) or {}
            return {
                "success": True,
                "message": "No lesson payment was deducted, so no wallet refund was needed",
                "balance": round(float(wallet.get("balance", 0)), 2),
                "no_refund_needed": True,
            }

        refund = refund_lesson_wallet(student_user_id, LESSON_FEE, booking_id, reason)
        if not refund:
            return {"success": False, "message": "Refund failed"}

        cancel_teacher_earning(booking_id)

        return {
            "success": True,
            "message": f"${LESSON_FEE:.2f} refunded to wallet",
            "balance": refund["balance"],
        }

    def check_cancellation_eligibility(self, booking_id: str, cancelled_by: str, scheduled_time_str: str) -> Dict:
        """Check if cancellation qualifies for a refund based on timing rules."""
        try:
            scheduled_time = datetime.fromisoformat(scheduled_time_str.replace("Z", "+00:00"))
            now = datetime.now(scheduled_time.tzinfo) if scheduled_time.tzinfo else datetime.now()
            time_until = (scheduled_time - now).total_seconds() / 3600

            if cancelled_by == "teacher":
                return {"eligible_for_refund": True, "reason": "Teacher cancelled — full refund"}
            elif cancelled_by == "student":
                if time_until > 1:
                    return {"eligible_for_refund": True, "reason": "Cancelled more than 1 hour before — full refund"}
                else:
                    return {"eligible_for_refund": False, "reason": "Cancelled less than 1 hour before — no refund (teacher still earns)"}
            else:
                return {"eligible_for_refund": True, "reason": "System cancellation — full refund"}
        except Exception as e:
            logger.error(f"Error checking cancellation eligibility: {e}")
            return {"eligible_for_refund": True, "reason": "Error determining eligibility — defaulting to refund"}

    # ─── Teacher Earnings ────────────────────────────────────────────────────

    def get_earnings_dashboard(self, teacher_id: str) -> Dict:
        """Get complete earnings dashboard data for a teacher."""
        summary = get_teacher_earnings_summary(teacher_id)
        recent = get_teacher_earnings_history(teacher_id, limit=10)
        payouts = get_teacher_payouts(teacher_id, limit=5)

        return {
            "summary": summary,
            "recent_earnings": recent,
            "recent_payouts": payouts,
            "lesson_fee": LESSON_FEE,
            "commission_rate": f"{int(LESSON_COMMISSION / LESSON_FEE * 100)}%",
            "teacher_rate": TEACHER_EARNING_PER_LESSON,
            "minimum_payout": MINIMUM_PAYOUT,
            "hold_days": PAYOUT_HOLD_DAYS,
        }

    def request_payout(self, teacher_id: str, phone_number: str) -> Dict:
        """Request an EcoCash payout for available earnings."""
        if not phone_number or len(phone_number) < 10:
            return {"success": False, "message": "Valid EcoCash phone number required"}

        total, earnings = get_available_earnings_for_payout(teacher_id)
        if total < MINIMUM_PAYOUT:
            return {
                "success": False,
                "message": f"Minimum payout is ${MINIMUM_PAYOUT:.2f}. You have ${total:.2f} available.",
                "available": total,
                "minimum": MINIMUM_PAYOUT,
            }

        payout = create_teacher_payout(teacher_id, phone_number)
        if not payout:
            return {"success": False, "message": "Failed to create payout request"}

        return {
            "success": True,
            "message": f"Payout of ${total:.2f} requested. Processing to EcoCash {phone_number}.",
            "payout": payout,
        }

    def complete_payout(self, teacher_id: str, payout_id: str, reference: str) -> Dict:
        """Mark a processing payout as completed with an EcoCash reference."""
        if not payout_id:
            return {"success": False, "message": "payout_id is required"}
        if not reference:
            return {"success": False, "message": "Payout reference is required"}

        payout_rows = make_supabase_request(
            "GET", "teacher_payouts",
            filters={"id": f"eq.{payout_id}", "teacher_id": f"eq.{teacher_id}"},
            limit=1,
            use_service_role=True,
        ) or []
        if not payout_rows:
            return {"success": False, "message": "Payout not found"}

        payout = payout_rows[0]
        status = (payout.get("status") or "").lower()
        if status == "completed":
            return {"success": True, "message": "Payout already completed", "already_completed": True}
        if status != "processing":
            return {"success": False, "message": f"Payout cannot be completed from status '{status}'"}

        ok = complete_teacher_payout(payout_id, reference)
        if not ok:
            return {"success": False, "message": "Failed to complete payout"}

        return {"success": True, "message": "Payout marked as completed"}


# Singleton instance
lesson_payment_service = LessonPaymentService()
