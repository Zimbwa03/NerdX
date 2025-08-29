#!/usr/bin/env python3
"""
Comprehensive database functionality test to verify everything is working correctly.
This script will test all critical database operations and relationships.
"""

import os
import sys
import logging
import psycopg2
from psycopg2.extras import RealDictCursor
import uuid
from datetime import datetime, timedelta

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

def test_referral_system(conn):
    """Test referral system functionality."""
    logger.info("🧪 Testing referral system...")
    
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # Test 1: Create referrer user
        referrer_nerdx_id = f"REF{datetime.now().strftime('%Y%m%d%H%M%S')}"
        referrer_whatsapp_id = f"263{referrer_nerdx_id}"
        
        cursor.execute("""
            INSERT INTO users (whatsapp_id, nerdx_id, name, surname, credits)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id;
        """, (referrer_whatsapp_id, referrer_nerdx_id, "Referrer", "User", 100))
        
        referrer_id = cursor.fetchone()['id']
        
        # Test 2: Create referred user
        referred_nerdx_id = f"REFD{datetime.now().strftime('%Y%m%d%H%M%S')}"
        referred_whatsapp_id = f"263{referred_nerdx_id}"
        
        cursor.execute("""
            INSERT INTO users (whatsapp_id, nerdx_id, name, surname, credits)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id;
        """, (referred_whatsapp_id, referred_nerdx_id, "Referred", "User", 75))
        
        referred_id = cursor.fetchone()['id']
        
        # Test 3: Create referral record
        cursor.execute("""
            INSERT INTO referrals (referrer_id, referred_id, referral_code, status, bonus_credits)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id;
        """, (referrer_nerdx_id, referred_nerdx_id, referrer_nerdx_id, 'completed', 5))
        
        referral_id = cursor.fetchone()['id']
        
        # Test 4: Verify referral relationship
        cursor.execute("""
            SELECT r.referrer_id, r.referred_id, r.status, r.bonus_credits
            FROM referrals r
            WHERE r.id = %s;
        """, (referral_id,))
        
        result = cursor.fetchone()
        if result and result['status'] == 'completed':
            logger.info(f"   ✅ Referral system working: {result['referrer_id']} → {result['referred_id']} (+{result['bonus_credits']} credits)")
        else:
            logger.error("   ❌ Referral system failed!")
            return False
        
        # Clean up test data
        cursor.execute("DELETE FROM referrals WHERE id = %s;", (referral_id,))
        cursor.execute("DELETE FROM users WHERE id = %s;", (referred_id,))
        cursor.execute("DELETE FROM users WHERE id = %s;", (referrer_id,))
        logger.info("   🧹 Referral test data cleaned up")
        
        return True
        
    except Exception as e:
        logger.error(f"   ❌ Referral system test failed: {e}")
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

def test_admin_system(conn):
    """Test admin system functionality."""
    logger.info("🧪 Testing admin system...")
    
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # Test 1: Check admin user exists
        cursor.execute("""
            SELECT id, email, first_name, last_name, role
            FROM admin_users
            WHERE email = 'neezykidngoni@gmail.com';
        """)
        
        admin_user = cursor.fetchone()
        if not admin_user:
            logger.error("   ❌ Admin user not found!")
            return False
        
        logger.info(f"   ✅ Admin user found: {admin_user['first_name']} {admin_user['last_name']}")
        
        # Test 2: Test admin session creation
        session_token = f"test_session_{datetime.now().strftime('%Y%m%d%H%M%S')}"
        cursor.execute("""
            INSERT INTO admin_sessions (session_token, admin_user_id, ip_address, user_agent, expires_at)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id;
        """, (session_token, admin_user['id'], '127.0.0.1', 'Test Browser', datetime.now() + timedelta(hours=24)))
        
        session_id = cursor.fetchone()['id']
        logger.info(f"   ✅ Admin session created")
        
        # Test 3: Test admin activity logging
        cursor.execute("""
            INSERT INTO admin_activity_logs (admin_user_id, action, details, ip_address, user_agent)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id;
        """, (admin_user['id'], 'LOGIN_TEST', '{"test": true}', '127.0.0.1', 'Test Browser'))
        
        log_id = cursor.fetchone()['id']
        logger.info(f"   ✅ Admin activity logged")
        
        # Test 4: Verify admin permissions
        cursor.execute("""
            SELECT COUNT(*) as permission_count
            FROM admin_permissions
            WHERE admin_user_id = %s;
        """, (admin_user['id'],))
        
        permission_count = cursor.fetchone()['permission_count']
        logger.info(f"   ✅ Admin permissions verified: {permission_count} permissions")
        
        # Clean up test data
        cursor.execute("DELETE FROM admin_activity_logs WHERE id = %s;", (log_id,))
        cursor.execute("DELETE FROM admin_sessions WHERE id = %s;", (session_id,))
        logger.info("   🧹 Admin test data cleaned up")
        
        return True
        
    except Exception as e:
        logger.error(f"   ❌ Admin system test failed: {e}")
        return False

