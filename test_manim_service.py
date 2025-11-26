"""
Test script for Manim Animation Service
Verifies that Manim can render videos (even without LaTeX)
"""

import sys
import os
import time

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def test_dependencies():
    """Test if dependencies are met"""
    print("\n" + "="*60)
    print("TESTING: Manim Dependencies")
    print("="*60)
    
    try:
        from services.manim_service import get_manim_service
        service = get_manim_service()
        deps = service.check_dependencies()
        
        print(f"[INFO] FFmpeg: {deps['ffmpeg']}")
        print(f"[INFO] LaTeX: {deps['latex']}")
        
        if not deps['ffmpeg']:
            print("[ERROR] FFmpeg is missing! Manim cannot render videos.")
            return False
            
        if not deps['latex']:
            print("[WARN] LaTeX is missing. Math formulas will be rendered as plain text.")
            
        return True
        
    except Exception as e:
        print(f"[ERROR] Service Init Error: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_quadratic_render():
    """Test rendering a quadratic animation"""
    print("\n" + "="*60)
    print("TESTING: Quadratic Animation Render")
    print("="*60)
    
    try:
        from services.manim_service import get_manim_service
        service = get_manim_service()
        
        print("[INFO] Starting render (this may take 10-20 seconds)...")
        start_time = time.time()
        
        # Render y = x^2 - 2
        result = service.render_quadratic(a=1, b=0, c=-2, quality='l')
        
        duration = time.time() - start_time
        
        if result['success']:
            print(f"[OK] Render successful in {duration:.2f}s")
            print(f"[INFO] Video Path: {result['video_path']}")
            print(f"[INFO] Render ID: {result['render_id']}")
            return True
        else:
            print(f"[ERROR] Render failed in {duration:.2f}s")
            print(f"[ERROR] Message: {result.get('error')}")
            print("\n--- Manim Logs ---")
            print(result.get('logs'))
            print("------------------")
            return False
            
    except Exception as e:
        print(f"[ERROR] Render Exception: {e}")
        import traceback
        traceback.print_exc()
        return False

def run_all_tests():
    """Run all Manim tests"""
    print("\n" + "="*60)
    print("MANIM ANIMATION ENGINE - TEST")
    print("="*60)
    
    if test_dependencies():
        test_quadratic_render()
        
    print("\n" + "="*60)
    print("TEST COMPLETE")
    print("="*60)

if __name__ == "__main__":
    run_all_tests()
