#!/usr/bin/env python3
"""
Biology Diagram Service - Renders biology diagrams using Manim
"""

import hashlib
import logging
import os
import subprocess
import sys
from typing import Dict, Optional

logger = logging.getLogger(__name__)


class BiologyDiagramService:
    """Service to render biology diagrams using Manim templates."""

    # Mapping of keywords to scene names
    DIAGRAM_KEYWORDS = {
        # Cell structure
        "animal cell": "animal_cell",
        "animal_cell": "animal_cell",
        "cell structure animal": "animal_cell",
        "plant cell": "plant_cell",
        "plant_cell": "plant_cell",
        "cell structure plant": "plant_cell",
        "cell wall": "plant_cell",
        "chloroplast": "plant_cell",
        # DNA
        "dna": "dna",
        "double helix": "dna",
        "dna structure": "dna",
        "nucleotide": "dna",
        "base pair": "dna",
        # Photosynthesis
        "photosynthesis": "photosynthesis",
        "light reaction": "photosynthesis",
        "calvin cycle": "photosynthesis",
        # Respiration
        "respiration": "respiration",
        "aerobic respiration": "respiration",
        "atp": "respiration",
        "mitochondria": "respiration",
        "cellular respiration": "respiration",
        # Neuron
        "neuron": "neuron",
        "nerve cell": "neuron",
        "axon": "neuron",
        "dendrite": "neuron",
        "synapse": "neuron",
        "nervous system": "neuron",
        # Heart
        "heart": "heart",
        "cardiac": "heart",
        "ventricle": "heart",
        "atrium": "heart",
        "blood flow": "heart",
        "circulatory": "heart",
        # Mitosis
        "mitosis": "mitosis",
        "cell division": "mitosis",
        "prophase": "mitosis",
        "metaphase": "mitosis",
        "anaphase": "mitosis",
        "telophase": "mitosis",
    }

    def __init__(self):
        self.base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.templates_file = os.path.join(
            self.base_dir, "services", "biology_diagram_templates.py"
        )
        self.media_dir = os.path.join(self.base_dir, "static", "media")
        os.makedirs(self.media_dir, exist_ok=True)

    def identify_diagram_type(self, text: str) -> Optional[str]:
        """
        Identify which biology diagram to render based on text content.
        Returns scene name or None if no match.
        """
        text_lower = text.lower()
        for keyword, scene_name in self.DIAGRAM_KEYWORDS.items():
            if keyword in text_lower:
                return scene_name
        return None

    def render_diagram(
        self, diagram_type: str, quality: str = "l"
    ) -> Dict:
        """
        Render a biology diagram by type.
        
        Args:
            diagram_type: One of the scene names (animal_cell, plant_cell, dna, etc.)
            quality: 'l' (480p), 'm' (720p), 'h' (1080p)
        
        Returns:
            Dict with success, video_path (relative), or error
        """
        # Map diagram type to scene class name
        scene_map = {
            "animal_cell": "AnimalCellScene",
            "plant_cell": "PlantCellScene",
            "dna": "DNAStructureScene",
            "photosynthesis": "PhotosynthesisScene",
            "respiration": "RespirationScene",
            "neuron": "NeuronScene",
            "heart": "HeartStructureScene",
            "mitosis": "MitosisScene",
        }

        scene_name = scene_map.get(diagram_type)
        if not scene_name:
            return {"success": False, "error": f"Unknown diagram type: {diagram_type}"}

        # Check cache first
        cache_key = f"{scene_name}_{quality}"
        cache_hash = hashlib.md5(cache_key.encode()).hexdigest()[:12]
        
        quality_map = {"l": "480p15", "m": "720p30", "h": "1080p60"}
        quality_dir = quality_map.get(quality, "480p15")
        
        cached_filename = f"{scene_name}_bio_{cache_hash}.mp4"
        cached_path = os.path.join(
            self.media_dir, "videos", "biology_diagram_templates", quality_dir, cached_filename
        )

        if os.path.exists(cached_path):
            relative_path = os.path.relpath(cached_path, self.base_dir).replace("\\", "/")
            logger.info(f"Biology diagram cache hit: {relative_path}")
            return {"success": True, "video_path": relative_path, "cached": True}

        # Render with Manim
        return self._render_scene(scene_name, quality, cached_filename)

    def _render_scene(self, scene_name: str, quality: str, output_filename: str) -> Dict:
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

        logger.info(f"Rendering biology diagram: {scene_name}")

        try:
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                check=True,
                timeout=180,  # 3 minute timeout for complex diagrams
                cwd=self.base_dir,
            )

            # Find output file
            quality_map = {"l": "480p15", "m": "720p30", "h": "1080p60"}
            quality_dir = quality_map.get(quality, "480p15")

            video_path = os.path.join(
                self.media_dir,
                "videos",
                "biology_diagram_templates",
                quality_dir,
                output_filename,
            )

            if os.path.exists(video_path):
                relative_path = os.path.relpath(video_path, self.base_dir).replace(
                    "\\", "/"
                )
                logger.info(f"Biology diagram rendered: {relative_path}")
                return {"success": True, "video_path": relative_path}
            else:
                logger.error(f"Video file not found after rendering: {video_path}")
                return {
                    "success": False,
                    "error": "Video file not found after rendering",
                    "logs": result.stdout + "\n" + result.stderr,
                }

        except subprocess.TimeoutExpired:
            logger.error("Biology diagram rendering timed out")
            return {"success": False, "error": "Animation rendering timed out (>180s)"}
        except subprocess.CalledProcessError as e:
            logger.error(f"Biology diagram rendering failed: {e.stderr}")
            return {
                "success": False,
                "error": "Manim rendering failed",
                "logs": (e.stdout or "") + "\n" + (e.stderr or ""),
            }
        except Exception as e:
            logger.error(f"Biology diagram exception: {e}")
            return {"success": False, "error": str(e)}


# Singleton instance
_biology_diagram_service = None


def get_biology_diagram_service() -> BiologyDiagramService:
    global _biology_diagram_service
    if _biology_diagram_service is None:
        _biology_diagram_service = BiologyDiagramService()
    return _biology_diagram_service

