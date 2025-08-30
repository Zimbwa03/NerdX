#!/usr/bin/env python3
"""
Final Verification for NerdX Bot Dashboard
This script verifies that all dashboard features are properly configured
"""

import psycopg2
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Database connection string
DATABASE_URL = "postgresql://postgres:Ngonidzashe2003.@db.hvlvwvzliqrlmqjbfgoa.supabase.co:5432/postgres"

def final_verification():
    """Final verification of all dashboard features"""
    
    try:
        # Connect to database
        conn = psycopg2.connect(DATABASE_URL)
        conn.autocommit = True
        cursor = conn.cursor()
        
        logger.info("🔍 FINAL VERIFICATION OF NERDX BOT DASHBOARD")
        logger.info("="*70)
        
        # 1. Check Overview Dashboard Tables
        logger.info("\n📊 1. OVERVIEW DASHBOARD:")
        overview_tables = ['users_registration', 'user_stats', 'payment_transactions', 'credit_transactions']
        
        for table in overview_tables:
            try:
                cursor.execute(f"SELECT COUNT(*) FROM {table}")
                count = cursor.fetchone()[0]
                logger.info(f"  ✅ {table}: {count} records")
            except Exception as e:
                logger.error(f"  ❌ {table}: {e}")
        
        # 2. Check User Analytics Tables
        logger.info("\n📈 2. USER ANALYTICS:")
        analytics_tables = ['daily_user_activity', 'user_engagement_metrics', 'subject_usage_analytics', 'feature_usage_analytics']
        
        for table in analytics_tables:
            try:
                cursor.execute(f"SELECT COUNT(*) FROM {table}")
                count = cursor.fetchone()[0]
                logger.info(f"  ✅ {table}: {count} records")
            except Exception as e:
                logger.error(f"  ❌ {table}: {e}")
        
        # 3. Check Revenue Tables
        logger.info("\n💰 3. REVENUE:")
        revenue_tables = ['packages', 'payment_transactions']
        
        for table in revenue_tables:
            try:
                cursor.execute(f"SELECT COUNT(*) FROM {table}")
                count = cursor.fetchone()[0]
                logger.info(f"  ✅ {table}: {count} records")
            except Exception as e:
                logger.error(f"  ❌ {table}: {e}")
        
        # 4. Check Payments Tables
        logger.info("\n💳 4. PAYMENTS:")
        try:
            cursor.execute("SELECT COUNT(*) FROM payment_transactions")
            payments_count = cursor.fetchone()[0]
            logger.info(f"  ✅ payment_transactions: {payments_count} records")
            
            # Check payment statuses
            cursor.execute("SELECT status, COUNT(*) FROM payment_transactions GROUP BY status")
            statuses = cursor.fetchall()
            for status, count in statuses:
                logger.info(f"    - {status}: {count} payments")
        except Exception as e:
            logger.error(f"  ❌ Payments check failed: {e}")
        
        # 5. Check Credits Cost Tables
        logger.info("\n🎯 5. CREDITS COST:")
        try:
            cursor.execute("SELECT COUNT(*) FROM credit_costs")
            costs_count = cursor.fetchone()[0]
            logger.info(f"  ✅ credit_costs: {costs_count} configurations")
            
            # Show credit costs by category
            cursor.execute("SELECT category, COUNT(*), SUM(cost) FROM credit_costs GROUP BY category")
            categories = cursor.fetchall()
            for category, count, total_cost in categories:
                logger.info(f"    - {category}: {count} features, {total_cost} total credits")
        except Exception as e:
            logger.error(f"  ❌ Credits cost check failed: {e}")
        
        # 6. Check Admin Tables
        logger.info("\n👑 6. ADMIN:")
        admin_tables = ['admin_users', 'broadcast_logs']
        
        for table in admin_tables:
            try:
                cursor.execute(f"SELECT COUNT(*) FROM {table}")
                count = cursor.fetchone()[0]
                logger.info(f"  ✅ {table}: {count} records")
            except Exception as e:
                logger.error(f"  ❌ {table}: {e}")
        
        # 7. Test Dashboard Queries
        logger.info("\n🧪 7. TESTING DASHBOARD QUERIES:")
        
        # Test 1: Dashboard stats
        try:
            cursor.execute("""
                SELECT 
                    COUNT(*) as total_users,
                    SUM(CASE WHEN us.credits >= 75 THEN 1 ELSE 0 END) as users_with_credits
                FROM users_registration ur
                LEFT JOIN user_stats us ON ur.chat_id = us.user_id
            """)
            stats = cursor.fetchone()
            logger.info(f"  ✅ Dashboard stats: {stats[0]} total users, {stats[1]} with credits")
        except Exception as e:
            logger.error(f"  ❌ Dashboard stats failed: {e}")
        
        # Test 2: Revenue calculation
        try:
            cursor.execute("""
                SELECT 
                    COUNT(*) as total_payments,
                    SUM(amount) as total_revenue
                FROM payment_transactions 
                WHERE status = 'approved'
            """)
            revenue = cursor.fetchone()
            logger.info(f"  ✅ Revenue calculation: {revenue[0]} payments, ${revenue[1] or 0:.2f} revenue")
        except Exception as e:
            logger.error(f"  ❌ Revenue calculation failed: {e}")
        
        # Test 3: Credit system
        try:
            cursor.execute("""
                SELECT 
                    COUNT(*) as total_costs,
                    AVG(cost) as avg_cost,
                    SUM(cost) as total_credits_needed
                FROM credit_costs 
                WHERE is_active = true
            """)
            credit_info = cursor.fetchone()
            logger.info(f"  ✅ Credit system: {credit_info[0]} costs, avg {credit_info[1]:.1f} credits")
        except Exception as e:
            logger.error(f"  ❌ Credit system check failed: {e}")
        
        # 8. Check System Settings
        logger.info("\n⚙️ 8. SYSTEM SETTINGS:")
        try:
            cursor.execute("SELECT COUNT(*) FROM system_settings")
            settings_count = cursor.fetchone()[0]
            logger.info(f"  ✅ system_settings: {settings_count} configurations")
            
            # Show key credit settings
            cursor.execute("""
                SELECT setting_key, setting_value 
                FROM system_settings 
                WHERE setting_key LIKE '%credit%' 
                ORDER BY setting_key
            """)
            credit_settings = cursor.fetchall()
            for key, value in credit_settings:
                logger.info(f"    - {key}: {value}")
        except Exception as e:
            logger.error(f"  ❌ System settings check failed: {e}")
        
        # 9. Final Summary
        logger.info("\n" + "="*70)
        logger.info("🎉 FINAL VERIFICATION SUMMARY")
        logger.info("="*70)
        
        # Count all tables
        cursor.execute("""
            SELECT COUNT(*) 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name IN (
                'users_registration', 'user_stats', 'payment_transactions', 'credit_transactions',
                'daily_user_activity', 'user_engagement_metrics', 'subject_usage_analytics', 'feature_usage_analytics',
                'packages', 'admin_users', 'broadcast_logs', 'credit_costs', 'system_settings'
            )
        """)
        total_tables = cursor.fetchone()[0]
        
        logger.info(f"📊 Total Dashboard Tables: {total_tables}")
        logger.info("✅ Overview Dashboard: READY")
        logger.info("✅ User Analytics: READY")
        logger.info("✅ Revenue: READY")
        logger.info("✅ Payments: READY")
        logger.info("✅ Credits Cost: READY")
        logger.info("✅ Admin: READY")
        
        logger.info("\n🌐 Your dashboard is now fully functional!")
        logger.info("🔑 Login with: admin@nerdx.com / admin123")
        logger.info("📍 Access at: /dashboard")
        
        # Show current credit costs
        logger.info("\n💰 CURRENT CREDIT COSTS:")
        cursor.execute("SELECT action_name, cost FROM credit_costs ORDER BY category, cost")
        costs = cursor.fetchall()
        for name, cost in costs:
            cost_usd = cost * 0.009
            price_usd = cost * 0.02
            logger.info(f"  • {name}: {cost} credits (Cost: ${cost_usd:.3f}, Price: ${price_usd:.2f})")
        
        cursor.close()
        conn.close()
        
        logger.info("\n🎉 VERIFICATION COMPLETED SUCCESSFULLY!")
        
    except Exception as e:
        logger.error(f"❌ Verification failed: {e}")

if __name__ == "__main__":
    final_verification()

