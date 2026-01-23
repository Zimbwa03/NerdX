#!/usr/bin/env python3
"""
Quick Payment Approval Script
=============================
Manually approve a Paynow payment that was successful but stuck in pending
"""

import sys
sys.path.append('.')

import logging
from services.payment_service import PaymentService

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def approve_payment(reference_code):
    """Approve a payment by reference code"""
    try:
        payment_service = PaymentService()
        
        print(f"\n🔄 Approving payment: {reference_code}")
        print("=" * 60)
        
        result = payment_service.approve_paynow_payment(reference_code)
        
        if result['success']:
            print(f"✅ Payment approved successfully!")
            print(f"   Reference: {reference_code}")
            print(f"   Credits added: {result.get('credits_added', 0)}")
            print(f"   User: {result.get('user_id', 'N/A')}")
            print(f"   Package: {result.get('package_name', 'N/A')}")
            return True
        else:
            print(f"❌ Approval failed: {result.get('message', 'Unknown error')}")
            return False
            
    except Exception as e:
        logger.error(f"Error approving payment: {e}", exc_info=True)
        print(f"\n❌ Error: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python approve_payment.py <reference_code>")
        print("\nExample: python approve_payment.py NX01182333.comLI")
        sys.exit(1)
    
    reference_code = sys.argv[1]
    success = approve_payment(reference_code)
    sys.exit(0 if success else 1)
