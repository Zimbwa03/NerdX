#!/usr/bin/env python3
"""
Check current status of all dashboard-related tables and user tables.
"""

import os
import psycopg2
from psycopg2.extras import RealDictCursor

# Database connection
DATABASE_URL = "postgresql://postgres:Ngonidzashe2003.@db.hvlvwvzliqrlmqjbfgoa.supabase.co:5432/postgres"

def check_current_status():
    """Check the current status of all tables"""
    try:
        print("Connecting to database...")
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        
        print("Checking current table status...\n")
        
        # Check users table
        print("=== USERS TABLE ===")
        cursor.execute("SELECT COUNT(*) FROM users;")
        users_count = cursor.fetchone()[0]
        print(f"Total users: {users_count}")
        
        cursor.execute("SELECT nerdx_id, whatsapp_id, name, surname FROM users LIMIT 5;")
        sample_users = cursor.fetchall()
        print("Sample users:")
        for user in sample_users:
            print(f"  - {user[0]} | {user[1]} | {user[2]} {user[3]}")
        
        # Check users_registration table
        print("\n=== USERS_REGISTRATION TABLE ===")
        cursor.execute("SELECT COUNT(*) FROM users_registration;")
        reg_count = cursor.fetchone()[0]
        print(f"Total registrations: {reg_count}")
        
        cursor.execute("SELECT nerdx_id, chat_id, name, surname FROM users_registration LIMIT 5;")
        sample_reg = cursor.fetchall()
        print("Sample registrations:")
        for reg in sample_reg:
            print(f"  - {reg[0]} | {reg[1]} | {reg[2]} {reg[3]}")
        
        # Check user_stats table
        print("\n=== USER_STATS TABLE ===")
        cursor.execute("SELECT COUNT(*) FROM user_stats;")
        stats_count = cursor.fetchone()[0]
        print(f"Total user stats: {stats_count}")
        
        # Check foreign key constraints
        print("\n=== FOREIGN KEY CHECK ===")
        cursor.execute("""
            SELECT COUNT(*) FROM user_stats us
            LEFT JOIN users u ON us.user_id = u.nerdx_id
            WHERE u.nerdx_id IS NULL;
        """)
        missing_users = cursor.fetchone()[0]
        print(f"User stats with missing users: {missing_users}")
        
        if missing_users > 0:
            cursor.execute("""
                SELECT DISTINCT us.user_id FROM user_stats us
                LEFT JOIN users u ON us.user_id = u.nerdx_id
                WHERE u.nerdx_id IS NULL
                LIMIT 5;
            """)
            missing_user_ids = cursor.fetchall()
            print("Sample missing user IDs:")
            for user_id in missing_user_ids:
                print(f"  - {user_id[0]}")
        
        # Check dashboard tables
        print("\n=== DASHBOARD TABLES STATUS ===")
        dashboard_tables = [
            'daily_user_activity',
            'user_engagement_metrics', 
            'subject_usage_analytics',
            'feature_usage_analytics',
            'credit_transactions',
            'payment_transactions',
            'broadcast_logs'
        ]
        
        for table in dashboard_tables:
            try:
                cursor.execute(f"SELECT COUNT(*) FROM {table};")
                count = cursor.fetchone()[0]
                print(f"{table}: {count} records")
            except Exception as e:
                print(f"{table}: ERROR - {e}")
        
        cursor.close()
        conn.close()
        print("\n✓ Database connection closed")
        
    except Exception as e:
        print(f"Error: {e}")
        if 'conn' in locals():
            conn.rollback()
            conn.close()

if __name__ == "__main__":
    check_current_status()

