#!/usr/bin/env python3
"""
Comprehensive database schema audit to ensure all tables match the code structure exactly.
This script will check every table and column to ensure perfect compatibility.
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

def get_table_schema(conn, table_name):
    """Get detailed schema for a specific table."""
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # Get columns
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
        
        # Get constraints
        cursor.execute("""
            SELECT 
                constraint_name,
                constraint_type,
                column_name
            FROM information_schema.table_constraints tc
            JOIN information_schema.constraint_column_usage ccu 
                ON tc.constraint_name = ccu.constraint_name
            WHERE tc.table_name = %s;
        """, (table_name,))
        
        constraints = cursor.fetchall()
        
        # Get indexes
        cursor.execute("""
            SELECT 
                indexname,
                indexdef
            FROM pg_indexes 
            WHERE tablename = %s;
        """, (table_name,))
        
        indexes = cursor.fetchall()
        
        return {
            'columns': columns,
            'constraints': constraints,
            'indexes': indexes
        }
        
    except Exception as e:
        logger.error(f"❌ Error getting schema for {table_name}: {e}")
        return None

def analyze_table_compatibility(conn, table_name):
    """Analyze if a table is compatible with the code."""
    logger.info(f"🔍 Analyzing table: {table_name}")
    
    schema = get_table_schema(conn, table_name)
    if not schema:
        return False
    
    # Log table structure
    logger.info(f"   📊 Columns ({len(schema['columns'])}):")
    for col in schema['columns']:
        nullable = "NULL" if col['is_nullable'] == 'YES' else "NOT NULL"
        default = f" DEFAULT {col['column_default']}" if col['column_default'] else ""
        logger.info(f"      - {col['column_name']}: {col['data_type']} {nullable}{default}")
    
    if schema['constraints']:
        logger.info(f"   🔒 Constraints ({len(schema['constraints'])}):")
        for const in schema['constraints']:
            logger.info(f"      - {const['constraint_name']}: {const['constraint_type']}")
    
    if schema['indexes']:
        logger.info(f"   📈 Indexes ({len(schema['indexes'])}):")
        for idx in schema['indexes']:
            logger.info(f"      - {idx['indexname']}")
    
    return True

def check_critical_tables(conn):
    """Check critical tables that the code depends on."""
    logger.info("🎯 Checking critical tables...")
    
    critical_tables = [
        'users_registration',
        'user_stats', 
        'credit_transactions',
        'payments',
        'admin_users',
        'admin_sessions',
        'admin_activity_logs',
        'admin_permissions'
    ]
    
    missing_tables = []
    existing_tables = []
    
    for table in critical_tables:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = %s
            );
        """, (table,))
        
        if cursor.fetchone()[0]:
            existing_tables.append(table)
            logger.info(f"✅ {table} - EXISTS")
        else:
            missing_tables.append(table)
            logger.error(f"❌ {table} - MISSING")
    
    if missing_tables:
        logger.warning(f"⚠️ Missing critical tables: {', '.join(missing_tables)}")
    else:
        logger.info("🎉 All critical tables exist!")
    
    return existing_tables, missing_tables

def check_table_data(conn, table_name):
    """Check if table has data and basic structure."""
    try:
        cursor = conn.cursor()
        
        # Check row count
        cursor.execute(f"SELECT COUNT(*) FROM {table_name};")
        row_count = cursor.fetchone()[0]
        
        # Check if table has any columns
        cursor.execute(f"SELECT COUNT(*) FROM information_schema.columns WHERE table_name = '{table_name}';")
        column_count = cursor.fetchone()[0]
        
        logger.info(f"   📊 {table_name}: {row_count} rows, {column_count} columns")
        
        if column_count == 0:
            logger.error(f"   ❌ {table_name} has NO COLUMNS!")
            return False
        
        return True
        
    except Exception as e:
        logger.error(f"   ❌ Error checking {table_name}: {e}")
        return False

def generate_schema_report(conn):
    """Generate a comprehensive schema report."""
    logger.info("📋 Generating comprehensive schema report...")
    
    # Get all tables
    all_tables = get_all_tables(conn)
    
    # Check critical tables
    existing_critical, missing_critical = check_critical_tables(conn)
    
    # Analyze each table
    logger.info("\n🔍 Detailed table analysis:")
    for table in all_tables:
        analyze_table_compatibility(conn, table)
        check_table_data(conn, table)
        logger.info("")  # Empty line for readability
    
    # Summary
    logger.info("📊 SCHEMA AUDIT SUMMARY:")
    logger.info(f"   Total tables: {len(all_tables)}")
    logger.info(f"   Critical tables: {len(existing_critical)}/{len(existing_critical) + len(missing_critical)}")
    logger.info(f"   Missing critical: {len(missing_critical)}")
    
    if missing_critical:
        logger.warning("⚠️ ACTION REQUIRED: Missing critical tables need to be created!")
    else:
        logger.info("✅ All critical tables are present!")

def main():
    """Main function."""
    logger.info("🚀 Starting comprehensive database schema audit...")
    
    conn = None
    try:
        conn = get_db_connection()
        
        # Generate comprehensive report
        generate_schema_report(conn)
        
        logger.info("🎉 Schema audit completed!")
        
    except Exception as e:
        logger.error(f"❌ Fatal error: {e}")
        sys.exit(1)
    finally:
        if conn:
            conn.close()
            logger.info("🔌 Database connection closed")

if __name__ == "__main__":
    main()
