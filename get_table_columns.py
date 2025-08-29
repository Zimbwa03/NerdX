#!/usr/bin/env python3
"""
Simple script to get the exact column structure of each table.
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

def get_all_tables(conn):
    """Get all tables in the database."""
    try:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
            ORDER BY table_name;
        """)
        
        tables = [row[0] for row in cursor.fetchall()]
        logger.info(f"📋 Found {len(tables)} tables in database")
        return tables
        
    except Exception as e:
        logger.error(f"❌ Error getting tables: {e}")
        return []

def get_table_columns(conn, table_name):
    """Get columns for a specific table."""
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        cursor.execute("""
            SELECT 
                column_name, 
                data_type, 
                is_nullable,
                column_default,
                character_maximum_length,
                numeric_precision,
                numeric_scale
            FROM information_schema.columns 
            WHERE table_name = %s 
            ORDER BY ordinal_position;
        """, (table_name,))
        
        columns = cursor.fetchall()
        return columns
        
    except Exception as e:
        logger.error(f"❌ Error getting columns for {table_name}: {e}")
        return []

def analyze_table_structure(conn, table_name):
    """Analyze table structure."""
    logger.info(f"🔍 Table: {table_name}")
    
    columns = get_table_columns(conn, table_name)
    if not columns:
        return
    
    # Get row count
    try:
        cursor = conn.cursor()
        cursor.execute(f"SELECT COUNT(*) FROM {table_name};")
        row_count = cursor.fetchone()[0]
        logger.info(f"   📊 Rows: {row_count}")
    except:
        logger.info(f"   📊 Rows: Error getting count")
    
    # Show columns
    logger.info(f"   📋 Columns ({len(columns)}):")
    for col in columns:
        nullable = "NULL" if col['is_nullable'] == 'YES' else "NOT NULL"
        default = f" DEFAULT {col['column_default']}" if col['column_default'] else ""
        length = f"({col['character_maximum_length']})" if col['character_maximum_length'] else ""
        
        col_type = col['data_type']
        if col['numeric_precision'] and col['numeric_scale']:
            col_type = f"{col['data_type']}({col['numeric_precision']},{col['numeric_scale']})"
        elif col['numeric_precision']:
            col_type = f"{col['data_type']}({col['numeric_precision']})"
        
        logger.info(f"      - {col['column_name']}: {col_type}{length} {nullable}{default}")
    
    logger.info("")  # Empty line for readability

def main():
    """Main function."""
    logger.info("🚀 Getting table column structures...")
    
    conn = None
    try:
        conn = get_db_connection()
        
        # Get all tables
        tables = get_all_tables(conn)
        
        # Analyze each table
        for table in tables:
            analyze_table_structure(conn, table)
        
        logger.info("🎉 Table structure analysis completed!")
        
    except Exception as e:
        logger.error(f"❌ Fatal error: {e}")
        sys.exit(1)
    finally:
        if conn:
            conn.close()
            logger.info("🔌 Database connection closed")

if __name__ == "__main__":
    main()
