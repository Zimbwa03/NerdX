import logging
import re
from typing import Dict, Optional, Tuple

logger = logging.getLogger(__name__)


# ============================================================================
# [DIAGRAM: ...] TAG SUPPORT FOR BIOLOGY/CHEMISTRY/PHYSICS
# ============================================================================


def _parse_diagram_tag(text: str) -> Optional[Dict]:
    """
    Extract a single [DIAGRAM: ...] tag from text.
    Supports: [DIAGRAM: type] or [DIAGRAM: type, subject=biology]
    Examples:
      [DIAGRAM: animal_cell]
      [DIAGRAM: photosynthesis, subject=biology]
      [DIAGRAM: atomic_structure, subject=chemistry]
    """
    match = re.search(r"\[DIAGRAM:\s*(.*?)\s*\]", text, flags=re.IGNORECASE | re.DOTALL)
    if not match:
        return None

    trigger_content = match.group(1).strip()
    diagram_type = trigger_content
    subject = None

    if ", subject=" in trigger_content.lower():
        parts = re.split(r",\s*subject\s*=\s*", trigger_content, flags=re.IGNORECASE)
        diagram_type = parts[0].strip()
        if len(parts) > 1:
            subject = parts[1].strip().lower()

    return {"diagram_type": diagram_type, "subject": subject, "span": match.span()}


def handle_teacher_diagram_trigger(
    response_text: str,
    user_id: str,
    subject_hint: str = "",
) -> Dict[str, Optional[str]]:
    """
    Convert [DIAGRAM: ...] into a Manim animation video.
    
    Args:
        response_text: The AI response containing [DIAGRAM: ...] tag
        user_id: User ID for logging
        subject_hint: The current Teacher Mode subject (Biology, Chemistry, Physics)
    
    Returns:
      {
        "clean_text": str,
        "video_url": Optional[str],
        "diagram_type": Optional[str],
      }
    """
    parsed = _parse_diagram_tag(response_text or "")
    if not parsed:
        return {"clean_text": response_text, "video_url": None, "diagram_type": None}

    diagram_type = parsed["diagram_type"].lower().replace(" ", "_")
    subject = parsed.get("subject") or _infer_subject(subject_hint, diagram_type)
    start, end = parsed["span"]

    # Remove the tag from text shown to user
    clean_text = (response_text[:start] + response_text[end:]).strip()

    out = {"clean_text": clean_text, "video_url": None, "diagram_type": diagram_type}

    try:
        video_result = None

        if subject == "biology":
            from services.biology_diagram_service import get_biology_diagram_service
            bio_service = get_biology_diagram_service()
            # Try to identify diagram type from keywords if not exact match
            resolved_type = bio_service.identify_diagram_type(diagram_type) or diagram_type
            video_result = bio_service.render_diagram(resolved_type)

        elif subject == "chemistry":
            from services.chemistry_diagram_service import get_chemistry_diagram_service
            chem_service = get_chemistry_diagram_service()
            resolved_type = chem_service.identify_diagram_type(diagram_type) or diagram_type
            video_result = chem_service.render_diagram(resolved_type)

        elif subject == "physics":
            from services.physics_diagram_service import get_physics_diagram_service
            phys_service = get_physics_diagram_service()
            resolved_type = phys_service.identify_diagram_type(diagram_type) or diagram_type
            video_result = phys_service.render_diagram(resolved_type)

        else:
            # Try all services to find a match
            video_result = _try_all_diagram_services(diagram_type)

        if video_result and video_result.get("success"):
            v_path = video_result.get("video_path")
            if v_path:
                out["video_url"] = f"/{v_path}"
                logger.info(f"Diagram rendered: {diagram_type} -> {v_path}")

    except Exception as e:
        logger.error(f"Teacher diagram trigger failed: {e}", exc_info=True)

    return out


def _infer_subject(subject_hint: str, diagram_type: str) -> str:
    """Infer subject from hint or diagram type keywords."""
    hint_lower = (subject_hint or "").lower()
    
    if "biology" in hint_lower or "bio" in hint_lower:
        return "biology"
    if "chemistry" in hint_lower or "chem" in hint_lower:
        return "chemistry"
    if "physics" in hint_lower or "phys" in hint_lower:
        return "physics"

    # Infer from diagram type keywords
    bio_keywords = ["cell", "dna", "photosynthesis", "respiration", "neuron", "heart", "mitosis", "meiosis"]
    chem_keywords = ["atom", "bond", "reaction", "electron", "orbital", "molecule", "acid", "base", "electrolysis"]
    phys_keywords = ["circuit", "ray", "wave", "force", "field", "magnet", "lens", "mirror", "pendulum"]

    dt_lower = diagram_type.lower()
    for kw in bio_keywords:
        if kw in dt_lower:
            return "biology"
    for kw in chem_keywords:
        if kw in dt_lower:
            return "chemistry"
    for kw in phys_keywords:
        if kw in dt_lower:
            return "physics"

    return "biology"  # Default fallback


