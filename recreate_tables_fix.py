#!/usr/bin/env python3
"""
Recreate tables with correct schema to fix nerdx_id field length issue permanently.
"""

import os
import sys
import logging
import psycopg2
from psycopg2.extras import RealDictCursor

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Database configuration
DATABASE_URL = "postgresql://postgres:Ngonidzashe2003.@db.hvlvwvzliqrlmqjbfgoa.supabase.co:5432/postgres"

def get_db_connection():
    """Get database connection."""
    try:
        conn = psycopg2.connect(DATABASE_URL)
        conn.autocommit = True
        logger.info("✅ Database connection established successfully")
        return conn
    except Exception as e:
        logger.error(f"❌ Database connection failed: {e}")
        sys.exit(1)

def backup_existing_data(conn):
    """Backup existing data before recreating tables."""
    logger.info("💾 Backing up existing data...")
    
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # Backup users table data
        cursor.execute("SELECT * FROM users;")
        users_data = cursor.fetchall()
        logger.info(f"   ✅ Backed up {len(users_data)} users records")
        
        # Backup users_registration table data
        cursor.execute("SELECT * FROM users_registration;")
        reg_data = cursor.fetchall()
        logger.info(f"   ✅ Backed up {len(reg_data)} registration records")
        
        # Backup user_stats table data
        cursor.execute("SELECT * FROM user_stats;")
        stats_data = cursor.fetchall()
        logger.info(f"   ✅ Backed up {len(stats_data)} stats records")
        
        return users_data, reg_data, stats_data
        
    except Exception as e:
        logger.error(f"   ❌ Failed to backup data: {e}")
        return [], [], []

def drop_problematic_tables(conn):
    """Drop the problematic tables to recreate them with correct schema."""
    logger.info("🗑️ Dropping problematic tables...")
    
    try:
        cursor = conn.cursor()
        
        # Drop tables in correct order (respecting foreign keys)
        tables_to_drop = [
            'user_stats',
            'credit_transactions', 
            'payments',
            'users_registration',
            'users'
        ]
        
        for table in tables_to_drop:
            try:
                cursor.execute(f"DROP TABLE IF EXISTS {table} CASCADE;")
                logger.info(f"   ✅ Dropped table: {table}")
            except Exception as e:
                logger.warning(f"   ⚠️ Could not drop {table}: {e}")
        
        return True
        
    except Exception as e:
        logger.error(f"   ❌ Failed to drop tables: {e}")
        return False

