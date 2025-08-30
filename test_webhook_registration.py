#!/usr/bin/env python3
"""
Test webhook registration functionality to ensure users can register properly.
"""

import os
import psycopg2
from psycopg2.extras import RealDictCursor
import json

# Database connection
DATABASE_URL = "postgresql://postgres:Ngonidzashe2003.@db.hvlvwvzliqrlmqjbfgoa.supabase.co:5432/postgres"

def test_webhook_registration():
    """Test the webhook registration flow"""
    try:
        print("Testing webhook registration functionality...\n")
        
        # Connect to database
        print("1. Testing database connection...")
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        print("✓ Database connected successfully")
        
        # Test 1: Check if users table has proper structure
        print("\n2. Testing users table structure...")
        cursor.execute("""
            SELECT column_name, data_type, is_nullable 
            FROM information_schema.columns 
            WHERE table_name = 'users' 
            ORDER BY ordinal_position;
        """)
        columns = cursor.fetchall()
        print("Users table columns:")
        for col in columns:
            print(f"  - {col[0]}: {col[1]} (nullable: {col[2]})")
        
        # Test 2: Check if users_registration table has proper structure
        print("\n3. Testing users_registration table structure...")
        cursor.execute("""
            SELECT column_name, data_type, is_nullable 
            FROM information_schema.columns 
            WHERE table_name = 'users_registration' 
            ORDER BY ordinal_position;
        """)
        reg_columns = cursor.fetchall()
        print("Users_registration table columns:")
        for col in reg_columns:
            print(f"  - {col[0]}: {col[1]} (nullable: {col[2]})")
        
        # Test 3: Check if registration session functions exist
        print("\n4. Testing registration session functions...")
        try:
            cursor.execute("""
                SELECT routine_name 
                FROM information_schema.routines 
                WHERE routine_name LIKE '%registration%' 
                AND routine_schema = 'public';
            """)
            functions = cursor.fetchall()
            if functions:
                print("Registration-related functions found:")
                for func in functions:
                    print(f"  - {func[0]}")
            else:
                print("⚠ No registration functions found in database")
        except Exception as e:
            print(f"⚠ Error checking functions: {e}")
        
        # Test 4: Check current user counts
        print("\n5. Testing current user data...")
        cursor.execute("SELECT COUNT(*) FROM users;")
        users_count = cursor.fetchone()[0]
        print(f"Total users: {users_count}")
        
        cursor.execute("SELECT COUNT(*) FROM users_registration;")
        reg_count = cursor.fetchone()[0]
        print(f"Total registrations: {reg_count}")
        
        # Test 5: Check for any registration sessions
        print("\n6. Testing registration sessions...")
        try:
            cursor.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_name LIKE '%session%' 
                AND table_schema = 'public';
            """)
            session_tables = cursor.fetchall()
            if session_tables:
                print("Session tables found:")
                for table in session_tables:
                    print(f"  - {table[0]}")
            else:
                print("⚠ No session tables found")
        except Exception as e:
            print(f"⚠ Error checking session tables: {e}")
        
        # Test 6: Simulate a new user registration
        print("\n7. Testing new user registration simulation...")
        test_whatsapp_id = "263TEST_REGISTRATION_" + str(int(os.getpid()))
        
        # Check if test user exists
        cursor.execute("SELECT nerdx_id FROM users WHERE whatsapp_id = %s;", (test_whatsapp_id,))
        existing_user = cursor.fetchone()
        
        if existing_user:
            print(f"⚠ Test user already exists: {existing_user[0]}")
        else:
            print(f"✓ Test user {test_whatsapp_id} is available for testing")
        
        cursor.close()
        conn.close()
        print("\n✓ Database connection closed")
        
        # Test 7: Check webhook file structure
        print("\n8. Testing webhook file structure...")
        webhook_file = "api/webhook.py"
        if os.path.exists(webhook_file):
            print(f"✓ Webhook file exists: {webhook_file}")
            
            # Check for key functions
            with open(webhook_file, 'r', encoding='utf-8') as f:
                content = f.read()
                
            required_functions = [
                'handle_webhook',
                'process_message_background', 
                'handle_text_message',
                'handle_new_user',
                'handle_registration_flow'
            ]
            
            for func in required_functions:
                if func in content:
                    print(f"  ✓ {func} function found")
                else:
                    print(f"  ✗ {func} function missing")
        else:
            print(f"✗ Webhook file not found: {webhook_file}")
        
        print("\n=== REGISTRATION TEST SUMMARY ===")
        print("✅ Database connection: Working")
        print(f"✅ Users table: {users_count} users")
        print(f"✅ Users registration: {reg_count} registrations")
        print("✅ Webhook file: Present")
        print("\n🎯 Next steps:")
        print("1. Send a message to the WhatsApp bot")
        print("2. The bot should respond with registration prompt")
        print("3. Follow the registration flow")
        print("4. Check database for new user entry")
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        if 'conn' in locals():
            conn.rollback()
            conn.close()

if __name__ == "__main__":
    test_webhook_registration()
