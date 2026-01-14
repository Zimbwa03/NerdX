import unittest
from unittest.mock import MagicMock, patch
import sys
import os

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from services.payment_service import PaymentService

class TestPaymentCreditAddition(unittest.TestCase):
    def setUp(self):
        self.payment_service = PaymentService()
        self.test_user_id = "test_user_123"

    def test_package_definitions(self):
        """Verify new package credit amounts"""
        print("\nTesting Package Definitions...")
        packages = self.payment_service.get_credit_packages()
        
        expected_values = {
            'pocket': 200,
            'mini': 420,
            'quick': 890,
            'boost': 1440
        }
        
        for pkg in packages:
            pkg_id = pkg['id']
            credits = pkg['credits']
            price = pkg['price']
            print(f"Package {pkg_id}: ${price} -> {credits} credits")
            
            if pkg_id in expected_values:
                self.assertEqual(credits, expected_values[pkg_id], 
                    f"Package {pkg_id} should have {expected_values[pkg_id]} credits, got {credits}")

    @patch('services.payment_service.paynow_service')
    @patch('services.payment_service.make_supabase_request')
    @patch('services.payment_service.add_credits')
    def test_paynow_approval_flow(self, mock_add_credits, mock_supabase, mock_paynow):
        """Test that approving a Paynow payment adds correct credits"""
        print("\nTesting Payment Approval Flow...")
        
        # Setup mocks
        mock_paynow.is_available.return_value = True
        mock_add_credits.return_value = True
        
        # Simulate 'pocket' package (200 credits)
        package_id = 'pocket'
        expected_credits = 200
        ref_code = "TEST_REF_123"
        
        # Mock database response for finding the payment transaction
        mock_supabase.return_value = [{
            'user_id': self.test_user_id,
            'credits': expected_credits,
            'package_id': package_id,
            'status': 'initiated',
            'amount': 2.50
        }]
        
        # Test approve_paynow_payment
        result = self.payment_service.approve_paynow_payment(ref_code)
        
        # Validation
        self.assertTrue(result['success'])
        mock_add_credits.assert_called_with(self.test_user_id, expected_credits)
        print(f"Success! Approved payment {ref_code} added {expected_credits} credits to {self.test_user_id}")
        
    @patch('services.payment_service.paynow_service')
    @patch('services.payment_service.make_supabase_request')
    @patch('services.advanced_credit_service.advanced_credit_service') # Correct patch path
    def test_manual_approval_flow(self, mock_adv_credit, mock_supabase, mock_paynow):
         """Test manual approval flow adds correct credits"""
         print("\nTesting Manual Approval Flow...")
         
         # Mock advanced credit service to return True for add
         mock_adv_credit.add_credits_for_purchase.return_value = True
         
         package_id = 'boost'
         expected_credits = 1440
         ref_code = "MANUAL_REF_456"
         
         # Mock database response
         mock_supabase.return_value = [{
            'user_id': self.test_user_id,
            'credits': expected_credits,
            'package_id': package_id,
            'amount': 15.00
         }]
         
         result = self.payment_service.approve_payment(ref_code)
         
         self.assertTrue(result['success'])
         self.assertEqual(result['credits'], expected_credits)
         mock_adv_credit.add_credits_for_purchase.assert_called_with(
             self.test_user_id, 
             expected_credits, 
             f"Credit purchase: PREMIUM PACKAGE" # Name form logic
         )
         print(f"Success! Manual approval for {ref_code} added {expected_credits} credits.")

if __name__ == '__main__':
    unittest.main()
