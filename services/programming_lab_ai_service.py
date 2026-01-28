"""
Programming Lab - AI Assistant Service

Uses:
- Vertex AI (Gemini) as PRIMARY model via vertex_service.generate_text
- DeepSeek as FALLBACK via utils.deepseek helper

This mirrors the multi-provider pattern already used in ComputerScienceGenerator.
"""

from dataclasses import dataclass
from typing import Optional, List, Dict, Any

from services.vertex_service import vertex_service
from utils.deepseek import get_deepseek_chat_model, call_deepseek_chat


@dataclass
class AIRequest:
    type: str  # 'code-help' | 'debug' | 'explain' | 'suggest-test' | 'fix-error' | 'general-question'
    code: Optional[str] = None
    language: Optional[str] = None
    error: Optional[str] = None
    userQuestion: Optional[str] = None
    context: Optional[Dict[str, Any]] = None
    conversationHistory: Optional[List[Dict[str, Any]]] = None


@dataclass
class AIResponse:
    type: str
    content: str
    codeSnippet: Optional[str] = None
    explanation: Optional[str] = None
    suggestions: Optional[List[str]] = None
    followUpQuestions: Optional[List[str]] = None
    confidence: Optional[float] = None


class ProgrammingLabAIService:
    """AI helper for the Programming Lab editor."""

    def __init__(self) -> None:
        self.deepseek_model = get_deepseek_chat_model()

    def process_request(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        req = AIRequest(
            type=payload.get("type") or "general-question",
            code=payload.get("code"),
            language=payload.get("language"),
            error=payload.get("error"),
            userQuestion=payload.get("userQuestion"),
            context=payload.get("context") or {},
            conversationHistory=payload.get("conversationHistory") or [],
        )

        # Always try Vertex AI (Gemini) first
        try:
            vertex_result = self._call_vertex(req)
            if vertex_result:
                return self._response_to_dict(vertex_result)
        except Exception:
            # Fall through to DeepSeek
            pass

        # Fallback: DeepSeek
        deepseek_result = self._call_deepseek(req)
        return self._response_to_dict(deepseek_result)

    # ------------------------------
    # Provider calls
    # ------------------------------
    def _call_vertex(self, req: AIRequest) -> Optional[AIResponse]:
        if not vertex_service.is_available():
            return None

        prompt = self._build_prompt(req)

        result = vertex_service.generate_text(prompt=prompt, model="gemini-2.5-flash")
        if not result or not result.get("success"):
            return None

        text = result.get("text") or ""
        return self._parse_ai_response(text, req)

    def _call_deepseek(self, req: AIRequest) -> AIResponse:
        prompt = self._build_prompt(req)
        # Use helper that wraps DeepSeek HTTP call similar to ComputerScienceGenerator
        text = call_deepseek_chat(
            model=self.deepseek_model,
            system_prompt="You are an expert programming tutor for ZIMSEC and Cambridge students.",
            user_prompt=prompt,
        )
        return self._parse_ai_response(text, req)

    # ------------------------------
    # Prompt and parsing
    # ------------------------------
    def _build_prompt(self, req: AIRequest) -> str:
        level = (req.context or {}).get("userLevel") or "intermediate"
        language = req.language or "Python"
        base = f"""
You are an expert programming tutor helping {level} Computer Science students (ZIMSEC 6023 and Cambridge 9618).
Language: {language}

Your role:
- Explain concepts clearly with short examples
- Help debug code and identify errors
- Suggest improvements and best practices
- Ask 1–2 short follow-up questions to guide learning
- Do NOT simply give full homework answers without explanation.
""".strip()

        code_block = ""
        if req.code:
            code_block = f"\n\nStudent's code:\n```{language.lower()}\n{req.code}\n```"

        if req.type == "debug" or req.type == "fix-error":
            return (
                base
                + code_block
                + f"\n\nThe student sees this error:\n{req.error or ''}\n\n"
                "Explain:\n"
                "1. Why this error occurred\n"
                "2. What the error message means\n"
                "3. How to fix it step by step\n"
                "4. Show a corrected code snippet if appropriate\n"
                "5. How to avoid similar bugs in future."
            )
        if req.type == "explain":
            selected = (req.context or {}).get("selectedCode") or ""
            selected_block = f"\n\nSelected snippet:\n```{language.lower()}\n{selected}\n```" if selected else ""
            return (
                base
                + selected_block
                + f"\n\nStudent question:\n{req.userQuestion or ''}\n\n"
                "Explain this in a way that a motivated A Level student can understand, with a short example."
            )
        if req.type == "suggest-test":
            return (
                base
                + code_block
                + "\n\nSuggest 3–5 good test cases for this code, including normal, boundary and invalid inputs. "
                "For each test case, describe input and expected output and what it checks."
            )
        if req.type == "code-help":
            return (
                base
                + code_block
                + f"\n\nThe student says:\n{req.userQuestion or ''}\n\n"
                "Give guidance and ask 1–2 small follow-up questions."
            )

        # general-question
        return (
            base
            + f"\n\nStudent question:\n{req.userQuestion or ''}\n\n"
            "Answer concisely with a clear explanation and a tiny example if useful."
        )

    def _parse_ai_response(self, text: str, req: AIRequest) -> AIResponse:
        code_snippet = None
        # Extract first fenced code block if present
        if "```" in text:
            try:
                start = text.index("```")
                end = text.index("```", start + 3)
                block = text[start + 3 : end]
                # Strip optional language tag on first line
                newline_idx = block.find("\n")
                if newline_idx != -1:
                    code_snippet = block[newline_idx + 1 :].strip()
                else:
                    code_snippet = block.strip()
            except ValueError:
                code_snippet = None

        # Very light heuristic for suggestions: bullet points
        suggestions: List[str] = []
        for line in text.splitlines():
            line_stripped = line.strip()
            if line_stripped.startswith(("- ", "* ")):
                suggestions.append(line_stripped[2:].strip())

        confidence = self._estimate_confidence(text)

        return AIResponse(
            type=req.type,
            content=text,
            codeSnippet=code_snippet,
            explanation=None,
            suggestions=suggestions or None,
            followUpQuestions=None,
            confidence=confidence,
        )

    def _estimate_confidence(self, response: str) -> float:
        """Simple heuristic based on length and presence of structure."""
        word_count = len(response.split())
        has_code = "```" in response
        has_list = any(line.strip().startswith(("- ", "* ")) for line in response.splitlines())
        score = 0.0
        score += min(0.4, (word_count / 120.0) * 0.4)
        if has_code:
            score += 0.3
        if has_list:
            score += 0.3
        return min(1.0, score)

    def _response_to_dict(self, resp: AIResponse) -> Dict[str, Any]:
        return {
            "type": resp.type,
            "content": resp.content,
            "codeSnippet": resp.codeSnippet,
            "explanation": resp.explanation,
            "suggestions": resp.suggestions,
            "followUpQuestions": resp.followUpQuestions,
            "confidence": resp.confidence,
        }


programming_lab_ai_service = ProgrammingLabAIService()

