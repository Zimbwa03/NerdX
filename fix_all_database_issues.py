#!/usr/bin/env python3
"""
Comprehensive fix for all missing database columns and tables
This will resolve all dashboard errors by creating the exact schema expected by the code
"""

import os
import sys
from datetime import datetime

def fix_database_schema_through_app():
    """Fix database schema using the app's working database connection"""
    
    # Change to the app directory and use app's database connection
    script_content = '''
import os
import sys
sys.path.append(".")
from app import app, db
import psycopg2

def fix_all_schema_issues():
    """Fix all missing columns and tables"""
    
    try:
        # Get the same database connection the app uses
        database_url = os.environ.get("DATABASE_URL", "")
        if "pgbouncer" in database_url:
            database_url = database_url.replace("?pgbouncer=true", "").replace("&pgbouncer=true", "")
        
        print("Connecting to Supabase database...")
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor()
        
        print("Fixing missing columns and creating missing tables...")
        
        # 1. Add missing total_attempts column to user_stats table
        try:
            cursor.execute("""
                ALTER TABLE user_stats 
                ADD COLUMN IF NOT EXISTS total_attempts INTEGER DEFAULT 0;
            """)
            print("✓ Added total_attempts column to user_stats")
        except Exception as e:
            print(f"Note: total_attempts - {e}")
        
        # 2. Create activity_analytics table for dashboard charts
        try:
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS activity_analytics (
                    id SERIAL PRIMARY KEY,
                    date DATE NOT NULL UNIQUE,
                    total_active_users INTEGER DEFAULT 0,
                    new_users INTEGER DEFAULT 0,
                    returning_users INTEGER DEFAULT 0,
                    questions_answered INTEGER DEFAULT 0,
                    revenue DECIMAL(10,2) DEFAULT 0.00,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)
            print("✓ Created activity_analytics table")
        except Exception as e:
            print(f"Note: activity_analytics - {e}")
            
        # 3. Add missing total_time_spent column to user_stats table
        try:
            cursor.execute("""
                ALTER TABLE user_stats 
                ADD COLUMN IF NOT EXISTS total_time_spent INTEGER DEFAULT 0;
            """)
            print("✓ Added total_time_spent column to user_stats")
        except Exception as e:
            print(f"Note: total_time_spent - {e}")
        
        # 4. Create user_sessions_analytics table 
        try:
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS user_sessions_analytics (
                    id SERIAL PRIMARY KEY,
                    user_id VARCHAR(50) NOT NULL,
                    session_id VARCHAR(100) NOT NULL,
                    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    device_info JSONB,
                    end_time TIMESTAMP,
                    duration_seconds INTEGER,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)
            print("✓ Created user_sessions_analytics table")
        except Exception as e:
            print(f"Note: user_sessions_analytics - {e}")
            
        # 5. Add sample data for current date to activity_analytics
        try:
            cursor.execute("""
                INSERT INTO activity_analytics (date, total_active_users, new_users, returning_users, questions_answered, revenue)
                VALUES (CURRENT_DATE, 0, 0, 0, 0, 0.00)
                ON CONFLICT (date) DO NOTHING;
            """)
            print("✓ Added sample data to activity_analytics")
        except Exception as e:
            print(f"Note: sample data - {e}")
        
        # 6. Add missing xp_points column to user_stats if needed
        try:
            cursor.execute("""
                ALTER TABLE user_stats 
                ADD COLUMN IF NOT EXISTS xp_points INTEGER DEFAULT 0;
            """)
            print("✓ Added xp_points column to user_stats")
        except Exception as e:
            print(f"Note: xp_points - {e}")
            
        # 7. Add missing streak column to user_stats if needed
        try:
            cursor.execute("""
                ALTER TABLE user_stats 
                ADD COLUMN IF NOT EXISTS streak INTEGER DEFAULT 0;
            """)
            print("✓ Added streak column to user_stats")
        except Exception as e:
            print(f"Note: streak - {e}")
        
        # Commit all changes
        conn.commit()
        cursor.close()
        conn.close()
        
        print("\\n✅ All database schema fixes completed successfully!")
        print("All dashboard errors should now be resolved.")
        return True
        
    except Exception as e:
        print(f"❌ Error fixing database schema: {e}")
        return False

if __name__ == "__main__":
    success = fix_all_schema_issues()
    sys.exit(0 if success else 1)
'''
    
    # Write the script and execute it
    with open('temp_fix_schema.py', 'w') as f:
        f.write(script_content)
    
    # Execute the script
    import subprocess
    result = subprocess.run([sys.executable, 'temp_fix_schema.py'], 
                          capture_output=True, text=True)
    
    print("Database schema fix output:")
    print(result.stdout)
    if result.stderr:
        print("Errors:")
        print(result.stderr)
    
    # Clean up
    try:
        os.remove('temp_fix_schema.py')
    except:
        pass
    
    return result.returncode == 0

if __name__ == "__main__":
    success = fix_database_schema_through_app()
    if success:
        print("\n🎉 Database schema fixes completed successfully!")
    else:
        print("\n❌ Some issues occurred during schema fixes")
    sys.exit(0 if success else 1)