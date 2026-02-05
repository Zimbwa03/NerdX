"""
ZIMSEC O-Level Paper 2 Correction of Errors question generator.
Uses Vertex AI (Gemini) only. Students practice different error-correction scenarios each time.

Aligned with ZIMSEC 7112 Correction of Errors: types of errors, journal entries to correct.
"""

import logging
import uuid
from typing import Any, Dict

from utils.vertex_ai_helper import try_vertex_json

logger = logging.getLogger(__name__)

CORRECTION_OF_ERRORS_SYSTEM = (
    "You are an expert ZIMSEC O-Level Principles of Accounting (7112) examiner specializing in "
    "Paper 2 Correction of Errors. "
    "Generate realistic, curriculum-aligned correction of errors practice questions for mobile learning. "
    "Use Zimbabwean business names and context where appropriate. "
    "Respond with valid JSON only."
)


def _fallback_question() -> Dict[str, Any]:
    """Static fallback when Vertex is unavailable or fails."""
    return {
        "question_id": "fallback-correction-errors",
        "question_type": "correction_of_errors",
        "difficulty_level": "intermediate",
        "marks": 18,
        "time_estimate": "22 minutes",
        "scenario": {
            "business_name": "Rudo General Dealer",
            "financial_year_end": "31 December 2025",
            "context": "The trial balance of Rudo General Dealer does not agree. The following errors were discovered. Prepare journal entries to correct them and state the corrected trial balance totals.",
            "additional_info": "",
        },
        "question_data": {
            "trial_balance": [
                {"account": "Debit total (as extracted)", "debit": 245000, "credit": None},
                {"account": "Credit total (as extracted)", "debit": None, "credit": 241000},
            ],
            "errors": [
                {"id": "err_1", "type": "omission", "description": "A credit purchase of $2,000 was not entered in the purchases account."},
                {"id": "err_2", "type": "commission", "description": "Electricity paid $500 was debited to the rates account."},
                {"id": "err_3", "type": "reversal", "description": "A payment of $1,500 to a creditor was debited to the creditor and credited to cash."},
            ],
            "adjustments": [
                {"id": "adj_1", "type": "omission", "description": "Credit purchase $2,000 not entered: Dr Purchases, Cr Payables."},
                {"id": "adj_2", "type": "commission", "description": "Electricity $500 wrong account: Dr Electricity, Cr Rates."},
                {"id": "adj_3", "type": "reversal", "description": "Payment $1,500 reversed: Dr Payables $3,000, Cr Cash $3,000 (correct double entry)."},
            ],
        },
        "requirements": [
            "Prepare journal entries to correct the above errors.",
            "State the corrected debit and credit totals for the trial balance.",
        ],
        "step_by_step_guidance": [
            {"step": 1, "instruction": "Identify each error type", "hint": "Omission, commission, reversal, principle, compensating."},
            {"step": 2, "instruction": "Write the correcting journal entry", "hint": "Debit and credit the correct accounts with correct amounts."},
            {"step": 3, "instruction": "Determine effect on trial balance", "hint": "Each entry may change debit total, credit total, or both."},
            {"step": 4, "instruction": "Calculate corrected totals", "hint": "Apply all corrections to the extracted totals."},
        ],
        "model_answer_summary": {
            "corrected_debit_total": 247000,
            "corrected_credit_total": 247000,
        },
        "source": "fallback",
    }


def generate_correction_of_errors_question(
    difficulty_level: str = "intermediate",
    format_type: str = "vertical",
) -> Dict[str, Any]:
    """Generate one Correction of Errors practice question using Vertex AI only."""
    prompt = f"""Generate ONE ZIMSEC O-Level Paper 2 Correction of Errors practice question.

**Parameters:** difficulty_level: {difficulty_level}, format: {format_type}

**Requirements:**
- Use a realistic Zimbabwean business name (e.g. Rudo General Dealer, Chipo Stores).
- Provide 3–4 errors: e.g. omission, commission (wrong account), reversal of entries, error of principle. Describe each error clearly.
- Include trial_balance with debit_total and credit_total (they may not agree). Optionally list accounts with wrong balances.
- All amounts consistent. Financial year end e.g. 31 December 2025.

**question_data must include:** trial_balance (array with at least debit total and credit total, or full list of accounts), and "errors" array with id, type, description. You may also include "adjustments" with the correcting entry descriptions for the model.

**Response format – return ONLY this JSON object (no markdown, no code fence):**
{{
  "question_id": "unique-id",
  "question_type": "correction_of_errors",
  "difficulty_level": "{difficulty_level}",
  "marks": 18,
  "time_estimate": "22 minutes",
  "scenario": {{ "business_name": "...", "financial_year_end": "31 December 2025", "context": "...", "additional_info": "" }},
  "question_data": {{
    "trial_balance": [{{"account": "...", "debit": number or null, "credit": number or null}}],
    "errors": [{{"id": "err_1", "type": "omission|commission|reversal|principle", "description": "Full sentence"}}],
    "adjustments": [{{"id": "adj_1", "type": "...", "description": "Correcting entry description"}}]
  }},
  "requirements": ["Prepare journal entries to correct the errors", "State corrected trial balance totals"],
  "step_by_step_guidance": [
    {{"step": 1, "instruction": "Identify each error type", "hint": "..."}},
    {{"step": 2, "instruction": "Write the correcting journal entry", "hint": "..."}},
    {{"step": 3, "instruction": "Determine effect on trial balance", "hint": "..."}},
    {{"step": 4, "instruction": "Calculate corrected totals", "hint": "..."}}
  ],
  "model_answer_summary": {{
    "corrected_debit_total": number,
    "corrected_credit_total": number
  }}
}}

Generate exactly one question. Return only the JSON object."""

    full_prompt = f"{CORRECTION_OF_ERRORS_SYSTEM}\n\n{prompt}"
    context = f"correction_of_errors:{difficulty_level}"

    logger.info("Generating Correction of Errors question with Vertex AI: %s", context)
    result = try_vertex_json(full_prompt, logger=logger, context=context)

    if not result or not isinstance(result, dict):
        logger.warning("Vertex AI returned no valid Correction of Errors question; using fallback")
        return _fallback_question()

    if "scenario" not in result:
        result["scenario"] = _fallback_question()["scenario"]
    qd = result.get("question_data") or {}
    if "trial_balance" not in qd:
        qd["trial_balance"] = _fallback_question()["question_data"]["trial_balance"]
    if "errors" not in qd:
        qd["errors"] = _fallback_question()["question_data"].get("errors", _fallback_question()["question_data"]["adjustments"])
    if "adjustments" not in qd and "errors" in qd:
        qd["adjustments"] = qd["errors"]
    result["question_data"] = qd

    result.setdefault("question_id", f"ce-{uuid.uuid4().hex[:12]}")
    result.setdefault("step_by_step_guidance", _fallback_question()["step_by_step_guidance"])
    result.setdefault("requirements", _fallback_question()["requirements"])
    result["source"] = "vertex_ai"

    return result
