"""
ZIMSEC O-Level Paper 2 Manufacturing Account question generator.
Uses Vertex AI (Gemini) only. Students practice different manufacturing scenarios each time.

Aligned with ZIMSEC 7112 Manufacturing Accounts: prime cost, factory overhead, production cost.
"""

import logging
import uuid
from typing import Any, Dict

from utils.vertex_ai_helper import try_vertex_json

logger = logging.getLogger(__name__)

MANUFACTURING_SYSTEM = (
    "You are an expert ZIMSEC O-Level Principles of Accounting (7112) examiner specializing in "
    "Paper 2 Manufacturing Accounts. "
    "Generate realistic, curriculum-aligned manufacturing account practice questions for mobile learning. "
    "Use Zimbabwean business names and context where appropriate. "
    "Respond with valid JSON only."
)


def _fallback_question() -> Dict[str, Any]:
    """Static fallback when Vertex is unavailable or fails."""
    return {
        "question_id": "fallback-manufacturing",
        "question_type": "manufacturing_account",
        "difficulty_level": "intermediate",
        "marks": 18,
        "time_estimate": "22 minutes",
        "scenario": {
            "business_name": "Harare Furniture Ltd",
            "financial_year_end": "31 December 2025",
            "context": "Prepare a Manufacturing Account for the year ended 31 December 2025 showing Prime Cost and Factory Cost of Production. Opening work in progress $8,000; closing work in progress $10,000.",
            "additional_info": "",
        },
        "question_data": {
            "trial_balance": [
                {"account": "Raw materials (1 Jan 2025)", "debit": 25000, "credit": None},
                {"account": "Raw materials (31 Dec 2025)", "debit": 18000, "credit": None},
                {"account": "Purchases of raw materials", "debit": 120000, "credit": None},
                {"account": "Direct wages", "debit": 85000, "credit": None},
                {"account": "Factory rent", "debit": 24000, "credit": None},
                {"account": "Factory electricity", "debit": 15000, "credit": None},
                {"account": "Depreciation - plant", "debit": 12000, "credit": None},
                {"account": "Work in progress (1 Jan 2025)", "debit": 8000, "credit": None},
                {"account": "Work in progress (31 Dec 2025)", "debit": 10000, "credit": None},
            ],
            "adjustments": [
                {"id": "adj_1", "type": "opening_stock", "description": "Opening raw materials $25,000"},
                {"id": "adj_2", "type": "closing_stock", "description": "Closing raw materials $18,000"},
                {"id": "adj_3", "type": "work_in_progress", "description": "Opening WIP $8,000; Closing WIP $10,000"},
            ],
        },
        "requirements": [
            "Prepare a Manufacturing Account for the year ended 31 December 2025",
            "Show Prime Cost and Factory Cost of Production",
        ],
        "step_by_step_guidance": [
            {"step": 1, "instruction": "Cost of raw materials consumed", "hint": "Opening raw materials + Purchases − Closing raw materials."},
            {"step": 2, "instruction": "Prime cost", "hint": "Raw materials consumed + Direct wages."},
            {"step": 3, "instruction": "Factory overheads", "hint": "Factory rent, electricity, depreciation (plant)."},
            {"step": 4, "instruction": "Total production cost", "hint": "Prime cost + Factory overheads."},
            {"step": 5, "instruction": "Factory cost of production", "hint": "Add opening WIP; deduct closing WIP."},
        ],
        "model_answer_summary": {
            "raw_materials_consumed": 127000,
            "prime_cost": 212000,
            "factory_overheads": 51000,
            "total_production_cost": 263000,
            "factory_cost_of_production": 261000,
        },
        "source": "fallback",
    }


def generate_manufacturing_account_question(
    difficulty_level: str = "intermediate",
    format_type: str = "vertical",
) -> Dict[str, Any]:
    """Generate one Manufacturing Account practice question using Vertex AI only."""
    prompt = f"""Generate ONE ZIMSEC O-Level Paper 2 Manufacturing Account practice question.

**Parameters:** difficulty_level: {difficulty_level}, format: {format_type}

**Requirements:**
- Use a realistic Zimbabwean manufacturing business name (e.g. Harare Furniture, Bulawayo Textiles).
- Trial balance must include: opening/closing raw materials, purchases of raw materials, direct wages, factory overheads (rent, electricity, depreciation). Optionally opening/closing work in progress.
- All amounts consistent. Financial year end e.g. 31 December 2025.

**Manufacturing structure:** Raw materials consumed = Opening + Purchases − Closing. Prime cost = Raw materials consumed + Direct wages. Add factory overheads = Total production cost. Factory cost of production = Total production cost + Opening WIP − Closing WIP.

**Response format – return ONLY this JSON object (no markdown, no code fence):**
{{
  "question_id": "unique-id",
  "question_type": "manufacturing_account",
  "difficulty_level": "{difficulty_level}",
  "marks": 18,
  "time_estimate": "22 minutes",
  "scenario": {{ "business_name": "...", "financial_year_end": "31 December 2025", "context": "...", "additional_info": "" }},
  "question_data": {{
    "trial_balance": [{{"account": "...", "debit": number or null, "credit": number or null}}],
    "adjustments": [{{"id": "adj_1", "type": "...", "description": "..."}}]
  }},
  "requirements": ["Prepare a Manufacturing Account...", "Show Prime Cost and Factory Cost of Production"],
  "step_by_step_guidance": [
    {{"step": 1, "instruction": "Cost of raw materials consumed", "hint": "..."}},
    {{"step": 2, "instruction": "Prime cost", "hint": "..."}},
    {{"step": 3, "instruction": "Factory overheads", "hint": "..."}},
    {{"step": 4, "instruction": "Total production cost", "hint": "..."}},
    {{"step": 5, "instruction": "Factory cost of production", "hint": "..."}}
  ],
  "model_answer_summary": {{
    "raw_materials_consumed": number,
    "prime_cost": number,
    "factory_overheads": number,
    "total_production_cost": number,
    "factory_cost_of_production": number
  }}
}}

Generate exactly one question. Return only the JSON object."""

    full_prompt = f"{MANUFACTURING_SYSTEM}\n\n{prompt}"
    context = f"manufacturing:{difficulty_level}"

    logger.info("Generating Manufacturing Account question with Vertex AI: %s", context)
    result = try_vertex_json(full_prompt, logger=logger, context=context)

    if not result or not isinstance(result, dict):
        logger.warning("Vertex AI returned no valid Manufacturing question; using fallback")
        return _fallback_question()

    if "scenario" not in result:
        result["scenario"] = _fallback_question()["scenario"]
    if "question_data" not in result or "trial_balance" not in result.get("question_data", {}):
        logger.warning("Vertex Manufacturing missing question_data; using fallback")
        return _fallback_question()

    result.setdefault("question_id", f"mfg-{uuid.uuid4().hex[:12]}")
    result.setdefault("step_by_step_guidance", _fallback_question()["step_by_step_guidance"])
    result.setdefault("requirements", _fallback_question()["requirements"])
    result["source"] = "vertex_ai"

    return result
