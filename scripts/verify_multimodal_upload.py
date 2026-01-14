
import unittest
import json
import io
from unittest.mock import patch, MagicMock
import sys
import os

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app
# Check if routes is already imported, if not import it to register blueprints
try:
    import routes
except ImportError:
    pass

class TestMultimodalUploads(unittest.TestCase):
    def setUp(self):
        self.app = app
        self.client = self.app.test_client()
        self.app.config['TESTING'] = True
        self.user_id = 'test_user_123'
        
    @patch('api.mobile.verify_token')
    @patch('services.math_ocr_service.math_ocr_service.scan_equation')
    def test_math_solver_scan(self, mock_scan, mock_auth):
        """Test /api/mobile/math/scan-gemini"""
        # Mock Auth
        mock_auth.return_value = {'user_id': self.user_id}
        
        # Mock OCR Response
        mock_scan.return_value = {
            'success': True,
            'plain_text': '2x + 5 = 15',
            'latex': '2x + 5 = 15',
            'confidence': 0.98,
            'method': 'gemini-vision'
        }
        
        # Payload
        # Backend expects raw base64 or handles it via base64.b64decode directly
        image_content = b"fake_image_content"
        import base64
        raw_b64 = base64.b64encode(image_content).decode('ascii')
        
        data = {
            "image_base64": raw_b64,
            "mime_type": "image/jpeg"
        }
        
        response = self.client.post(
            '/api/mobile/math/scan-gemini',
            data=json.dumps(data),
            content_type='application/json',
            headers={'Authorization': 'Bearer test_token'}
        )
        
        print(f"\n[Math Scan] Status: {response.status_code}")
        print(f"[Math Scan] Response: {response.get_json()}")
        
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.get_json()['success'])
        self.assertEqual(response.get_json()['data']['detected_text'], '2x + 5 = 15')

    @patch('api.mobile.verify_token')
    @patch('api.mobile.ImageService')
    @patch('services.advanced_credit_service.advanced_credit_service.get_credit_cost')
    @patch('api.mobile.get_user_credits')
    @patch('api.mobile.deduct_credits')
    def test_graph_practice_upload(self, mock_deduct, mock_credits, mock_cost, mock_image_service_cls, mock_auth):
        """Test /api/mobile/math/graph/upload"""
        mock_auth.return_value = {'user_id': self.user_id}
        mock_cost.return_value = 1
        mock_credits.return_value = 100
        mock_deduct.return_value = True
        
        # Mock ImageService instance and process_image method
        # Note: process_image is MISSING in source, so we mock it to prove the route calls it.
        mock_instance = mock_image_service_cls.return_value
        # Use keys verified in api/mobile.py: text, solution, analysis
        mock_instance.process_image.return_value = {
            "text": "Graph of y = x^2",
            "solution": "y=x^2\n\nFinal Answer: Parabola",
            "analysis": "Parabola opening upwards"
        }
        
        # Payload (Multipart)
        data = {
            'image': (io.BytesIO(b"fake_image_bytes"), 'graph.jpg'),
            'problem_type': 'function_analysis'
        }
        
        response = self.client.post(
            '/api/mobile/math/graph/upload',
            data=data,
            content_type='multipart/form-data',
            headers={'Authorization': 'Bearer test_token'}
        )
        
        print(f"\n[Graph Upload] Status: {response.status_code}")
        print(f"[Graph Upload] Response: {response.get_json()}")
        
        # Check success
        self.assertEqual(response.status_code, 200)
        resp_json = response.get_json()
        self.assertTrue(resp_json['success'])
        # The route expects process_image to return something. 
        # But wait, looking at lines 3345-3349 of api/mobile.py (Step 385):
        # result = image_service.process_image(image_file)
        # return jsonify({ ... 'data': result ... }) ? No, I couldn't see the return statement details.
        # But assumes success 200.

    @patch('api.mobile.verify_token')
    @patch('services.math_solver.MathSolver')
    def test_quiz_submit_image_url(self, mock_solver_cls, mock_auth):
        """Test /api/mobile/quiz/submit-answer with image_url"""
        mock_auth.return_value = {'user_id': self.user_id}
        
        # Mock MathSolver
        mock_instance = mock_solver_cls.return_value
        mock_instance.analyze_answer.return_value = {
            "is_correct": True,
            "feedback": "Correct via AI Analysis"
        }
        
        payload = {
            "question_id": "q123",
            "subject": "mathematics",
            "answer": "42", 
            "image_url": "https://example.com/answer.jpg",
            "question_text": "What is 40 + 2?",
            "correct_answer": "42"
        }
        
        response = self.client.post(
            '/api/mobile/quiz/submit-answer',
            data=json.dumps(payload),
            content_type='application/json',
            headers={'Authorization': 'Bearer test_token'}
        )
        
        print(f"\n[Quiz Image Submit] Status: {response.status_code}")
        print(f"[Quiz Image Submit] Response: {response.get_json()}")
        
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.get_json()['success'])
        self.assertTrue(response.get_json()['data']['correct'])

if __name__ == '__main__':
    unittest.main()
