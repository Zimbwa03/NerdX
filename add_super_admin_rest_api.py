#!/usr/bin/env python3
"""
NerdX Bot Add Super Admin Script (REST API Version)
This script will add neezykidngoni@gmail.com as a super admin user
Uses Supabase REST API instead of direct database connection
"""

import os
import requests
import hashlib
import secrets
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Try to load environment variables from .env file
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    # dotenv not available, continue without it
    pass

def _hash_password(password: str, salt: str = None):
    """Hash password with salt using PBKDF2 (same as AdminAuthService)"""
    if not salt:
        salt = secrets.token_hex(32)
    
    password_hash = hashlib.pbkdf2_hmac('sha256', 
                                       password.encode('utf-8'), 
                                       salt.encode('utf-8'), 
                                       100000)  # 100,000 iterations
    
    return password_hash.hex(), salt

def add_super_admin_via_rest_api():
    """Add neezykidngoni@gmail.com as super admin using Supabase REST API"""
    try:
        logger.info("Adding Super Admin: neezykidngoni@gmail.com via REST API...")
        
        # Get Supabase configuration
        supabase_url = os.getenv('SUPABASE_URL') or 'https://hvlvwvzliqrlmqjbfgoa.supabase.co'
        service_role_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('SUPABASE_KEY')
        
        # Fallback: Try to use anon key if service role key not available
        # Note: Service role key is needed for admin_users table writes
        if not service_role_key:
            anon_key = os.getenv('SUPABASE_ANON_KEY')
            if anon_key:
                logger.warning("WARNING: Using SUPABASE_ANON_KEY instead of SERVICE_ROLE_KEY")
                logger.warning("This may not work if RLS policies restrict admin_users table access")
                service_role_key = anon_key
            else:
                # Last resort fallback - use hardcoded keys from config files
                logger.warning("WARNING: Using fallback Supabase keys from config")
                service_role_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2bHZ3dnpsaXFybG1xamJmZ29hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzODIxMjksImV4cCI6MjA2Nzk1ODEyOX0.jHxdXm5ilonxeBBrjYEMEmL3-bd3XOvGKj7XVuLBaWU'
        
        # Hash the password using the same method as AdminAuthService
        password = "Ngoni2003"
        password_hash, salt = _hash_password(password)
        
        logger.info("Password hashed successfully using PBKDF2")
        
        # Prepare headers for Supabase REST API
        headers = {
            "apikey": service_role_key,
            "Authorization": f"Bearer {service_role_key}",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }
        
        # Check if admin already exists
        check_url = f"{supabase_url}/rest/v1/admin_users"
        check_params = {
            "email": "eq.neezykidngoni@gmail.com",
            "select": "id,email,first_name,last_name,role,is_active"
        }
        
        logger.info("Checking if admin already exists...")
        response = requests.get(check_url, headers=headers, params=check_params)
        
        existing_admin = None
        if response.status_code == 200:
            data = response.json()
            if data and len(data) > 0:
                existing_admin = data[0]
                logger.info(f"INFO: Admin already exists with ID: {existing_admin['id']}")
        
        if existing_admin:
            # Update the existing admin with new password and ensure super_admin role
            update_url = f"{supabase_url}/rest/v1/admin_users"
            update_params = {"id": "eq." + str(existing_admin['id'])}
            
            update_data = {
                "password_hash": password_hash,
                "password_salt": salt,
                "role": "super_admin",
                "is_active": True,
                "updated_at": datetime.now().isoformat()
            }
            
            logger.info("Updating existing admin user...")
            response = requests.patch(update_url, headers=headers, params=update_params, json=update_data)
            
            if response.status_code in [200, 204]:
                logger.info("SUCCESS: Updated existing admin user with new password and super_admin role")
                updated_data = response.json() if response.content else existing_admin
                if isinstance(updated_data, list) and len(updated_data) > 0:
                    updated_data = updated_data[0]
                logger.info(f"   Updated ID: {updated_data.get('id')}")
                logger.info(f"   Email: {updated_data.get('email')}")
                logger.info(f"   Name: {updated_data.get('first_name')} {updated_data.get('last_name')}")
                logger.info(f"   Role: {updated_data.get('role')}")
            else:
                logger.error(f"ERROR: Failed to update admin - Status: {response.status_code}")
                logger.error(f"Response: {response.text}")
                return False
        else:
            # Insert new super admin
            insert_url = f"{supabase_url}/rest/v1/admin_users"
            
            insert_data = {
                "email": "neezykidngoni@gmail.com",
                "password_hash": password_hash,
                "password_salt": salt,
                "first_name": "Ngonidzashe",
                "last_name": "Zimbwa",
                "role": "super_admin",
                "is_active": True,
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat()
            }
            
            logger.info("Inserting new super admin user...")
            response = requests.post(insert_url, headers=headers, json=insert_data)
            
            if response.status_code in [200, 201]:
                logger.info("SUCCESS: Added new super admin user")
                new_data = response.json()
                if isinstance(new_data, list) and len(new_data) > 0:
                    new_data = new_data[0]
                logger.info(f"   ID: {new_data.get('id')}")
                logger.info(f"   Email: {new_data.get('email')}")
                logger.info(f"   Name: {new_data.get('first_name')} {new_data.get('last_name')}")
                logger.info(f"   Role: {new_data.get('role')}")
            else:
                logger.error(f"ERROR: Failed to insert admin - Status: {response.status_code}")
                logger.error(f"Response: {response.text}")
                return False
        
        # Verify the admin was added/updated
        logger.info("Verifying admin user...")
        verify_response = requests.get(check_url, headers=headers, params=check_params)
        
        if verify_response.status_code == 200:
            admin_info = verify_response.json()
            if admin_info and len(admin_info) > 0:
                admin = admin_info[0]
                logger.info("Final admin user details:")
                logger.info(f"   ID: {admin.get('id')}")
                logger.info(f"   Email: {admin.get('email')}")
                logger.info(f"   Name: {admin.get('first_name')} {admin.get('last_name')}")
                logger.info(f"   Role: {admin.get('role')}")
                logger.info(f"   Active: {admin.get('is_active')}")
        
        logger.info("Super admin setup complete!")
        return True
        
    except Exception as e:
        logger.error(f"ERROR: Failed to add super admin: {e}")
        import traceback
        logger.error(traceback.format_exc())
        return False

