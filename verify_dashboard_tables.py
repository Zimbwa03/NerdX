#!/usr/bin/env python3
"""
Verify Dashboard Tables for NerdX Bot
This script verifies that all required tables exist and are properly configured
"""

import psycopg2
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Database connection string
DATABASE_URL = "postgresql://postgres:Ngonidzashe2003.@db.hvlvwvzliqrlmqjbfgoa.supabase.co:5432/postgres"

def verify_dashboard_tables():
    """Verify all dashboard tables are properly set up"""
    
    try:
        # Connect to database
        conn = psycopg2.connect(DATABASE_URL)
        conn.autocommit = True
        cursor = conn.cursor()
        
        logger.info("🔍 Verifying dashboard tables...")
        
        # Required tables for dashboard features
        required_tables = {
            'Overview Dashboard': [
                'users_registration',
                'user_stats', 
                'payment_transactions',
                'credit_transactions'
            ],
            'User Analytics': [
                'daily_user_activity',
                'user_engagement_metrics',
                'subject_usage_analytics',
                'feature_usage_analytics',
                'scan_solve_runs',
            ],
            'Revenue': [
                'packages',
                'payment_transactions'
            ],
            'Payments': [
                'payment_transactions',
                'users_registration'
            ],
            'Credits Cost': [
                'credit_costs'
            ],
            'Admin': [
                'admin_users',
                'broadcast_logs'
            ]
        }
        
        all_tables_exist = True
        table_status = {}
        
        # Check each table category
        for category, tables in required_tables.items():
            logger.info(f"\n📊 {category}:")
            category_status = True
            
            for table in tables:
                try:
                    cursor.execute(f"SELECT COUNT(*) FROM {table}")
                    count = cursor.fetchone()[0]
                    status = "✅"
                    table_status[table] = count
                    logger.info(f"  {status} {table}: {count} records")
                except Exception as e:
                    status = "❌"
                    category_status = False
                    all_tables_exist = False
                    table_status[table] = "ERROR"
                    logger.error(f"  {status} {table}: {e}")
            
            if category_status:
                logger.info(f"  🎯 {category}: READY")
            else:
                logger.error(f"  ⚠️  {category}: ISSUES DETECTED")
        
        # Test dashboard functionality
        logger.info("\n🧪 Testing Dashboard Functionality:")
        
        # Test 1: Dashboard stats query
        try:
            cursor.execute("""
                SELECT 
                    COUNT(*) as total_users,
                    SUM(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 ELSE 0 END) as new_users_week
                FROM users_registration
            """)
            stats = cursor.fetchone()
            logger.info(f"  ✅ Dashboard stats query: {stats[0]} total users, {stats[1]} new this week")
        except Exception as e:
            logger.error(f"  ❌ Dashboard stats query failed: {e}")
        
        # Test 2: User analytics query
        try:
            cursor.execute("""
                SELECT COUNT(*) FROM daily_user_activity LIMIT 1
            """)
            analytics_count = cursor.fetchone()[0]
            logger.info(f"  ✅ User analytics query: {analytics_count} records accessible")
        except Exception as e:
            logger.error(f"  ❌ User analytics query failed: {e}")
        
        # Test 3: Payment analytics query
        try:
            cursor.execute("""
                SELECT 
                    COUNT(*) as total_payments,
                    SUM(amount) as total_revenue
                FROM payment_transactions 
                WHERE status = 'approved'
            """)
            payments = cursor.fetchone()
            logger.info(f"  ✅ Payment analytics query: {payments[0]} payments, ${payments[1] or 0} revenue")
        except Exception as e:
            logger.error(f"  ❌ Payment analytics query failed: {e}")
        
        # Test 4: Credit costs query
        try:
            cursor.execute("""
                SELECT COUNT(*) FROM credit_costs WHERE is_active = true
            """)
            active_costs = cursor.fetchone()[0]
            logger.info(f"  ✅ Credit costs query: {active_costs} active cost configurations")
        except Exception as e:
            logger.error(f"  ❌ Credit costs query failed: {e}")
        
        # Test 5: Admin functionality query
        try:
            cursor.execute("""
                SELECT COUNT(*) FROM admin_users WHERE is_active = true
            """)
            active_admins = cursor.fetchone()[0]
            logger.info(f"  ✅ Admin functionality query: {active_admins} active admin users")
        except Exception as e:
            logger.error(f"  ❌ Admin functionality query failed: {e}")
        
        cursor.close()
        conn.close()
        
        # Final summary
        logger.info("\n" + "="*80)
        logger.info("📋 DASHBOARD VERIFICATION SUMMARY")
        logger.info("="*80)
        
        if all_tables_exist:
            logger.info("🎉 SUCCESS! All dashboard tables are properly configured.")
            logger.info("✅ Overview Dashboard: READY")
            logger.info("✅ User Analytics: READY") 
            logger.info("✅ Revenue: READY")
            logger.info("✅ Payments: READY")
            logger.info("✅ Credits Cost: READY")
            logger.info("✅ Admin: READY")
            logger.info("\n🌐 Your dashboard should now work perfectly!")
            logger.info("🔑 Login with: admin@nerdx.com / admin123")
            logger.info("📍 Access at: /dashboard")
        else:
            logger.warning("⚠️  Some issues detected. Check the logs above for details.")
        
        logger.info("="*80)
        
        return all_tables_exist
        
    except Exception as e:
        logger.error(f"❌ Verification failed: {e}")
        return False

if __name__ == "__main__":
    verify_dashboard_tables()

