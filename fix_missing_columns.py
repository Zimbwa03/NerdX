#!/usr/bin/env python3
"""
Fix missing columns in database tables that are causing admin API errors.
"""

import os
import psycopg2
from psycopg2.extras import RealDictCursor

# Database connection
DATABASE_URL = "postgresql://postgres:Ngonidzashe2003.@db.hvlvwvzliqrlmqjbfgoa.supabase.co:5432/postgres"

def fix_missing_columns():
    """Add missing columns to fix admin API errors"""
    try:
        print("Connecting to database...")
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        
        print("Checking and fixing missing columns...")
        
        # 1. Add target_group column to broadcast_logs if it doesn't exist
        try:
            cursor.execute("""
                ALTER TABLE broadcast_logs 
                ADD COLUMN IF NOT EXISTS target_group VARCHAR(50) DEFAULT 'all';
            """)
            print("✓ Added target_group column to broadcast_logs")
        except Exception as e:
            print(f"Error adding target_group column: {e}")
        
        # 2. Add transaction_type column to credit_transactions if it doesn't exist
        try:
            cursor.execute("""
                ALTER TABLE credit_transactions 
                ADD COLUMN IF NOT EXISTS transaction_type VARCHAR(50) DEFAULT 'usage';
            """)
            print("✓ Added transaction_type column to credit_transactions")
        except Exception as e:
            print(f"Error adding transaction_type column: {e}")
        
        # 3. Update existing records with default values
        try:
            cursor.execute("""
                UPDATE broadcast_logs 
                SET target_group = 'all' 
                WHERE target_group IS NULL;
            """)
            print("✓ Updated existing broadcast_logs records with default target_group")
        except Exception as e:
            print(f"Error updating broadcast_logs: {e}")
        
        try:
            cursor.execute("""
                UPDATE credit_transactions 
                SET transaction_type = 'usage' 
                WHERE transaction_type IS NULL;
            """)
            print("✓ Updated existing credit_transactions records with default transaction_type")
        except Exception as e:
            print(f"Error updating credit_transactions: {e}")
        
        # Commit changes
        conn.commit()
        print("✓ All changes committed successfully")
        
        # Verify the columns exist
        print("\nVerifying column additions...")
        
        cursor.execute("""
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_name = 'broadcast_logs' AND column_name = 'target_group';
        """)
        target_group_col = cursor.fetchone()
        if target_group_col:
            print(f"✓ target_group column: {target_group_col}")
        else:
            print("✗ target_group column not found")
        
        cursor.execute("""
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_name = 'credit_transactions' AND column_name = 'transaction_type';
        """)
        transaction_type_col = cursor.fetchone()
        if transaction_type_col:
            print(f"✓ transaction_type column: {transaction_type_col}")
        else:
            print("✗ transaction_type column not found")
        
        cursor.close()
        conn.close()
        print("\n✓ Database connection closed")
        
    except Exception as e:
        print(f"Error: {e}")
        if 'conn' in locals():
            conn.rollback()
            conn.close()

if __name__ == "__main__":
    fix_missing_columns()