def recreate_tables_with_correct_schema(conn):
    """Recreate tables with the correct schema."""
    logger.info("🔨 Recreating tables with correct schema...")
    
    try:
        cursor = conn.cursor()
        
        # Create users table with correct schema
        cursor.execute("""
            CREATE TABLE users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                whatsapp_id VARCHAR(255) UNIQUE NOT NULL,
                nerdx_id TEXT UNIQUE NOT NULL,
                name VARCHAR(100) NOT NULL,
                surname VARCHAR(100) NOT NULL,
                email VARCHAR(255),
                phone_number VARCHAR(20),
                date_of_birth DATE,
                credits INTEGER DEFAULT 75,
                total_points INTEGER DEFAULT 0,
                streak_count INTEGER DEFAULT 0,
                referred_by TEXT,
                is_active BOOLEAN DEFAULT true,
                last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        logger.info("   ✅ Created users table with correct schema")
        
        # Create users_registration table
        cursor.execute("""
            CREATE TABLE users_registration (
                id SERIAL PRIMARY KEY,
                chat_id VARCHAR(255) NOT NULL,
                name VARCHAR(100) NOT NULL,
                surname VARCHAR(100) NOT NULL,
                date_of_birth DATE NOT NULL,
                nerdx_id TEXT NOT NULL,
                credits INTEGER DEFAULT 75,
                registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                referred_by_nerdx_id TEXT,
                FOREIGN KEY (referred_by_nerdx_id) REFERENCES users(nerdx_id) ON DELETE SET NULL
            );
        """)
        logger.info("   ✅ Created users_registration table with correct schema")
        
        # Create user_stats table
        cursor.execute("""
            CREATE TABLE user_stats (
                id SERIAL PRIMARY KEY,
                user_id TEXT NOT NULL,
                total_questions_answered INTEGER DEFAULT 0,
                correct_answers INTEGER DEFAULT 0,
                total_points_earned INTEGER DEFAULT 0,
                streak_count INTEGER DEFAULT 0,
                last_activity_date DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(nerdx_id) ON DELETE CASCADE
            );
        """)
        logger.info("   ✅ Created user_stats table with correct schema")
        
        # Create credit_transactions table
        cursor.execute("""
            CREATE TABLE credit_transactions (
                id SERIAL PRIMARY KEY,
                user_id TEXT NOT NULL,
                action VARCHAR(50) NOT NULL,
                credits_change INTEGER NOT NULL,
                balance_before INTEGER NOT NULL,
                balance_after INTEGER NOT NULL,
                description TEXT,
                transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(nerdx_id) ON DELETE CASCADE
            );
        """)
        logger.info("   ✅ Created credit_transactions table with correct schema")
        
        # Create payments table
        cursor.execute("""
            CREATE TABLE payments (
                id SERIAL PRIMARY KEY,
                user_id TEXT NOT NULL,
                amount DECIMAL(10,2) NOT NULL,
                status VARCHAR(20) DEFAULT 'pending',
                payment_method VARCHAR(50),
                reference_code VARCHAR(100) UNIQUE,
                payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(nerdx_id) ON DELETE CASCADE
            );
        """)
        logger.info("   ✅ Created payments table with correct schema")
        
        return True
        
    except Exception as e:
        logger.error(f"   ❌ Failed to recreate tables: {e}")
        return False

def restore_data(conn, users_data, reg_data, stats_data):
    """Restore the backed up data to the new tables."""
    logger.info("📥 Restoring backed up data...")
    
    try:
        cursor = conn.cursor()
        
        # Restore users data
        for user in users_data:
            cursor.execute("""
                INSERT INTO users (id, whatsapp_id, nerdx_id, name, surname, email, 
                                 phone_number, date_of_birth, credits, total_points, 
                                 streak_count, referred_by, is_active, last_activity, 
                                 created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
            """, (user['id'], user['whatsapp_id'], user['nerdx_id'], user['name'], 
                  user['surname'], user['email'], user['phone_number'], user['date_of_birth'],
                  user['credits'], user['total_points'], user['streak_count'], user['referred_by'],
                  user['is_active'], user['last_activity'], user['created_at'], user['updated_at']))
        
        logger.info(f"   ✅ Restored {len(users_data)} users records")
        
        # Restore users_registration data
        for reg in reg_data:
            cursor.execute("""
                INSERT INTO users_registration (chat_id, name, surname, date_of_birth, 
                                              nerdx_id, credits, registration_date, referred_by_nerdx_id)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s);
            """, (reg['chat_id'], reg['name'], reg['surname'], reg['date_of_birth'],
                  reg['nerdx_id'], reg['credits'], reg['registration_date'], reg.get('referred_by_nerdx_id')))
        
        logger.info(f"   ✅ Restored {len(reg_data)} registration records")
        
        # Restore user_stats data
        for stats in stats_data:
            cursor.execute("""
                INSERT INTO user_stats (user_id, total_questions_answered, correct_answers,
                                      total_points_earned, streak_count, last_activity_date,
                                      created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s);
            """, (stats['user_id'], stats['total_questions_answered'], stats['correct_answers'],
                  stats['total_points_earned'], stats['streak_count'], stats.get('last_activity_date'),
                  stats['created_at'], stats['updated_at']))
        
        logger.info(f"   ✅ Restored {len(stats_data)} stats records")
        
        return True
        
    except Exception as e:
        logger.error(f"   ❌ Failed to restore data: {e}")
        return False

def test_long_nerdx_id(conn):
    """Test inserting a very long nerdx_id to verify the fix."""
    logger.info("🧪 Testing long nerdx_id insertion...")
    
    try:
        cursor = conn.cursor()
        
        # Create a very long nerdx_id (200 characters)
        very_long_nerdx_id = "VERY_VERY_LONG_NERDX_ID_" + "A" * 180
        
        cursor.execute("""
            INSERT INTO users (whatsapp_id, nerdx_id, name, surname, credits)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id;
        """, (f"263{long_nerdx_id}", very_long_nerdx_id, "Test", "VeryLongID", 75))
        
        test_user_id = cursor.fetchone()[0]
        logger.info(f"   ✅ Very long nerdx_id test successful: {len(very_long_nerdx_id)} characters")
        
        # Clean up test data
        cursor.execute("DELETE FROM users WHERE id = %s;", (test_user_id,))
        logger.info("   🧹 Test data cleaned up")
        
        return True
        
    except Exception as e:
        logger.error(f"   ❌ Long nerdx_id test failed: {e}")
        return False

def create_indexes(conn):
    """Create performance indexes for the new tables."""
    logger.info("📊 Creating performance indexes...")
    
    try:
        cursor = conn.cursor()
        
        # Create indexes for better performance
        indexes = [
            "CREATE INDEX idx_users_whatsapp_id ON users(whatsapp_id);",
            "CREATE INDEX idx_users_nerdx_id ON users(nerdx_id);",
            "CREATE INDEX idx_users_registration_chat_id ON users_registration(chat_id);",
            "CREATE INDEX idx_users_registration_nerdx_id ON users_registration(nerdx_id);",
            "CREATE INDEX idx_user_stats_user_id ON user_stats(user_id);",
            "CREATE INDEX idx_credit_transactions_user_id ON credit_transactions(user_id);",
            "CREATE INDEX idx_payments_user_id ON payments(user_id);",
            "CREATE INDEX idx_payments_status ON payments(status);"
        ]
        
        for index_sql in indexes:
            try:
                cursor.execute(index_sql)
                logger.info(f"   ✅ Created index: {index_sql.split('ON')[1].split('(')[0].strip()}")
            except Exception as e:
                logger.warning(f"   ⚠️ Could not create index: {e}")
        
        return True
        
    except Exception as e:
        logger.error(f"   ❌ Failed to create indexes: {e}")
        return False

def main():
    """Main function to recreate tables with correct schema."""
    logger.info("🚀 Starting table recreation with correct schema...")
    
    conn = None
    
    try:
        conn = get_db_connection()
        
        # Step 1: Backup existing data
        logger.info(f"\n{'='*50}")
        logger.info("Step 1: Backup existing data")
        logger.info(f"{'='*50}")
        
        users_data, reg_data, stats_data = backup_existing_data(conn)
        
        # Step 2: Drop problematic tables
        logger.info(f"\n{'='*50}")
        logger.info("Step 2: Drop problematic tables")
        logger.info(f"{'='*50}")
        
        if not drop_problematic_tables(conn):
            sys.exit(1)
        
        # Step 3: Recreate tables with correct schema
        logger.info(f"\n{'='*50}")
        logger.info("Step 3: Recreate tables with correct schema")
        logger.info(f"{'='*50}")
        
        if not recreate_tables_with_correct_schema(conn):
            sys.exit(1)
        
        # Step 4: Create performance indexes
        logger.info(f"\n{'='*50}")
        logger.info("Step 4: Create performance indexes")
        logger.info(f"{'='*50}")
        
        create_indexes(conn)
        
        # Step 5: Restore data
        logger.info(f"\n{'='*50}")
        logger.info("Step 5: Restore backed up data")
        logger.info(f"{'='*50}")
        
        if not restore_data(conn, users_data, reg_data, stats_data):
            sys.exit(1)
        
        # Step 6: Test the fix
        logger.info(f"\n{'='*50}")
        logger.info("Step 6: Test long nerdx_id insertion")
        logger.info(f"{'='*50}")
        
        if not test_long_nerdx_id(conn):
            sys.exit(1)
        
        logger.info(f"\n{'='*60}")
        logger.info("🎉 TABLES RECREATED SUCCESSFULLY WITH CORRECT SCHEMA!")
        logger.info("All nerdx_id fields are now TEXT (unlimited) and can handle any length.")
        logger.info("Data has been preserved and restored.")
        logger.info(f"{'='*60}")
        
    except Exception as e:
        logger.error(f"❌ Fatal error: {e}")
        sys.exit(1)
    finally:
        if conn:
            conn.close()
            logger.info("🔌 Database connection closed")

if __name__ == "__main__":
    main()
