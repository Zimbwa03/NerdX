"""
ZIMSEC O-Level Paper 2 Income Statement / Profit and Loss Account question generator.
Uses Vertex AI (Gemini) only. Students practice different P&L scenarios each time.

Aligned with ZIMSEC 7112 Income Statement module: Net Sales, Cost of Sales, Gross Profit,
Other Income, Expenses, Net Profit. Adjustments: accruals, prepayments, depreciation,
provisions, bad debts.
"""

import logging
import uuid
from typing import Any, Dict

from utils.vertex_ai_helper import try_vertex_json

logger = logging.getLogger(__name__)

INCOME_STATEMENT_SYSTEM = (
    "You are an expert ZIMSEC O-Level Principles of Accounting (7112) examiner specializing in "
    "Paper 2 Income Statement / Profit and Loss Account questions. "
    "Generate realistic, curriculum-aligned P&L practice questions for mobile learning. "
    "Use Zimbabwean business names and context where appropriate. "
    "Respond with valid JSON only."
)


def _fallback_question() -> Dict[str, Any]:
    """Static fallback when Vertex is unavailable or fails."""
    return {
        "question_id": "fallback-income-statement",
        "question_type": "income_statement",
        "business_type": "sole_trader",
        "difficulty_level": "intermediate",
        "marks": 18,
        "time_estimate": "22 minutes",
        "scenario": {
            "business_name": "Chipo General Dealer",
            "financial_year_end": "31 December 2025",
            "context": "Sole trader. Prepare an Income Statement (Profit and Loss Account) for the year ended 31 December 2025 showing Gross Profit and Net Profit.",
            "additional_info": "",
        },
        "question_data": {
            "trial_balance": [
                {"account": "Sales", "debit": None, "credit": 240000},
                {"account": "Sales Returns", "debit": 4000, "credit": None},
                {"account": "Purchases", "debit": 140000, "credit": None},
                {"account": "Purchases Returns", "debit": None, "credit": 3000},
                {"account": "Inventory (1 Jan 2025)", "debit": 20000, "credit": None},
                {"account": "Wages and Salaries", "debit": 45000, "credit": None},
                {"account": "Rent", "debit": 18000, "credit": None},
                {"account": "Insurance", "debit": 3600, "credit": None},
                {"account": "Electricity", "debit": 5400, "credit": None},
                {"account": "Discount Received", "debit": None, "credit": 1200},
                {"account": "Discount Allowed", "debit": 1500, "credit": None},
                {"account": "Bad Debts", "debit": 800, "credit": None},
            ],
            "adjustments": [
                {"id": "adj_1", "type": "closing_stock", "description": "Closing inventory valued at $25,000"},
                {"id": "adj_2", "type": "accrual", "description": "Wages owing at year-end: $3,000"},
                {"id": "adj_3", "type": "prepayment", "description": "Insurance prepaid at year-end: $600"},
                {"id": "adj_4", "type": "accrual", "description": "Electricity owing at year-end: $500"},
            ],
        },
        "requirements": [
            "Prepare an Income Statement (Profit and Loss Account) for the year ended 31 December 2025",
            "Show clearly: Net Sales, Cost of Sales, Gross Profit, and Net Profit",
        ],
        "step_by_step_guidance": [
            {"step": 1, "instruction": "Calculate Net Sales", "hint": "Sales minus Sales Returns."},
            {"step": 2, "instruction": "Calculate Cost of Sales", "hint": "Opening stock + Purchases − Purchases Returns + Carriage Inwards − Closing stock."},
            {"step": 3, "instruction": "Calculate Gross Profit", "hint": "Gross Profit = Net Sales − Cost of Sales."},
            {"step": 4, "instruction": "Add Other Income", "hint": "Discount received, commission received, rent received, etc."},
            {"step": 5, "instruction": "List and total Expenses", "hint": "Adjust for accruals and prepayments (insurance, electricity, wages)."},
            {"step": 6, "instruction": "Calculate Net Profit", "hint": "Net Profit = (Gross Profit + Other Income) − Total Expenses."},
        ],
        "model_answer_summary": {
            "net_sales": 236000,
            "cost_of_sales": 132000,
            "gross_profit": 104000,
            "total_expenses": 72300,
            "net_profit": 31700,
        },
        "source": "fallback",
    }


