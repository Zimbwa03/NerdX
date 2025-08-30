#!/usr/bin/env python3
"""
Inspect Database - Check current database state
"""

import psycopg2
import logging

# Database connection
DATABASE_URL = "postgresql://postgres.hvlvwvzliqrlmqjbfgoa:Ngonidzashe2003.@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def connect_to_database():
    """Connect to the database"""
    try:
        conn = psycopg2.connect(DATABASE_URL)
        conn.autocommit = True
        logger.info("✅ Database connection successful")
        return conn
    except Exception as e:
        logger.error(f"❌ Database connection failed: {e}")
        return None

def inspect_database(conn):
    """Inspect the current database state"""
    try:
        cursor = conn.cursor()
        
        # Get all tables
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name
        """)
        
        tables = cursor.fetchall()
        logger.info(f"📋 Found {len(tables)} tables:")
        
        for table in tables:
            table_name = table[0]
            logger.info(f"  - {table_name}")
            
            # Get table structure
            cursor.execute(f"""
                SELECT column_name, data_type, is_nullable, column_default
                FROM information_schema.columns 
                WHERE table_name = '{table_name}'
                ORDER BY ordinal_position
            """)
            
            columns = cursor.fetchall()
            logger.info(f"    Columns ({len(columns)}):")
            
            for col in columns:
                col_name, data_type, nullable, default_val = col
                nullable_str = "NULL" if nullable == "YES" else "NOT NULL"
                default_str = f" DEFAULT {default_val}" if default_val else ""
                logger.info(f"      - {col_name}: {data_type} {nullable_str}{default_str}")
            
            # Get row count
            try:
                cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
                count = cursor.fetchone()[0]
                logger.info(f"    Rows: {count}")
            except Exception as e:
                logger.info(f"    Rows: Error counting - {e}")
            
            logger.info("")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Error inspecting database: {e}")
        return False

def main():
    """Main function"""
    logger.info("🔍 Starting Database Inspection...")
    
    # Connect to database
    conn = connect_to_database()
    if not conn:
        logger.error("❌ Cannot proceed without database connection")
        return False
    
    try:
        # Inspect database
        if not inspect_database(conn):
            logger.error("❌ Failed to inspect database")
            return False
        
        logger.info("✅ Database inspection completed successfully!")
        return True
        
    except Exception as e:
        logger.error(f"❌ Unexpected error: {e}")
        return False
    
    finally:
        if conn:
            conn.close()
            logger.info("Database connection closed")

if __name__ == "__main__":
    main()
