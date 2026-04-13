"""
ZIMSEC O-Level Paper 2 Partnership Appropriation Account question generator.
Uses Vertex AI (Gemini) only. Students practice different partnership scenarios each time.

Aligned with ZIMSEC 7112 Partnership Accounts: appropriation account, interest on capital,
partner salary, profit-sharing ratio, capital and current account balances.
"""

import logging
import uuid
from typing import Any, Dict

from utils.vertex_ai_helper import try_vertex_json

logger = logging.getLogger(__name__)

PARTNERSHIP_SYSTEM = (
    "You are an expert ZIMSEC O-Level Principles of Accounting (7112) examiner specializing in "
    "Paper 2 Partnership Accounts and Appropriation. "
    "Generate realistic, curriculum-aligned partnership appropriation practice questions for mobile learning. "
    "Use Zimbabwean business names and context where appropriate. "
    "Respond with valid JSON only."
)


def _fallback_question() -> Dict[str, Any]:
    """Static fallback when Vertex is unavailable or fails."""
    return {
        "question_id": "fallback-partnership",
        "question_type": "partnership_appropriation",
        "difficulty_level": "intermediate",
        "marks": 18,
        "time_estimate": "22 minutes",
        "scenario": {
            "business_name": "Moyo & Ncube Traders",
            "financial_year_end": "31 December 2025",
            "context": "Partnership (profit share 2:1). Prepare the Appropriation Account and show the partners' Capital and Current account balances after appropriation. Interest on capital 5% p.a.; Ncube receives a salary of $12,000.",
            "additional_info": "",
        },
        "question_data": {
            "trial_balance": [
                {"account": "Capital - Moyo", "debit": None, "credit": 60000},
                {"account": "Capital - Ncube", "debit": None, "credit": 40000},
                {"account": "Current account - Moyo (1 Jan)", "debit": 2000, "credit": None},
                {"account": "Current account - Ncube (1 Jan)", "debit": None, "credit": 3000},
                {"account": "Drawings - Moyo", "debit": 8000, "credit": None},
                {"account": "Drawings - Ncube", "debit": 5000, "credit": None},
                {"account": "Net Profit (before appropriation)", "debit": None, "credit": 45000},
            ],
            "adjustments": [
                {"id": "adj_1", "type": "interest_on_capital", "description": "Interest on capital 5% per annum"},
                {"id": "adj_2", "type": "partner_salary", "description": "Ncube's salary $12,000"},
                {"id": "adj_3", "type": "profit_share", "description": "Profit shared Moyo:Ncube = 2:1"},
            ],
        },
        "requirements": [
            "Prepare the Appropriation Account for the year ended 31 December 2025",
            "Prepare the partners' Capital and Current accounts (after appropriation)",
        ],
        "step_by_step_guidance": [
            {"step": 1, "instruction": "Start with Net Profit", "hint": "Bring in the net profit before appropriation."},
            {"step": 2, "instruction": "Deduct interest on capital", "hint": "Calculate 5% of each partner's capital; deduct from profit."},
            {"step": 3, "instruction": "Deduct partner salary", "hint": "Deduct Ncube's salary from remaining profit."},
            {"step": 4, "instruction": "Share remaining profit", "hint": "Divide residual profit in the ratio 2:1 (Moyo:Ncube)."},
            {"step": 5, "instruction": "Update Current accounts", "hint": "Add interest, salary, profit share; deduct drawings. Balance c/d."},
        ],
        "model_answer_summary": {
            "net_profit": 45000,
            "interest_on_capital_moyo": 3000,
            "interest_on_capital_ncube": 2000,
            "salary_ncube": 12000,
            "profit_share_moyo": 20000,
            "profit_share_ncube": 10000,
            "current_balance_moyo": 13000,
            "current_balance_ncube": 15000,
        },
        "source": "fallback",
    }


