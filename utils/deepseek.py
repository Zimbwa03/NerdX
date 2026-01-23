import os

DEFAULT_CHAT_MODEL = "deepseek-chat"
DEFAULT_REASONER_MODEL = "deepseek-reasoner"


def get_deepseek_chat_model() -> str:
    return os.getenv("DEEPSEEK_CHAT_MODEL", DEFAULT_CHAT_MODEL)


def get_deepseek_reasoner_model() -> str:
    return os.getenv("DEEPSEEK_REASONER_MODEL", DEFAULT_REASONER_MODEL)
