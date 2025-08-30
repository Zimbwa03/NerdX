#!/usr/bin/env python3
"""
Check Table Structures for NerdX Bot Dashboard
This script checks the actual structure of all dashboard tables
"""

import psycopg2
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Database connection string
DATABASE_URL = "postgresql://postgres:Ngonidzashe2003.@db.hvlvwvzliqrlmqjbfgoa.supabase.co:5432/postgres"

def check_table_structures():
    """Check the actual structure of all dashboard tables"""
    
    try:
        # Connect to database
        conn = psycopg2.connect(DATABASE_URL)
        conn.autocommit = True
        cursor = conn.cursor()
        
        logger.info("🔍 CHECKING DASHBOARD TABLE STRUCTURES")
        logger.info("="*60)
        
        # List of tables to check
        tables = [
            'daily_user_activity',
            'user_engagement_metrics', 
            'subject_usage_analytics',
            'feature_usage_analytics',
            'credit_transactions',
            'broadcast_logs'
        ]
        
        for table in tables:
            try:
                logger.info(f"\n📋 Table: {table}")
                logger.info("-" * 40)
                
                # Get table structure
                cursor.execute(f"""
                    SELECT column_name, data_type, is_nullable, column_default
                    FROM information_schema.columns 
                    WHERE table_name = '{table}' 
                    ORDER BY ordinal_position
                """)
                
                columns = cursor.fetchall()
                
                if columns:
                    for col in columns:
                        col_name, data_type, nullable, default_val = col
                        default_str = f" DEFAULT {default_val}" if default_val else ""
                        nullable_str = "NULL" if nullable == "YES" else "NOT NULL"
                        logger.info(f"  • {col_name}: {data_type} {nullable_str}{default_str}")
                else:
                    logger.info(f"  ❌ Table {table} not found or empty")
                
                # Get sample data
                try:
                    cursor.execute(f"SELECT COUNT(*) FROM {table}")
                    count = cursor.fetchone()[0]
                    logger.info(f"  📊 Records: {count}")
                    
                    if count > 0:
                        cursor.execute(f"SELECT * FROM {table} LIMIT 1")
                        sample = cursor.fetchone()
                        logger.info(f"  📝 Sample row: {sample}")
                except Exception as e:
                    logger.error(f"  ❌ Error checking data: {e}")
                    
            except Exception as e:
                logger.error(f"❌ Error checking table {table}: {e}")
        
        cursor.close()
        conn.close()
        
        logger.info("\n🎉 Table structure check completed!")
        
    except Exception as e:
        logger.error(f"❌ Table structure check failed: {e}")

if __name__ == "__main__":
    check_table_structures()

