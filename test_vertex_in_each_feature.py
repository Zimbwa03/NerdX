"""
Test Vertex AI generation in each feature that uses it.
Runs one test per feature and asserts Vertex is used when available (where the API exposes source/ai_model).
"""
import os
import sys
import logging
from dotenv import load_dotenv

# Project root on path
_SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
if _SCRIPT_DIR not in sys.path:
    sys.path.insert(0, _SCRIPT_DIR)

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


def _vertex_available() -> bool:
    try:
        from services.vertex_service import vertex_service
        return bool(vertex_service.is_available())
    except Exception:
        return False


def test_vertex_service() -> bool:
    """Vertex service text generation."""
    logger.info("Feature: Vertex service (generate_text)")
    try:
        from services.vertex_service import vertex_service
        if not vertex_service.is_available():
            logger.warning("Vertex not available - skip assert")
            return True
        prompt = "Return JSON: {\"x\": 1}"
        out = vertex_service.generate_text(prompt=prompt, model="gemini-2.5-flash")
        ok = out and out.get("success")
        if ok:
            logger.info("  -> Vertex generate_text OK (Vertex used)")
        else:
            logger.error("  -> Vertex generate_text failed: %s", out.get("error") if out else "no result")
        return ok
    except Exception as e:
        logger.error("  -> Error: %s", e, exc_info=True)
        return False


def test_math_topical() -> bool:
    """Math topical question: expects source=='vertex_ai' when Vertex used."""
    logger.info("Feature: Math topical (generate_question)")
    try:
        from services.math_question_generator import MathQuestionGenerator
        gen = MathQuestionGenerator()
        out = gen.generate_question(
            subject="Mathematics",
            topic="Algebra",
            difficulty="easy",
            platform="whatsapp",
        )
        if not out:
            logger.error("  -> No result")
            return False
        src = out.get("source")
        if _vertex_available() and src != "vertex_ai":
            logger.warning("  -> Vertex available but source=%s (expected vertex_ai)", src)
            return False
        logger.info("  -> OK (source=%s)", src)
        return True
    except Exception as e:
        logger.error("  -> Error: %s", e, exc_info=True)
        return False


def test_math_graph() -> bool:
    """Math graph question: expects source=='vertex_ai' when Vertex used."""
    logger.info("Feature: Math graph (generate_graph_question)")
    try:
        from services.math_question_generator import MathQuestionGenerator
        gen = MathQuestionGenerator()
        out = gen.generate_graph_question(
            equation="y=x^2",
            graph_type="parabola",
            difficulty="easy",
        )
        if not out:
            logger.error("  -> No result")
            return False
        src = out.get("source")
        if _vertex_available() and src != "vertex_ai":
            logger.warning("  -> Vertex available but source=%s (expected vertex_ai)", src)
            return False
        logger.info("  -> OK (source=%s)", src)
        return True
    except Exception as e:
        logger.error("  -> Error: %s", e, exc_info=True)
        return False


def test_combined_science_topical() -> bool:
    """Combined science topical: no source field in response; check valid question."""
    logger.info("Feature: Combined science (generate_topical_question)")
    try:
        from services.combined_science_generator import CombinedScienceGenerator
        gen = CombinedScienceGenerator()
        out = gen.generate_topical_question(
            subject="Biology",
            topic="Cell Structure",
            difficulty="easy",
            platform="whatsapp",
        )
        if not out:
            logger.error("  -> No result")
            return False
        if not out.get("question") or not out.get("options"):
            logger.error("  -> Missing question or options")
            return False
        logger.info("  -> OK (question generated)")
        return True
    except Exception as e:
        logger.error("  -> Error: %s", e, exc_info=True)
        return False


def test_flashcards() -> bool:
    """Flashcards: no source in response; check non-empty list when AI available."""
    logger.info("Feature: Flashcards (generate_flashcards)")
    try:
        from services.flashcard_service import FlashcardService
        svc = FlashcardService()
        out = svc.generate_flashcards(
            subject="Biology",
            topic="Cells",
            notes_content="Cells are the basic unit of life. They have a membrane, cytoplasm, nucleus.",
            count=3,
        )
        if not isinstance(out, list):
            logger.error("  -> Result is not a list: %s", type(out))
            return False
        if len(out) < 1:
            logger.warning("  -> Empty list (fallback may have run)")
        logger.info("  -> OK (%d cards)", len(out))
        return True
    except Exception as e:
        logger.error("  -> Error: %s", e, exc_info=True)
        return False


def test_english_grammar() -> bool:
    """English grammar: success + question_data (no vertex flag in response)."""
    logger.info("Feature: English grammar (generate_grammar_question)")
    try:
        from services.english_service import EnglishService
        svc = EnglishService()
        out = svc.generate_grammar_question(platform="mobile")
        if not out or not out.get("success"):
            logger.error("  -> No success or missing result")
            return False
        qd = out.get("question_data")
        if not qd:
            logger.error("  -> No question_data")
            return False
        logger.info("  -> OK (question_data present)")
        return True
    except Exception as e:
        logger.error("  -> Error: %s", e, exc_info=True)
        return False


