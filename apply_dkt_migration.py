"""
Apply Deep Knowledge Tracing Database Migration
Run this to set up DKT tables in Supabase
"""

import os
import logging
from pathlib import Path

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def run_migration():
    """Apply DKT migration to Supabase database"""
    try:
        # Read migration SQL
        migration_path = Path(__file__).parent / 'database' / 'migrations' / '001_add_interaction_tracking.sql'
        
        if not migration_path.exists():
            logger.error(f"Migration file not found: {migration_path}")
            return False
        
        with open(migration_path, 'r', encoding='utf-8') as f:
            migration_sql = f.read()
        
        logger.info("Migration SQL loaded successfully")
        
        # Connect to Supabase
        supabase_url = os.getenv('SUPABASE_URL')
        supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
        
        if not supabase_url or not supabase_key:
            logger.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables")
            return False
        
        # Use psycopg2 to execute SQL directly
        try:
            import psycopg2
            from urllib.parse import urlparse
            
            # Parse Supabase URL to get database connection info
            # Supabase provides a direct postgres connection
            # Format: postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
            
            # Get database URL from environment
            database_url = os.getenv('DATABASE_URL')
            
            if not database_url:
                logger.warning("DATABASE_URL not set. Using Supabase REST API fallback.")
                return run_migration_via_rest_api(migration_sql, supabase_url, supabase_key)
            
            logger.info("Connecting to Supabase PostgreSQL...")
            
            conn = psycopg2.connect(database_url)
            conn.autocommit = True
            
            cursor = conn.cursor()
            
            # Execute migration SQL
            logger.info("Executing migration...")
            cursor.execute(migration_sql)
            
            logger.info("✅ Migration applied successfully!")
            
            # Verify tables were created
            cursor.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name IN (
                    'student_interactions', 
                    'student_knowledge_state', 
                    'skills_taxonomy', 
                    'misconceptions',
                    'daily_review_queue',
                    'offline_sync_queue'
                )
                ORDER BY table_name
            """)
            
            tables = cursor.fetchall()
            logger.info(f"Created tables: {[t[0] for t in tables]}")
            
            cursor.close()
            conn.close()
            
            return True
            
        except ImportError:
            logger.warning("psycopg2 not installed. Using REST API fallback.")
            return run_migration_via_rest_api(migration_sql, supabase_url, supabase_key)
        
    except Exception as e:
        logger.error(f"Migration failed: {str(e)}", exc_info=True)
        return False

def run_migration_via_rest_api(migration_sql, supabase_url, supabase_key):
    """
    Fallback: Run migration via Supabase REST API
    Note: This may not support all SQL features like CREATE TABLE
    For full migration, use psycopg2 or Supabase SQL Editor
    """
    import requests
    
    logger.info("Attempting migration via REST API (limited functionality)...")
    logger.warning("⚠️  For full migration support, please run this SQL manually in Supabase SQL Editor:")
    logger.warning("https://app.supabase.com/project/[your-project]/sql")
    
    # Print the SQL for manual execution
    print("\n" + "="*80)
    print("MIGRATION SQL (Copy to Supabase SQL Editor):")
    print("="*80)
    print(migration_sql)
    print("="*80 + "\n")
    
    return False

if __name__ == "__main__":
    logger.info("🚀 Starting Deep Knowledge Tracing migration...")
    logger.info("This will create the following tables:")
    logger.info("  - student_interactions")
    logger.info("  - student_knowledge_state")
    logger.info("  - skills_taxonomy")
    logger.info("  - misconceptions")
    logger.info("  - student_misconceptions_log")
    logger.info("  - dkt_model_metrics")
    logger.info("  - daily_review_queue")
    logger.info("  - offline_sync_queue")
    logger.info("")
    
    success = run_migration()
    
    if success:
        logger.info("✅ Migration completed successfully!")
        logger.info("\nNext steps:")
        logger.info("1. Test DKT API endpoints")
        logger.info("2. Integrate into mobile app quiz flow")
        logger.info("3. Verify interaction logging")
    else:
        logger.error("❌ Migration failed. Please run SQL manually in Supabase SQL Editor.")
        logger.info("\nManual migration steps:")
        logger.info("1. Go to https://app.supabase.com/project/[your-project]/sql")
        logger.info("2. Copy the SQL from database/migrations/001_add_interaction_tracking.sql")
        logger.info("3. Paste and execute in SQL Editor")
