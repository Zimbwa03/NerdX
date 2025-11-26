import os
import subprocess
import uuid
import shutil
from typing import Dict, Optional

class ManimService:
    """
    Service to manage Manim animation rendering.
    Runs Manim in a subprocess to ensure stability and isolation.
    """
    
    def __init__(self):
        self.base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.media_dir = os.path.join(self.base_dir, "static", "media")
        self.templates_file = os.path.join(self.base_dir, "services", "manim_templates.py")
        
        # Ensure media directory exists
        os.makedirs(self.media_dir, exist_ok=True)
        
    def check_dependencies(self) -> Dict[str, bool]:
        """Check if ffmpeg and latex are available"""
        # Add MikTeX to PATH for this check if needed
        miktex_path = r"C:\Users\GWENJE\AppData\Local\Programs\MiKTeX\miktex\bin\x64"
        if os.path.exists(miktex_path) and miktex_path not in os.environ["PATH"]:
            os.environ["PATH"] += os.pathsep + miktex_path
            
        return {
            "ffmpeg": shutil.which("ffmpeg") is not None,
            "latex": shutil.which("latex") is not None or shutil.which("pdflatex") is not None
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
        # Generate unique ID for this render
        render_id = str(uuid.uuid4())[:8]
        output_filename = f"{scene_name}_{render_id}"
        
        # Construct command
        # python -m manim -q{quality} -o {output_filename} {templates_file} {scene_name} --media_dir {media_dir}
        import sys
        cmd = [
            sys.executable, "-m", "manim",
            f"-q{quality}",
            "--media_dir", self.media_dir,
            "-o", output_filename,
            self.templates_file,
            scene_name
        ]
        
        # Prepare environment
        env = os.environ.copy()
        env.update(env_vars)
        
        # Add MikTeX to PATH if not present
        miktex_path = r"C:\Users\GWENJE\AppData\Local\Programs\MiKTeX\miktex\bin\x64"
        if os.path.exists(miktex_path) and miktex_path not in os.environ["PATH"]:
            env["PATH"] = miktex_path + os.pathsep + env.get("PATH", "")
            
        # Add project root to PATH to find latex.bat/pdflatex.bat wrappers
        env["PATH"] = self.base_dir + os.pathsep + env.get("PATH", "")
        
        try:
            # Run Manim
            result = subprocess.run(
                cmd,
                env=env,
                capture_output=True,
                text=True,
                check=True
            )
            
            # Find the output file
            # Manim structure: media_dir/videos/manim_templates/quality/output_filename.mp4
            # Note: 'manim_templates' is the module name
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
                # Return relative path for API
                relative_path = os.path.relpath(video_path, self.base_dir)
                return {
                    "success": True,
                    "video_path": relative_path,
                    "render_id": render_id,
                    "logs": result.stdout
                }
            else:
                return {
                    "success": False,
                    "error": "Video file not found after rendering",
                    "logs": result.stdout + "\n" + result.stderr
                }
                
        except subprocess.CalledProcessError as e:
            return {
                "success": False,
                "error": "Manim rendering failed",
                "logs": e.stdout + "\n" + e.stderr
            }
        except Exception as e:
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
