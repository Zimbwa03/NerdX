#!/usr/bin/env python3
"""
NerdX Bot Add Super Admin Script
This script will add Ngonidzashe Zimbwa as a super admin user
"""

import psycopg2
import bcrypt
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Database connection string
DATABASE_URL = "postgresql://postgres:Ngonidzashe2003.@db.hvlvwvzliqrlmqjbfgoa.supabase.co:5432/postgres"

def add_super_admin():
    """Add Ngonidzashe Zimbwa as super admin"""
    try:
        logger.info("👑 Adding Super Admin: Ngonidzashe Zimbwa...")
        
        # Connect to database
        conn = psycopg2.connect(DATABASE_URL)
        conn.autocommit = True
        cursor = conn.cursor()
        
        logger.info("✅ Connected to database successfully")
        
        # Hash the password
        password = "Ngoni2003."
        salt = bcrypt.gensalt()
        password_hash = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
        
        logger.info("🔐 Password hashed successfully")
        
        # Check if admin already exists
        cursor.execute("""
            SELECT id, username, email FROM admin_users 
            WHERE email = 'neezykidngoni@gmail.com' OR username = 'ngonidzashe';
        """)
        
        existing_admin = cursor.fetchone()
        
        if existing_admin:
            logger.info(f"ℹ️  Admin already exists with ID: {existing_admin[0]}")
            logger.info(f"   Username: {existing_admin[1]}")
            logger.info(f"   Email: {existing_admin[2]}")
            
            # Update the existing admin with new details
            cursor.execute("""
                UPDATE admin_users 
                SET username = 'ngonidzashe',
                    full_name = 'Ngonidzashe Zimbwa',
                    password_hash = %s,
                    role = 'super_admin',
                    is_active = TRUE,
                    updated_at = CURRENT_TIMESTAMP
                WHERE email = 'neezykidngoni@gmail.com';
            """, (password_hash,))
            
            logger.info("✅ Updated existing admin user with new details")
            
        else:
            # Insert new super admin
            cursor.execute("""
                INSERT INTO admin_users (
                    username, 
                    email, 
                    password_hash, 
                    full_name, 
                    role, 
                    is_active
                ) VALUES (
                    'ngonidzashe',
                    'neezykidngoni@gmail.com',
                    %s,
                    'Ngonidzashe Zimbwa',
                    'super_admin',
                    TRUE
                );
            """, (password_hash,))
            
            logger.info("✅ Added new super admin user")
        
        # Verify the admin was added/updated
        cursor.execute("""
            SELECT id, username, email, full_name, role, is_active, created_at 
            FROM admin_users 
            WHERE email = 'neezykidngoni@gmail.com';
        """)
        
        admin_info = cursor.fetchone()
        
        if admin_info:
            logger.info("🔍 Admin user details:")
            logger.info(f"   ID: {admin_info[0]}")
            logger.info(f"   Username: {admin_info[1]}")
            logger.info(f"   Email: {admin_info[2]}")
            logger.info(f"   Full Name: {admin_info[3]}")
            logger.info(f"   Role: {admin_info[4]}")
            logger.info(f"   Active: {admin_info[5]}")
            logger.info(f"   Created: {admin_info[6]}")
        
        # List all admin users
        cursor.execute("""
            SELECT username, email, full_name, role, is_active 
            FROM admin_users 
            ORDER BY created_at;
        """)
        
        all_admins = cursor.fetchall()
        logger.info(f"📋 Total admin users: {len(all_admins)}")
        
        for admin in all_admins:
            logger.info(f"   - {admin[0]} ({admin[1]}) - {admin[2]} - Role: {admin[3]} - Active: {admin[4]}")
        
        # Close connection
        cursor.close()
        conn.close()
        
        logger.info("✅ Database connection closed")
        logger.info("🎉 Super admin setup complete!")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Failed to add super admin: {e}")
        return False

def main():
    """Main execution function"""
    print("=" * 60)
    print("👑 NERDX BOT SUPER ADMIN SETUP")
    print("=" * 60)
    print("Adding Ngonidzashe Zimbwa as Super Admin")
    print("Username: ngonidzashe")
    print("Email: neezykidngoni@gmail.com")
    print("=" * 60)
    
    print("\n👑 Starting super admin setup...")
    
    # Execute admin setup
    success = add_super_admin()
    
    if success:
        print("\n🎉 SUPER ADMIN SETUP COMPLETE!")
        print("✅ Ngonidzashe Zimbwa has been added as super admin")
        print("✅ Login credentials:")
        print("   Username: ngonidzashe")
        print("   Email: neezykidngoni@gmail.com")
        print("   Password: Ngoni2003.")
        print("   Role: super_admin")
        print("\n📋 Next steps:")
        print("   1. Test admin login to the dashboard")
        print("   2. Verify admin permissions work")
        print("   3. Start using the admin features")
    else:
        print("\n❌ SUPER ADMIN SETUP FAILED!")
        print("Please check the logs above for errors")

if __name__ == "__main__":
    main()
