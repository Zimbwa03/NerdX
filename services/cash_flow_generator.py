"""
ZIMSEC O-Level Paper 2 Cash Flow Statement question generator.
Uses Vertex AI (Gemini) only. Students practice different cash flow scenarios each time.

Aligned with ZIMSEC 7112 Cash Flow: operating, investing, financing activities.
"""

import logging
import uuid
from typing import Any, Dict

from utils.vertex_ai_helper import try_vertex_json

logger = logging.getLogger(__name__)

CASH_FLOW_SYSTEM = (
    "You are an expert ZIMSEC O-Level Principles of Accounting (7112) examiner specializing in "
    "Paper 2 Cash Flow Statement questions. "
    "Generate realistic, curriculum-aligned cash flow practice questions for mobile learning. "
    "Use Zimbabwean business names and context where appropriate. "
    "Respond with valid JSON only."
)


def _fallback_question() -> Dict[str, Any]:
    """Static fallback when Vertex is unavailable or fails."""
    return {
        "question_id": "fallback-cash-flow",
        "question_type": "cash_flow",
        "difficulty_level": "intermediate",
        "marks": 18,
        "time_estimate": "22 minutes",
        "scenario": {
            "business_name": "Tendai Electronics",
            "financial_year_end": "31 December 2025",
            "context": "Prepare a Cash Flow Statement for the year ended 31 December 2025 showing clearly net cash from operating, investing and financing activities.",
            "additional_info": "",
        },
        "question_data": {
            "trial_balance": [
                {"account": "Profit before tax", "debit": None, "credit": 52000},
                {"account": "Depreciation", "debit": 8000, "credit": None},
                {"account": "Interest expense", "debit": 3000, "credit": None},
                {"account": "Increase in inventory", "debit": 5000, "credit": None},
                {"account": "Increase in receivables", "debit": 4000, "credit": None},
                {"account": "Increase in payables", "debit": None, "credit": 6000},
                {"account": "Purchase of equipment", "debit": 25000, "credit": None},
                {"account": "Proceeds from loan", "debit": None, "credit": 20000},
                {"account": "Dividends paid", "debit": 15000, "credit": None},
                {"account": "Cash and bank (1 Jan 2025)", "debit": 12000, "credit": None},
            ],
            "adjustments": [
                {"id": "adj_1", "type": "operating", "description": "Add back depreciation (non-cash)"},
                {"id": "adj_2", "type": "operating", "description": "Deduct increase in inventory and receivables; add increase in payables"},
                {"id": "adj_3", "type": "investing", "description": "Purchase of equipment is cash outflow"},
                {"id": "adj_4", "type": "financing", "description": "Loan proceeds inflow; dividends paid outflow"},
            ],
        },
        "requirements": [
            "Prepare a Cash Flow Statement for the year ended 31 December 2025",
            "Show net cash from operating, investing and financing activities",
        ],
        "step_by_step_guidance": [
            {"step": 1, "instruction": "Net cash from operating activities", "hint": "Start with profit; add back depreciation; adjust for working capital changes."},
            {"step": 2, "instruction": "Net cash from investing activities", "hint": "Purchase of non-current assets = outflow; disposal = inflow."},
            {"step": 3, "instruction": "Net cash from financing activities", "hint": "Loan received = inflow; loan repaid or dividends paid = outflow."},
            {"step": 4, "instruction": "Net change in cash", "hint": "Sum of operating + investing + financing."},
            {"step": 5, "instruction": "Reconcile opening and closing cash", "hint": "Opening cash + net change = closing cash."},
        ],
        "model_answer_summary": {
            "net_cash_operating": 44000,
            "net_cash_investing": -25000,
            "net_cash_financing": 5000,
            "net_change_cash": 24000,
            "closing_cash": 36000,
        },
        "source": "fallback",
    }


def generate_cash_flow_question(
    difficulty_level: str = "intermediate",
    format_type: str = "vertical",
) -> Dict[str, Any]:
    """Generate one Cash Flow Statement practice question using Vertex AI only."""
    prompt = f"""Generate ONE ZIMSEC O-Level Paper 2 Cash Flow Statement practice question.

**Parameters:** difficulty_level: {difficulty_level}, format: {format_type}

**Requirements:**
- Use a realistic Zimbabwean business name (e.g. Tendai Electronics, Rudo Stores).
- Provide data that allows calculation of: net cash from operating (profit + depreciation ± working capital changes), investing (purchase/sale of assets), financing (loans, dividends).
- Trial balance or extract should include: profit, depreciation, interest, changes in inventory/receivables/payables, capital expenditure, loan movements, dividends. All amounts consistent.
- Financial year end e.g. 31 December 2025.

**Response format – return ONLY this JSON object (no markdown, no code fence):**
{{
  "question_id": "unique-id",
  "question_type": "cash_flow",
  "difficulty_level": "{difficulty_level}",
  "marks": 18,
  "time_estimate": "22 minutes",
  "scenario": {{ "business_name": "...", "financial_year_end": "31 December 2025", "context": "...", "additional_info": "" }},
  "question_data": {{
    "trial_balance": [{{"account": "...", "debit": number or null, "credit": number or null}}],
    "adjustments": [{{"id": "adj_1", "type": "operating|investing|financing", "description": "..."}}]
  }},
  "requirements": ["Prepare a Cash Flow Statement...", "Show net cash from operating, investing, financing"],
  "step_by_step_guidance": [
    {{"step": 1, "instruction": "Net cash from operating activities", "hint": "..."}},
    {{"step": 2, "instruction": "Net cash from investing activities", "hint": "..."}},
    {{"step": 3, "instruction": "Net cash from financing activities", "hint": "..."}},
    {{"step": 4, "instruction": "Net change in cash", "hint": "..."}},
    {{"step": 5, "instruction": "Reconcile opening and closing cash", "hint": "..."}}
  ],
  "model_answer_summary": {{
    "net_cash_operating": number,
    "net_cash_investing": number,
    "net_cash_financing": number,
    "net_change_cash": number,
    "closing_cash": number
  }}
}}

Generate exactly one question. Return only the JSON object."""

    full_prompt = f"{CASH_FLOW_SYSTEM}\n\n{prompt}"
    context = f"cash_flow:{difficulty_level}"

    logger.info("Generating Cash Flow question with Vertex AI: %s", context)
    result = try_vertex_json(full_prompt, logger=logger, context=context)

    if not result or not isinstance(result, dict):
        logger.warning("Vertex AI returned no valid Cash Flow question; using fallback")
        return _fallback_question()

    if "scenario" not in result:
        result["scenario"] = _fallback_question()["scenario"]
    if "question_data" not in result or "trial_balance" not in result.get("question_data", {}):
        logger.warning("Vertex Cash Flow missing question_data; using fallback")
        return _fallback_question()

    result.setdefault("question_id", f"cf-{uuid.uuid4().hex[:12]}")
    result.setdefault("step_by_step_guidance", _fallback_question()["step_by_step_guidance"])
    result.setdefault("requirements", _fallback_question()["requirements"])
    result["source"] = "vertex_ai"

    return result
