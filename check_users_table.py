#!/usr/bin/env python3
"""
Check Users Table Structure for NerdX Bot
This script checks the actual structure of the users table
"""

import psycopg2
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Database connection string
DATABASE_URL = "postgresql://postgres:Ngonidzashe2003.@db.hvlvwvzliqrlmqjbfgoa.supabase.co:5432/postgres"

def check_users_table():
    """Check the actual structure of the users table"""
    
    try:
        # Connect to database
        conn = psycopg2.connect(DATABASE_URL)
        conn.autocommit = True
        cursor = conn.cursor()
        
        logger.info("🔍 CHECKING USERS TABLE STRUCTURE")
        logger.info("="*60)
        
        # Check users table structure
        logger.info("\n📋 USERS TABLE STRUCTURE:")
        cursor.execute("""
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_name = 'users' 
            ORDER BY ordinal_position
        """)
        
        columns = cursor.fetchall()
        for col in columns:
            col_name, data_type, nullable, default_val = col
            default_str = f" DEFAULT {default_val}" if default_val else ""
            nullable_str = "NULL" if nullable == "YES" else "NOT NULL"
            logger.info(f"  • {col_name}: {data_type} {nullable_str}{default_str}")
        
        # Check users_registration table structure
        logger.info("\n📋 USERS_REGISTRATION TABLE STRUCTURE:")
        cursor.execute("""
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_name = 'users_registration' 
            ORDER BY ordinal_position
        """)
        
        reg_columns = cursor.fetchall()
        for col in reg_columns:
            col_name, data_type, nullable, default_val = col
            default_str = f" DEFAULT {default_val}" if default_val else ""
            nullable_str = "NULL" if nullable == "YES" else "NOT NULL"
            logger.info(f"  • {col_name}: {data_type} {nullable_str}{default_str}")
        
        # Check foreign key constraint details
        logger.info("\n🔗 FOREIGN KEY CONSTRAINT DETAILS:")
        cursor.execute("""
            SELECT 
                tc.constraint_name, 
                tc.table_name, 
                kcu.column_name, 
                ccu.table_name AS foreign_table_name,
                ccu.column_name AS foreign_column_name 
            FROM 
                information_schema.table_constraints AS tc 
                JOIN information_schema.key_column_usage AS kcu
                  ON tc.constraint_name = kcu.constraint_name
                  AND tc.table_schema = kcu.table_schema
                JOIN information_schema.constraint_column_usage AS ccu
                  ON ccu.constraint_name = tc.constraint_name
                  AND ccu.table_schema = tc.table_schema
            WHERE tc.constraint_type = 'FOREIGN KEY' 
            AND tc.table_name = 'user_stats'
        """)
        
        constraints = cursor.fetchall()
        for constraint in constraints:
            logger.info(f"  • {constraint[0]}: {constraint[1]}.{constraint[2]} -> {constraint[3]}.{constraint[4]}")
        
        # Check sample data from both tables
        logger.info("\n📊 SAMPLE DATA FROM USERS TABLE:")
        cursor.execute("SELECT * FROM users LIMIT 3")
        users_sample = cursor.fetchall()
        for user in users_sample:
            logger.info(f"  • {user}")
        
        logger.info("\n📊 SAMPLE DATA FROM USERS_REGISTRATION TABLE:")
        cursor.execute("SELECT * FROM users_registration LIMIT 3")
        reg_sample = cursor.fetchall()
        for user in reg_sample:
            logger.info(f"  • {user}")
        
        cursor.close()
        conn.close()
        
        logger.info("\n🎉 Users table structure check completed!")
        
    except Exception as e:
        logger.error(f"❌ Users table check failed: {e}")

if __name__ == "__main__":
    check_users_table()

