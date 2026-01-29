"""
Professional Geography Question Generator.
- ZIMSEC O-Level Geography (Forms 1–4), All Level (no Form grouping in UI).
- Paper 1: Multiple Choice (MCQ, 40 items).
- Paper 2: Structured/Data-response (25-mark questions).

AI stack:
- Vertex AI (Gemini 2.5 Flash) as PRIMARY JSON generator via `try_vertex_json`.
- DeepSeek chat completion as FALLBACK provider when Vertex fails or is unavailable.

This mirrors the ComputerScienceGenerator shape but is simplified and strictly ZIMSEC-focused.
"""

import os
import json
import requests
import logging
import random
from typing import Dict, Optional, Any

from utils.deepseek import get_deepseek_chat_model
from utils.vertex_ai_helper import try_vertex_json

try:
    from services.zimsec_geography_syllabus import (
        ZIMSEC_GEOGRAPHY_TOPIC_OBJECTIVES,
        ZIMSEC_GEOGRAPHY_CODE,
        get_topic_objectives,
        get_paper1_prompt_guidance,
        get_paper2_prompt_guidance,
    )
except ImportError:
    ZIMSEC_GEOGRAPHY_TOPIC_OBJECTIVES = {}
    ZIMSEC_GEOGRAPHY_CODE = "2248"

    def get_topic_objectives(topic_name: str) -> dict:
        return {"subtopics": [], "learning_objectives": []}

    def get_paper1_prompt_guidance() -> str:
        return "ZIMSEC Geography Paper 1: MCQ testing breadth of knowledge and skills."

    def get_paper2_prompt_guidance() -> str:
        return "ZIMSEC Geography Paper 2: structured/data-response questions testing deep understanding."


logger = logging.getLogger(__name__)


GEO_SYSTEM_MESSAGE = (
    "You are an expert ZIMSEC O-Level Geography examiner (Forms 1–4). "
    "Generate educational questions in valid JSON format only. "
    "Use Zimbabwean and African contexts where appropriate."
)


