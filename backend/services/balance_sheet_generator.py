"""
ZIMSEC O-Level Paper 2 Balance Sheet / Statement of Financial Position question generator.
Uses Vertex AI (Gemini) only for all generations so students can practice different questions.

Aligned with Balance-Sheet-AI-Prompt.md: scenario, trial balance, adjustments, requirements,
step-by-step guidance. No DeepSeek fallback – Vertex only.
"""

import json
import logging
import uuid
from typing import Any, Dict, List, Optional

from utils.vertex_ai_helper import try_vertex_json

logger = logging.getLogger(__name__)

BALANCE_SHEET_SYSTEM = (
    "You are an expert ZIMSEC O-Level Principles of Accounting (7112) examiner specializing in "
    "Paper 2 Balance Sheet / Statement of Financial Position questions. "
    "Generate realistic, curriculum-aligned Balance Sheet practice questions for mobile learning. "
    "Use Zimbabwean business names and context where appropriate. "
    "Respond with valid JSON only."
)


def _fallback_question() -> Dict[str, Any]:
    """Static fallback (Takura Enterprises) when Vertex is unavailable or fails."""
    return {
        "question_id": "fallback-balance-sheet",
        "question_type": "balance_sheet",
        "business_type": "sole_trader",
        "difficulty_level": "intermediate",
        "marks": 20,
        "time_estimate": "24 minutes",
        "scenario": {
            "business_name": "Takura Enterprises",
            "financial_year_end": "31 December 2025",
            "context": "Sole trader. Prepare a Balance Sheet (Statement of Financial Position) as at the year end showing clearly Working Capital.",
            "additional_info": "",
        },
        "question_data": {
            "trial_balance": [
                {"account": "Capital (1 Jan 2025)", "debit": None, "credit": 50000},
                {"account": "Drawings", "debit": 8000, "credit": None},
                {"account": "Premises", "debit": 80000, "credit": None},
                {"account": "Motor Vehicles (Cost)", "debit": 40000, "credit": None},
                {"account": "Accumulated Depreciation - Vehicles (1 Jan)", "debit": None, "credit": 12000},
                {"account": "Equipment", "debit": 25000, "credit": None},
                {"account": "Inventory", "debit": 15000, "credit": None},
                {"account": "Trade Receivables", "debit": 18000, "credit": None},
                {"account": "Trade Payables", "debit": None, "credit": 12000},
                {"account": "Bank", "debit": 8500, "credit": None},
                {"account": "Cash", "debit": 500, "credit": None},
                {"account": "Sales", "debit": None, "credit": 180000},
                {"account": "Purchases", "debit": 110000, "credit": None},
                {"account": "Rent", "debit": 12000, "credit": None},
                {"account": "Salaries", "debit": 35000, "credit": None},
                {"account": "Insurance", "debit": 2400, "credit": None},
                {"account": "Electricity", "debit": 3600, "credit": None},
                {"account": "Loan from ABC Bank", "debit": None, "credit": 20000},
            ],
            "adjustments": [
                {"id": "adj_1", "type": "depreciation", "description": "Depreciate motor vehicles at 20% per annum using reducing balance method"},
                {"id": "adj_2", "type": "depreciation", "description": "Depreciate equipment at 10% per annum using straight line method"},
                {"id": "adj_3", "type": "accrual", "description": "Electricity owing at year-end: $400"},
                {"id": "adj_4", "type": "prepayment", "description": "Insurance prepaid at year-end: $600"},
                {"id": "adj_5", "type": "provision", "description": "Create provision for doubtful debts at 5% of trade receivables"},
                {"id": "adj_6", "type": "closing_stock", "description": "Closing inventory valued at $18,000"},
            ],
        },
        "requirements": [
            "Prepare a Trading Account for the year ended 31 December 2025",
            "Prepare a Profit and Loss Account for the year ended 31 December 2025",
            "Prepare a Balance Sheet as at 31 December 2025 showing clearly the working capital",
        ],
        "step_by_step_guidance": [
            {"step": 1, "instruction": "List all Non-Current Assets at Net Book Value", "hint": "Subtract accumulated depreciation from cost."},
            {"step": 2, "instruction": "List all Current Assets", "hint": "Include inventory, debtors (less provision), prepayments, bank, cash."},
            {"step": 3, "instruction": "List all Current Liabilities", "hint": "Include creditors and accrued expenses."},
            {"step": 4, "instruction": "Calculate Working Capital", "hint": "Working Capital = Current Assets − Current Liabilities"},
            {"step": 5, "instruction": "Complete the Capital Section", "hint": "Opening Capital + Net Profit − Drawings = Closing Capital"},
            {"step": 6, "instruction": "Add Long-term Liabilities", "hint": "Loans payable after 12 months from balance sheet date."},
        ],
        "model_answer_summary": {
            "working_capital": 32300,
            "closing_capital": 52500,
            "non_current_assets_total": 124900,
            "current_assets_total": 44700,
            "current_liabilities_total": 12400,
        },
        "source": "fallback",
    }


