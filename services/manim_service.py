import os
import subprocess
import sys
import uuid
import shutil
import logging
from typing import Dict, Optional

logger = logging.getLogger(__name__)

class ManimService:
    """
    Service to manage Manim animation rendering.
    Runs Manim in a subprocess to ensure stability and isolation.
    Cross-platform compatible: Works on Windows (dev) and Linux (production/Render).
    """
    
    def __init__(self):
        self.base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.media_dir = os.path.join(self.base_dir, "static", "media")
        self.templates_file = os.path.join(self.base_dir, "services", "manim_templates.py")
        self.is_windows = sys.platform == 'win32'
        
        # Ensure media directory exists
        os.makedirs(self.media_dir, exist_ok=True)
        
        # Setup LaTeX paths for Windows if needed
        self._setup_latex_path()
        
    def _setup_latex_path(self):
        """Add LaTeX to PATH if on Windows and not already available"""
        if not self.is_windows:
            # On Linux, LaTeX is installed system-wide via apt-get (Dockerfile)
            return
            
        # Windows: Try common LaTeX installation paths
        possible_latex_paths = [
            os.path.expandvars(r"%LOCALAPPDATA%\Programs\MiKTeX\miktex\bin\x64"),
            r"C:\Program Files\MiKTeX\miktex\bin\x64",
            r"C:\texlive\2024\bin\windows",
            r"C:\texlive\2023\bin\win64",
        ]
        
        current_path = os.environ.get("PATH", "")
        for latex_path in possible_latex_paths:
            if os.path.exists(latex_path) and latex_path not in current_path:
                os.environ["PATH"] = latex_path + os.pathsep + current_path
                logger.info(f"Added LaTeX path: {latex_path}")
                break
        
    def check_dependencies(self) -> Dict[str, bool]:
        """Check if ffmpeg and latex are available"""
        ffmpeg_available = shutil.which("ffmpeg") is not None
        latex_available = shutil.which("latex") is not None or shutil.which("pdflatex") is not None
        
        logger.info(f"Manim dependencies - FFmpeg: {ffmpeg_available}, LaTeX: {latex_available}, Platform: {'Windows' if self.is_windows else 'Linux'}")
        
        return {
            "ffmpeg": ffmpeg_available,
            "latex": latex_available,
            "platform": "windows" if self.is_windows else "linux"
        }

    def render_quadratic(self, a: float, b: float, c: float, quality: str = "l") -> Dict:
        """
        Render a quadratic equation animation.
        quality: 'l' (low, 480p), 'm' (medium, 720p), 'h' (high, 1080p)
        """
        return self._render_scene("QuadraticScene", {"MANIM_A": str(a), "MANIM_B": str(b), "MANIM_C": str(c)}, quality)

    def render_linear(self, m: float, c: float, quality: str = "l") -> Dict:
        """Render a linear equation animation"""
        return self._render_scene("LinearScene", {"MANIM_M": str(m), "MANIM_C": str(c)}, quality)

    def _render_scene(self, scene_name: str, env_vars: Dict[str, str], quality: str) -> Dict:
        """
        Internal method to run manim subprocess
        """
        # Check dependencies first
        deps = self.check_dependencies()
        if not deps["ffmpeg"]:
            return {
                "success": False,
                "error": "FFmpeg is not installed. Cannot render video animations.",
                "platform": deps.get("platform", "unknown")
            }
        
        # Generate unique ID for this render
        render_id = str(uuid.uuid4())[:8]
        output_filename = f"{scene_name}_{render_id}"
        
        # Construct command
        cmd = [
            sys.executable, "-m", "manim",
            f"-q{quality}",
            "--media_dir", self.media_dir,
            "-o", output_filename,
            self.templates_file,
            scene_name
        ]
        
        logger.info(f"Running Manim command: {' '.join(cmd)}")
        
        # Prepare environment
        env = os.environ.copy()
        env.update(env_vars)
        
        # Add project root to PATH for any wrapper scripts
        env["PATH"] = self.base_dir + os.pathsep + env.get("PATH", "")
        
        try:
            # Run Manim with timeout (60 seconds should be enough for simple graphs)
            result = subprocess.run(
                cmd,
                env=env,
                capture_output=True,
                text=True,
                check=True,
                timeout=120  # 2 minute timeout
            )
            
            # Find the output file
            # Manim structure: media_dir/videos/manim_templates/quality/output_filename.mp4
            quality_map = {'l': '480p15', 'm': '720p30', 'h': '1080p60'}
            quality_dir = quality_map.get(quality, '480p15')
            
            video_path = os.path.join(
                self.media_dir,
                "videos",
                "manim_templates",
                quality_dir,
                f"{output_filename}.mp4"
            )
            
            # Verify file exists
            if os.path.exists(video_path):
                # Return relative path for API (use forward slashes for URLs)
                relative_path = os.path.relpath(video_path, self.base_dir).replace("\\", "/")
                logger.info(f"Manim render success: {relative_path}")
                return {
                    "success": True,
                    "video_path": relative_path,
                    "render_id": render_id,
                    "logs": result.stdout
                }
            else:
                logger.error(f"Video file not found: {video_path}")
                return {
                    "success": False,
                    "error": "Video file not found after rendering",
                    "logs": result.stdout + "\n" + result.stderr
                }
                
        except subprocess.TimeoutExpired:
            logger.error("Manim rendering timed out")
            return {
                "success": False,
                "error": "Animation rendering timed out (>120s)"
            }
        except subprocess.CalledProcessError as e:
            logger.error(f"Manim rendering failed: {e.stderr}")
            return {
                "success": False,
                "error": "Manim rendering failed",
                "logs": (e.stdout or "") + "\n" + (e.stderr or ""),
                "platform": "windows" if self.is_windows else "linux"
            }
        except Exception as e:
            logger.error(f"Manim exception: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }

# Singleton instance
_manim_service = None

def get_manim_service():
    global _manim_service
    if _manim_service is None:
        _manim_service = ManimService()
    return _manim_service
