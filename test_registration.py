#!/usr/bin/env python3
"""
Registration Testing Script for NerdX Bot
Tests user registration functionality with and without referrals using actual Supabase credentials
"""

import os
import sys
import json
import uuid
import logging
from datetime import datetime

# Add project root to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Set environment variables for testing (using your actual Supabase credentials)
os.environ['SUPABASE_URL'] = 'https://hvlvwvzliqrlmqjbfgoa.supabase.co'
os.environ['SUPABASE_ANON_KEY'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2bHZ3dnpsaXFybG1xamJmZ29hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzODIxMjksImV4cCI6MjA2Nzk1ODEyOX0.jHxdXm5ilonxeBBrjYEMEmL3-bd3XOvGKj7XVuLBaWU'
os.environ['SUPABASE_SERVICE_ROLE_KEY'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2bHZ3dnpsaXFybG1xamJmZ29hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjM4MjEyOSwiZXhwIjoyMDY3OTU4MTI5fQ.p4qtbG42XUiN8sXH3phmUMwwQPo1v-StjUkwUZOR4Bg'
os.environ['SUPABASE_KEY'] = os.environ['SUPABASE_ANON_KEY']

# Import our database functions
from database.external_db import (
    create_user_registration, 
    get_user_registration, 
    get_user_by_nerdx_id,
    add_referral_credits,
    make_supabase_request,
    create_users_registration_table,
    diagnose_supabase_issues,
    get_user_credits,
    add_credits
)

def test_table_structure():
    """Test if tables exist and have correct structure"""
    print("\n" + "="*60)
    print("🔍 TESTING TABLE STRUCTURE")
    print("="*60)
    
    try:
        # Test table creation
        logger.info("📋 Testing table creation...")
        table_created = create_users_registration_table()
        print(f"✅ Table creation result: {table_created}")
        
        # Test table access
        logger.info("🔍 Testing table access...")
        result = make_supabase_request("GET", "users_registration", limit=1)
        print(f"✅ Table access successful: {result is not None}")
        
        # Check existing users
        all_users = make_supabase_request("GET", "users_registration")
        if all_users:
            print(f"📊 Found {len(all_users)} existing users in database")
            for user in all_users[:3]:  # Show first 3
                print(f"   📄 User: {user.get('name')} {user.get('surname')} (ID: {user.get('nerdx_id')})")
        else:
            print("📊 No existing users found")
            
        return True
        
    except Exception as e:
        print(f"❌ Table structure test failed: {e}")
        return False

def test_registration_without_referral():
    """Test user registration without referral code"""
    print("\n" + "="*60)
    print("👤 TESTING REGISTRATION WITHOUT REFERRAL")
    print("="*60)
    
    try:
        # Generate test data
        test_chat_id = f"test_no_ref_{uuid.uuid4().hex[:8]}"
        test_name = "John"
        test_surname = "Doe"
        test_dob = "15/08/1995"
        
        print(f"📝 Creating user: {test_name} {test_surname}")
        print(f"📱 Chat ID: {test_chat_id}")
        print(f"🎂 DOB: {test_dob}")
        
        # Attempt registration
        result = create_user_registration(
            chat_id=test_chat_id,
            name=test_name,
            surname=test_surname,
            date_of_birth=test_dob,
            referred_by_nerdx_id=None
        )
        
        if result:
            print(f"✅ Registration successful!")
            print(f"🆔 Generated NerdX ID: {result.get('nerdx_id')}")
            print(f"🔢 Database ID: {result.get('id')}")
            print(f"📅 Created at: {result.get('created_at')}")
            
            # Verify we can retrieve the user
            retrieved = get_user_registration(test_chat_id)
            if retrieved:
                print(f"✅ User retrieval successful")
                return result
            else:
                print(f"❌ Could not retrieve registered user")
                return None
        else:
            print(f"❌ Registration failed - no result returned")
            return None
            
    except Exception as e:
        print(f"❌ Registration without referral failed: {e}")
        return None

def test_registration_with_referral(referrer_nerdx_id):
    """Test user registration with referral code"""
    print("\n" + "="*60)
    print("🔗 TESTING REGISTRATION WITH REFERRAL")
    print("="*60)
    
    try:
        # Generate test data
        test_chat_id = f"test_with_ref_{uuid.uuid4().hex[:8]}"
        test_name = "Jane"
        test_surname = "Smith"
        test_dob = "22/12/1992"
        
        print(f"📝 Creating user: {test_name} {test_surname}")
        print(f"📱 Chat ID: {test_chat_id}")
        print(f"🎂 DOB: {test_dob}")
        print(f"🔗 Referral Code: {referrer_nerdx_id}")
        
        # Check if referrer exists
        referrer = get_user_by_nerdx_id(referrer_nerdx_id)
        if not referrer:
            print(f"❌ Referrer with NerdX ID {referrer_nerdx_id} not found")
            return None
            
        print(f"✅ Referrer found: {referrer.get('name')} {referrer.get('surname')}")
        
        # Get referrer's initial credits
        initial_credits = get_user_credits(referrer.get('chat_id'))
        print(f"💰 Referrer's initial credits: {initial_credits}")
        
        # Attempt registration with referral
        result = create_user_registration(
            chat_id=test_chat_id,
            name=test_name,
            surname=test_surname,
            date_of_birth=test_dob,
            referred_by_nerdx_id=referrer_nerdx_id
        )
        
        if result:
            print(f"✅ Registration with referral successful!")
            print(f"🆔 Generated NerdX ID: {result.get('nerdx_id')}")
            print(f"🔗 Referred by: {result.get('referred_by_nerdx_id')}")
            print(f"📅 Created at: {result.get('created_at')}")
            
            # Test referral credit awarding
            print(f"\n🎁 Testing referral credit awarding...")
            credit_success = add_referral_credits(referrer_nerdx_id, test_chat_id)
            
            if credit_success:
                print(f"✅ Referral credits awarded successfully")
                
                # Check referrer's updated credits
                updated_credits = get_user_credits(referrer.get('chat_id'))
                credit_increase = updated_credits - initial_credits if initial_credits and updated_credits else 0
                print(f"💰 Referrer's updated credits: {updated_credits} (+{credit_increase})")
            else:
                print(f"❌ Failed to award referral credits")
            
            return result
        else:
            print(f"❌ Registration with referral failed - no result returned")
            return None
            
    except Exception as e:
        print(f"❌ Registration with referral failed: {e}")
        return None

def test_supabase_diagnostics():
    """Run Supabase diagnostics"""
    print("\n" + "="*60)
    print("🔧 RUNNING SUPABASE DIAGNOSTICS")
    print("="*60)
    
    try:
        diagnosis = diagnose_supabase_issues()
        
        print(f"🏥 Configuration Status: {diagnosis.get('configuration_status')}")
        print(f"🔗 Connection Status: {diagnosis.get('connection_status')}")
        print(f"🗄️ Tables Status: {diagnosis.get('tables_status')}")
        
        # Print any recommendations
        if diagnosis.get('recommendations'):
            print(f"\n💡 Recommendations:")
            for rec in diagnosis['recommendations']:
                print(f"   • {rec}")
                
        return diagnosis
        
    except Exception as e:
        print(f"❌ Diagnostics failed: {e}")
        return None

def cleanup_test_users():
    """Clean up test users created during testing"""
    print("\n" + "="*60)
    print("🧹 CLEANING UP TEST USERS")
    print("="*60)
    
    try:
        # Get all users with test chat IDs
        all_users = make_supabase_request("GET", "users_registration")
        
        if all_users:
            test_users = [u for u in all_users if u.get('chat_id', '').startswith('test_')]
            
            print(f"🗑️ Found {len(test_users)} test users to clean up")
            
            for user in test_users:
                chat_id = user.get('chat_id')
                name = user.get('name')
                nerdx_id = user.get('nerdx_id')
                
                print(f"   🗑️ Deleting: {name} ({nerdx_id}) - {chat_id}")
                
                # Delete using Supabase REST API
                result = make_supabase_request(
                    "DELETE", 
                    "users_registration", 
                    filters={"chat_id": f"eq.{chat_id}"},
                    use_service_role=True
                )
                
            print(f"✅ Cleanup completed")
        else:
            print(f"ℹ️ No users found for cleanup")
            
    except Exception as e:
        print(f"❌ Cleanup failed: {e}")

def main():
    """Run all registration tests"""
    print("🧪 NERDX REGISTRATION TESTING SUITE")
    print("🕒 Started at:", datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    
    results = {
        'table_structure': False,
        'registration_no_referral': None,
        'registration_with_referral': None,
        'diagnostics': None
    }
    
    # 1. Test table structure
    results['table_structure'] = test_table_structure()
    
    if not results['table_structure']:
        print("\n❌ CRITICAL: Table structure test failed. Cannot proceed.")
        return results
    
    # 2. Test registration without referral
    results['registration_no_referral'] = test_registration_without_referral()
    
    # 3. Test registration with referral (using the first registered user as referrer)
    if results['registration_no_referral']:
        referrer_nerdx_id = results['registration_no_referral'].get('nerdx_id')
        if referrer_nerdx_id:
            results['registration_with_referral'] = test_registration_with_referral(referrer_nerdx_id)
    
    # 4. Run diagnostics
    results['diagnostics'] = test_supabase_diagnostics()
    
    # 5. Print summary
    print("\n" + "="*60)
    print("📊 TEST SUMMARY")
    print("="*60)
    
    print(f"✅ Table Structure: {'PASS' if results['table_structure'] else 'FAIL'}")
    print(f"✅ Registration (No Referral): {'PASS' if results['registration_no_referral'] else 'FAIL'}")
    print(f"✅ Registration (With Referral): {'PASS' if results['registration_with_referral'] else 'FAIL'}")
    print(f"✅ Diagnostics: {'PASS' if results['diagnostics'] else 'FAIL'}")
    
    # Overall result
    all_tests_passed = (
        results['table_structure'] and 
        results['registration_no_referral'] and 
        results['registration_with_referral'] and
        results['diagnostics']
    )
    
    print(f"\n🎯 OVERALL RESULT: {'✅ ALL TESTS PASSED' if all_tests_passed else '❌ SOME TESTS FAILED'}")
    
    # Cleanup option
    cleanup_choice = input("\n🧹 Clean up test users? (y/N): ").strip().lower()
    if cleanup_choice == 'y':
        cleanup_test_users()
    
    return results

if __name__ == "__main__":
    try:
        results = main()
        
        # Exit with appropriate code
        sys.exit(0 if all(results.values()) else 1)
        
    except KeyboardInterrupt:
        print("\n\n⏹️ Testing interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n💥 Testing script crashed: {e}")
        sys.exit(1)