def main():
    """Main execution function"""
    print("=" * 70)
    print("NERDX BOT SUPER ADMIN SETUP (REST API VERSION)")
    print("=" * 70)
    print("Adding neezykidngoni@gmail.com as Super Admin")
    print("Email: neezykidngoni@gmail.com")
    print("Password: Ngoni2003")
    print("Role: super_admin")
    print("=" * 70)
    
    print("\nStarting super admin setup via REST API...")
    
    # Execute admin setup
    success = add_super_admin_via_rest_api()
    
    if success:
        print("\n" + "=" * 70)
        print("SUPER ADMIN SETUP COMPLETE!")
        print("=" * 70)
        print("neezykidngoni@gmail.com has been added as super admin")
        print("\nLogin credentials:")
        print("   Email: neezykidngoni@gmail.com")
        print("   Password: Ngoni2003")
        print("   Role: super_admin")
        print("\nNext steps:")
        print("   1. Go to https://nerdx.onrender.com/login")
        print("   2. Login with the credentials above")
        print("   3. You can now add other admins from the dashboard")
        print("   4. Navigate to Admin Users section to manage admins")
        print("=" * 70)
    else:
        print("\n" + "=" * 70)
        print("SUPER ADMIN SETUP FAILED!")
        print("=" * 70)
        print("Please check the logs above for errors")
        print("Make sure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set correctly")

if __name__ == "__main__":
    main()
