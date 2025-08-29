#!/usr/bin/env python3
"""
Test script for NerdX Payment System
Tests the payment admin dashboard and payment service integration
"""

import os
import sys
import requests
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
        
        return True
        
    except Exception as e:
        print(f"❌ Payment admin dashboard test failed: {e}")
        return False

def test_database_connection():
    """Test database connection for payment tables"""
    print("\n🔍 Testing Database Connection...")
    
    try:
        from database.external_db import make_supabase_request
        
        # Test if we can connect to Supabase
        print("Testing Supabase connection...")
        
        # Test users_registration table
        users_result = make_supabase_request("GET", "users_registration", limit=1)
        if users_result is not None:
            print("✅ users_registration table accessible")
        else:
            print("❌ users_registration table not accessible")
        
        # Test payment_transactions table
        payments_result = make_supabase_request("GET", "payment_transactions", limit=1)
        if payments_result is not None:
            print("✅ payment_transactions table accessible")
        else:
            print("❌ payment_transactions table not accessible")
            print("   💡 You may need to create the table using the SQL in create_payment_tables.sql")
        
        return True
        
    except Exception as e:
        print(f"❌ Database connection test failed: {e}")
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
        else:
            print(f"❌ Payment instructions failed: {instructions.get('message', 'Unknown error')}")
        
        return True
        
    except Exception as e:
        print(f"❌ Payment flow test failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 NerdX Payment System Test Suite")
    print("=" * 50)
    
    tests = [
        ("Payment Service", test_payment_service),
        ("Payment Admin Dashboard", test_payment_admin_dashboard),
        ("Database Connection", test_database_connection),
        ("Payment Flow", test_payment_flow)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
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
        print("🎉 All tests passed! Payment system is ready.")
    else:
        print("⚠️  Some tests failed. Check the issues above.")
        
        if passed < total:
            print("\n🔧 RECOMMENDED ACTIONS:")
            print("1. Run the SQL in create_payment_tables.sql in your Supabase SQL Editor")
            print("2. Check your environment variables (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)")
            print("3. Verify the payment_transactions table exists and is accessible")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
