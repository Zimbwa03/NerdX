#!/usr/bin/env python3
"""
Add Super Admin via Supabase REST API
This script uses the same make_supabase_request function as the codebase
"""

import os
import sys

# Try to load environment variables
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# Set Supabase environment variables if not already set
if not os.getenv('SUPABASE_URL'):
    os.environ['SUPABASE_URL'] = 'https://hvlvwvzliqrlmqjbfgoa.supabase.co'
if not os.getenv('SUPABASE_SERVICE_ROLE_KEY'):
    # Use anon key as fallback (will need service role for admin_users writes)
    os.environ['SUPABASE_SERVICE_ROLE_KEY'] = os.getenv('SUPABASE_ANON_KEY') or 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2bHZ3dnpsaXFybG1xamJmZ29hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzODIxMjksImV4cCI6MjA2Nzk1ODEyOX0.jHxdXm5ilonxeBBrjYEMEmL3-bd3XOvGKj7XVuLBaWU'
if not os.getenv('SUPABASE_ANON_KEY'):
    os.environ['SUPABASE_ANON_KEY'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2bHZ3dnpsaXFybG1xamJmZ29hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzODIxMjksImV4cCI6MjA2Nzk1ODEyOX0.jHxdXm5ilonxeBBrjYEMEmL3-bd3XOvGKj7XVuLBaWU'

# Add project root to path to import database functions
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database.external_db import make_supabase_request
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def add_super_admin():
    """Add super admin using Supabase REST API"""
    try:
        logger.info("Adding Super Admin: neezykidngoni@gmail.com via Supabase REST API...")
        
        # Check if admin already exists
        existing = make_supabase_request(
            "GET",
            "admin_users",
            select="id,email,first_name,last_name,role,is_active",
            filters={"email": "eq.neezykidngoni@gmail.com"},
            use_service_role=True
        )
        
        # Prepare admin data
        admin_data = {
            "email": "neezykidngoni@gmail.com",
            "password_hash": "04b98f750bddcb8c12bf8133514e117293a31531dac09ca1e60b66fec237738e",
            "password_salt": "98f171d29755f2048ceb66ee935f460eb78e473f3c8693fcba5c4866916bc096",
            "first_name": "Ngonidzashe",
            "last_name": "Zimbwa",
            "role": "super_admin",
            "is_active": True
        }
        
        if existing and len(existing) > 0:
            # Update existing admin
            admin_id = existing[0]['id']
            logger.info(f"Updating existing admin with ID: {admin_id}")
            
            result = make_supabase_request(
                "PATCH",
                "admin_users",
                data=admin_data,
                filters={"id": f"eq.{admin_id}"},
                use_service_role=True
            )
            
            if result:
                logger.info("SUCCESS: Updated existing admin user")
                logger.info(f"Admin ID: {admin_id}")
                logger.info(f"Email: {admin_data['email']}")
                logger.info(f"Role: {admin_data['role']}")
                return True
            else:
                logger.error("Failed to update admin")
                return False
        else:
            # Insert new admin
            logger.info("Inserting new admin user...")
            
            result = make_supabase_request(
                "POST",
                "admin_users",
                data=admin_data,
                use_service_role=True
            )
            
            if result:
                logger.info("SUCCESS: Added new super admin user")
                if isinstance(result, list) and len(result) > 0:
                    admin = result[0]
                    logger.info(f"Admin ID: {admin.get('id')}")
                    logger.info(f"Email: {admin.get('email')}")
                    logger.info(f"Role: {admin.get('role')}")
                return True
            else:
                logger.error("Failed to insert admin")
                return False
                
    except Exception as e:
        logger.error(f"ERROR: Failed to add super admin: {e}")
        import traceback
        logger.error(traceback.format_exc())
        return False

if __name__ == "__main__":
    print("=" * 70)
    print("ADDING SUPER ADMIN VIA SUPABASE REST API")
    print("=" * 70)
    
    success = add_super_admin()
    
    if success:
        print("\n" + "=" * 70)
        print("SUPER ADMIN SETUP COMPLETE!")
        print("=" * 70)
        print("Email: neezykidngoni@gmail.com")
        print("Password: Ngoni2003")
        print("Role: super_admin")
        print("\nYou can now login at: https://nerdx.onrender.com/login")
        print("=" * 70)
    else:
        print("\n" + "=" * 70)
        print("SETUP FAILED!")
        print("=" * 70)
        print("Check the logs above for errors")
