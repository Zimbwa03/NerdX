"""
ZIMSEC O-Level Paper 2 Not-for-Profit (Income & Expenditure, Accumulated Fund) question generator.
Uses Vertex AI (Gemini) only. Students practice different club/society scenarios each time.

Aligned with ZIMSEC 7112 Not-for-Profit Organizations: receipts and payments, income and expenditure.
"""

import logging
import uuid
from typing import Any, Dict

from utils.vertex_ai_helper import try_vertex_json

logger = logging.getLogger(__name__)

NOT_FOR_PROFIT_SYSTEM = (
    "You are an expert ZIMSEC O-Level Principles of Accounting (7112) examiner specializing in "
    "Paper 2 Not-for-Profit Organizations (clubs, societies). "
    "Generate realistic, curriculum-aligned Income & Expenditure and Accumulated Fund practice questions for mobile learning. "
    "Use Zimbabwean names and context where appropriate. "
    "Respond with valid JSON only."
)


def _fallback_question() -> Dict[str, Any]:
    """Static fallback when Vertex is unavailable or fails."""
    return {
        "question_id": "fallback-not-for-profit",
        "question_type": "not_for_profit",
        "difficulty_level": "intermediate",
        "marks": 18,
        "time_estimate": "22 minutes",
        "scenario": {
            "business_name": "Harare Youth Club",
            "financial_year_end": "31 December 2025",
            "context": "Prepare an Income & Expenditure Account for the year ended 31 December 2025 and a Statement of Accumulated Fund as at that date. Subscriptions in arrears at start $2,000; at end $1,500. Subscriptions in advance at start $800; at end $1,200.",
            "additional_info": "",
        },
        "question_data": {
            "trial_balance": [
                {"account": "Subscriptions received", "debit": None, "credit": 48000},
                {"account": "Bar sales", "debit": None, "credit": 12000},
                {"account": "Rent paid", "debit": 18000, "credit": None},
                {"account": "Wages", "debit": 15000, "credit": None},
                {"account": "Electricity", "debit": 4000, "credit": None},
                {"account": "Accumulated fund (1 Jan 2025)", "debit": None, "credit": 35000},
                {"account": "Bar purchases", "debit": 7000, "credit": None},
                {"account": "Equipment (cost)", "debit": 20000, "credit": None},
                {"account": "Bank", "debit": 21000, "credit": None},
            ],
            "adjustments": [
                {"id": "adj_1", "type": "subscriptions", "description": "Subscriptions in arrears: 1 Jan $2,000, 31 Dec $1,500; in advance: 1 Jan $800, 31 Dec $1,200"},
                {"id": "adj_2", "type": "depreciation", "description": "Depreciate equipment 10% per annum"},
                {"id": "adj_3", "type": "bar", "description": "Bar profit is income (bar sales − bar purchases)."},
            ],
        },
        "requirements": [
            "Prepare an Income & Expenditure Account for the year ended 31 December 2025",
            "Prepare a Statement of Accumulated Fund as at 31 December 2025",
        ],
        "step_by_step_guidance": [
            {"step": 1, "instruction": "Calculate subscription income", "hint": "Subscriptions received + arrears at end − arrears at start − advance at end + advance at start."},
            {"step": 2, "instruction": "List all income", "hint": "Subscriptions, bar profit, any other income."},
            {"step": 3, "instruction": "List all expenditure", "hint": "Rent, wages, electricity, depreciation."},
            {"step": 4, "instruction": "Surplus or deficit", "hint": "Total income − Total expenditure."},
            {"step": 5, "instruction": "Accumulated fund", "hint": "Opening accumulated fund + Surplus (or − Deficit)."},
        ],
        "model_answer_summary": {
            "subscription_income": 46900,
            "total_income": 59900,
            "total_expenditure": 40200,
            "surplus_or_deficit": 19700,
            "accumulated_fund_balance": 54700,
        },
        "source": "fallback",
    }


def generate_not_for_profit_question(
    difficulty_level: str = "intermediate",
    format_type: str = "vertical",
) -> Dict[str, Any]:
    """Generate one Not-for-Profit Income & Expenditure practice question using Vertex AI only."""
    prompt = f"""Generate ONE ZIMSEC O-Level Paper 2 Not-for-Profit (Income & Expenditure, Accumulated Fund) practice question.

**Parameters:** difficulty_level: {difficulty_level}, format: {format_type}

**Requirements:**
- Use a realistic Zimbabwean club/society name (e.g. Harare Youth Club, Bulawayo Sports Club).
- Trial balance must include: subscriptions received, bar sales/purchases (or similar), rent, wages, electricity, accumulated fund (opening), bank. Include adjustments for subscriptions in arrears/advance and optionally depreciation.
- All amounts consistent. Financial year end e.g. 31 December 2025.

**Structure:** Income & Expenditure: Subscription income (adjusted), bar profit, other income; less expenditure = Surplus/Deficit. Statement of Accumulated Fund: Opening + Surplus (or − Deficit) = Closing.

**Response format – return ONLY this JSON object (no markdown, no code fence):**
{{
  "question_id": "unique-id",
  "question_type": "not_for_profit",
  "difficulty_level": "{difficulty_level}",
  "marks": 18,
  "time_estimate": "22 minutes",
  "scenario": {{ "business_name": "...", "financial_year_end": "31 December 2025", "context": "...", "additional_info": "" }},
  "question_data": {{
    "trial_balance": [{{"account": "...", "debit": number or null, "credit": number or null}}],
    "adjustments": [{{"id": "adj_1", "type": "subscriptions|depreciation|bar|...", "description": "..."}}]
  }},
  "requirements": ["Prepare an Income & Expenditure Account...", "Prepare a Statement of Accumulated Fund..."],
  "step_by_step_guidance": [
    {{"step": 1, "instruction": "Calculate subscription income", "hint": "..."}},
    {{"step": 2, "instruction": "List all income", "hint": "..."}},
    {{"step": 3, "instruction": "List all expenditure", "hint": "..."}},
    {{"step": 4, "instruction": "Surplus or deficit", "hint": "..."}},
    {{"step": 5, "instruction": "Accumulated fund", "hint": "..."}}
  ],
  "model_answer_summary": {{
    "subscription_income": number,
    "total_income": number,
    "total_expenditure": number,
    "surplus_or_deficit": number,
    "accumulated_fund_balance": number
  }}
}}

Generate exactly one question. Return only the JSON object."""

    full_prompt = f"{NOT_FOR_PROFIT_SYSTEM}\n\n{prompt}"
    context = f"not_for_profit:{difficulty_level}"

    logger.info("Generating Not-for-Profit question with Vertex AI: %s", context)
    result = try_vertex_json(full_prompt, logger=logger, context=context)

    if not result or not isinstance(result, dict):
        logger.warning("Vertex AI returned no valid Not-for-Profit question; using fallback")
        return _fallback_question()

    if "scenario" not in result:
        result["scenario"] = _fallback_question()["scenario"]
    if "question_data" not in result or "trial_balance" not in result.get("question_data", {}):
        logger.warning("Vertex Not-for-Profit missing question_data; using fallback")
        return _fallback_question()

    result.setdefault("question_id", f"nfp-{uuid.uuid4().hex[:12]}")
    result.setdefault("step_by_step_guidance", _fallback_question()["step_by_step_guidance"])
    result.setdefault("requirements", _fallback_question()["requirements"])
    result["source"] = "vertex_ai"

    return result
