#!/usr/bin/env python3
"""
NerdX Bot Database Complete Reset Script
This script will completely reset the database to start fresh for marketing
WARNING: This will DELETE ALL DATA permanently!
"""

import psycopg2
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Database connection string
DATABASE_URL = "postgresql://postgres:Ngonidzashe2003.@db.hvlvwvzliqrlmqjbfgoa.supabase.co:5432/postgres"

def reset_database():
    """Complete database reset - removes all tables and data"""
    try:
        logger.info("🔄 Starting complete database reset...")
        
        # Connect to database
        conn = psycopg2.connect(DATABASE_URL)
        conn.autocommit = True  # Enable autocommit for DDL operations
        cursor = conn.cursor()
        
        logger.info("✅ Connected to database successfully")
        
        # ========================================
        # STEP 1: DISABLE ROW LEVEL SECURITY (RLS)
        # ========================================
        logger.info("📋 Step 1: Disabling Row Level Security...")
        
        rls_tables = [
            'users_registration', 'payment_transactions', 'packages', 
            'credit_costs', 'user_sessions', 'user_question_history',
            'registration_sessions', 'rate_limits', 'questions',
            'user_stats', 'admin_users', 'system_settings'
        ]
        
        for table in rls_tables:
            try:
                cursor.execute(f"ALTER TABLE IF EXISTS {table} DISABLE ROW LEVEL SECURITY;")
                logger.info(f"   ✅ Disabled RLS for {table}")
            except Exception as e:
                logger.info(f"   ℹ️  {table} RLS already disabled or table doesn't exist: {e}")
        
        # ========================================
        # STEP 2: DROP ALL EXISTING TABLES
        # ========================================
        logger.info("🗑️  Step 2: Dropping all existing tables...")
        
        # Get all existing tables
        cursor.execute("""
            SELECT tablename 
            FROM pg_tables 
            WHERE schemaname = 'public' 
            AND tablename NOT LIKE 'pg_%'
            ORDER BY tablename;
        """)
        
        existing_tables = [row[0] for row in cursor.fetchall()]
        logger.info(f"   📊 Found {len(existing_tables)} existing tables: {existing_tables}")
        
        # Drop all tables
        for table in existing_tables:
            try:
                cursor.execute(f"DROP TABLE IF EXISTS {table} CASCADE;")
                logger.info(f"   ✅ Dropped table: {table}")
            except Exception as e:
                logger.error(f"   ❌ Failed to drop {table}: {e}")
        
        # ========================================
        # STEP 3: DROP ALL SEQUENCES
        # ========================================
        logger.info("🔄 Step 3: Dropping all sequences...")
        
        cursor.execute("""
            SELECT sequencename 
            FROM pg_sequences 
            WHERE schemaname = 'public';
        """)
        
        existing_sequences = [row[0] for row in cursor.fetchall()]
        logger.info(f"   📊 Found {len(existing_sequences)} existing sequences: {existing_sequences}")
        
        for sequence in existing_sequences:
            try:
                cursor.execute(f"DROP SEQUENCE IF EXISTS {sequence} CASCADE;")
                logger.info(f"   ✅ Dropped sequence: {sequence}")
            except Exception as e:
                logger.error(f"   ❌ Failed to drop sequence {sequence}: {e}")
        
        # ========================================
        # STEP 4: VERIFY CLEAN STATE
        # ========================================
        logger.info("🔍 Step 4: Verifying clean state...")
        
        # Check remaining tables
        cursor.execute("""
            SELECT tablename 
            FROM pg_tables 
            WHERE schemaname = 'public' 
            AND tablename NOT LIKE 'pg_%';
        """)
        
        remaining_tables = cursor.fetchall()
        
        # Check remaining sequences
        cursor.execute("""
            SELECT sequencename 
            FROM pg_sequences 
            WHERE schemaname = 'public';
        """)
        
        remaining_sequences = cursor.fetchall()
        
        if not remaining_tables and not remaining_sequences:
            logger.info("✅ SUCCESS: Database completely reset - all tables and sequences removed!")
        else:
            logger.warning(f"⚠️  WARNING: Some objects still remain:")
            if remaining_tables:
                logger.warning(f"   Tables: {[row[0] for row in remaining_tables]}")
            if remaining_sequences:
                logger.warning(f"   Sequences: {[row[0] for row in remaining_sequences]}")
        
        # ========================================
        # STEP 5: RESET DATABASE STATISTICS
        # ========================================
        logger.info("📊 Step 5: Resetting database statistics...")
        cursor.execute("ANALYZE;")
        logger.info("   ✅ Database statistics reset")
        
        # ========================================
        # STEP 6: FINAL VERIFICATION
        # ========================================
        logger.info("🔍 Step 6: Final verification...")
        
        cursor.execute("""
            SELECT 
                COUNT(*) as table_count,
                (SELECT COUNT(*) FROM pg_sequences WHERE schemaname = 'public') as sequence_count
            FROM pg_tables 
            WHERE schemaname = 'public' 
            AND tablename NOT LIKE 'pg_%';
        """)
        
        result = cursor.fetchone()
        table_count, sequence_count = result
        
        logger.info(f"   📊 Final state: {table_count} tables, {sequence_count} sequences")
        
        if table_count == 0 and sequence_count == 0:
            logger.info("🎉 DATABASE RESET COMPLETE! Ready for fresh start!")
        else:
            logger.warning("⚠️  Some objects remain - manual cleanup may be needed")
        
        # Close connection
        cursor.close()
        conn.close()
        
        logger.info("✅ Database connection closed")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Database reset failed: {e}")
        return False

def main():
    """Main execution function"""
    print("=" * 60)
    print("🚨 NERDX BOT DATABASE COMPLETE RESET")
    print("=" * 60)
    print("⚠️  WARNING: This will DELETE ALL DATA permanently!")
    print("⚠️  This action cannot be undone!")
    print("=" * 60)
    
    # Confirm action
    confirm = input("Are you absolutely sure you want to reset the database? (yes/no): ").lower().strip()
    
    if confirm != 'yes':
        print("❌ Database reset cancelled")
        return
    
    print("\n🔄 Starting database reset...")
    print("⏳ This may take a few minutes...")
    
    # Execute reset
    success = reset_database()
    
    if success:
        print("\n🎉 DATABASE RESET COMPLETE!")
        print("✅ All data has been permanently removed")
        print("✅ Database is now clean and ready for fresh marketing")
        print("\n📋 Next steps:")
        print("   1. Run table creation scripts to set up fresh structure")
        print("   2. Configure initial settings and credit costs")
        print("   3. Start fresh marketing campaign")
        print("   4. Monitor new user registrations and growth")
    else:
        print("\n❌ DATABASE RESET FAILED!")
        print("Please check the logs above for errors")

if __name__ == "__main__":
    main()
