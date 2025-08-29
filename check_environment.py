#!/usr/bin/env python3
"""
Check environment variables and database configuration
"""

import os
import sys

def check_environment():
    """Check environment variables and database configuration"""
    print("🔍 Environment Variables Check")
    print("=" * 50)
    
    # Check for database-related environment variables
    db_vars = [
        'DATABASE_URL',
        'SUPABASE_DATABASE_URL', 
        'SUPABASE_URL',
        'SUPABASE_KEY',
        'SUPABASE_ANON_KEY'
    ]
    
    for var in db_vars:
        value = os.getenv(var)
        if value:
            # Mask sensitive parts of the URL
            if 'postgresql://' in value:
                masked = value.replace(value.split('@')[0].split('://')[1], '***:***')
                print(f"✅ {var}: {masked}")
            else:
                print(f"✅ {var}: {value}")
        else:
            print(f"❌ {var}: Not set")
    
    print("\n🔍 Current Working Directory:")
    print(f"   {os.getcwd()}")
    
    print("\n🔍 Python Path:")
    for path in sys.path[:5]:  # Show first 5 paths
        print(f"   {path}")
    
    print("\n🔍 Environment File Check:")
    env_files = ['.env', '.env.local', '.env.development']
    for env_file in env_files:
        if os.path.exists(env_file):
            print(f"✅ {env_file} exists")
        else:
            print(f"❌ {env_file} not found")
    
    print("\n🔍 Database Connection Test:")
    try:
        import psycopg2
        print("✅ psycopg2 imported successfully")
    except ImportError:
        print("❌ psycopg2 not available")
    
    print("\n💡 Recommendations:")
    if not any(os.getenv(var) for var in ['DATABASE_URL', 'SUPABASE_DATABASE_URL']):
        print("   • Set DATABASE_URL or SUPABASE_DATABASE_URL environment variable")
        print("   • Copy env.example to .env and fill in your Supabase details")
        print("   • Or set environment variables directly in your shell")
    
    print("\n📝 Example DATABASE_URL format:")
    print("   postgresql://postgres.your-project-ref:your-password@aws-0-region.pooler.supabase.com:6543/postgres")

if __name__ == "__main__":
    check_environment()
