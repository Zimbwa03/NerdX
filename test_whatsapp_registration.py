#!/usr/bin/env python3
"""
WhatsApp Registration Flow Testing Script
Tests the complete registration flow including security checks and referral system
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

# Set environment variables for testing
os.environ['SUPABASE_URL'] = 'https://hvlvwvzliqrlmqjbfgoa.supabase.co'
os.environ['SUPABASE_ANON_KEY'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2bHZ3dnpsaXFybG1xamJmZ29hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzODIxMjksImV4cCI6MjA2Nzk1ODEyOX0.jHxdXm5ilonxeBBrjYEMEmL3-bd3XOvGKj7XVuLBaWU'
os.environ['SUPABASE_SERVICE_ROLE_KEY'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2bHZ3dnpsaXFybG1xamJmZ29hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjM4MjEyOSwiZXhwIjoyMDY3OTU4MTI5fQ.p4qtbG42XUiN8sXH3phmUMwwQPo1v-StjUkwUZOR4Bg'
os.environ['SUPABASE_KEY'] = os.environ['SUPABASE_ANON_KEY']

# Import our services
from services.user_service import UserService
from database.external_db import (
    get_user_registration, 
    get_user_by_nerdx_id,
    get_user_credits,
    make_supabase_request
)

# Mock WhatsApp service for testing
class MockWhatsAppService:
    def __init__(self):
        self.sent_messages = []
    
    def send_message(self, user_id, message):
        print(f"\n📱 WHATSAPP MESSAGE TO {user_id}:")
        print("─" * 50)
        print(message)
        print("─" * 50)
        self.sent_messages.append({'user_id': user_id, 'message': message})
        return True
    
    def send_interactive_message(self, user_id, message, buttons):
        print(f"\n📱 WHATSAPP INTERACTIVE MESSAGE TO {user_id}:")
        print("─" * 50)
        print(message)
        print("\nButtons:")
        for button in buttons:
            print(f"  [{button.get('text', 'N/A')}]")
        print("─" * 50)
        self.sent_messages.append({'user_id': user_id, 'message': message, 'buttons': buttons})
        return True

def test_registration_security():
    """Test that unregistered users are blocked from accessing bot features"""
    print("\n" + "="*60)
    print("🔒 TESTING REGISTRATION SECURITY")
    print("="*60)
    
    # Test user ID that doesn't exist
    test_user_id = f"security_test_{uuid.uuid4().hex[:8]}"
    user_service = UserService()
    
    print(f"📱 Testing user: {test_user_id}")
    
    # Check registration status
    status = user_service.check_user_registration(test_user_id)
    print(f"✅ Registration status: {status}")
    
    # Verify user doesn't exist in database
    user_reg = get_user_registration(test_user_id)
    print(f"✅ Database check: {user_reg is None}")
    
    return status['is_registered'] == False and user_reg is None

def test_registration_flow():
    """Test the complete registration flow"""
    print("\n" + "="*60)
    print("👤 TESTING REGISTRATION FLOW")
    print("="*60)
    
    # Mock WhatsApp service
    import services.whatsapp_service
    original_service = services.whatsapp_service.WhatsAppService
    services.whatsapp_service.WhatsAppService = MockWhatsAppService
    
    try:
        user_service = UserService()
        test_user_id = f"reg_test_{uuid.uuid4().hex[:8]}"
        
        print(f"📱 Testing registration for: {test_user_id}")
        
        # Step 1: Start registration
        print("\n🔹 Step 1: Starting registration")
        user_service.start_registration(test_user_id)
        
        # Step 2: Provide name
        print("\n🔹 Step 2: Providing name")
        result = user_service.process_registration_step(test_user_id, "TestUser")
        print(f"Result: {result}")
        
        # Step 3: Provide surname
        print("\n🔹 Step 3: Providing surname")
        result = user_service.process_registration_step(test_user_id, "TestSurname")
        print(f"Result: {result}")
        
        # Step 4: Provide date of birth
        print("\n🔹 Step 4: Providing date of birth")
        result = user_service.process_registration_step(test_user_id, "15/05/1995")
        print(f"Result: {result}")
        
        # Step 5: Skip referral
        print("\n🔹 Step 5: Skipping referral")
        result = user_service.process_registration_step(test_user_id, "skip")
        print(f"Final result: {result}")
        
        # Verify registration in database
        final_registration = get_user_registration(test_user_id)
        if final_registration:
            print(f"✅ Registration successful!")
            print(f"🆔 NerdX ID: {final_registration.get('nerdx_id')}")
            print(f"👤 Name: {final_registration.get('name')} {final_registration.get('surname')}")
            return final_registration
        else:
            print(f"❌ Registration failed - not found in database")
            return None
            
    finally:
        # Restore original service
        services.whatsapp_service.WhatsAppService = original_service

def test_referral_system(referrer_nerdx_id):
    """Test the referral system with WhatsApp notifications"""
    print("\n" + "="*60)
    print("🔗 TESTING REFERRAL SYSTEM")
    print("="*60)
    
    # Mock WhatsApp service to capture notifications
    import services.whatsapp_service
    original_service = services.whatsapp_service.WhatsAppService
    mock_service = MockWhatsAppService()
    services.whatsapp_service.WhatsAppService = lambda: mock_service
    
    try:
        user_service = UserService()
        test_user_id = f"referral_test_{uuid.uuid4().hex[:8]}"
        
        print(f"📱 Testing referral registration for: {test_user_id}")
        print(f"🔗 Using referral code: {referrer_nerdx_id}")
        
        # Get referrer's initial credits
        referrer = get_user_by_nerdx_id(referrer_nerdx_id)
        if not referrer:
            print(f"❌ Referrer not found: {referrer_nerdx_id}")
            return None
            
        initial_credits = get_user_credits(referrer['chat_id'])
        print(f"💰 Referrer's initial credits: {initial_credits}")
        
        # Complete registration flow with referral
        user_service.start_registration(test_user_id)
        user_service.process_registration_step(test_user_id, "ReferredUser")
        user_service.process_registration_step(test_user_id, "TestSurname")
        user_service.process_registration_step(test_user_id, "20/12/1990")
        
        # Use referral code
        print(f"\n🔹 Using referral code: {referrer_nerdx_id}")
        result = user_service.process_registration_step(test_user_id, referrer_nerdx_id)
        print(f"Referral result: {result}")
        
        # Check if referrer received credits and notification
        final_credits = get_user_credits(referrer['chat_id'])
        credit_increase = final_credits - initial_credits if initial_credits and final_credits else 0
        
        print(f"💰 Referrer's final credits: {final_credits} (+{credit_increase})")
        
        # Check if notification was sent
        referrer_messages = [msg for msg in mock_service.sent_messages if msg['user_id'] == referrer['chat_id']]
        if referrer_messages:
            print(f"✅ Referral notification sent to referrer!")
            print(f"📧 Notification count: {len(referrer_messages)}")
        else:
            print(f"❌ No notification sent to referrer")
        
        # Verify new user registration
        new_user_reg = get_user_registration(test_user_id)
        if new_user_reg and new_user_reg.get('referred_by_nerdx_id') == referrer_nerdx_id:
            print(f"✅ New user registered with referral!")
            return {
                'new_user': new_user_reg,
                'credit_increase': credit_increase,
                'notification_sent': len(referrer_messages) > 0
            }
        else:
            print(f"❌ Referral registration failed")
            return None
            
    finally:
        # Restore original service
        services.whatsapp_service.WhatsAppService = original_service

def test_access_without_registration():
    """Test that bot features are blocked without registration"""
    print("\n" + "="*60)
    print("🚫 TESTING ACCESS DENIAL WITHOUT REGISTRATION")
    print("="*60)
    
    from api.webhook import require_registration
    
    # Create a mock function that requires registration
    @require_registration
    def protected_function(user_id: str):
        return f"Access granted to {user_id}"
    
    # Test with unregistered user
    unregistered_user = f"unregistered_{uuid.uuid4().hex[:8]}"
    print(f"📱 Testing access for unregistered user: {unregistered_user}")
    
    # Mock WhatsApp service
    import services.whatsapp_service
    original_service = services.whatsapp_service.WhatsAppService
    mock_service = MockWhatsAppService()
    services.whatsapp_service.WhatsAppService = lambda: mock_service
    
    try:
        result = protected_function(unregistered_user)
        
        # Should return None (access denied)
        access_denied = result is None
        
        # Should have sent registration message
        messages_sent = len(mock_service.sent_messages) > 0
        registration_message = any("first name" in msg['message'].lower() for msg in mock_service.sent_messages)
        
        print(f"✅ Access denied: {access_denied}")
        print(f"✅ Registration message sent: {messages_sent and registration_message}")
        
        return access_denied and messages_sent and registration_message
        
    finally:
        services.whatsapp_service.WhatsAppService = original_service

def cleanup_test_data():
    """Clean up test data"""
    print("\n" + "="*60)
    print("🧹 CLEANING UP TEST DATA")
    print("="*60)
    
    try:
        # Get all test users
        all_users = make_supabase_request("GET", "users_registration")
        if all_users:
            test_users = [u for u in all_users if any(prefix in u.get('chat_id', '') for prefix in ['security_test_', 'reg_test_', 'referral_test_', 'unregistered_'])]
            
            print(f"🗑️ Found {len(test_users)} test users to clean up")
            
            for user in test_users:
                chat_id = user.get('chat_id')
                print(f"   Deleting: {chat_id}")
                make_supabase_request(
                    "DELETE", 
                    "users_registration", 
                    filters={"chat_id": f"eq.{chat_id}"},
                    use_service_role=True
                )
        
        print("✅ Cleanup completed")
        return True
        
    except Exception as e:
        print(f"❌ Cleanup failed: {e}")
        return False

def main():
    """Run all WhatsApp registration tests"""
    print("🧪 NERDX WHATSAPP REGISTRATION SECURITY TESTS")
    print("🕒 Started at:", datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    
    results = {}
    
    # Test 1: Registration security
    results['security'] = test_registration_security()
    
    # Test 2: Registration flow
    first_user = test_registration_flow()
    results['registration_flow'] = first_user is not None
    
    # Test 3: Referral system (using first user as referrer)
    if first_user:
        referrer_nerdx_id = first_user.get('nerdx_id')
        if referrer_nerdx_id:
            results['referral_system'] = test_referral_system(referrer_nerdx_id)
        else:
            results['referral_system'] = None
    else:
        results['referral_system'] = None
    
    # Test 4: Access denial
    results['access_denial'] = test_access_without_registration()
    
    # Print summary
    print("\n" + "="*60)
    print("📊 TEST SUMMARY")
    print("="*60)
    
    print(f"🔒 Registration Security: {'✅ PASS' if results['security'] else '❌ FAIL'}")
    print(f"📝 Registration Flow: {'✅ PASS' if results['registration_flow'] else '❌ FAIL'}")
    print(f"🔗 Referral System: {'✅ PASS' if results['referral_system'] else '❌ FAIL' if results['referral_system'] is False else '⏭️ SKIP'}")
    print(f"🚫 Access Denial: {'✅ PASS' if results['access_denial'] else '❌ FAIL'}")
    
    # Overall result
    passed_tests = sum(1 for result in results.values() if result is True)
    total_tests = sum(1 for result in results.values() if result is not None)
    
    print(f"\n🎯 OVERALL: {passed_tests}/{total_tests} tests passed")
    
    if passed_tests == total_tests:
        print("🎉 ALL SECURITY TESTS PASSED! Registration system is secure.")
    else:
        print("⚠️ SOME TESTS FAILED! Review security implementation.")
    
    # Cleanup
    cleanup_choice = input("\n🧹 Clean up test data? (y/N): ").strip().lower()
    if cleanup_choice == 'y':
        cleanup_test_data()
    
    return results

if __name__ == "__main__":
    try:
        results = main()
        all_passed = all(result is True for result in results.values() if result is not None)
        sys.exit(0 if all_passed else 1)
        
    except KeyboardInterrupt:
        print("\n\n⏹️ Testing interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n💥 Testing script crashed: {e}")
        sys.exit(1)




