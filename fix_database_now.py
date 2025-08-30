#!/usr/bin/env python3
"""
Fix NerdX Bot database issues directly using Supabase API
"""
import requests
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Supabase configuration
SUPABASE_URL = "https://hvlvwvzliqrlmqjbfgoa.supabase.co"
SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2bHZ3dnpsaXFybG1xamJmZ29hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjM4MjEyOSwiZXhwIjoyMDY3OTU4MTI5fQ.p4qtbG42XUiN8sXH3phmUMwwQPo1v-StjUkwUZOR4Bg"

def execute_sql(sql_query):
    """Execute SQL query using Supabase REST API"""
    headers = {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
        "Content-Type": "application/json"
    }
    
    # Use the SQL endpoint
    url = f"{SUPABASE_URL}/rest/v1/rpc/exec_sql"
    
    data = {
        "query": sql_query
    }
    
    try:
        response = requests.post(url, headers=headers, json=data, timeout=30)
        if response.status_code == 200:
            return response.json()
        else:
            logger.error(f"SQL execution failed: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        logger.error(f"Error executing SQL: {e}")
        return None

def create_xp_transactions_table():
    """Create the missing xp_transactions table"""
    logger.info("🔨 Creating xp_transactions table...")
    
    sql = """
    CREATE TABLE IF NOT EXISTS xp_transactions (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        activity_type VARCHAR(50) NOT NULL,
        xp_earned INTEGER NOT NULL,
        xp_before INTEGER NOT NULL,
        xp_after INTEGER NOT NULL,
        level_before INTEGER NOT NULL,
        level_after INTEGER NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """
    
    result = execute_sql(sql)
    if result:
        logger.info("✅ xp_transactions table created successfully")
        
        # Create indexes
        index_sql = """
        CREATE INDEX IF NOT EXISTS idx_xp_transactions_user_id ON xp_transactions(user_id);
        CREATE INDEX IF NOT EXISTS idx_xp_transactions_created_at ON xp_transactions(created_at);
        """
        execute_sql(index_sql)
        
        # Enable RLS and create policy
        rls_sql = """
        ALTER TABLE xp_transactions ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "XP transactions - allow all operations" ON xp_transactions
            FOR ALL USING (true) WITH CHECK (true);
        """
        execute_sql(rls_sql)
        
        return True
    else:
        logger.error("❌ Failed to create xp_transactions table")
        return False

def create_admin_user():
    """Create the default admin user"""
    logger.info("👤 Creating default admin user...")
    
    # First check if admin user already exists
    check_sql = "SELECT id FROM admin_users WHERE email = 'admin@nerdx.com';"
    result = execute_sql(check_sql)
    
    if result and len(result) > 0:
        logger.info("✅ Admin user already exists")
        return True
    
    # Create admin user
    sql = """
    INSERT INTO admin_users (email, password_hash, password_salt, first_name, last_name, role, is_active)
    VALUES (
        'admin@nerdx.com',
        '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
        'default_salt_change_me',
        'Super',
        'Admin',
        'super_admin',
        true
    );
    """
    
    result = execute_sql(sql)
    if result:
        logger.info("✅ Admin user created successfully")
        return True
    else:
        logger.error("❌ Failed to create admin user")
        return False

def test_table_access():
    """Test if the new table is accessible"""
    logger.info("🧪 Testing table access...")
    
    try:
        # Test xp_transactions table
        headers = {
            "apikey": SUPABASE_SERVICE_ROLE_KEY,
            "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
            "Content-Type": "application/json"
        }
        
        url = f"{SUPABASE_URL}/rest/v1/xp_transactions?select=count&limit=1"
        response = requests.get(url, headers=headers, timeout=30)
        
        if response.status_code == 200:
            logger.info("✅ xp_transactions table is accessible")
            return True
        else:
            logger.error(f"❌ xp_transactions table not accessible: {response.status_code}")
            return False
            
    except Exception as e:
        logger.error(f"❌ Error testing table access: {e}")
        return False

def main():
    """Main function to fix database issues"""
    logger.info("🚀 Starting database fix...")
    
    # Step 1: Create missing table
    table_created = create_xp_transactions_table()
    
    # Step 2: Create admin user
    admin_created = create_admin_user()
    
    # Step 3: Test access
    access_ok = test_table_access()
    
    # Summary
    logger.info("\n" + "="*50)
    logger.info("📋 FIX RESULTS SUMMARY")
    logger.info("="*50)
    logger.info(f"🔨 Table Creation: {'✅ SUCCESS' if table_created else '❌ FAILED'}")
    logger.info(f"👤 Admin User: {'✅ SUCCESS' if admin_created else '❌ FAILED'}")
    logger.info(f"🧪 Table Access: {'✅ SUCCESS' if access_ok else '❌ FAILED'}")
    logger.info("="*50)
    
    if table_created and admin_created and access_ok:
        logger.info("🎉 Database fix completed successfully!")
        logger.info("\n🔐 Dashboard Login:")
        logger.info("   Email: admin@nerdx.com")
        logger.info("   Password: admin123")
        logger.info("   ⚠️ Change password after first login!")
    else:
        logger.error("❌ Some fixes failed - check the logs above")
    
    logger.info("\n🏁 Database fix completed!")

if __name__ == "__main__":
    main()



