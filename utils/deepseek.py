import os
import logging
import time
from typing import Optional

import requests
from requests.exceptions import Timeout, ConnectionError, HTTPError

logger = logging.getLogger(__name__)

DEFAULT_CHAT_MODEL = "deepseek-chat"
DEFAULT_REASONER_MODEL = "deepseek-reasoner"
DEFAULT_TIMEOUT = 60  # Increased from 30s to handle longer AI generations
MAX_RETRIES = 2


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
    timeout: Optional[int] = None,
    retries: int = MAX_RETRIES,
) -> str:
    """
    Minimal helper to call the DeepSeek chat API and return plain text.

    This is used by services like ProgrammingLabAIService as a fallback when
    Vertex AI is unavailable.
    
    Args:
        model: DeepSeek model to use (defaults to DEEPSEEK_CHAT_MODEL env var)
        system_prompt: System prompt for the AI
        user_prompt: User prompt (required)
        temperature: Sampling temperature (0.0-2.0)
        max_tokens: Maximum tokens in response
        timeout: Request timeout in seconds (default: 60)
        retries: Number of retry attempts on timeout (default: 2)
    
    Returns:
        str: The AI response content
        
    Raises:
        RuntimeError: If DEEPSEEK_API_KEY is not configured or API fails
        ValueError: If user_prompt is empty
    """
    api_key = os.getenv("DEEPSEEK_API_KEY")
    if not api_key:
        raise RuntimeError("DEEPSEEK_API_KEY is not configured")

    if not user_prompt:
        raise ValueError("user_prompt must not be empty")

    chat_model = model or get_deepseek_chat_model()
    request_timeout = timeout or DEFAULT_TIMEOUT

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
    
    last_error = None
    for attempt in range(retries + 1):
        try:
            logger.debug(f"DeepSeek API call attempt {attempt + 1}/{retries + 1} (timeout: {request_timeout}s)")
            
            resp = requests.post(url, json=payload, headers=headers, timeout=request_timeout)
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
            
        except Timeout as e:
            last_error = e
            logger.warning(f"DeepSeek API timeout on attempt {attempt + 1}/{retries + 1}: {e}")
            if attempt < retries:
                # Exponential backoff: 1s, 2s, 4s...
                wait_time = min(2 ** attempt, 5)
                logger.info(f"Retrying in {wait_time}s...")
                time.sleep(wait_time)
                # Increase timeout for retry
                request_timeout = min(request_timeout + 15, 90)
            continue
            
        except ConnectionError as e:
            last_error = e
            logger.warning(f"DeepSeek API connection error on attempt {attempt + 1}/{retries + 1}: {e}")
            if attempt < retries:
                time.sleep(2)
            continue
            
        except HTTPError as e:
            # Don't retry on HTTP errors (4xx, 5xx) - they're usually not transient
            logger.error(f"DeepSeek API HTTP error: {e}")
            raise RuntimeError(f"DeepSeek API error: {e}")
            
        except Exception as e:
            logger.error(f"DeepSeek API unexpected error: {e}")
            raise RuntimeError(f"DeepSeek API error: {e}")
    
    # All retries exhausted
    logger.error(f"DeepSeek API failed after {retries + 1} attempts: {last_error}")
    raise RuntimeError(f"DeepSeek API timeout after {retries + 1} attempts")
