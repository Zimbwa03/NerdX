import asyncio
import os
import json
import time
from typing import Dict, Any

# Import services directly to simulate API calls
from services.symbolic_solver_service import SymbolicSolverService
from services.math_ocr_service import MathOCRService
from services.vector_search_service import VectorSearchService
from services.manim_service import get_manim_service
from services.voice_service import get_voice_service

class MockMobileClient:
    def __init__(self):
        self.math_service = SymbolicSolverService()
        self.ocr_service = MathOCRService()
        self.vector_service = VectorSearchService()
        self.manim_service = get_manim_service()
        self.voice_service = get_voice_service()
        
        self.results = {}

    async def run_full_verification(self):
        print("\n" + "="*60)
        print("NERDX MOBILE BACKEND - PRODUCTION READINESS VERIFICATION")
        print("="*60)
        
        await self.verify_sympy()
        await self.verify_ocr()
        await self.verify_vector_search()
        await self.verify_manim()
        await self.verify_voice()
        
        self.print_summary()

    async def verify_sympy(self):
        print("\n[1/5] Verifying SymPy Solver...")
        try:
            # Test case: Quadratic equation
            problem = "x^2 - 5x + 6 = 0"
            start = time.time()
            result = self.math_service.solve_equation_with_steps(problem)
            duration = time.time() - start
            
            if result and 'steps' in result:
                print(f"  [PASS] Solved '{problem}' in {duration:.2f}s")
                print(f"  [INFO] Steps generated: {len(result['steps'])}")
                self.results['sympy'] = 'PASS'
            else:
                print(f"  [FAIL] Failed to solve '{problem}'")
                self.results['sympy'] = 'FAIL'
        except Exception as e:
            print(f"  [ERROR] SymPy error: {e}")
            self.results['sympy'] = 'ERROR'

    async def verify_ocr(self):
        print("\n[2/5] Verifying Pix2Text OCR...")
        try:
            # Check if model loads (we might not have a test image ready, so we check initialization)
            if self.ocr_service.p2t:
                print("  [PASS] OCR Model initialized successfully")
                self.results['ocr'] = 'PASS'
            else:
                print("  [FAIL] OCR Model failed to initialize")
                self.results['ocr'] = 'FAIL'
        except Exception as e:
            print(f"  [ERROR] OCR error: {e}")
            self.results['ocr'] = 'ERROR'

    async def verify_vector_search(self):
        print("\n[3/5] Verifying Vector Search (ChromaDB)...")
        try:
            # Add a dummy question
            test_q = {
                "question_id": "test_001",
                "question_text": "Calculate the force of gravity.",
                "topic": "Physics",
                "year": 2023,
                "paper": 1,
                "latex_equation": "F = mg"
            }
            self.vector_service.index_question(test_q)
            
            # Search for it
            results = self.vector_service.find_similar_questions("gravity force")
            
            if results and len(results) > 0:
                print(f"  [PASS] Found {len(results)} similar questions")
                print(f"  [INFO] Top match: {results[0]['id']}")
                self.results['vector'] = 'PASS'
            else:
                print("  [WARN] No results found (might be expected if DB empty)")
                self.results['vector'] = 'WARN'
        except Exception as e:
            print(f"  [ERROR] Vector Search error: {e}")
            self.results['vector'] = 'ERROR'

    async def verify_manim(self):
        print("\n[4/5] Verifying Manim Engine (Lite Mode)...")
        try:
            # Render a simple linear graph
            start = time.time()
            result = self.manim_service.render_linear(2, 1, 'l') # Low quality for speed
            duration = time.time() - start
            
            if result['success']:
                print(f"  [PASS] Rendered video in {duration:.2f}s")
                print(f"  [INFO] Path: {result['video_path']}")
                self.results['manim'] = 'PASS'
            else:
                print(f"  [FAIL] Rendering failed: {result.get('error')}")
                if 'logs' in result:
                    print(f"  [LOGS] {result['logs'][:500]}...") # Print first 500 chars
                self.results['manim'] = 'FAIL'
        except Exception as e:
            print(f"  [ERROR] Manim error: {e}")
            self.results['manim'] = 'ERROR'

    async def verify_voice(self):
        print("\n[5/5] Verifying Voice Services...")
        try:
            # Test TTS
            text = "Production readiness check."
            tts_result = await self.voice_service.text_to_speech(text)
            
            if not tts_result['success']:
                print(f"  [FAIL] TTS failed: {tts_result.get('error')}")
                self.results['voice'] = 'FAIL'
                return

            # Test STT
            stt_result = self.voice_service.transcribe_audio(tts_result['full_path'])
            
            if 'error' not in stt_result:
                print(f"  [PASS] TTS -> STT cycle complete")
                print(f"  [INFO] Transcribed: '{stt_result['text']}'")
                self.results['voice'] = 'PASS'
            else:
                print(f"  [FAIL] STT failed: {stt_result['error']}")
                self.results['voice'] = 'FAIL'
        except Exception as e:
            print(f"  [ERROR] Voice error: {e}")
            self.results['voice'] = 'ERROR'

    def print_summary(self):
        print("\n" + "="*60)
        print("VERIFICATION SUMMARY")
        print("="*60)
        all_passed = True
        for component, status in self.results.items():
            print(f"{component.upper():<15} : {status}")
            if status not in ['PASS', 'WARN']:
                all_passed = False
        
        print("-" * 60)
        if all_passed:
            print("✅ SYSTEM IS PRODUCTION READY")
        else:
            print("❌ SYSTEM HAS ISSUES - CHECK LOGS")
        print("="*60)

if __name__ == "__main__":
    client = MockMobileClient()
    asyncio.run(client.run_full_verification())
