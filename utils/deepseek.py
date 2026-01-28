import os
from typing import Optional

import requests

DEFAULT_CHAT_MODEL = "deepseek-chat"
DEFAULT_REASONER_MODEL = "deepseek-reasoner"


def get_deepseek_chat_model() -> str:
    return os.getenv("DEEPSEEK_CHAT_MODEL", DEFAULT_CHAT_MODEL)


def get_deepseek_reasoner_model() -> str:
    return os.getenv("DEEPSEEK_REASONER_MODEL", DEFAULT_REASONER_MODEL)


def call_deepseek_chat(
    model: Optional[str] = None,
    system_prompt: str = "",
    user_prompt: str = "",
    temperature: float = 0.7,
    max_tokens: int = 1024,
) -> str:
    """
    Minimal helper to call the DeepSeek chat API and return plain text.

    This is used by services like ProgrammingLabAIService as a fallback when
    Vertex AI is unavailable.
    """
    api_key = os.getenv("DEEPSEEK_API_KEY")
    if not api_key:
        raise RuntimeError("DEEPSEEK_API_KEY is not configured")

    if not user_prompt:
        raise ValueError("user_prompt must not be empty")

    chat_model = model or get_deepseek_chat_model()

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": chat_model,
        "messages": [
            {"role": "system", "content": system_prompt or ""},
            {"role": "user", "content": user_prompt},
        ],
        "temperature": float(temperature),
        "max_tokens": int(max_tokens),
    }

    # Use the same base URL pattern as other DeepSeek integrations in the project
    url = "https://api.deepseek.com/chat/completions"

    resp = requests.post(url, json=payload, headers=headers, timeout=30)
    resp.raise_for_status()

    data = resp.json()
    choices = data.get("choices") or []
    if not choices:
        raise RuntimeError("DeepSeek response did not contain any choices")

    message = choices[0].get("message") or {}
    content = message.get("content", "")
    if not isinstance(content, str):
        raise RuntimeError("DeepSeek response content was not a string")

    return content
