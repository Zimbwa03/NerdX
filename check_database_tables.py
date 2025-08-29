#!/usr/bin/env python3
"""
Check Database Tables Script
Examines the current database structure and identifies what needs to be created/modified
"""

import os
import psycopg2
from psycopg2.extras import RealDictCursor
import sys

# Database connection string
DATABASE_URL = "postgresql://postgres:Ngonidzashe2003.@db.hvlvwvzliqrlmqjbfgoa.supabase.co:5432/postgres"

def check_database_connection():
    """Test database connection"""
    try:
        print("🔍 Testing database connection...")
        conn = psycopg2.connect(DATABASE_URL)
        print("✅ Database connection successful!")
        return conn
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return None

def check_existing_tables(conn):
    """Check what tables already exist"""
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # Get list of all tables
        cursor.execute("""
            SELECT table_name, table_type 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name
        """)
        
        tables = cursor.fetchall()
        
        print("\n📋 Existing Tables:")
        print("=" * 50)
        
        if not tables:
            print("No tables found in the database")
            return []
        
        for table in tables:
            print(f"📁 {table['table_name']} ({table['table_type']})")
        
        return [table['table_name'] for table in tables]
        
    except Exception as e:
        print(f"❌ Error checking tables: {e}")
        return []

def check_table_structure(conn, table_name):
    """Check the structure of a specific table"""
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # Get table columns
        cursor.execute("""
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_name = %s 
            ORDER BY ordinal_position
        """, (table_name,))
        
        columns = cursor.fetchall()
        
        print(f"\n🔍 Table Structure: {table_name}")
        print("-" * 40)
        
        if not columns:
            print("No columns found")
            return []
        
        for col in columns:
            nullable = "NULL" if col['is_nullable'] == 'YES' else "NOT NULL"
            default = f"DEFAULT {col['column_default']}" if col['column_default'] else ""
            print(f"  {col['column_name']}: {col['data_type']} {nullable} {default}")
        
        return columns
        
    except Exception as e:
        print(f"❌ Error checking table structure for {table_name}: {e}")
        return []

def check_table_data(conn, table_name):
    """Check if table has any data"""
    try:
        cursor = conn.cursor()
        cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
        count = cursor.fetchone()[0]
        print(f"  📊 Records: {count}")
        return count
    except Exception as e:
        print(f"  ❌ Error counting records: {e}")
        return 0

def check_payment_system_requirements():
    """Check what's needed for the payment system"""
    print("\n🎯 Payment System Requirements Check:")
    print("=" * 50)
    
    required_tables = [
        'users_registration',
        'payment_transactions', 
        'payments'
    ]
    
    print("Required tables for payment system:")
    for table in required_tables:
        print(f"  ✅ {table}")

def main():
    """Main function to check database"""
    print("🚀 NerdX Database Table Checker")
    print("=" * 50)
    
    # Connect to database
    conn = check_database_connection()
    if not conn:
        print("❌ Cannot proceed without database connection")
        return
    
    try:
        # Check existing tables
        existing_tables = check_existing_tables(conn)
        
        # Check structure of key tables
        key_tables = ['users_registration', 'payment_transactions', 'payments']
        
        for table in key_tables:
            if table in existing_tables:
                print(f"\n📋 Table '{table}' exists - checking structure...")
                columns = check_table_structure(conn, table)
                if columns:
                    check_table_data(conn, table)
            else:
                print(f"\n❌ Table '{table}' is MISSING - needs to be created")
        
        # Check payment system requirements
        check_payment_system_requirements()
        
        # Summary
        print("\n" + "=" * 50)
        print("📊 SUMMARY")
        print("=" * 50)
        
        missing_tables = [table for table in key_tables if table not in existing_tables]
        
        if missing_tables:
            print(f"❌ Missing tables: {', '.join(missing_tables)}")
            print("💡 These tables need to be created for the payment system to work")
        else:
            print("✅ All required tables exist!")
            print("💡 Payment system should work properly")
        
        print(f"\n📁 Total tables in database: {len(existing_tables)}")
        
    except Exception as e:
        print(f"❌ Error during database check: {e}")
        import traceback
        traceback.print_exc()
    
    finally:
        if conn:
            conn.close()
            print("\n🔌 Database connection closed")

if __name__ == "__main__":
    main()