def _try_all_diagram_services(diagram_type: str) -> Optional[Dict]:
    """Try all diagram services to find a matching diagram."""
    try:
        from services.biology_diagram_service import get_biology_diagram_service
        bio = get_biology_diagram_service()
        resolved = bio.identify_diagram_type(diagram_type)
        if resolved:
            return bio.render_diagram(resolved)
    except Exception:
        pass

    try:
        from services.chemistry_diagram_service import get_chemistry_diagram_service
        chem = get_chemistry_diagram_service()
        resolved = chem.identify_diagram_type(diagram_type)
        if resolved:
            return chem.render_diagram(resolved)
    except Exception:
        pass

    try:
        from services.physics_diagram_service import get_physics_diagram_service
        phys = get_physics_diagram_service()
        resolved = phys.identify_diagram_type(diagram_type)
        if resolved:
            return phys.render_diagram(resolved)
    except Exception:
        pass

    return None


def _parse_plot_tag(text: str) -> Optional[Dict]:
    """
    Extract a single [PLOT: ...] tag from text.
    Supports: [PLOT: expr] and [PLOT: expr, range=a:b]
    """
    match = re.search(r"\[PLOT:\s*(.*?)\s*\]", text, flags=re.IGNORECASE | re.DOTALL)
    if not match:
        return None

    trigger_content = match.group(1).strip()
    expression = trigger_content
    x_range: Optional[Tuple[float, float]] = None

    if ", range=" in trigger_content:
        parts = trigger_content.split(", range=")
        expression = parts[0].strip()
        range_str = parts[1].strip()
        if ":" in range_str:
            try:
                a, b = range_str.split(":", 1)

                def parse_val(v: str) -> float:
                    v = v.strip().lower()
                    # Support pi in range
                    v = v.replace("pi", "3.141592653589793")
                    return float(eval(v))  # noqa: S307 (trusted internal tag format)

                x_range = (parse_val(a), parse_val(b))
            except Exception:
                x_range = None

    return {"expression": expression, "x_range": x_range, "span": match.span()}


def handle_teacher_plot_trigger(
    response_text: str,
    user_id: str,
    user_name: str = "Student",
    title: str = "NerdX Teacher Mode",
) -> Dict[str, Optional[str]]:
    """
    Convert [PLOT: ...] into:
    - a Matplotlib image (graph_url)
    - a matching Manim video (video_url)

    Returns:
      {
        "clean_text": str,
        "graph_url": Optional[str],
        "video_url": Optional[str],
        "graph_spec": Optional[dict],
      }
    """
    parsed = _parse_plot_tag(response_text or "")
    if not parsed:
        return {"clean_text": response_text, "graph_url": None, "video_url": None, "graph_spec": None}

    expression = parsed["expression"]
    x_range = parsed["x_range"]
    start, end = parsed["span"]

    # Remove the tag from text shown to user
    clean_text = (response_text[:start] + response_text[end:]).strip()

    out = {"clean_text": clean_text, "graph_url": None, "video_url": None, "graph_spec": None}

    try:
        from services.graph_service import GraphService

        graph_service = GraphService()
        graph_result = graph_service.create_graph(
            user_id=user_id,
            expression=expression,
            title=title,
            user_name=user_name,
            x_range=x_range,
        )
        image_path = (graph_result or {}).get("image_path")
        graph_spec = (graph_result or {}).get("graph_spec")
        out["graph_spec"] = graph_spec

        if image_path:
            # Convert local path to a /static URL path
            # Most parts of the app expect "/static/graphs/<file>"
            import os as _os

            filename = _os.path.basename(image_path)
            out["graph_url"] = f"/static/graphs/{filename}"

        # Manim video (deterministic)
        try:
            from services.manim_service import get_manim_service

            manim = get_manim_service()
            video_result = None

            if graph_spec:
                spec_type = graph_spec.get("graph_type")
                coeffs = graph_spec.get("coefficients") or {}
                xr = graph_spec.get("x_range")
                yr = graph_spec.get("y_range")

                if spec_type == "linear" and "m" in coeffs:
                    video_result = manim.render_linear(float(coeffs.get("m", 1.0)), float(coeffs.get("c", 0.0)), x_range=xr, y_range=yr)
                elif spec_type == "quadratic" and "a" in coeffs:
                    video_result = manim.render_quadratic(
                        float(coeffs.get("a", 1.0)),
                        float(coeffs.get("b", 0.0)),
                        float(coeffs.get("c", 0.0)),
                        x_range=xr,
                        y_range=yr,
                    )
                else:
                    # trig/exponential/other → expression-based animation
                    clean_expr = graph_spec.get("clean_expression") or expression
                    video_result = manim.render_expression(clean_expr, x_range=xr, y_range=yr)

            if video_result and video_result.get("success"):
                v_path = video_result.get("video_path")
                if v_path:
                    out["video_url"] = f"/{v_path}"
        except Exception as e:
            logger.warning(f"Teacher plot trigger: manim render failed: {e}")

    except Exception as e:
        logger.error(f"Teacher plot trigger failed: {e}", exc_info=True)

    return out


