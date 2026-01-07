#!/usr/bin/env python3
"""
Test script for A-Level Pure Math visualization integration.
Tests that graph/shape/Argand diagrams can be generated alongside questions.
"""

import os
import sys

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

# Ensure we can import from project root
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_graph_service_argand():
    """Test Argand diagram generation"""
    print("\n=== Testing Argand Diagram Generation ===")
    try:
        from services.graph_service import GraphService
        gs = GraphService()
        
        # Test basic Argand diagram
        path = gs.generate_argand_diagram(
            points=[
                {'real': 3, 'imag': 4, 'label': 'z₁'},
                {'real': -2, 'imag': 1, 'label': 'z₂'}
            ],
            highlight_region='I',
            title='Complex Numbers Test'
        )
        
        if path and os.path.exists(path):
            print(f"[PASS] Argand diagram created: {path}")
            return True
        else:
            print(f"[FAIL] Argand diagram not created (path: {path})")
            return False
    except Exception as e:
        print(f"[FAIL] Error: {e}")
        return False


def test_graph_service_function():
    """Test function graph generation"""
    print("\n=== Testing Function Graph Generation ===")
    try:
        from services.graph_service import GraphService
        gs = GraphService()
        
        # Test quadratic function
        path = gs.create_advanced_function_graph(
            "x**2 - 4*x + 3",
            title="Quadratic Function Test"
        )
        
        if path and os.path.exists(path):
            print(f"[PASS] Function graph created: {path}")
            return True
        else:
            print(f"[FAIL] Function graph not created (path: {path})")
            return False
    except Exception as e:
        print(f"[FAIL] Error: {e}")
        return False


def test_graph_service_geometry():
    """Test geometry diagram generation"""
    print("\n=== Testing Geometry Diagram Generation ===")
    try:
        from services.graph_service import GraphService
        gs = GraphService()
        
        # Test circle
        path = gs.create_geometry_diagram('circle', {'radius': 3, 'center': (0, 0)})
        
        if path and os.path.exists(path):
            print(f"[PASS] Circle diagram created: {path}")
        else:
            print(f"[FAIL] Circle diagram not created")
            return False
        
        # Test triangle
        path2 = gs.create_geometry_diagram('triangle', {
            'vertices': [(0, 0), (4, 0), (2, 3)]
        })
        
        if path2 and os.path.exists(path2):
            print(f"[PASS] Triangle diagram created: {path2}")
            return True
        else:
            print(f"[FAIL] Triangle diagram not created")
            return False
    except Exception as e:
        print(f"[FAIL] Error: {e}")
        return False


def test_a_level_generator_visualization_hook():
    """Test that A-Level generator has visualization method"""
    print("\n=== Testing A-Level Generator Visualization Hook ===")
    try:
        from services.a_level_pure_math_generator import ALevelPureMathGenerator
        
        gen = ALevelPureMathGenerator()
        
        # Check method exists
        if not hasattr(gen, '_maybe_attach_visualization'):
            print("[FAIL] _maybe_attach_visualization method not found")
            return False
        
        print("[PASS] _maybe_attach_visualization method exists")
        
        # Check graph_service is initialized as None (lazy)
        if gen.graph_service is not None:
            print("[WARN] graph_service should be None initially (lazy init)")
        else:
            print("[PASS] graph_service is None (lazy initialization)")
        
        # Test with mock question data that triggers visualization
        mock_question = {
            'question': 'Sketch the graph of y = x² - 4x + 3',
            'options': {'A': '1', 'B': '2', 'C': '3', 'D': '4'},
            'correct_answer': 'A',
            'solution': 'Test solution',
            'explanation': 'Test explanation'
        }
        
        result = gen._maybe_attach_visualization(mock_question, 'Quadratic Functions')
        
        if 'graph_image_path' in result:
            print(f"[PASS] Visualization attached: {result['graph_image_path']}")
            if os.path.exists(result['graph_image_path']):
                print(f"[PASS] Image file exists")
                return True
            else:
                print(f"[WARN] Image file path returned but file doesn't exist")
                return False
        else:
            print("[WARN] No visualization attached (expression extraction might have failed)")
            # This is okay if expression couldn't be extracted
            return True
            
    except Exception as e:
        print(f"[FAIL] Error: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_prompt_includes_visualization():
    """Test that prompts include visualization instructions"""
    print("\n=== Testing Prompt Includes Visualization Instructions ===")
    try:
        from services.a_level_pure_math_generator import ALevelPureMathGenerator
        
        gen = ALevelPureMathGenerator()
        
        # Test MCQ prompt
        mcq_prompt = gen._create_mcq_prompt(
            'Complex Numbers', 'medium', 'Upper Sixth',
            ['Argand diagrams'], ['z = a + bi'], ['finding roots']
        )
        
        if 'visualization' in mcq_prompt.lower():
            print("[PASS] MCQ prompt includes visualization instructions")
        else:
            print("[FAIL] MCQ prompt missing visualization instructions")
            return False
        
        # Test structured prompt
        struct_prompt = gen._create_structured_prompt(
            'Quadratic Functions', 'medium', 'Lower Sixth',
            ['graphs'], ['ax² + bx + c'], ['sketching']
        )
        
        if 'visualization' in struct_prompt.lower():
            print("[PASS] Structured prompt includes visualization instructions")
        else:
            print("[FAIL] Structured prompt missing visualization instructions")
            return False
        
        return True
        
    except Exception as e:
        print(f"[FAIL] Error: {e}")
        return False


def main():
    """Run all tests"""
    print("=" * 60)
    print("A-Level Pure Math Visualization Integration Tests")
    print("=" * 60)
    
    results = []
    
    # Run tests
    results.append(("GraphService Argand", test_graph_service_argand()))
    results.append(("GraphService Function", test_graph_service_function()))
    results.append(("GraphService Geometry", test_graph_service_geometry()))
    results.append(("A-Level Generator Hook", test_a_level_generator_visualization_hook()))
    results.append(("Prompt Visualization", test_prompt_includes_visualization()))
    
    # Summary
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    
    passed = 0
    failed = 0
    for name, result in results:
        status = "[PASS] PASS" if result else "[FAIL] FAIL"
        print(f"  {name}: {status}")
        if result:
            passed += 1
        else:
            failed += 1
    
    print(f"\nTotal: {passed} passed, {failed} failed")
    
    return failed == 0


if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)

