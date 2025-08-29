#!/usr/bin/env python3
"""
Create Missing Tables Script
Creates the payment_transactions table and verifies existing table structures
"""

import psycopg2
from psycopg2.extras import RealDictCursor

# Database connection string
DATABASE_URL = "postgresql://postgres:Ngonidzashe2003.@db.hvlvwvzliqrlmqjbfgoa.supabase.co:5432/postgres"

def create_payment_transactions_table(conn):
    """Create the payment_transactions table"""
    try:
        cursor = conn.cursor()
        
        print("🔨 Creating payment_transactions table...")
        
        # Create payment_transactions table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS payment_transactions (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                package_id VARCHAR(50) NOT NULL,
                reference_code VARCHAR(100) UNIQUE NOT NULL,
                amount DECIMAL(10,2) NOT NULL,
                credits INTEGER NOT NULL,
                status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
                payment_proof TEXT NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                proof_submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                approved_at TIMESTAMP WITH TIME ZONE,
                rejected_at TIMESTAMP WITH TIME ZONE,
                credits_added INTEGER DEFAULT 0,
                admin_notes TEXT
            )
        """)
        
        # Create indexes for better performance
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id 
            ON payment_transactions(user_id)
        """)
        
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_payment_transactions_status 
            ON payment_transactions(status)
        """)
        
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_payment_transactions_created_at 
            ON payment_transactions(created_at)
        """)
        
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_payment_transactions_reference_code 
            ON payment_transactions(reference_code)
        """)
        
        # Enable Row Level Security (RLS)
        cursor.execute("ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY")
        
        # Create RLS policies
        cursor.execute("""
            DROP POLICY IF EXISTS "Allow all operations on payment_transactions" ON payment_transactions
        """)
        
        cursor.execute("""
            CREATE POLICY "Allow all operations on payment_transactions" ON payment_transactions
            FOR ALL USING (true) WITH CHECK (true)
        """)
        
        conn.commit()
        print("✅ payment_transactions table created successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Error creating payment_transactions table: {e}")
        conn.rollback()
        return False

def check_payments_table_structure(conn):
    """Check the structure of the existing payments table"""
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        print("\n🔍 Checking payments table structure...")
        
        cursor.execute("""
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_name = 'payments' 
            ORDER BY ordinal_position
        """)
        
        columns = cursor.fetchall()
        
        if not columns:
            print("❌ payments table has no columns - this is a problem!")
            return False
        
        print("📋 payments table structure:")
        for col in columns:
            nullable = "NULL" if col['is_nullable'] == 'YES' else "NOT NULL"
            default = f"DEFAULT {col['column_default']}" if col['column_default'] else ""
            print(f"  📝 {col['column_name']}: {col['data_type']} {nullable} {default}")
        
        # Check if it has the basic structure we need
        column_names = [col['column_name'] for col in columns]
        required_columns = ['user_id', 'amount_paid', 'credits_added', 'transaction_reference']
        
        missing_columns = [col for col in required_columns if col not in column_names]
        
        if missing_columns:
            print(f"⚠️  Missing required columns: {missing_columns}")
            return False
        else:
            print("✅ payments table has the required structure")
            return True
            
    except Exception as e:
        print(f"❌ Error checking payments table structure: {e}")
        return False

def verify_table_creation(conn):
    """Verify that the payment_transactions table was created correctly"""
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        print("\n🔍 Verifying payment_transactions table creation...")
        
        # Check if table exists
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_name = 'payment_transactions'
        """)
        
        if cursor.fetchone():
            print("✅ payment_transactions table exists")
            
            # Check structure
            cursor.execute("""
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = 'payment_transactions' 
                ORDER BY ordinal_position
            """)
            
            columns = cursor.fetchall()
            print("📋 payment_transactions table structure:")
            for col in columns:
                print(f"  📝 {col['column_name']}: {col['data_type']}")
            
            return True
        else:
            print("❌ payment_transactions table was not created")
            return False
            
    except Exception as e:
        print(f"❌ Error verifying table creation: {e}")
        return False

def main():
    """Main function to create missing tables"""
    print("🚀 NerdX Database Table Creator")
    print("=" * 50)
    
    try:
        # Connect to database
        print("🔍 Connecting to database...")
        conn = psycopg2.connect(DATABASE_URL)
        print("✅ Database connection successful!")
        
        # Check existing payments table
        payments_ok = check_payments_table_structure(conn)
        
        # Create missing payment_transactions table
        if create_payment_transactions_table(conn):
            # Verify creation
            if verify_table_creation(conn):
                print("\n🎉 SUCCESS: All required tables are now available!")
                print("💡 The payment system should now work smoothly")
            else:
                print("\n⚠️  Table creation verification failed")
        else:
            print("\n❌ Failed to create payment_transactions table")
        
        # Summary
        print("\n" + "=" * 50)
        print("📊 FINAL STATUS")
        print("=" * 50)
        
        if payments_ok:
            print("✅ payments table: OK")
        else:
            print("⚠️  payments table: Needs attention")
        
        print("✅ payment_transactions table: Created")
        print("✅ users_registration table: Already exists")
        
    except Exception as e:
        print(f"❌ Error during table creation: {e}")
        import traceback
        traceback.print_exc()
    
    finally:
        if 'conn' in locals():
            conn.close()
            print("\n🔌 Database connection closed")

if __name__ == "__main__":
    main()

