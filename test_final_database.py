#!/usr/bin/env python3
"""
Final test to verify database is working correctly after table recreation.
"""

import os
import sys
import logging
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

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

def test_nerdx_id_field_length(conn):
    """Test that nerdx_id field can handle very long values."""
    logger.info("🧪 Testing nerdx_id field length...")
    
    try:
        cursor = conn.cursor()
        
        # Create a very long nerdx_id (200 characters)
        very_long_nerdx_id = "VERY_VERY_LONG_NERDX_ID_" + "A" * 180
        
        cursor.execute("""
            INSERT INTO users (whatsapp_id, nerdx_id, name, surname, credits)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id;
        """, (f"263{very_long_nerdx_id}", very_long_nerdx_id, "Test", "VeryLongID", 75))
        
        test_user_id = cursor.fetchone()[0]
        logger.info(f"   ✅ Very long nerdx_id test successful: {len(very_long_nerdx_id)} characters")
        
        # Clean up test data
        cursor.execute("DELETE FROM users WHERE id = %s;", (test_user_id,))
        logger.info("   🧹 Test data cleaned up")
        
        return True
        
    except Exception as e:
        logger.error(f"   ❌ Long nerdx_id test failed: {e}")
        return False

def test_user_registration_flow(conn):
    """Test complete user registration flow."""
    logger.info("🧪 Testing user registration flow...")
    
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # Test 1: Create a test user
        test_nerdx_id = f"TEST{datetime.now().strftime('%Y%m%d%H%M%S')}"
        test_whatsapp_id = f"263{test_nerdx_id}"
        
        cursor.execute("""
            INSERT INTO users (whatsapp_id, nerdx_id, name, surname, email, credits)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id;
        """, (test_whatsapp_id, test_nerdx_id, "Test", "User", "test@example.com", 75))
        
        user_id = cursor.fetchone()['id']
        logger.info(f"   ✅ Test user created: {test_nerdx_id}")
        
        # Test 2: Create user registration record
        cursor.execute("""
            INSERT INTO users_registration (chat_id, name, surname, date_of_birth, nerdx_id, credits)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id;
        """, (test_whatsapp_id, "Test", "User", "1990-01-01", test_nerdx_id, 75))
        
        reg_id = cursor.fetchone()['id']
        logger.info(f"   ✅ User registration record created")
        
        # Test 3: Create user stats
        cursor.execute("""
            INSERT INTO user_stats (user_id, total_questions_answered, correct_answers, total_points_earned)
            VALUES (%s, %s, %s, %s)
            RETURNING id;
        """, (test_nerdx_id, 0, 0, 0))
        
        stats_id = cursor.fetchone()['id']
        logger.info(f"   ✅ User stats created")
        
        # Test 4: Verify relationships work
        cursor.execute("""
            SELECT u.nerdx_id, ur.name, us.total_questions_answered
            FROM users u
            JOIN users_registration ur ON u.nerdx_id = ur.nerdx_id
            JOIN user_stats us ON u.nerdx_id = us.user_id
            WHERE u.nerdx_id = %s;
        """, (test_nerdx_id,))
        
        result = cursor.fetchone()
        if result:
            logger.info(f"   ✅ Relationships verified: {result['name']} - {result['total_questions_answered']} questions")
        else:
            logger.error("   ❌ Relationships failed!")
            return False
        
        # Clean up test data
        cursor.execute("DELETE FROM user_stats WHERE id = %s;", (stats_id,))
        cursor.execute("DELETE FROM users_registration WHERE id = %s;", (reg_id,))
        cursor.execute("DELETE FROM users WHERE id = %s;", (user_id,))
        logger.info("   🧹 Test data cleaned up")
        
        return True
        
    except Exception as e:
        logger.error(f"   ❌ User registration test failed: {e}")
        return False

