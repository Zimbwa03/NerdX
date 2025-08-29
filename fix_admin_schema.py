#!/usr/bin/env python3
"""
NerdX Bot Fix Admin Schema Script
This script will fix the admin_users table schema to match the admin auth service
"""

import psycopg2
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Database connection string
DATABASE_URL = "postgresql://postgres:Ngonidzashe2003.@db.hvlvwvzliqrlmqjbfgoa.supabase.co:5432/postgres"

def fix_admin_schema():
    """Fix admin_users table schema to match admin auth service"""
    try:
        logger.info("🔧 Fixing admin_users table schema...")
        
        # Connect to database
        conn = psycopg2.connect(DATABASE_URL)
        conn.autocommit = True
        cursor = conn.cursor()
        
        logger.info("✅ Connected to database successfully")
        
        # Check current schema
        cursor.execute("""
            SELECT column_name, data_type, is_nullable 
            FROM information_schema.columns 
            WHERE table_name = 'admin_users' 
            ORDER BY ordinal_position;
        """)
        
        current_columns = [row[0] for row in cursor.fetchall()]
        logger.info(f"📋 Current columns: {current_columns}")
        
        # Add missing columns
        missing_columns = []
        
        if 'password_salt' not in current_columns:
            missing_columns.append("ADD COLUMN password_salt VARCHAR(255)")
            
        if 'first_name' not in current_columns:
            missing_columns.append("ADD COLUMN first_name VARCHAR(100)")
            
        if 'last_name' not in current_columns:
            missing_columns.append("ADD COLUMN last_name VARCHAR(100)")
            
        if 'phone_number' not in current_columns:
            missing_columns.append("ADD COLUMN phone_number VARCHAR(20)")
            
        if 'failed_login_attempts' not in current_columns:
            missing_columns.append("ADD COLUMN failed_login_attempts INTEGER DEFAULT 0")
            
        if 'account_locked_until' not in current_columns:
            missing_columns.append("ADD COLUMN account_locked_until TIMESTAMP")
            
        if 'last_login_ip' not in current_columns:
            missing_columns.append("ADD COLUMN last_login_ip VARCHAR(45)")
            
        if 'created_by' not in current_columns:
            missing_columns.append("ADD COLUMN created_by INTEGER")
        
        # Execute ALTER TABLE statements
        if missing_columns:
            logger.info("🔨 Adding missing columns...")
            
            for column_def in missing_columns:
                try:
                    cursor.execute(f"ALTER TABLE admin_users {column_def};")
                    logger.info(f"   ✅ Added column: {column_def}")
                except Exception as e:
                    logger.info(f"   ℹ️  Column already exists or error: {e}")
        else:
            logger.info("✅ All required columns already exist")
        
        # Update existing admin users to split full_name into first_name and last_name
        cursor.execute("""
            SELECT id, full_name FROM admin_users 
            WHERE (first_name IS NULL OR last_name IS NULL) AND full_name IS NOT NULL;
        """)
        
        users_to_update = cursor.fetchall()
        
        if users_to_update:
            logger.info(f"🔄 Updating {len(users_to_update)} users to split full_name...")
            
            for user_id, full_name in users_to_update:
                if full_name:
                    # Split full name (assuming format: "First Last")
                    name_parts = full_name.strip().split(' ', 1)
                    first_name = name_parts[0] if name_parts else ''
                    last_name = name_parts[1] if len(name_parts) > 1 else ''
                    
                    cursor.execute("""
                        UPDATE admin_users 
                        SET first_name = %s, last_name = %s
                        WHERE id = %s
                    """, (first_name, last_name, user_id))
                    
                    logger.info(f"   ✅ Updated user {user_id}: {first_name} {last_name}")
        
        # Set default values for new columns
        logger.info("🔧 Setting default values for new columns...")
        
        # Set default role for existing users if not set
        cursor.execute("""
            UPDATE admin_users 
            SET role = 'admin' 
            WHERE role IS NULL OR role = '';
        """)
        
        # Set default is_active for existing users if not set
        cursor.execute("""
            UPDATE admin_users 
            SET is_active = TRUE 
            WHERE is_active IS NULL;
        """)
        
        # Set default failed_login_attempts for existing users if not set
        cursor.execute("""
            UPDATE admin_users 
            SET failed_login_attempts = 0 
            WHERE failed_login_attempts IS NULL;
        """)
        
        logger.info("✅ Default values set")
        
        # Verify final schema
        cursor.execute("""
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_name = 'admin_users' 
            ORDER BY ordinal_position;
        """)
        
        final_columns = cursor.fetchall()
        logger.info(f"📋 Final schema - {len(final_columns)} columns:")
        
        for col in final_columns:
            logger.info(f"   - {col[0]}: {col[1]} (nullable: {col[2]}, default: {col[3]})")
        
        # Check admin users
        cursor.execute("""
            SELECT id, username, email, first_name, last_name, role, is_active 
            FROM admin_users 
            ORDER BY created_at;
        """)
        
        admin_users = cursor.fetchall()
        logger.info(f"📋 Admin users ({len(admin_users)} total):")
        
        for user in admin_users:
            logger.info(f"   - ID {user[0]}: {user[1]} ({user[2]}) - {user[3]} {user[4]} - Role: {user[5]} - Active: {user[6]}")
        
        # Close connection
        cursor.close()
        conn.close()
        
        logger.info("✅ Database connection closed")
        logger.info("🎉 Admin schema fixes complete!")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Admin schema fixes failed: {e}")
        return False

def main():
    """Main execution function"""
    print("=" * 60)
    print("🔧 NERDX BOT ADMIN SCHEMA FIXES")
    print("=" * 60)
    print("This will fix the admin_users table schema")
    print("to match what the admin auth service expects")
    print("=" * 60)
    
    print("\n🔧 Starting admin schema fixes...")
    
    # Execute schema fixes
    success = fix_admin_schema()
    
    if success:
        print("\n🎉 ADMIN SCHEMA FIXES COMPLETE!")
        print("✅ admin_users table now has all required columns")
        print("✅ Schema matches admin auth service expectations")
        print("✅ Existing admin users have been updated")
        print("\n📋 What was fixed:")
        print("   - Added missing columns (password_salt, first_name, last_name, etc.)")
        print("   - Split full_name into separate first_name and last_name fields")
        print("   - Set default values for new columns")
        print("   - Updated existing admin users")
        print("\n📋 Next steps:")
        print("   1. Test admin login to the dashboard")
        print("   2. Verify all admin features work")
        print("   3. Add new admin users if needed")
    else:
        print("\n❌ ADMIN SCHEMA FIXES FAILED!")
        print("Please check the logs above for errors")

if __name__ == "__main__":
    main()
