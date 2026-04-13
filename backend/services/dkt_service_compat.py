"""
DKT Service Compatibility Layer
================================
Thin wrappers used by the streaming endpoint so it doesn't need to import
the full DeepKnowledgeTracing class.
"""

from services.dkt_service import get_recommended_difficulty as _get_recommended_difficulty


def get_recommended_difficulty(student_id: str, subject: str, topic: str) -> str:
    return _get_recommended_difficulty(student_id, subject, topic)
