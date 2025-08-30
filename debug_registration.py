#!/usr/bin/env python3
"""
Debug script to identify registration flow issues
"""
import sys
import os

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def debug_registration_flow():
    """Debug the registration flow step by step"""
    print("🔍 Debugging Registration Flow")
    print("=" * 40)
    
    try:
        from services.user_service import UserService
        from database.session_db import get_registration_session, update_registration_session
        from database.external_db import is_user_registered
        
        user_service = UserService()
        test_user_id = "debug_user_123"
        
        print(f"📱 Testing registration for: {test_user_id}")
        
        # Step 1: Check if user is registered
        print("\n🔹 Step 1: Checking if user is registered")
        is_reg = is_user_registered(test_user_id)
        print(f"Is registered: {is_reg}")
        
        # Step 2: Check registration status
        print("\n🔹 Step 2: Checking registration status")
        reg_status = user_service.check_user_registration(test_user_id)
        print(f"Registration status: {reg_status}")
        
        # Step 3: Start registration
        print("\n🔹 Step 3: Starting registration")
        start_result = user_service.start_registration(test_user_id)
        print(f"Start result: {start_result}")
        
        # Step 4: Check session after start
        print("\n🔹 Step 4: Checking session after start")
        session = get_registration_session(test_user_id)
        print(f"Session data: {session}")
        
        # Step 5: Process name input
        print("\n🔹 Step 5: Processing name 'Tinase'")
        name_result = user_service.process_registration_step(test_user_id, "Tinase")
        print(f"Name result: {name_result}")
        
        # Step 6: Check session after name
        print("\n🔹 Step 6: Checking session after name")
        session_after_name = get_registration_session(test_user_id)
        print(f"Session after name: {session_after_name}")
        
        # Step 7: Check registration status again
        print("\n🔹 Step 7: Checking registration status again")
        reg_status_after = user_service.check_user_registration(test_user_id)
        print(f"Registration status after name: {reg_status_after}")
        
        print("\n✅ Debug completed!")
        return True
        
    except Exception as e:
        print(f"❌ Error during debug: {e}")
        import traceback
        traceback.print_exc()
        return False

def debug_session_management():
    """Debug session management specifically"""
    print("\n🔍 Debugging Session Management")
    print("=" * 40)
    
    try:
        from database.session_db import get_registration_session, update_registration_session
        from utils.session_manager import session_manager
        
        test_user_id = "debug_session_123"
        
        print(f"📱 Testing session management for: {test_user_id}")
        
        # Test session manager
        print("\n🔹 Testing session manager")
        session_type = session_manager.get_session_type(test_user_id)
        print(f"Session type: {session_type}")
        
        # Test direct session functions
        print("\n🔹 Testing direct session functions")
        session = get_registration_session(test_user_id)
        print(f"Direct session: {session}")
        
        # Test session update
        print("\n🔹 Testing session update")
        test_data = {
            'step': 'name',
            'name': None,
            'surname': None,
            'date_of_birth': None,
            'referred_by_nerdx_id': None
        }
        update_result = update_registration_session(test_user_id, test_data)
        print(f"Update result: {update_result}")
        
        # Check updated session
        updated_session = get_registration_session(test_user_id)
        print(f"Updated session: {updated_session}")
        
        print("\n✅ Session management debug completed!")
        return True
        
    except Exception as e:
        print(f"❌ Error during session debug: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    """Main debug function"""
    print("🚀 NerdX Registration Debug")
    print("=" * 50)
    
    tests = [
        debug_registration_flow,
        debug_session_management
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
        print()
    
    print("=" * 50)
    print(f"🏁 Debug Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("✅ All debug tests passed!")
    else:
        print("❌ Some debug tests failed. Check the output above.")
    
    return 0 if passed == total else 1

if __name__ == "__main__":
    sys.exit(main())
