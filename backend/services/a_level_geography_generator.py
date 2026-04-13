"""
A-Level Geography Generator — ZIMSEC A-Level Geography (Forms 5–6, Syllabus 9156).
Generates essay questions only (20-25 marks, 400-600 words).
"""

import json
import logging
import random
from typing import Dict, Any, Optional

from utils.vertex_ai_helper import try_vertex_json, extract_json_object
from utils.deepseek import call_deepseek_chat
from services.zimsec_a_level_geography_syllabus import (
    ZIMSEC_A_LEVEL_GEOGRAPHY_CODE,
    get_topic_objectives_a_level,
    get_paper1_prompt_guidance_a_level,
    get_paper2_prompt_guidance_a_level,
    get_essay_prompt_guidance_a_level,
    get_topic_paper,
)

logger = logging.getLogger(__name__)

# System message for A-Level Geography
A_LEVEL_GEO_SYSTEM_MESSAGE = (
    f"You are an expert ZIMSEC A-Level Geography examiner, curriculum designer, and assessment specialist "
    f"with deep knowledge of the ZIMSEC Advanced Level Geography syllabus (Code: {ZIMSEC_A_LEVEL_GEOGRAPHY_CODE}, Forms 5–6). "
    f"Your task is to generate complete, accurate, syllabus-aligned Geography content suitable for A-Level students. "
    f"All content must strictly follow ZIMSEC A-Level Geography standards, be conceptually deep, exam-oriented, "
    f"and Zimbabwe-relevant, including case studies, examples, and exam-style questions."
)


