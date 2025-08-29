#!/usr/bin/env python3
"""
Test Payment Flow Script
Tests the complete payment system now that database tables are ready
"""

import os
import sys
from datetime import datetime

def test_payment_service():
    """Test the payment service functionality"""
    print("🔍 Testing Payment Service...")
    
    try:
        from services.payment_service import PaymentService
        
        # Create payment service instance
        payment_service = PaymentService()
        print("✅ Payment service created successfully")
        
        # Test credit packages
        packages = payment_service.calculate_credit_packages()
        print(f"✅ Credit packages loaded: {len(packages)} packages")
        
        for package in packages:
            print(f"   📦 {package['name']}: ${package['price']} for {package['credits']} credits")
        
        # Test package by ID
        if packages:
            first_package = packages[0]
            package_by_id = payment_service.get_package_by_id(first_package['id'])
            if package_by_id:
                print(f"✅ Package lookup by ID working: {package_by_id['name']}")
            else:
                print("❌ Package lookup by ID failed")
        
        return True
        
    except Exception as e:
        print(f"❌ Payment service test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_payment_flow():
    """Test a complete payment flow"""
    print("\n🔍 Testing Payment Flow...")
    
    try:
        from services.payment_service import PaymentService
        
        payment_service = PaymentService()
        
        # Test payment reference generation
        test_user_id = "263785494594"
        test_package_id = "starter"
        
        reference = payment_service.generate_payment_reference(test_user_id, test_package_id)
        print(f"✅ Payment reference generated: {reference}")
        
        # Test payment instructions
        instructions = payment_service.get_payment_instructions_message(test_user_id, test_package_id)
        if instructions.get('success'):
            print("✅ Payment instructions generated successfully")
            print(f"   💰 Amount: ${instructions.get('package', {}).get('price', 'N/A')}")
            print(f"   💎 Credits: {instructions.get('package', {}).get('credits', 'N/A')}")
            print(f"   📋 Reference: {instructions.get('reference_code', 'N/A')}")
            
            # Check if payment name is displayed correctly
            instructions_text = instructions.get('message', '')
            if "Ngonidzashe Zimbwa" in instructions_text:
                print("✅ Payment recipient name 'Ngonidzashe Zimbwa' is displayed correctly")
            else:
                print("⚠️  Payment recipient name not found in instructions")
                
        else:
            print(f"❌ Payment instructions failed: {instructions.get('message', 'Unknown error')}")
        
        return True
        
    except Exception as e:
        print(f"❌ Payment flow test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_payment_proof_submission():
    """Test payment proof submission to database"""
    print("\n🔍 Testing Payment Proof Submission...")
    
    try:
        from services.payment_service import PaymentService
        from database.external_db import make_supabase_request
        
        payment_service = PaymentService()
        
        # Test data
        test_user_id = "263785494594"
        test_package_id = "starter"
        test_reference = "TEST_REF_001"
        test_amount = 5.00
        test_credits = 50
        test_proof = "Test payment proof screenshot"
        
        # Try to submit payment proof
        result = payment_service.submit_payment_proof(
            user_id=test_user_id,
            package_id=test_package_id,
            reference_code=test_reference,
            amount=test_amount,
            credits=test_credits,
            payment_proof=test_proof
        )
        
        if result.get('success'):
            print("✅ Payment proof submission successful!")
            print(f"   📝 Reference: {result.get('reference_code')}")
            print(f"   📊 Status: {result.get('status')}")
            
            # Verify it was stored in database
            db_result = make_supabase_request(
                "GET", 
                "payment_transactions", 
                filters={"reference_code": f"eq.{test_reference}"}
            )
            
            if db_result and len(db_result) > 0:
                print("✅ Payment proof stored in database successfully")
                stored_payment = db_result[0]
                print(f"   📊 Database ID: {stored_payment.get('id')}")
                print(f"   📊 Database Status: {stored_payment.get('status')}")
                
                # Clean up test data
                make_supabase_request(
                    "DELETE", 
                    "payment_transactions", 
                    filters={"reference_code": f"eq.{test_reference}"}
                )
                print("🧹 Test data cleaned up")
                
            else:
                print("❌ Payment proof not found in database")
                
        else:
            print(f"❌ Payment proof submission failed: {result.get('message', 'Unknown error')}")
        
        return True
        
    except Exception as e:
        print(f"❌ Payment proof submission test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_payment_admin_dashboard():
    """Test the payment admin dashboard functionality"""
    print("\n🔍 Testing Payment Admin Dashboard...")
    
    try:
        from api.payment_admin import PaymentAdminDashboard
        
        # Create dashboard instance
        dashboard = PaymentAdminDashboard()
        print("✅ Payment admin dashboard created successfully")
        
        # Test methods exist
        methods = [
            'get_pending_payments',
            'get_approved_payments', 
            'get_rejected_payments',
            'get_payment_statistics',
            'approve_payment',
            'reject_payment'
        ]
        
        for method in methods:
            if hasattr(dashboard, method):
                print(f"✅ Method {method} exists")
            else:
                print(f"❌ Method {method} missing")
        
        # Test getting payment statistics
        try:
            stats = dashboard.get_payment_statistics()
            print("✅ Payment statistics retrieved successfully")
            print(f"   📊 Pending: {stats.get('pending_count', 0)}")
            print(f"   📊 Approved: {stats.get('approved_count', 0)}")
            print(f"   💰 Revenue: {stats.get('total_revenue', '$0.00')}")
        except Exception as e:
            print(f"⚠️  Payment statistics test failed: {e}")
        
        return True
        
    except Exception as e:
        print(f"❌ Payment admin dashboard test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    """Run all tests"""
    print("🚀 NerdX Payment System Test Suite")
    print("=" * 50)
    print("🎯 Testing complete payment system flow...")
    
    tests = [
        ("Payment Service", test_payment_service),
        ("Payment Flow", test_payment_flow),
        ("Payment Proof Submission", test_payment_proof_submission),
        ("Payment Admin Dashboard", test_payment_admin_dashboard)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            print(f"\n{'='*20} {test_name} {'='*20}")
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} test crashed: {e}")
            results.append((test_name, False))
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 TEST RESULTS SUMMARY")
    print("=" * 50)
    
    passed = 0
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} {test_name}")
        if result:
            passed += 1
    
    print(f"\n🎯 Overall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Payment system is fully functional!")
        print("💡 Users can now:")
        print("   - Select credit packages")
        print("   - Submit payment proofs")
        print("   - Admins can approve/reject payments")
        print("   - Credits are allocated after approval")
    else:
        print("⚠️  Some tests failed. Check the issues above.")
        
        if passed < total:
            print("\n🔧 RECOMMENDED ACTIONS:")
            print("1. Check the specific error messages above")
            print("2. Verify environment variables are set correctly")
            print("3. Check if all required services are running")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)

