#!/usr/bin/env python3
print("Starting database check...")

try:
    import psycopg2
    print("✅ psycopg2 imported successfully")
    
    # Database connection string
    DATABASE_URL = "postgresql://postgres:Ngonidzashe2003.@db.hvlvwvzliqrlmqjbfgoa.supabase.co:5432/postgres"
    
    print("🔍 Connecting to database...")
    conn = psycopg2.connect(DATABASE_URL)
    print("✅ Database connection successful!")
    
    # Check existing tables
    cursor = conn.cursor()
    cursor.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name
    """)
    
    tables = cursor.fetchall()
    print(f"\n📋 Found {len(tables)} tables:")
    
    for table in tables:
        print(f"  📁 {table[0]}")
    
    # Check specific tables we need
    required_tables = ['users_registration', 'payment_transactions', 'payments']
    
    print(f"\n🎯 Checking required tables:")
    for table in required_tables:
        if any(table in t[0] for t in tables):
            print(f"  ✅ {table} - EXISTS")
        else:
            print(f"  ❌ {table} - MISSING")
    
    # Check users_registration structure if it exists
    if any('users_registration' in t[0] for t in tables):
        print(f"\n🔍 Checking users_registration structure:")
        cursor.execute("""
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'users_registration' 
            ORDER BY ordinal_position
        """)
        columns = cursor.fetchall()
        for col in columns:
            print(f"  📝 {col[0]}: {col[1]}")
    
    conn.close()
    print("\n✅ Database check completed!")
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
