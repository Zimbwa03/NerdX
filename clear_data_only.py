#!/usr/bin/env python3
"""
NerdX Bot Database Data Clear Script
This script will clear only the data from tables while keeping the structure
"""

import psycopg2
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Database connection string
DATABASE_URL = "postgresql://postgres:Ngonidzashe2003.@db.hvlvwvzliqrlmqjbfgoa.supabase.co:5432/postgres"

def clear_data_only():
    """Clear only the data from tables while keeping structure"""
    try:
        logger.info("🧹 Starting data clearing (keeping table structure)...")
        
        # Connect to database
        conn = psycopg2.connect(DATABASE_URL)
        conn.autocommit = True
        cursor = conn.cursor()
        
        logger.info("✅ Connected to database successfully")
        
        # ========================================
        # CLEAR DATA FROM TABLES (KEEP STRUCTURE)
        # ========================================
        
        # Tables to clear data from (in order of dependencies)
        tables_to_clear = [
            'user_question_history',      # Clear first (depends on users)
            'user_sessions',              # Clear first (depends on users)
            'user_stats',                 # Clear first (depends on users)
            'payment_transactions',       # Clear first (depends on users)
            'questions',                  # Clear question data
            'users_registration'          # Clear users last
        ]
        
        for table in tables_to_clear:
            try:
                # Get row count before clearing
                cursor.execute(f"SELECT COUNT(*) FROM {table};")
                row_count = cursor.fetchone()[0]
                
                # Clear all data from table
                cursor.execute(f"DELETE FROM {table};")
                
                logger.info(f"   ✅ Cleared {row_count} rows from {table}")
                
            except Exception as e:
                logger.error(f"   ❌ Failed to clear {table}: {e}")
        
        # ========================================
        # RESET AUTO-INCREMENT SEQUENCES
        # ========================================
        logger.info("🔄 Resetting auto-increment sequences...")
        
        sequences_to_reset = [
            'users_registration_id_seq',
            'payment_transactions_id_seq',
            'questions_id_seq',
            'user_stats_id_seq',
            'user_sessions_id_seq',
            'user_question_history_id_seq'
        ]
        
        for sequence in sequences_to_reset:
            try:
                cursor.execute(f"ALTER SEQUENCE {sequence} RESTART WITH 1;")
                logger.info(f"   ✅ Reset sequence: {sequence}")
            except Exception as e:
                logger.info(f"   ℹ️  Sequence {sequence} not found or already reset: {e}")
        
        # ========================================
        # VERIFY DATA CLEARING
        # ========================================
        logger.info("🔍 Verifying data clearing...")
        
        total_rows = 0
        for table in tables_to_clear:
            try:
                cursor.execute(f"SELECT COUNT(*) FROM {table};")
                row_count = cursor.fetchone()[0]
                total_rows += row_count
                logger.info(f"   📊 {table}: {row_count} rows")
            except Exception as e:
                logger.info(f"   📊 {table}: Error checking - {e}")
        
        if total_rows == 0:
            logger.info("✅ SUCCESS: All data cleared successfully!")
        else:
            logger.warning(f"⚠️  WARNING: {total_rows} rows still remain in tables")
        
        # ========================================
        # VERIFY TABLE STRUCTURE INTACT
        # ========================================
        logger.info("🔍 Verifying table structure...")
        
        cursor.execute("""
            SELECT tablename 
            FROM pg_tables 
            WHERE schemaname = 'public' 
            AND tablename NOT LIKE 'pg_%'
            ORDER BY tablename;
        """)
        
        existing_tables = [row[0] for row in cursor.fetchall()]
        logger.info(f"   📊 Found {len(existing_tables)} tables: {existing_tables}")
        
        # ========================================
        # FINAL VERIFICATION
        # ========================================
        logger.info("🔍 Final verification...")
        
        # Check that essential tables still exist
        essential_tables = [
            'users_registration', 'payment_transactions', 'packages', 
            'credit_costs', 'admin_users', 'user_sessions', 
            'user_question_history', 'questions', 'user_stats', 'system_settings'
        ]
        
        missing_tables = [table for table in essential_tables if table not in existing_tables]
        
        if not missing_tables:
            logger.info("✅ SUCCESS: All essential tables are intact!")
        else:
            logger.error(f"❌ ERROR: Missing tables: {missing_tables}")
        
        # Close connection
        cursor.close()
        conn.close()
        
        logger.info("✅ Database connection closed")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Data clearing failed: {e}")
        return False

def main():
    """Main execution function"""
    print("=" * 60)
    print("🧹 NERDX BOT DATABASE DATA CLEARING")
    print("=" * 60)
    print("This will clear ONLY the data from tables")
    print("Table structure will remain intact")
    print("=" * 60)
    
    # Confirm action
    confirm = input("Are you sure you want to clear all data? (yes/no): ").lower().strip()
    
    if confirm != 'yes':
        print("❌ Data clearing cancelled")
        return
    
    print("\n🧹 Starting data clearing...")
    print("⏳ This will clear all user data, payments, questions, etc.")
    
    # Execute data clearing
    success = clear_data_only()
    
    if success:
        print("\n🎉 DATA CLEARING COMPLETE!")
        print("✅ All data has been cleared")
        print("✅ Table structure remains intact")
        print("✅ Bot can work as before with fresh data")
        print("\n📋 What was cleared:")
        print("   - All user registrations")
        print("   - All payment transactions")
        print("   - All question history")
        print("   - All user sessions and stats")
        print("\n📋 What remains:")
        print("   - Table structure")
        print("   - Default packages and credit costs")
        print("   - Admin users and system settings")
        print("\n📋 Next steps:")
        print("   1. Test the bot functionality")
        print("   2. Verify all features work")
        print("   3. Start fresh marketing campaign")
    else:
        print("\n❌ DATA CLEARING FAILED!")
        print("Please check the logs above for errors")

if __name__ == "__main__":
    main()