def generate_balance_sheet_question(
    business_type: str = "sole_trader",
    difficulty_level: str = "intermediate",
    format_type: str = "vertical",
) -> Dict[str, Any]:
    """
    Generate a single Balance Sheet practice question using Vertex AI only.
    Returns full question structure (scenario, trial_balance, adjustments, step_by_step_guidance, etc.).
    Uses fallback static question if Vertex is unavailable or returns invalid JSON.
    """
    prompt = f"""Generate ONE ZIMSEC O-Level Paper 2 Balance Sheet practice question.

**Parameters:**
- business_type: {business_type}
- difficulty_level: {difficulty_level}
- format: {format_type}

**Requirements:**
- Use a realistic Zimbabwean business name (e.g. Tendai Electronics, Rudo's Boutique, Chipo General Dealer, Takura Enterprises).
- Trial balance must have at least 12–18 accounts including: Capital, Drawings, at least 2 fixed assets, Accumulated Depreciation, Inventory, Trade Receivables, Trade Payables, Bank, Cash, Sales, Purchases, 2–3 expenses, and optionally a long-term loan.
- Include 4–6 adjustments: e.g. depreciation (2 assets, different methods), one accrual, one prepayment, provision for doubtful debts, closing inventory.
- All monetary amounts must be consistent (numbers that could come from a real trial balance).
- Financial year end: use a recent date e.g. 31 December 2025.

**Response format – return ONLY this JSON object (no markdown, no code fence):**
{{
  "question_id": "unique-id",
  "question_type": "balance_sheet",
  "business_type": "{business_type}",
  "difficulty_level": "{difficulty_level}",
  "marks": 18,
  "time_estimate": "22 minutes",
  "scenario": {{
    "business_name": "Business Name",
    "financial_year_end": "31 December 2025",
    "context": "One or two sentences: type of business, what the student must prepare.",
    "additional_info": ""
  }},
  "question_data": {{
    "trial_balance": [
      {{"account": "Account name", "debit": number or null, "credit": number or null}}
    ],
    "adjustments": [
      {{"id": "adj_1", "type": "depreciation|accrual|prepayment|provision|closing_stock", "description": "Full sentence"}}
    ]
  }},
  "requirements": [
    "Prepare a Trading Account for the year ended ...",
    "Prepare a Profit and Loss Account for the year ended ...",
    "Prepare a Balance Sheet as at ... showing clearly the working capital"
  ],
  "step_by_step_guidance": [
    {{"step": 1, "instruction": "List all Non-Current Assets at Net Book Value", "hint": "Short hint."}},
    {{"step": 2, "instruction": "List all Current Assets", "hint": "Short hint."}},
    {{"step": 3, "instruction": "List all Current Liabilities", "hint": "Short hint."}},
    {{"step": 4, "instruction": "Calculate Working Capital", "hint": "Formula."}},
    {{"step": 5, "instruction": "Complete the Capital Section", "hint": "Short hint."}},
    {{"step": 6, "instruction": "Add Long-term Liabilities", "hint": "Short hint."}}
  ],
  "model_answer_summary": {{
    "working_capital": number,
    "closing_capital": number,
    "non_current_assets_total": number,
    "current_assets_total": number,
    "current_liabilities_total": number
  }}
}}

Generate exactly one question now. Return only the JSON object."""

    full_prompt = f"{BALANCE_SHEET_SYSTEM}\n\n{prompt}"
    context = f"balance_sheet:{business_type}:{difficulty_level}"

    logger.info("Generating Balance Sheet question with Vertex AI: %s", context)
    result = try_vertex_json(full_prompt, logger=logger, context=context)

    if not result or not isinstance(result, dict):
        logger.warning("Vertex AI returned no valid Balance Sheet question; using fallback")
        return _fallback_question()

    # Ensure required keys and normalize
    if "scenario" not in result:
        result["scenario"] = _fallback_question()["scenario"]
    if "question_data" not in result or "trial_balance" not in result.get("question_data", {}):
        logger.warning("Vertex Balance Sheet missing question_data; using fallback")
        return _fallback_question()

    result.setdefault("question_id", f"bs-{uuid.uuid4().hex[:12]}")
    result.setdefault("step_by_step_guidance", _fallback_question()["step_by_step_guidance"])
    result.setdefault("requirements", _fallback_question()["requirements"])
    result["source"] = "vertex_ai"

    return result