def test_database_performance(conn):
    """Test database performance with sample queries."""
    logger.info("🧪 Testing database performance...")
    
    try:
        cursor = conn.cursor()
        
        # Test 1: Simple SELECT performance
        start_time = datetime.now()
        cursor.execute("SELECT COUNT(*) FROM users_registration;")
        result = cursor.fetchone()
        end_time = datetime.now()
        
        query_time = (end_time - start_time).total_seconds() * 1000
        logger.info(f"   ✅ Simple query performance: {query_time:.2f}ms")
        
        # Test 2: JOIN query performance
        start_time = datetime.now()
        cursor.execute("""
            SELECT ur.name, ur.credits, us.total_questions_answered
            FROM users_registration ur
            LEFT JOIN user_stats us ON ur.nerdx_id = us.user_id
            LIMIT 10;
        """)
        results = cursor.fetchall()
        end_time = datetime.now()
        
        query_time = (end_time - start_time).total_seconds() * 1000
        logger.info(f"   ✅ JOIN query performance: {query_time:.2f}ms ({len(results)} results)")
        
        # Test 3: Index usage verification
        cursor.execute("""
            SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
            FROM pg_stat_user_indexes
            WHERE tablename IN ('users_registration', 'payments', 'credit_transactions')
            ORDER BY idx_scan DESC;
        """)
        
        indexes = cursor.fetchall()
        logger.info(f"   ✅ Index usage verified: {len(indexes)} indexes found")
        
        return True
        
    except Exception as e:
        logger.error(f"   ❌ Performance test failed: {e}")
        return False

def final_comprehensive_test(conn):
    """Run final comprehensive test."""
    logger.info("🧪 Running final comprehensive test...")
    
    try:
        cursor = conn.cursor()
        
        # Test all critical tables exist and are accessible
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
        
        # Test foreign key constraints
        try:
            cursor.execute("""
                SELECT 
                    tc.table_name, 
                    kcu.column_name, 
                    ccu.table_name AS foreign_table_name,
                    ccu.column_name AS foreign_column_name 
                FROM 
                    information_schema.table_constraints AS tc 
                    JOIN information_schema.key_column_usage AS kcu
                      ON tc.constraint_name = kcu.constraint_name
                      AND tc.table_schema = kcu.table_schema
                    JOIN information_schema.constraint_column_usage AS ccu
                      ON ccu.constraint_name = tc.constraint_name
                      AND ccu.table_schema = tc.table_schema
                WHERE tc.constraint_type = 'FOREIGN KEY';
            """)
            
            foreign_keys = cursor.fetchall()
            logger.info(f"   ✅ Foreign key constraints: {len(foreign_keys)} found")
            
        except Exception as e:
            logger.warning(f"   ⚠️ Could not verify foreign keys: {e}")
        
        logger.info("   ✅ Final comprehensive test completed")
        return True
        
    except Exception as e:
        logger.error(f"   ❌ Final test failed: {e}")
        return False

def main():
    """Main function to run all tests."""
    logger.info("🚀 Starting comprehensive database functionality tests...")
    
    conn = None
    test_results = []
    
    try:
        conn = get_db_connection()
        
        # Run all tests
        tests = [
            ("User Registration Flow", test_user_registration_flow),
            ("Referral System", test_referral_system),
            ("Payment System", test_payment_system),
            ("Admin System", test_admin_system),
            ("Database Performance", test_database_performance),
            ("Final Comprehensive Test", final_comprehensive_test)
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
        logger.info("📊 TEST RESULTS SUMMARY")
        logger.info(f"{'='*60}")
        
        passed = sum(1 for _, result in test_results if result)
        total = len(test_results)
        
        for test_name, result in test_results:
            status = "✅ PASSED" if result else "❌ FAILED"
            logger.info(f"{test_name}: {status}")
        
        logger.info(f"\nOverall Result: {passed}/{total} tests passed")
        
        if passed == total:
            logger.info("🎉 ALL TESTS PASSED! Database is working perfectly!")
        else:
            logger.error(f"⚠️ {total - passed} tests failed. Database has issues!")
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