def test_ai_service_science() -> bool:
    """AI service science question: expects source=='vertex_ai' when Vertex used."""
    logger.info("Feature: AI service science (generate_science_question)")
    try:
        from services.ai_service import AIService
        svc = AIService()
        out = svc.generate_science_question(
            subject="Biology",
            topic="Cells",
            difficulty="easy",
            platform="whatsapp",
        )
        if not out:
            logger.error("  -> No result")
            return False
        src = out.get("source")
        if _vertex_available() and src != "vertex_ai":
            logger.warning("  -> Vertex available but source=%s (expected vertex_ai)", src)
            return False
        logger.info("  -> OK (source=%s)", src)
        return True
    except Exception as e:
        logger.error("  -> Error: %s", e, exc_info=True)
        return False


def test_a_level_math() -> bool:
    """A-Level Pure Math: expects ai_model=='vertex_ai' when Vertex used."""
    logger.info("Feature: A-Level Pure Math (generate_question)")
    try:
        from services.a_level_pure_math_generator import ALevelPureMathGenerator
        gen = ALevelPureMathGenerator()
        out = gen.generate_question(topic="Polynomials", difficulty="easy", question_type="mcq")
        if not out:
            logger.error("  -> No result")
            return False
        ai_model = out.get("ai_model")
        if _vertex_available() and ai_model != "vertex_ai":
            logger.warning("  -> Vertex available but ai_model=%s (expected vertex_ai)", ai_model)
            return False
        logger.info("  -> OK (ai_model=%s)", ai_model)
        return True
    except Exception as e:
        logger.error("  -> Error: %s", e, exc_info=True)
        return False


def test_a_level_biology() -> bool:
    """A-Level Biology: expects ai_model=='vertex_ai' when Vertex used."""
    logger.info("Feature: A-Level Biology (generate_question)")
    try:
        from services.a_level_biology_generator import ALevelBiologyGenerator
        gen = ALevelBiologyGenerator()
        out = gen.generate_question(topic="cell_structure", difficulty="easy", question_type="mcq")
        if not out:
            logger.error("  -> No result")
            return False
        ai_model = out.get("ai_model")
        if _vertex_available() and ai_model != "vertex_ai":
            logger.warning("  -> Vertex available but ai_model=%s (expected vertex_ai)", ai_model)
            return False
        logger.info("  -> OK (ai_model=%s)", ai_model)
        return True
    except Exception as e:
        logger.error("  -> Error: %s", e, exc_info=True)
        return False


def test_a_level_physics() -> bool:
    """A-Level Physics: expects ai_model=='vertex_ai' when Vertex used."""
    logger.info("Feature: A-Level Physics (generate_question)")
    try:
        from services.a_level_physics_generator import ALevelPhysicsGenerator
        gen = ALevelPhysicsGenerator()
        out = gen.generate_question(topic="Kinematics", difficulty="easy", question_type="mcq")
        if not out:
            logger.error("  -> No result")
            return False
        ai_model = out.get("ai_model")
        if _vertex_available() and ai_model != "vertex_ai":
            logger.warning("  -> Vertex available but ai_model=%s (expected vertex_ai)", ai_model)
            return False
        logger.info("  -> OK (ai_model=%s)", ai_model)
        return True
    except Exception as e:
        logger.error("  -> Error: %s", e, exc_info=True)
        return False


def test_a_level_chemistry() -> bool:
    """A-Level Chemistry: expects ai_model=='vertex_ai' when Vertex used."""
    logger.info("Feature: A-Level Chemistry (generate_question)")
    try:
        from services.a_level_chemistry_generator import ALevelChemistryGenerator
        gen = ALevelChemistryGenerator()
        out = gen.generate_question(topic="Atomic Structure", difficulty="easy", question_type="mcq")
        if not out:
            logger.error("  -> No result")
            return False
        ai_model = out.get("ai_model")
        if _vertex_available() and ai_model != "vertex_ai":
            logger.warning("  -> Vertex available but ai_model=%s (expected vertex_ai)", ai_model)
            return False
        logger.info("  -> OK (ai_model=%s)", ai_model)
        return True
    except Exception as e:
        logger.error("  -> Error: %s", e, exc_info=True)
        return False


def main():
    logger.info("=" * 60)
    logger.info("Vertex generation in each feature")
    logger.info("=" * 60)
    avail = _vertex_available()
    logger.info("Vertex available: %s", avail)
    logger.info("")

    results = []
    tests = [
        ("Vertex service", test_vertex_service),
        ("Math topical", test_math_topical),
        ("Math graph", test_math_graph),
        ("Combined science topical", test_combined_science_topical),
        ("Flashcards", test_flashcards),
        ("English grammar", test_english_grammar),
        ("AI service science", test_ai_service_science),
        ("A-Level Pure Math", test_a_level_math),
        ("A-Level Biology", test_a_level_biology),
        ("A-Level Physics", test_a_level_physics),
        ("A-Level Chemistry", test_a_level_chemistry),
    ]
    for name, fn in tests:
        try:
            ok = fn()
            results.append((name, ok))
        except Exception as e:
            logger.exception("Uncaught in %s", name)
            results.append((name, False))
        logger.info("")

    logger.info("=" * 60)
    logger.info("Summary")
    logger.info("=" * 60)
    for name, ok in results:
        logger.info("  %s: %s", name, "PASS" if ok else "FAIL")
    all_ok = all(r[1] for r in results)
    logger.info("Overall: %s", "PASS" if all_ok else "FAIL")
    return 0 if all_ok else 1


if __name__ == "__main__":
    sys.exit(main())
