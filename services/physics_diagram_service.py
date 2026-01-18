#!/usr/bin/env python3
"""
Physics Diagram Service - Renders physics diagrams using Manim
"""

import hashlib
import logging
import os
import subprocess
import sys
from typing import Dict, Optional

logger = logging.getLogger(__name__)


class PhysicsDiagramService:
    """Service to render physics diagrams using Manim templates."""

    # Mapping of keywords to scene names
    DIAGRAM_KEYWORDS = {
        # Ray diagrams / Optics
        "ray": "ray_diagram",
        "ray diagram": "ray_diagram",
        "ray_diagram": "ray_diagram",
        "lens": "ray_diagram",
        "convex lens": "ray_diagram",
        "converging lens": "ray_diagram",
        "concave lens": "ray_diagram",
        "mirror": "ray_diagram",
        "refraction": "ray_diagram",
        "reflection": "ray_diagram",
        "focal point": "ray_diagram",
        "optics": "ray_diagram",
        # Circuits
        "circuit": "circuit",
        "electric circuit": "circuit",
        "electrical circuit": "circuit",
        "resistor": "circuit",
        "battery": "circuit",
        "bulb": "circuit",
        "switch": "circuit",
        "ohm": "circuit",
        "current": "circuit",
        "voltage": "circuit",
        # Waves
        "wave": "wave",
        "wave properties": "wave",
        "wavelength": "wave",
        "amplitude": "wave",
        "frequency": "wave",
        "crest": "wave",
        "trough": "wave",
        "transverse wave": "wave",
        "longitudinal wave": "wave",
        # Forces
        "force": "force_diagram",
        "force diagram": "force_diagram",
        "forces": "force_diagram",
        "free body diagram": "force_diagram",
        "weight": "force_diagram",
        "friction": "force_diagram",
        "normal force": "force_diagram",
        "tension": "force_diagram",
        "newton": "force_diagram",
        # Magnetic fields
        "magnetic": "magnetic_field",
        "magnetic field": "magnetic_field",
        "magnet": "magnetic_field",
        "bar magnet": "magnetic_field",
        "field lines": "magnetic_field",
        "compass": "magnetic_field",
        "electromagnet": "magnetic_field",
        # Pendulum / Oscillations
        "pendulum": "pendulum",
        "simple pendulum": "pendulum",
        "oscillation": "pendulum",
        "shm": "pendulum",
        "simple harmonic motion": "pendulum",
        "period": "pendulum",
    }

    def __init__(self):
        self.base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.templates_file = os.path.join(
            self.base_dir, "services", "physics_diagram_templates.py"
        )
        self.media_dir = os.path.join(self.base_dir, "static", "media")
        os.makedirs(self.media_dir, exist_ok=True)

    def identify_diagram_type(self, text: str) -> Optional[str]:
        """
        Identify which physics diagram to render based on text content.
        Returns scene name or None if no match.
        """
        text_lower = text.lower()
        for keyword, scene_name in self.DIAGRAM_KEYWORDS.items():
            if keyword in text_lower:
                return scene_name
        return None

    def render_diagram(self, diagram_type: str, quality: str = "l") -> Dict:
        """
        Render a physics diagram by type.
        
        Args:
            diagram_type: One of the scene names (ray_diagram, circuit, wave, etc.)
            quality: 'l' (480p), 'm' (720p), 'h' (1080p)
        
        Returns:
            Dict with success, video_path (relative), or error
        """
        # Map diagram type to scene class name
        scene_map = {
            "ray_diagram": "RayDiagramConvexLensScene",
            "circuit": "CircuitDiagramScene",
            "wave": "WavePropertiesScene",
            "force_diagram": "ForceDiagramScene",
            "magnetic_field": "MagneticFieldScene",
            "pendulum": "PendulumScene",
        }

        scene_name = scene_map.get(diagram_type)
        if not scene_name:
            return {"success": False, "error": f"Unknown diagram type: {diagram_type}"}

        # Check cache first
        cache_key = f"{scene_name}_{quality}"
        cache_hash = hashlib.md5(cache_key.encode()).hexdigest()[:12]

        quality_map = {"l": "480p15", "m": "720p30", "h": "1080p60"}
        quality_dir = quality_map.get(quality, "480p15")

        cached_filename = f"{scene_name}_phys_{cache_hash}.mp4"
        cached_path = os.path.join(
            self.media_dir,
            "videos",
            "physics_diagram_templates",
            quality_dir,
            cached_filename,
        )

        if os.path.exists(cached_path):
            relative_path = os.path.relpath(cached_path, self.base_dir).replace(
                "\\", "/"
            )
            logger.info(f"Physics diagram cache hit: {relative_path}")
            return {"success": True, "video_path": relative_path, "cached": True}

        # Render with Manim
        return self._render_scene(scene_name, quality, cached_filename)

    def _render_scene(
        self, scene_name: str, quality: str, output_filename: str
    ) -> Dict:
        """Run Manim to render the scene."""
        cmd = [
            sys.executable,
            "-m",
            "manim",
            f"-q{quality}",
            "--media_dir",
            self.media_dir,
            "-o",
            output_filename,
            self.templates_file,
            scene_name,
        ]

        logger.info(f"Rendering physics diagram: {scene_name}")

        try:
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                check=True,
                timeout=180,
                cwd=self.base_dir,
            )

            # Find output file
            quality_map = {"l": "480p15", "m": "720p30", "h": "1080p60"}
            quality_dir = quality_map.get(quality, "480p15")

            video_path = os.path.join(
                self.media_dir,
                "videos",
                "physics_diagram_templates",
                quality_dir,
                output_filename,
            )

            if os.path.exists(video_path):
                relative_path = os.path.relpath(video_path, self.base_dir).replace(
                    "\\", "/"
                )
                logger.info(f"Physics diagram rendered: {relative_path}")
                return {"success": True, "video_path": relative_path}
            else:
                logger.error(f"Video file not found after rendering: {video_path}")
                return {
                    "success": False,
                    "error": "Video file not found after rendering",
                    "logs": result.stdout + "\n" + result.stderr,
                }

        except subprocess.TimeoutExpired:
            logger.error("Physics diagram rendering timed out")
            return {"success": False, "error": "Animation rendering timed out (>180s)"}
        except subprocess.CalledProcessError as e:
            logger.error(f"Physics diagram rendering failed: {e.stderr}")
            return {
                "success": False,
                "error": "Manim rendering failed",
                "logs": (e.stdout or "") + "\n" + (e.stderr or ""),
            }
        except Exception as e:
            logger.error(f"Physics diagram exception: {e}")
            return {"success": False, "error": str(e)}


# Singleton instance
_physics_diagram_service = None


def get_physics_diagram_service() -> PhysicsDiagramService:
    global _physics_diagram_service
    if _physics_diagram_service is None:
        _physics_diagram_service = PhysicsDiagramService()
    return _physics_diagram_service

