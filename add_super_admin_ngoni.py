#!/usr/bin/env python3
"""
NerdX Bot Add Super Admin Script
This script will add neezykidngoni@gmail.com as a super admin user
Uses the same password hashing as AdminAuthService (PBKDF2)
"""

import os
import psycopg2
import hashlib
import secrets
import logging
import re
from datetime import datetime

# Try to load environment variables from .env file
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    # dotenv not available, continue without it
    pass

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def _clean_connection_string(database_url: str) -> str:
    """Clean database URL by removing pgbouncer and other problematic parameters"""
    if not database_url:
        return database_url
    
    # Remove pgbouncer parameter if present (incompatible with psycopg2)
    if "pgbouncer=true" in database_url:
        database_url = database_url.replace("?pgbouncer=true", "").replace("&pgbouncer=true", "")
    if "pgbouncer=1" in database_url:
        database_url = database_url.replace("?pgbouncer=1", "").replace("&pgbouncer=1", "")
    if "pgbouncer" in database_url:
        # Remove any remaining pgbouncer parameters
        database_url = re.sub(r'[?&]pgbouncer=[^&]*', '', database_url)
    
    return database_url

def _hash_password(password: str, salt: str = None):
    """Hash password with salt using PBKDF2 (same as AdminAuthService)"""
    if not salt:
        salt = secrets.token_hex(32)
    
    password_hash = hashlib.pbkdf2_hmac('sha256', 
                                       password.encode('utf-8'), 
                                       salt.encode('utf-8'), 
                                       100000)  # 100,000 iterations
    
    return password_hash.hex(), salt

def add_super_admin():
    """Add neezykidngoni@gmail.com as super admin"""
    try:
        logger.info("Adding Super Admin: neezykidngoni@gmail.com...")
        
        # Get database connection string
        raw_conn_string = os.getenv('DATABASE_URL') or os.getenv('SUPABASE_DATABASE_URL')
        
        # Fallback to direct connection string if env vars not set
        if not raw_conn_string:
            # Try to use a pooler connection string (same format as inspect_database.py)
            raw_conn_string = "postgresql://postgres.hvlvwvzliqrlmqjbfgoa:Ngonidzashe2003.@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
            logger.info("Using fallback database connection string (pooler)")
        
        if not raw_conn_string:
            logger.error("ERROR: DATABASE_URL or SUPABASE_DATABASE_URL environment variable not set")
            return False
        
        conn_string = _clean_connection_string(raw_conn_string)
        
        # Connect to database
        logger.info("Connecting to database...")
        conn = psycopg2.connect(conn_string, connect_timeout=10)
        conn.autocommit = False
        cursor = conn.cursor()
        
        logger.info("Connected to database successfully")
        
        # Hash the password using the same method as AdminAuthService
        password = "Ngoni2003"
        password_hash, salt = _hash_password(password)
        
        logger.info("Password hashed successfully using PBKDF2")
        
        # Check if admin already exists
        cursor.execute("""
            SELECT id, email, first_name, last_name, role, is_active 
            FROM admin_users 
            WHERE email = %s
        """, ('neezykidngoni@gmail.com',))
        
        existing_admin = cursor.fetchone()
        
        if existing_admin:
            admin_id, email, first_name, last_name, role, is_active = existing_admin
            logger.info(f"INFO: Admin already exists with ID: {admin_id}")
            logger.info(f"   Email: {email}")
            logger.info(f"   Name: {first_name} {last_name}")
            logger.info(f"   Role: {role}")
            logger.info(f"   Active: {is_active}")
            
            # Update the existing admin with new password and ensure super_admin role
            cursor.execute("""
                UPDATE admin_users 
                SET password_hash = %s,
                    password_salt = %s,
                    role = 'super_admin',
                    is_active = TRUE,
                    updated_at = %s
                WHERE email = %s
                RETURNING id, email, first_name, last_name, role
            """, (password_hash, salt, datetime.now(), 'neezykidngoni@gmail.com'))
            
            updated_admin = cursor.fetchone()
            conn.commit()
            
            logger.info("SUCCESS: Updated existing admin user with new password and super_admin role")
            logger.info(f"   Updated ID: {updated_admin[0]}")
            logger.info(f"   Email: {updated_admin[1]}")
            logger.info(f"   Name: {updated_admin[2]} {updated_admin[3]}")
            logger.info(f"   Role: {updated_admin[4]}")
            
        else:
            # Insert new super admin
            cursor.execute("""
                INSERT INTO admin_users 
                (email, password_hash, password_salt, first_name, last_name, 
                 role, is_active, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id, email, first_name, last_name, role
            """, (
                'neezykidngoni@gmail.com',
                password_hash,
                salt,
                'Ngonidzashe',
                'Zimbwa',
                'super_admin',
                True,
                datetime.now(),
                datetime.now()
            ))
            
            new_admin = cursor.fetchone()
            conn.commit()
            
            logger.info("SUCCESS: Added new super admin user")
            logger.info(f"   ID: {new_admin[0]}")
            logger.info(f"   Email: {new_admin[1]}")
            logger.info(f"   Name: {new_admin[2]} {new_admin[3]}")
            logger.info(f"   Role: {new_admin[4]}")
        
        # Verify the admin was added/updated
        cursor.execute("""
            SELECT id, email, first_name, last_name, role, is_active, created_at, last_login
            FROM admin_users 
            WHERE email = 'neezykidngoni@gmail.com'
        """)
        
        admin_info = cursor.fetchone()
        
        if admin_info:
            logger.info("Final admin user details:")
            logger.info(f"   ID: {admin_info[0]}")
            logger.info(f"   Email: {admin_info[1]}")
            logger.info(f"   Name: {admin_info[2]} {admin_info[3]}")
            logger.info(f"   Role: {admin_info[4]}")
            logger.info(f"   Active: {admin_info[5]}")
            logger.info(f"   Created: {admin_info[6]}")
            if admin_info[7]:
                logger.info(f"   Last Login: {admin_info[7]}")
        
        # List all admin users
        cursor.execute("""
            SELECT id, email, first_name, last_name, role, is_active, created_at
            FROM admin_users 
            ORDER BY created_at
        """)
        
        all_admins = cursor.fetchall()
        logger.info(f"\nTotal admin users: {len(all_admins)}")
        
        for admin in all_admins:
            role_badge = "SUPER" if admin[4] == 'super_admin' else "ADMIN"
            active_status = "Active" if admin[5] else "Inactive"
            logger.info(f"   [{role_badge}] {admin[2]} {admin[3]} ({admin[1]}) - {admin[4]} - {active_status}")
        
        # Close connection
        cursor.close()
        conn.close()
        
        logger.info("Database connection closed")
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
    print("NERDX BOT SUPER ADMIN SETUP")
    print("=" * 70)
    print("Adding neezykidngoni@gmail.com as Super Admin")
    print("Email: neezykidngoni@gmail.com")
    print("Password: Ngoni2003")
    print("Role: super_admin")
    print("=" * 70)
    
    print("\nStarting super admin setup...")
    
    # Execute admin setup
    success = add_super_admin()
    
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
        print("Make sure DATABASE_URL or SUPABASE_DATABASE_URL is set correctly")

if __name__ == "__main__":
    main()