class GeographyGenerator:
    """ZIMSEC O-Level Geography generator with Vertex primary."""

    def __init__(self) -> None:
        self.api_key = os.environ.get("DEEPSEEK_API_KEY")
        self.api_url = "https://api.deepseek.com/v1/chat/completions"
        self.model = get_deepseek_chat_model()
        self.max_retries = 3
        self.timeouts = [30, 45, 60]
        self.retry_delay = 2
        self.connect_timeout = 10

        self.session = requests.Session()
        self.session.headers.update(
            {
                "Content-Type": "application/json",
                "User-Agent": "NerdX-Education/1.0",
            }
        )

        self.topics = dict(ZIMSEC_GEOGRAPHY_TOPIC_OBJECTIVES) if ZIMSEC_GEOGRAPHY_TOPIC_OBJECTIVES else {}

    # -------------------------------------------------------------------------
    # Public API
    # -------------------------------------------------------------------------

    def generate_topical_question(
        self,
        topic: str,
        difficulty: str = "medium",
        user_id: Optional[str] = None,
        board: str = "zimsec",
    ) -> Dict[str, Any]:
        """
        Generate a single MCQ for a Geography topic (topical practice or exam mode).
        For now, `board` is kept for future Cambridge support but only 'zimsec' is used.
        """
        try:
            prompt = self._create_mcq_prompt(topic, difficulty)
            context = f"geo:mcq:{topic}:{difficulty}:{board}"
            vertex_prompt = f"{GEO_SYSTEM_MESSAGE}\n\n{prompt}"

            logger.info("Trying Vertex AI (primary) for %s", context)
            vertex_response = try_vertex_json(vertex_prompt, logger=logger, context=context)
            if vertex_response and "question" in vertex_response:
                return self._validate_and_enhance_mcq(vertex_response, topic, difficulty, user_id, source="vertex_ai")

            logger.info("Falling back to DeepSeek for %s", context)
            response = self._call_deepseek_api(prompt, "mcq")
            if response and "question" in response:
                return self._validate_and_enhance_mcq(response, topic, difficulty, user_id, source="deepseek_fallback")

            return self._get_fallback_mcq_question(topic, difficulty, user_id)
        except Exception as exc:
            logger.error("Error generating Geography MCQ question: %s", exc, exc_info=True)
            return self._get_fallback_mcq_question(topic, difficulty, user_id)

    def generate_structured_question(
        self,
        topic: str,
        difficulty: str = "medium",
        user_id: Optional[str] = None,
        board: str = "zimsec",
    ) -> Dict[str, Any]:
        """
        Generate a ZIMSEC-style structured/data-response question.
        The JSON format is compatible with the mobile Quiz screen and exam engine.
        """
        try:
            prompt = self._create_structured_prompt(topic, difficulty)
            context = f"geo:structured:{topic}:{difficulty}:{board}"
            vertex_prompt = f"{GEO_SYSTEM_MESSAGE}\n\n{prompt}"

            logger.info("Trying Vertex AI (primary) for %s", context)
            vertex_response = try_vertex_json(vertex_prompt, logger=logger, context=context)
            if vertex_response:
                return self._validate_and_enhance_structured(vertex_response, topic, difficulty, user_id, source="vertex_ai")

            logger.info("Falling back to DeepSeek for %s", context)
            response = self._call_deepseek_api(prompt, "structured")
            if response:
                return self._validate_and_enhance_structured(response, topic, difficulty, user_id, source="deepseek_fallback")

            return self._get_fallback_structured_question(topic, difficulty, user_id)
        except Exception as exc:
            logger.error("Error generating Geography structured question: %s", exc, exc_info=True)
            return self._get_fallback_structured_question(topic, difficulty, user_id)

    def generate_essay_question(
        self,
        topic: str,
        difficulty: str = "medium",
        user_id: Optional[str] = None,
        board: str = "zimsec",
    ) -> Dict[str, Any]:
        """
        Generate a Geography extended structured-answer / mini-essay question (10–15 marks).
        """
        try:
            prompt = self._create_essay_prompt(topic, difficulty)
            context = f"geo:essay:{topic}:{difficulty}:{board}"
            vertex_prompt = f"{GEO_SYSTEM_MESSAGE}\n\n{prompt}"

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
            logger.error("Error generating Geography essay question: %s", exc, exc_info=True)
            return self._get_fallback_essay_question(topic, difficulty, user_id)

    # -------------------------------------------------------------------------
    # Prompt builders
    # -------------------------------------------------------------------------

    def _topic_info(self, topic: str) -> dict:
        """Resolve topic to syllabus objectives, using graceful fallback."""
        try:
            info = get_topic_objectives(topic)
            if info and (info.get("subtopics") or info.get("learning_objectives")):
                return info
        except Exception:
            pass
        return self.topics.get(topic, {})

    def _create_mcq_prompt(self, topic: str, difficulty: str) -> str:
        """Create ZIMSEC Geography Paper 1-style MCQ prompt."""
        topic_info = self._topic_info(topic)
        subtopics = topic_info.get("subtopics", [])
        objectives = topic_info.get("learning_objectives", [])
        selected_subtopic = random.choice(subtopics) if subtopics else topic

        diff_text = {
            "easy": "Focus on basic definitions, identification of features, and simple relationships. Suitable for early Forms 1–2.",
            "medium": "Include interpretation of maps/graphs and short explanations. Suitable for Forms 3–4.",
            "difficult": "Require analysis, comparison, and application in Zimbabwean/African contexts. Suitable for exam preparation.",
        }
        paper1_guide = get_paper1_prompt_guidance()
        objs_text = "\n".join(
            f"- {obj}"
            for obj in (objectives[:4] if objectives else ["Align to ZIMSEC Geography Forms 1–4 learning outcomes for this topic."])
        )

        return f"""You are an expert ZIMSEC O-Level Geography examiner (syllabus {ZIMSEC_GEOGRAPHY_CODE}).

**Paper 1 Focus**: {paper1_guide}

**Topic**: {topic}
**Subtopic Focus**: {selected_subtopic}
**Difficulty**: {difficulty}
**Difficulty Guidance**: {diff_text.get(difficulty, diff_text["medium"])}

**Learning objectives to test (syllabus-aligned)**:
{objs_text}

**Requirements**:
1. Question must be clear, unambiguous, and age-appropriate for Forms 1–4.
2. Provide exactly 4 options (A–D); only ONE must be correct.
3. Avoid 'All of the above' or 'None of the above'.
4. Prefer Zimbabwean or Southern African examples (rivers, settlements, farms, mines, industries, etc.) where relevant.
5. If map/graph/photo is implied, describe it in words (no images).

**Response Format (JSON only)**:
{{
  "question": "Clear question text",
  "options": {{
    "A": "First option",
    "B": "Second option",
    "C": "Third option",
    "D": "Fourth option"
  }},
  "correct_answer": "A",
  "explanation": "Detailed explanation of why the answer is correct and why other options are wrong. Include the key concept being tested.",
  "topic": "{topic}",
  "subtopic": "{selected_subtopic}",
  "difficulty": "{difficulty}"
}}

Generate ONE high-quality MCQ now."""

    def _create_structured_prompt(self, topic: str, difficulty: str) -> str:
        """Create ZIMSEC Geography Paper 2-style structured/data-response prompt."""
        topic_info = self._topic_info(topic)
        subtopics = topic_info.get("subtopics", [])
        objectives = topic_info.get("learning_objectives", [])
        selected_subtopic = random.choice(subtopics) if subtopics else topic
        paper2_guide = get_paper2_prompt_guidance()
        objs_text = "\n".join(
            f"- {obj}"
            for obj in (objectives[:4] if objectives else ["Align to ZIMSEC Geography Forms 1–4 learning outcomes for this topic."])
        )

        return f"""You are an expert ZIMSEC O-Level Geography examiner (syllabus {ZIMSEC_GEOGRAPHY_CODE}).

**Paper 2 Focus**: {paper2_guide}

**Topic**: {topic}
**Subtopic Focus**: {selected_subtopic}
**Difficulty**: {difficulty}

**Learning objectives to target (syllabus-aligned)**:
{objs_text}

**Requirements**:
1. Create ONE structured/data-response question suitable for a 25-mark ZIMSEC Geography Paper 2 question, BUT you may set total_marks between 8 and 15 for this AI practice.
2. Question must have multiple parts labelled (a), (b), (c)... with mark allocations that sum to total_marks.
3. Parts must progress from simple recall → description → explanation → application/evaluation.
4. Use a short context or data stimulus where possible (e.g., rainfall graph, population pyramid, map description, case study snippet).
5. Provide a clear marking scheme / key points for each part.

**Response Format (JSON only)**:
{{
  "question_type": "structured",
  "context": "Short scenario or data description (if any)",
  "stem": "Overall question introduction / main focus",
  "parts": [
    {{
      "label": "a",
      "question": "Part (a) question text",
      "marks": 2,
      "expected_answer": "Model answer for part (a)",
      "marking_points": ["Point 1 (1 mark)", "Point 2 (1 mark)"]
    }},
    {{
      "label": "b",
      "question": "Part (b) question text",
      "marks": 3,
      "expected_answer": "Model answer for part (b)",
      "marking_points": ["Point 1", "Point 2", "Point 3"]
    }}
  ],
  "total_marks": 10,
  "topic": "{topic}",
  "subtopic": "{selected_subtopic}",
  "difficulty": "{difficulty}"
}}

Generate ONE high-quality structured question now."""

    def _create_essay_prompt(self, topic: str, difficulty: str) -> str:
        """Create an extended structured-answer / mini-essay prompt (Geography)."""
        topic_info = self._topic_info(topic)
        subtopics = topic_info.get("subtopics", [])
        objectives = topic_info.get("learning_objectives", [])
        selected_subtopic = random.choice(subtopics) if subtopics else topic
        objs_text = "\n".join(
            f"- {obj}"
            for obj in (objectives[:4] if objectives else ["Align to ZIMSEC Geography Forms 1–4 learning outcomes for this topic."])
        )

        return f"""You are an expert ZIMSEC O-Level Geography examiner (syllabus {ZIMSEC_GEOGRAPHY_CODE}).

Generate ONE extended structured-answer / mini-essay question (10–15 marks) for:

Topic: {topic}
Subtopic Focus: {selected_subtopic}
Difficulty: {difficulty}

**Learning objectives to target (syllabus-aligned)**:
{objs_text}

**Requirements**:
1. Question should invite extended writing (about 1–2 pages of lined paper; 200–350 words).
2. Focus on explanation, analysis, and evaluation using Zimbabwean or African examples.
3. Provide a clear marking guide listing key points and their mark allocations.

**Response Format (JSON only)**:
{{
  \"question_type\": \"essay\",
  \"question\": \"Full question text, including any context or case study information\",
  \"word_limit\": \"200-350 words\",
  \"marks\": 15,
  \"key_points\": [
    \"Key point 1 that should be discussed\",
    \"Key point 2\",
    \"Key point 3\"
  ],
  \"marking_criteria\": {{
    \"content\": \"What content earns marks (e.g., up to 8 marks)\",
    \"analysis\": \"What analysis/application earns marks (e.g., up to 4 marks)\",
    \"communication\": \"Quality of written communication (e.g., up to 3 marks)\"
  }},
  \"sample_answer_outline\": \"Brief outline of an excellent response (bullet points or short paragraph)\",
  \"topic\": \"{topic}\",
  \"subtopic\": \"{selected_subtopic}\",
  \"difficulty\": \"{difficulty}\"
}}

Generate ONE high-quality question now."""

    # -------------------------------------------------------------------------
    # DeepSeek fallback
    # -------------------------------------------------------------------------

    def _call_deepseek_api(self, prompt: str, generation_type: str) -> Optional[Dict]:
        """Call DeepSeek API with retries; return parsed JSON dict or None."""
        if not self.api_key:
            logger.error("DeepSeek API key not configured for GeographyGenerator")
            return None

        if not prompt or not prompt.strip():
            logger.error("Empty prompt provided to DeepSeek Geography generator")
            return None

        headers = {
            "Authorization": f"Bearer {self.api_key}",
        }
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": GEO_SYSTEM_MESSAGE},
                {"role": "user", "content": prompt},
            ],
            "temperature": 0.7,
            "max_tokens": 2000,
        }

        for attempt in range(self.max_retries):
            timeout = self.timeouts[min(attempt, len(self.timeouts) - 1)]
            if attempt > 0:
                import time as _time

                backoff = self.retry_delay * (2 ** (attempt - 1)) + random.uniform(0, 1)
                logger.info("DeepSeek Geography %s retry %s/%s, waiting %.2fs", generation_type, attempt + 1, self.max_retries, backoff)
                _time.sleep(backoff)

            try:
                self.session.headers.update(headers)
                response = self.session.post(
                    self.api_url,
                    json=payload,
                    timeout=(self.connect_timeout, timeout),
                )
                if response.status_code != 200:
                    logger.warning("DeepSeek Geography %s HTTP %s", generation_type, response.status_code)
                    continue

                result = response.json()
                content = (result.get("choices", [{}])[0].get("message", {}) or {}).get("content", "")
                if not content:
                    continue

                try:
                    if "```json" in content:
                        json_str = content.split("```json")[1].split("```")[0].strip()
                    elif "```" in content:
                        json_str = content.split("```")[1].split("```")[0].strip()
                    else:
                        json_str = content.strip()
                    return json.loads(json_str)
                except json.JSONDecodeError as exc:
                    logger.error("DeepSeek Geography JSON parse error: %s", exc)
                    continue
            except requests.exceptions.Timeout:
                logger.warning("DeepSeek Geography %s timeout on attempt %s", generation_type, attempt + 1)
            except Exception as exc:
                logger.error("DeepSeek Geography %s error on attempt %s: %s", generation_type, attempt + 1, exc)

        return None

    # -------------------------------------------------------------------------
    # Validation / enhancement
    # -------------------------------------------------------------------------

    def _validate_and_enhance_mcq(
        self,
        data: Dict,
        topic: str,
        difficulty: str,
        user_id: Optional[str],
        source: str,
    ) -> Dict:
        options = data.get("options") or {}
        if isinstance(options, dict):
            cleaned_options = options
        else:
            # If model returns list, coerce to A–D
            labels = ["A", "B", "C", "D"]
            cleaned_options = {labels[i]: opt for i, opt in enumerate(options[:4])}

        correct = data.get("correct_answer") or data.get("correct_option") or "A"
        if isinstance(correct, str):
            correct = correct.strip().upper()
        else:
            correct = "A"

        return {
            "question": data.get("question", ""),
            "options": cleaned_options,
            "correct_answer": correct,
            "explanation": data.get("explanation", ""),
            "topic": topic,
            "subtopic": data.get("subtopic", topic),
            "difficulty": difficulty,
            "question_type": "mcq",
            "subject": "geography",
            "source": source,
            "user_id": user_id,
        }

    def _validate_and_enhance_structured(
        self,
        data: Dict,
        topic: str,
        difficulty: str,
        user_id: Optional[str],
        source: str,
    ) -> Dict:
        return {
            "question_type": "structured",
            "context": data.get("context", ""),
            "stem": data.get("stem", ""),
            "parts": data.get("parts", []),
            "total_marks": data.get("total_marks", 10),
            "topic": topic,
            "subtopic": data.get("subtopic", topic),
            "difficulty": difficulty,
            "subject": "geography",
            "source": source,
            "user_id": user_id,
        }

    def _validate_and_enhance_essay(
        self,
        data: Dict,
        topic: str,
        difficulty: str,
        user_id: Optional[str],
        source: str,
    ) -> Dict:
        return {
            "question_type": "essay",
            "question": data.get("question", ""),
            "word_limit": data.get("word_limit", "200-350 words"),
            "marks": data.get("marks", 15),
            "key_points": data.get("key_points", []),
            "marking_criteria": data.get("marking_criteria", {}),
            "sample_answer_outline": data.get("sample_answer_outline", ""),
            "topic": topic,
            "subtopic": data.get("subtopic", topic),
            "difficulty": difficulty,
            "subject": "geography",
            "source": source,
            "user_id": user_id,
        }

    # -------------------------------------------------------------------------
    # Simple fallbacks (when AI fails completely)
    # -------------------------------------------------------------------------

    def _get_fallback_mcq_question(self, topic: str, difficulty: str, user_id: Optional[str]) -> Dict:
        """Very simple Geography fallback MCQ."""
        question = "Which of the following is an example of a renewable natural resource?"
        options = {
            "A": "Coal",
            "B": "Crude oil",
            "C": "Solar energy",
            "D": "Natural gas",
        }
        explanation = (
            "Solar energy is renewable because it is continuously supplied by the sun. "
            "Coal, crude oil and natural gas are non-renewable fossil fuels."
        )
        return {
            "question": question,
            "options": options,
            "correct_answer": "C",
            "explanation": explanation,
            "topic": topic or "Natural Resources",
            "subtopic": topic or "Natural Resources",
            "difficulty": difficulty,
            "question_type": "mcq",
            "subject": "geography",
            "user_id": user_id,
        }

    def _get_fallback_structured_question(self, topic: str, difficulty: str, user_id: Optional[str]) -> Dict:
        stem = "Study the information below about a village in a semi-arid region of Zimbabwe and answer the questions that follow."
        context = (
            "A village in Region IV receives low and erratic rainfall. Most villagers rely on rain-fed agriculture. "
            "In recent years, crop yields have declined and many young people have migrated to cities."
        )
        parts = [
            {
                "label": "a",
                "question": "Define the term 'semi-arid region'.",
                "marks": 2,
                "expected_answer": "A semi-arid region is an area that receives low and unreliable rainfall, just above desert conditions.",
                "marking_points": [
                    "Area with low rainfall (1 mark)",
                    "Rainfall is unreliable/variable/irregular (1 mark)",
                ],
            },
            {
                "label": "b",
                "question": "Explain TWO problems experienced by farmers in such areas.",
                "marks": 4,
                "expected_answer": "Farmers experience frequent droughts leading to crop failure; soils may be dry and easily eroded; water sources such as rivers and dams may dry up.",
                "marking_points": [
                    "Frequent droughts / crop failure (2 marks)",
                    "Water shortages for crops and livestock (2 marks)",
                ],
            },
            {
                "label": "c",
                "question": "Suggest THREE measures that the villagers and government can take to improve agriculture in this area.",
                "marks": 6,
                "expected_answer": "Construction of small dams and boreholes; practice irrigation; use drought-resistant crops; conservation farming; water harvesting; training farmers.",
                "marking_points": [
                    "Irrigation or small-scale irrigation (2 marks)",
                    "Use of drought-resistant crops (2 marks)",
                    "Water harvesting / conservation farming / soil conservation (2 marks)",
                ],
            },
        ]
        return {
            "question_type": "structured",
            "context": context,
            "stem": stem,
            "parts": parts,
            "total_marks": 12,
            "topic": topic or "Agriculture and Land Reform",
            "subtopic": topic or "Agriculture and Land Reform",
            "difficulty": difficulty,
            "subject": "geography",
            "user_id": user_id,
        }

    def _get_fallback_essay_question(self, topic: str, difficulty: str, user_id: Optional[str]) -> Dict:
        question = (
            "Discuss the causes and effects of deforestation in Zimbabwe. In your answer, "
            "refer to both rural and urban areas and suggest measures that can be taken to reduce the problem."
        )
        return {
            "question_type": "essay",
            "question": question,
            "word_limit": "200-350 words",
            "marks": 15,
            "key_points": [
                "Causes: fuelwood demand, land clearing for agriculture, settlement expansion, tobacco curing, illegal logging.",
                "Effects: soil erosion, loss of biodiversity, reduced rainfall, siltation of rivers and dams, climate change impacts.",
                "Rural vs urban dimensions (e.g., communal lands vs urban firewood markets and construction).",
                "Measures: reforestation/afforestation, alternative energy sources, controlled harvesting, community-based management, enforcement of laws.",
            ],
            "marking_criteria": {
                "content": "Accurate description of causes and effects, with Zimbabwean examples (up to 8 marks).",
                "analysis": "Quality of explanation, linkages and evaluation of measures (up to 4 marks).",
                "communication": "Clarity of expression, structure and use of geographical terms (up to 3 marks).",
            },
            "sample_answer_outline": "Define deforestation → outline key causes in Zimbabwe → explain environmental and socio-economic effects "
            "→ discuss realistic measures by government and communities → short conclusion on importance of sustainable forest management.",
            "topic": topic or "Environmental Management",
            "subtopic": topic or "Environmental Management",
            "difficulty": difficulty,
            "subject": "geography",
            "user_id": user_id,
        }


# Global instance
geography_generator = GeographyGenerator()

