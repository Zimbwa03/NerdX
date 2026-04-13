#!/usr/bin/env python3
"""
Chemistry Diagram Service - Renders chemistry diagrams using Manim
"""

import hashlib
import logging
import os
import subprocess
import sys
from typing import Dict, Optional

logger = logging.getLogger(__name__)


class ChemistryDiagramService:
    """Service to render chemistry diagrams using Manim templates."""

    # Mapping of keywords to scene names
    DIAGRAM_KEYWORDS = {
        # Atomic structure
        "atom": "atom_structure",
        "atomic structure": "atom_structure",
        "atom_structure": "atom_structure",
        "electron shell": "atom_structure",
        "electron configuration": "atom_structure",
        "proton": "atom_structure",
        "neutron": "atom_structure",
        # Ionic bonding
        "ionic": "ionic_bond",
        "ionic bond": "ionic_bond",
        "ionic_bond": "ionic_bond",
        "ionic bonding": "ionic_bond",
        "electron transfer": "ionic_bond",
        "nacl": "ionic_bond",
        "sodium chloride": "ionic_bond",
        # Covalent bonding
        "covalent": "covalent_bond",
        "covalent bond": "covalent_bond",
        "covalent_bond": "covalent_bond",
        "covalent bonding": "covalent_bond",
        "electron sharing": "covalent_bond",
        "water molecule": "covalent_bond",
        "h2o": "covalent_bond",
        # Electrolysis
        "electrolysis": "electrolysis",
        "electrolyte": "electrolysis",
        "electrode": "electrolysis",
        "cathode": "electrolysis",
        "anode": "electrolysis",
        "electrochemical": "electrolysis",
        # Energy profiles
        "energy profile": "energy_profile",
        "energy_profile": "energy_profile",
        "reaction profile": "energy_profile",
        "activation energy": "energy_profile",
        "exothermic": "energy_profile",
        "endothermic": "energy_profile",
        "enthalpy": "energy_profile",
        # Periodic table
        "periodic table": "periodic_table",
        "periodic_table": "periodic_table",
        "periodic trend": "periodic_table",
        "ionization energy": "periodic_table",
        "atomic radius": "periodic_table",
        "electronegativity": "periodic_table",
    }

    def __init__(self):
        self.base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.templates_file = os.path.join(
            self.base_dir, "services", "chemistry_diagram_templates.py"
        )
        self.media_dir = os.path.join(self.base_dir, "static", "media")
        os.makedirs(self.media_dir, exist_ok=True)

    def identify_diagram_type(self, text: str) -> Optional[str]:
        """
        Identify which chemistry diagram to render based on text content.
        Returns scene name or None if no match.
        """
        text_lower = text.lower()
        for keyword, scene_name in self.DIAGRAM_KEYWORDS.items():
            if keyword in text_lower:
                return scene_name
        return None

    def render_diagram(self, diagram_type: str, quality: str = "l") -> Dict:
        """
        Render a chemistry diagram by type.
        
        Args:
            diagram_type: One of the scene names (atom_structure, ionic_bond, etc.)
            quality: 'l' (480p), 'm' (720p), 'h' (1080p)
        
        Returns:
            Dict with success, video_path (relative), or error
        """
        # Map diagram type to scene class name
        scene_map = {
            "atom_structure": "AtomStructureScene",
            "ionic_bond": "IonicBondScene",
            "covalent_bond": "CovalentBondScene",
            "electrolysis": "ElectrolysisScene",
            "energy_profile": "EnergyProfileScene",
            "periodic_table": "PeriodicTableTrendsScene",
        }

        scene_name = scene_map.get(diagram_type)
        if not scene_name:
            return {"success": False, "error": f"Unknown diagram type: {diagram_type}"}

        # Check cache first
        cache_key = f"{scene_name}_{quality}"
        cache_hash = hashlib.md5(cache_key.encode()).hexdigest()[:12]

        quality_map = {"l": "480p15", "m": "720p30", "h": "1080p60"}
        quality_dir = quality_map.get(quality, "480p15")

        cached_filename = f"{scene_name}_chem_{cache_hash}.mp4"
        cached_path = os.path.join(
            self.media_dir,
            "videos",
            "chemistry_diagram_templates",
            quality_dir,
            cached_filename,
        )

        if os.path.exists(cached_path):
            relative_path = os.path.relpath(cached_path, self.base_dir).replace(
                "\\", "/"
            )
            logger.info(f"Chemistry diagram cache hit: {relative_path}")
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

        logger.info(f"Rendering chemistry diagram: {scene_name}")

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
                "chemistry_diagram_templates",
                quality_dir,
                output_filename,
            )

            if os.path.exists(video_path):
                relative_path = os.path.relpath(video_path, self.base_dir).replace(
                    "\\", "/"
                )
                logger.info(f"Chemistry diagram rendered: {relative_path}")
                return {"success": True, "video_path": relative_path}
            else:
                logger.error(f"Video file not found after rendering: {video_path}")
                return {
                    "success": False,
                    "error": "Video file not found after rendering",
                    "logs": result.stdout + "\n" + result.stderr,
                }

        except subprocess.TimeoutExpired:
            logger.error("Chemistry diagram rendering timed out")
            return {"success": False, "error": "Animation rendering timed out (>180s)"}
        except subprocess.CalledProcessError as e:
            logger.error(f"Chemistry diagram rendering failed: {e.stderr}")
            return {
                "success": False,
                "error": "Manim rendering failed",
                "logs": (e.stdout or "") + "\n" + (e.stderr or ""),
            }
        except Exception as e:
            logger.error(f"Chemistry diagram exception: {e}")
            return {"success": False, "error": str(e)}


# Singleton instance
_chemistry_diagram_service = None


def get_chemistry_diagram_service() -> ChemistryDiagramService:
    global _chemistry_diagram_service
    if _chemistry_diagram_service is None:
        _chemistry_diagram_service = ChemistryDiagramService()
    return _chemistry_diagram_service