def test_payment_system(conn):
    """Test payment system functionality."""
    logger.info("🧪 Testing payment system...")
    
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # Test 1: Create test user
        test_nerdx_id = f"PAY{datetime.now().strftime('%Y%m%d%H%M%S')}"
        test_whatsapp_id = f"263{test_nerdx_id}"
        
        cursor.execute("""
            INSERT INTO users (whatsapp_id, nerdx_id, name, surname, credits)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id;
        """, (test_whatsapp_id, test_nerdx_id, "Payment", "User", 50))
        
        user_id = cursor.fetchone()['id']
        
        # Test 2: Create payment record
        reference_code = f"PAY{datetime.now().strftime('%Y%m%d%H%M%S')}"
        cursor.execute("""
            INSERT INTO payments (user_id, amount, status, payment_method, reference_code)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id;
        """, (test_nerdx_id, 10.00, 'pending', 'ecocash', reference_code))
        
        payment_id = cursor.fetchone()['id']
        
        # Test 3: Create credit transaction
        cursor.execute("""
            INSERT INTO credit_transactions (user_id, action, credits_change, balance_before, balance_after, description)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id;
        """, (test_nerdx_id, 'purchase', 10, 50, 60, 'Payment for credits'))
        
        transaction_id = cursor.fetchone()['id']
        
        # Test 4: Verify payment and credit system
        cursor.execute("""
            SELECT p.amount, p.status, ct.credits_change, ct.balance_after
            FROM payments p
            JOIN credit_transactions ct ON p.user_id = ct.user_id
            WHERE p.id = %s AND ct.id = %s;
        """, (payment_id, transaction_id))
        
        result = cursor.fetchone()
        if result and result['amount'] == 10.00:
            logger.info(f"   ✅ Payment system working: ${result['amount']} → +{result['credits_change']} credits (Balance: {result['balance_after']})")
        else:
            logger.error("   ❌ Payment system failed!")
            return False
        
        # Clean up test data
        cursor.execute("DELETE FROM credit_transactions WHERE id = %s;", (transaction_id,))
        cursor.execute("DELETE FROM payments WHERE id = %s;", (payment_id,))
        cursor.execute("DELETE FROM users WHERE id = %s;", (user_id,))
        logger.info("   🧹 Payment test data cleaned up")
        
        return True
        
    except Exception as e:
        logger.error(f"   ❌ Payment system test failed: {e}")
        return False

def check_table_schemas(conn):
    """Check that all tables have the correct schema."""
    logger.info("🔍 Checking table schemas...")
    
    try:
        cursor = conn.cursor()
        
        # Check critical tables exist and are accessible
        critical_tables = [
            'users', 'users_registration', 'user_stats', 
            'credit_transactions', 'payments', 'admin_users',
            'admin_sessions', 'admin_activity_logs', 'admin_permissions'
        ]
        
        for table in critical_tables:
            try:
                cursor.execute(f"SELECT COUNT(*) FROM {table};")
                count = cursor.fetchone()[0]
                logger.info(f"   ✅ {table}: {count} rows (accessible)")
            except Exception as e:
                logger.error(f"   ❌ {table}: Error - {e}")
                return False
        
        # Check nerdx_id field types
        cursor.execute("""
            SELECT table_name, column_name, data_type, character_maximum_length
            FROM information_schema.columns 
            WHERE (table_name = 'users' AND column_name = 'nerdx_id')
               OR (table_name = 'users_registration' AND column_name = 'nerdx_id')
               OR (table_name = 'user_stats' AND column_name = 'user_id');
        """)
        
        columns = cursor.fetchall()
        for table_name, column_name, data_type, max_length in columns:
            if data_type == 'text' or max_length is None:
                logger.info(f"   ✅ {table_name}.{column_name}: {data_type} (unlimited)")
            else:
                logger.warning(f"   ⚠️ {table_name}.{column_name}: {data_type}({max_length})")
        
        return True
        
    except Exception as e:
        logger.error(f"   ❌ Schema check failed: {e}")
        return False

def main():
    """Main function to run final database tests."""
    logger.info("🚀 Running final database functionality tests...")
    
    conn = None
    test_results = []
    
    try:
        conn = get_db_connection()
        
        # Run all tests
        tests = [
            ("Table Schema Check", check_table_schemas),
            ("NERDX_ID Field Length", test_nerdx_id_field_length),
            ("User Registration Flow", test_user_registration_flow),
            ("Payment System", test_payment_system)
        ]
        
        for test_name, test_func in tests:
            logger.info(f"\n{'='*50}")
            logger.info(f"Running: {test_name}")
            logger.info(f"{'='*50}")
            
            try:
                result = test_func(conn)
                test_results.append((test_name, result))
                
                if result:
                    logger.info(f"✅ {test_name}: PASSED")
                else:
                    logger.error(f"❌ {test_name}: FAILED")
                    
            except Exception as e:
                logger.error(f"❌ {test_name}: ERROR - {e}")
                test_results.append((test_name, False))
        
        # Summary
        logger.info(f"\n{'='*60}")
        logger.info("📊 FINAL TEST RESULTS SUMMARY")
        logger.info(f"{'='*60}")
        
        passed = sum(1 for _, result in test_results if result)
        total = len(test_results)
        
        for test_name, result in test_results:
            status = "✅ PASSED" if result else "❌ FAILED"
            logger.info(f"{test_name}: {status}")
        
        logger.info(f"\nOverall Result: {passed}/{total} tests passed")
        
        if passed == total:
            logger.info("🎉 ALL TESTS PASSED! Database is now working perfectly!")
            logger.info("The nerdx_id field length issue has been completely resolved!")
        else:
            logger.error(f"⚠️ {total - passed} tests failed. Database still has issues!")
            sys.exit(1)
        
    except Exception as e:
        logger.error(f"❌ Fatal error: {e}")
        sys.exit(1)
    finally:
        if conn:
            conn.close()
            logger.info("🔌 Database connection closed")

if __name__ == "__main__":
    main()