def generate_partnership_appropriation_question(
    difficulty_level: str = "intermediate",
    format_type: str = "vertical",
) -> Dict[str, Any]:
    """
    Generate one Partnership Appropriation practice question using Vertex AI only.
    Returns scenario, trial_balance, adjustments, step_by_step_guidance, model_answer_summary.
    """
    prompt = f"""Generate ONE ZIMSEC O-Level Paper 2 Partnership Appropriation practice question.

**Parameters:**
- difficulty_level: {difficulty_level}
- format: {format_type}

**Requirements:**
- Use a realistic Zimbabwean partnership name (e.g. Moyo & Ncube, Chipo & Tendai Traders).
- Trial balance must include: both partners' Capital accounts, Current accounts (opening balance), Drawings, Net Profit (before appropriation).
- Include adjustments: interest on capital (e.g. 5% p.a.), optional partner salary, profit-sharing ratio (e.g. 2:1 or 3:2).
- All amounts must be consistent. Financial year end e.g. 31 December 2025.

**Appropriation structure:** Net Profit − Interest on capital − Partner salary = Residual profit; share in agreed ratio. Update current accounts: opening + interest + salary + profit share − drawings = balance c/d.

**Response format – return ONLY this JSON object (no markdown, no code fence):**
{{
  "question_id": "unique-id",
  "question_type": "partnership_appropriation",
  "difficulty_level": "{difficulty_level}",
  "marks": 18,
  "time_estimate": "22 minutes",
  "scenario": {{
    "business_name": "Partnership Name",
    "financial_year_end": "31 December 2025",
    "context": "One or two sentences: profit share ratio, what to prepare (Appropriation Account and Capital/Current accounts).",
    "additional_info": ""
  }},
  "question_data": {{
    "trial_balance": [
      {{"account": "Account name", "debit": number or null, "credit": number or null}}
    ],
    "adjustments": [
      {{"id": "adj_1", "type": "interest_on_capital|partner_salary|profit_share", "description": "Full sentence"}}
    ]
  }},
  "requirements": [
    "Prepare the Appropriation Account for the year ended ...",
    "Prepare the partners' Capital and Current accounts"
  ],
  "step_by_step_guidance": [
    {{"step": 1, "instruction": "Start with Net Profit", "hint": "Bring in net profit before appropriation."}},
    {{"step": 2, "instruction": "Deduct interest on capital", "hint": "Calculate for each partner."}},
    {{"step": 3, "instruction": "Deduct partner salary if any", "hint": "Full amount."}},
    {{"step": 4, "instruction": "Share remaining profit", "hint": "Use profit-sharing ratio."}},
    {{"step": 5, "instruction": "Update Current accounts", "hint": "Add interest, salary, share; deduct drawings."}}
  ],
  "model_answer_summary": {{
    "net_profit": number,
    "interest_on_capital_moyo": number,
    "interest_on_capital_ncube": number,
    "salary_ncube": number,
    "profit_share_moyo": number,
    "profit_share_ncube": number,
    "current_balance_moyo": number,
    "current_balance_ncube": number
  }}
}}

Use partner names that match the keys (e.g. Moyo, Ncube or similar). Generate exactly one question. Return only the JSON object."""

    full_prompt = f"{PARTNERSHIP_SYSTEM}\n\n{prompt}"
    context = f"partnership_appropriation:{difficulty_level}"

    logger.info("Generating Partnership Appropriation question with Vertex AI: %s", context)
    result = try_vertex_json(full_prompt, logger=logger, context=context)

    if not result or not isinstance(result, dict):
        logger.warning("Vertex AI returned no valid Partnership question; using fallback")
        return _fallback_question()

    if "scenario" not in result:
        result["scenario"] = _fallback_question()["scenario"]
    if "question_data" not in result or "trial_balance" not in result.get("question_data", {}):
        logger.warning("Vertex Partnership missing question_data; using fallback")
        return _fallback_question()

    result.setdefault("question_id", f"pa-{uuid.uuid4().hex[:12]}")
    result.setdefault("step_by_step_guidance", _fallback_question()["step_by_step_guidance"])
    result.setdefault("requirements", _fallback_question()["requirements"])
    result["source"] = "vertex_ai"

    return result