def generate_income_statement_question(
    business_type: str = "sole_trader",
    difficulty_level: str = "intermediate",
    format_type: str = "vertical",
) -> Dict[str, Any]:
    """
    Generate one Income Statement / P&L practice question using Vertex AI only.
    Returns scenario, trial_balance, adjustments, step_by_step_guidance, model_answer_summary.
    Uses fallback static question if Vertex is unavailable.
    """
    prompt = f"""Generate ONE ZIMSEC O-Level Paper 2 Income Statement (Profit and Loss Account) practice question.

**Parameters:**
- business_type: {business_type}
- difficulty_level: {difficulty_level}
- format: {format_type}

**Requirements:**
- Use a realistic Zimbabwean business name (e.g. Tendai Electronics, Rudo's Boutique, Chipo General Dealer).
- Trial balance must include: Sales, Sales Returns (optional), Purchases, Purchases Returns (optional), Opening Inventory/Stock, at least 4–5 expense accounts (Wages, Rent, Insurance, Electricity, etc.), and optionally Discount Received, Discount Allowed, Bad Debts.
- Include 3–5 adjustments: closing inventory, at least one accrual, one prepayment, and optionally depreciation or provision for doubtful debts.
- All amounts must be consistent and realistic.
- Financial year end: e.g. 31 December 2025.

**Income Statement structure (vertical):**
- Net Sales = Sales − Sales Returns
- Cost of Sales = Opening Stock + Purchases − Purchases Returns − Closing Stock (and + Carriage Inwards if given)
- Gross Profit = Net Sales − Cost of Sales
- Add Other Income (e.g. Discount Received)
- Less Expenses (adjusted for accruals and prepayments)
- Net Profit (or Net Loss)

**Response format – return ONLY this JSON object (no markdown, no code fence):**
{{
  "question_id": "unique-id",
  "question_type": "income_statement",
  "business_type": "{business_type}",
  "difficulty_level": "{difficulty_level}",
  "marks": 18,
  "time_estimate": "22 minutes",
  "scenario": {{
    "business_name": "Business Name",
    "financial_year_end": "31 December 2025",
    "context": "One or two sentences: type of business, what the student must prepare (Income Statement showing Gross Profit and Net Profit).",
    "additional_info": ""
  }},
  "question_data": {{
    "trial_balance": [
      {{"account": "Account name", "debit": number or null, "credit": number or null}}
    ],
    "adjustments": [
      {{"id": "adj_1", "type": "closing_stock|accrual|prepayment|depreciation|provision|bad_debts", "description": "Full sentence"}}
    ]
  }},
  "requirements": [
    "Prepare an Income Statement (Profit and Loss Account) for the year ended ...",
    "Show clearly: Net Sales, Cost of Sales, Gross Profit, and Net Profit"
  ],
  "step_by_step_guidance": [
    {{"step": 1, "instruction": "Calculate Net Sales", "hint": "Sales minus Sales Returns."}},
    {{"step": 2, "instruction": "Calculate Cost of Sales", "hint": "Opening stock + Net purchases − Closing stock."}},
    {{"step": 3, "instruction": "Calculate Gross Profit", "hint": "Net Sales − Cost of Sales."}},
    {{"step": 4, "instruction": "Add Other Income", "hint": "Discount received, etc."}},
    {{"step": 5, "instruction": "List and total Expenses", "hint": "Adjust for accruals and prepayments."}},
    {{"step": 6, "instruction": "Calculate Net Profit", "hint": "(Gross Profit + Other Income) − Total Expenses."}}
  ],
  "model_answer_summary": {{
    "net_sales": number,
    "cost_of_sales": number,
    "gross_profit": number,
    "total_expenses": number,
    "net_profit": number
  }}
}}

Generate exactly one question now. Return only the JSON object."""

    full_prompt = f"{INCOME_STATEMENT_SYSTEM}\n\n{prompt}"
    context = f"income_statement:{business_type}:{difficulty_level}"

    logger.info("Generating Income Statement question with Vertex AI: %s", context)
    result = try_vertex_json(full_prompt, logger=logger, context=context)

    if not result or not isinstance(result, dict):
        logger.warning("Vertex AI returned no valid Income Statement question; using fallback")
        return _fallback_question()

    if "scenario" not in result:
        result["scenario"] = _fallback_question()["scenario"]
    if "question_data" not in result or "trial_balance" not in result.get("question_data", {}):
        logger.warning("Vertex Income Statement missing question_data; using fallback")
        return _fallback_question()

    result.setdefault("question_id", f"is-{uuid.uuid4().hex[:12]}")
    result.setdefault("step_by_step_guidance", _fallback_question()["step_by_step_guidance"])
    result.setdefault("requirements", _fallback_question()["requirements"])
    result["source"] = "vertex_ai"

    return result