class ALevelGeographyGenerator:
    """Generator for ZIMSEC A-Level Geography essay questions (Forms 5–6)."""

    def __init__(self):
        self.topics = {}

    def generate_essay_question(
        self,
        topic: str,
        difficulty: str = "medium",
        user_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Generate a ZIMSEC A-Level Geography essay question (20-25 marks, 400-600 words).
        Only essay questions are supported for A-Level Geography.
        """
        try:
            prompt = self._create_essay_prompt(topic, difficulty)
            context = f"a_level_geo:essay:{topic}:{difficulty}"
            vertex_prompt = f"{A_LEVEL_GEO_SYSTEM_MESSAGE}\n\n{prompt}"

            logger.info("Trying Vertex AI (primary) for %s", context)
            vertex_response = try_vertex_json(vertex_prompt, logger=logger, context=context)
            if vertex_response:
                return self._validate_and_enhance_essay(vertex_response, topic, difficulty, user_id, source="vertex_ai")

            logger.info("Falling back to DeepSeek for %s", context)
            response = self._call_deepseek_api(prompt, "essay")
            if response:
                return self._validate_and_enhance_essay(response, topic, difficulty, user_id, source="deepseek_fallback")

            return self._get_fallback_essay_question(topic, difficulty, user_id)
        except Exception as exc:
            logger.error("Error generating A-Level Geography essay question: %s", exc, exc_info=True)
            return self._get_fallback_essay_question(topic, difficulty, user_id)

    # -------------------------------------------------------------------------
    # Prompt builders
    # -------------------------------------------------------------------------

    def _topic_info(self, topic: str) -> dict:
        """Resolve topic to syllabus objectives, using graceful fallback."""
        try:
            info = get_topic_objectives_a_level(topic)
            if info and (info.get("subtopics") or info.get("learning_objectives")):
                return info
        except Exception:
            pass
        return {}

    def _create_essay_prompt(self, topic: str, difficulty: str) -> str:
        """Create an A-Level Geography essay prompt (20-25 marks, 400-600 words)."""
        topic_info = self._topic_info(topic)
        subtopics = topic_info.get("subtopics", [])
        objectives = topic_info.get("learning_objectives", [])
        case_studies = topic_info.get("case_studies", [])
        selected_subtopic = random.choice(subtopics) if subtopics else topic
        paper = get_topic_paper(topic)
        
        paper_guide = (
            get_paper1_prompt_guidance_a_level() if paper == "Paper 1"
            else get_paper2_prompt_guidance_a_level()
        )
        
        objs_text = "\n".join(
            f"- {obj}"
            for obj in (objectives[:5] if objectives else [
                "Demonstrate deep understanding of A-Level Geography concepts",
                "Apply knowledge to Zimbabwean/African contexts",
                "Analyse and evaluate geographical processes and patterns",
            ])
        )
        
        case_studies_text = ""
        if case_studies:
            case_studies_text = f"\n**Relevant case studies to reference**:\n" + "\n".join(f"- {cs}" for cs in case_studies[:3])

        diff_text = {
            "easy": "Focus on clear explanations and basic analysis. Suitable for early Form 5.",
            "medium": "Require analysis, evaluation, and application. Suitable for Form 5–6 exam preparation.",
            "difficult": "Require sophisticated analysis, critical evaluation, and synthesis of multiple concepts. Suitable for final exam preparation.",
        }

        return f"""You are an expert ZIMSEC A-Level Geography examiner (syllabus {ZIMSEC_A_LEVEL_GEOGRAPHY_CODE}, Forms 5–6).

**Paper**: {paper}
**Paper Focus**: {paper_guide}

Generate ONE essay question (20-25 marks) for:

Topic: {topic}
Paper: {paper}
Subtopic Focus: {selected_subtopic}
Difficulty: {difficulty}
**Difficulty Guidance**: {diff_text.get(difficulty, diff_text["medium"])}

**Learning objectives (syllabus-aligned)**:
{objs_text}
{case_studies_text}

**Requirements**:
1. Essay question requiring extended writing (400-600 words expected)
2. Use command words: Discuss, Evaluate, Assess, To what extent
3. Include Zimbabwean/African case studies where relevant
4. Test analysis, evaluation, and critical thinking (AO2/AO3)
5. Provide comprehensive marking guide (content, analysis, communication)
6. Do NOT ask for diagrams; focus on knowledge and written analysis only
7. Marks should be 20-25 (A-Level standard, not 10-15 like O-Level)

**Response Format (JSON only)**:
{{
  "question_type": "essay",
  "question": "Full essay question with context and case study references",
  "word_limit": "400-600 words",
  "marks": 25,
  "key_points": [
    "Key point 1 that should be discussed (with expected detail)",
    "Key point 2",
    "Key point 3",
    "Key point 4"
  ],
  "marking_criteria": {{
    "content": "Description of content marks (10-12 marks): Knowledge, understanding, use of examples/case studies",
    "analysis": "Description of analysis marks (6-8 marks): Analysis, evaluation, critical thinking, synthesis",
    "communication": "Description of communication marks (3-4 marks): Structure, clarity, use of geographical terminology"
  }},
  "case_studies": {json.dumps(case_studies[:3] if case_studies else [])},
  "sample_answer_outline": "Brief outline of expected answer structure",
  "topic": "{topic}",
  "paper": "{paper}",
  "difficulty": "{difficulty}"
}}

Generate ONE high-quality A-Level Geography essay question now."""

    def _call_deepseek_api(self, prompt: str, question_type: str) -> Optional[Dict[str, Any]]:
        """Call DeepSeek API as fallback for essay generation."""
        try:
            system_prompt = (
                f"{A_LEVEL_GEO_SYSTEM_MESSAGE}\n\n"
                f"Generate ZIMSEC A-Level Geography essay questions (20-25 marks, 400-600 words). "
                f"Focus on analysis, evaluation, and critical thinking. Include Zimbabwean/African case studies. "
                f"Do NOT ask for diagrams."
            )
            content = call_deepseek_chat(
                system_prompt=system_prompt,
                user_prompt=prompt,
                temperature=0.7,
                max_tokens=2000,
            )
            if content:
                response = extract_json_object(content, logger=logger, context="a_level_geo_essay")
                if response and isinstance(response, dict):
                    return response
        except RuntimeError as exc:
            logger.warning("DeepSeek not configured for A-Level Geography: %s", exc)
        except Exception as exc:
            logger.error("DeepSeek API error for A-Level Geography essay: %s", exc)
        return None

    def _validate_and_enhance_essay(
        self,
        response: Dict[str, Any],
        topic: str,
        difficulty: str,
        user_id: Optional[str],
        source: str = "unknown",
    ) -> Dict[str, Any]:
        """Validate and enhance essay question response."""
        if not response or not isinstance(response, dict):
            return self._get_fallback_essay_question(topic, difficulty, user_id)
        # Ensure required fields
        if "question_type" not in response:
            response["question_type"] = "essay"
        if "marks" not in response:
            response["marks"] = random.randint(20, 25)
        if "word_limit" not in response:
            response["word_limit"] = "400-600 words"
        if "topic" not in response:
            response["topic"] = topic
        if "difficulty" not in response:
            response["difficulty"] = difficulty
        if "paper" not in response:
            response["paper"] = get_topic_paper(topic)
        
        # Ensure marking criteria structure
        if "marking_criteria" not in response:
            response["marking_criteria"] = {
                "content": "Knowledge, understanding, use of examples/case studies (10-12 marks)",
                "analysis": "Analysis, evaluation, critical thinking (6-8 marks)",
                "communication": "Structure, clarity, terminology (3-4 marks)",
            }
        
        # Ensure key_points is a list
        if "key_points" not in response:
            response["key_points"] = [
                "Demonstrate understanding of key concepts",
                "Apply knowledge to case studies",
                "Analyse processes and patterns",
                "Evaluate effectiveness of strategies",
            ]
        
        response["source"] = source
        if user_id:
            response["user_id"] = user_id
        
        return response

    def _get_fallback_essay_question(
        self,
        topic: str,
        difficulty: str,
        user_id: Optional[str],
    ) -> Dict[str, Any]:
        """Generate a fallback essay question if AI generation fails."""
        paper = get_topic_paper(topic)
        topic_info = self._topic_info(topic)
        case_studies = topic_info.get("case_studies", [])
        case_study_text = f" Use examples from {case_studies[0]}." if case_studies else ""
        
        command_words = ["Discuss", "Evaluate", "Assess", "To what extent"]
        command = random.choice(command_words)
        
        return {
            "question_type": "essay",
            "question": (
                f"{command} the key processes and patterns in {topic}. "
                f"Analyse the factors influencing these processes and evaluate their impacts on Zimbabwean society and environment.{case_study_text}"
            ),
            "word_limit": "400-600 words",
            "marks": 25,
            "key_points": [
                "Define and explain key concepts",
                "Describe processes and patterns",
                "Analyse factors and causes",
                "Evaluate impacts and effectiveness",
            ],
            "marking_criteria": {
                "content": "Knowledge, understanding, use of examples/case studies (10-12 marks)",
                "analysis": "Analysis, evaluation, critical thinking (6-8 marks)",
                "communication": "Structure, clarity, terminology (3-4 marks)",
            },
            "case_studies": case_studies[:2] if case_studies else [],
            "sample_answer_outline": (
                "Introduction: Define key terms and outline scope. "
                "Main body: Explain processes, analyse factors, evaluate impacts with examples. "
                "Conclusion: Summarise key points and provide balanced evaluation."
            ),
            "topic": topic,
            "paper": paper,
            "difficulty": difficulty,
            "source": "fallback",
        }
