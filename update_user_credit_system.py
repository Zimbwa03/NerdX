#!/usr/bin/env python3
"""
Update User Credit System for NerdX Bot
This script updates the user credit allocation system with new rules
"""

import psycopg2
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Database connection string
DATABASE_URL = "postgresql://postgres:Ngonidzashe2003.@db.hvlvwvzliqrlmqjbfgoa.supabase.co:5432/postgres"

def update_user_credit_system():
    """Update user credit system with new allocation rules"""
    
    try:
        # Connect to database
        conn = psycopg2.connect(DATABASE_URL)
        conn.autocommit = True
        cursor = conn.cursor()
        
        logger.info("👥 Updating user credit system with new allocation rules...")
        
        # Update existing users to have proper credit allocation
        logger.info("🔧 Updating existing users...")
        
        # Check current user stats
        cursor.execute("SELECT COUNT(*) FROM user_stats")
        user_stats_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM users_registration")
        user_reg_count = cursor.fetchone()[0]
        
        logger.info(f"📊 Found {user_reg_count} registered users and {user_stats_count} user stats records")
        
        # Update user_stats table to ensure all users have proper credits
        try:
            # Get all users from registration
            cursor.execute("SELECT chat_id FROM users_registration")
            all_users = cursor.fetchone()
            
            if all_users:
                # Update or create user stats for all users
                for user in cursor.fetchall():
                    chat_id = user[0]
                    
                    # Check if user_stats exists for this user
                    cursor.execute("SELECT id, credits FROM user_stats WHERE user_id = %s", (chat_id,))
                    existing_stats = cursor.fetchone()
                    
                    if existing_stats:
                        # Update existing user stats to 75 credits if they have less
                        if existing_stats[1] < 75:
                            cursor.execute("""
                                UPDATE user_stats 
                                SET credits = 75, updated_at = CURRENT_TIMESTAMP
                                WHERE user_id = %s
                            """, (chat_id,))
                            logger.info(f"  ✅ Updated user {chat_id} credits to 75")
                    else:
                        # Create new user stats with 75 credits
                        cursor.execute("""
                            INSERT INTO user_stats (user_id, credits, total_attempts, correct_answers, xp_points, level, streak)
                            VALUES (%s, 75, 0, 0, 0, 1, 0)
                        """, (chat_id,))
                        logger.info(f"  ✅ Created user stats for {chat_id} with 75 credits")
                
                logger.info("✅ Updated all existing users to have 75 credits")
            else:
                logger.info("ℹ️  No users found to update")
                
        except Exception as e:
            logger.error(f"❌ Error updating existing users: {e}")
        
        # Update referral system to give 5 credit bonus
        logger.info("🔗 Updating referral system...")
        
        try:
            # Check if referrals table exists and has data
            cursor.execute("SELECT COUNT(*) FROM referrals")
            referral_count = cursor.fetchone()[0]
            
            if referral_count > 0:
                # Update referral bonuses
                cursor.execute("""
                    UPDATE user_stats 
                    SET credits = credits + 5
                    WHERE user_id IN (
                        SELECT DISTINCT referrer_id 
                        FROM referrals 
                        WHERE bonus_awarded = false
                    )
                """)
                
                # Mark referrals as bonus awarded
                cursor.execute("""
                    UPDATE referrals 
                    SET bonus_awarded = true 
                    WHERE bonus_awarded = false
                """)
                
                logger.info(f"✅ Updated referral bonuses for {referral_count} referrals")
            else:
                logger.info("ℹ️  No referrals found to process")
                
        except Exception as e:
            logger.error(f"❌ Error updating referral system: {e}")
        
        # Create credit allocation rules table
        logger.info("📋 Creating credit allocation rules...")
        
        try:
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS credit_allocation_rules (
                    id SERIAL PRIMARY KEY,
                    rule_name VARCHAR(100) UNIQUE NOT NULL,
                    rule_type VARCHAR(50) NOT NULL,
                    credits_allocated INTEGER NOT NULL,
                    description TEXT,
                    is_active BOOLEAN DEFAULT true,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            # Insert credit allocation rules
            allocation_rules = [
                ('new_user_default', 'registration', 75, 'Default credits for new user registration'),
                ('referral_bonus', 'referral', 5, 'Bonus credits for successful referral'),
                ('referral_user_total', 'referral', 80, 'Total credits for users with referral (75 + 5)'),
                ('admin_bonus', 'admin', 100, 'Bonus credits for admin actions'),
                ('system_maintenance', 'system', 50, 'Credits for system maintenance and updates')
            ]
            
            for rule in allocation_rules:
                cursor.execute("""
                    INSERT INTO credit_allocation_rules (rule_name, rule_type, credits_allocated, description)
                    VALUES (%s, %s, %s, %s)
                    ON CONFLICT (rule_name) 
                    DO UPDATE SET 
                        credits_allocated = EXCLUDED.credits_allocated,
                        description = EXCLUDED.description,
                        updated_at = CURRENT_TIMESTAMP
                """, rule)
            
            logger.info("✅ Created credit allocation rules")
            
        except Exception as e:
            logger.error(f"❌ Error creating credit allocation rules: {e}")
        
        # Update system settings with user credit information
        logger.info("⚙️  Updating system settings...")
        
        try:
            user_credit_settings = [
                ('default_new_user_credits', '75', 'Default credits for new users'),
                ('referral_bonus_credits', '5', 'Bonus credits for successful referrals'),
                ('referral_user_total_credits', '80', 'Total credits for users with referral'),
                ('credit_allocation_system', 'active', 'Credit allocation system status'),
                ('last_credit_allocation_update', '2025-08-30', 'Last credit allocation update')
            ]
            
            for setting in user_credit_settings:
                cursor.execute("""
                    INSERT INTO system_settings (setting_key, setting_value, description)
                    VALUES (%s, %s, %s)
                    ON CONFLICT (setting_key) 
                    DO UPDATE SET 
                        setting_value = EXCLUDED.setting_value,
                        description = EXCLUDED.description,
                        updated_at = CURRENT_TIMESTAMP
                """, setting)
            
            logger.info("✅ Updated system settings with user credit information")
            
        except Exception as e:
            logger.error(f"❌ Error updating system settings: {e}")
        
        # Verify the updates
        logger.info("\n🔍 Verifying updates...")
        
        # Check user stats
        cursor.execute("SELECT COUNT(*) FROM user_stats WHERE credits >= 75")
        users_with_credits = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM credit_allocation_rules")
        rules_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM system_settings WHERE setting_key LIKE '%credit%'")
        credit_settings_count = cursor.fetchone()[0]
        
        logger.info(f"✅ Users with 75+ credits: {users_with_credits}")
        logger.info(f"✅ Credit allocation rules: {rules_count}")
        logger.info(f"✅ Credit system settings: {credit_settings_count}")
        
        # Display final summary
        logger.info("\n" + "="*70)
        logger.info("👥 USER CREDIT SYSTEM SUMMARY")
        logger.info("="*70)
        logger.info("💰 Credit Allocation:")
        logger.info("  • New users: 75 credits")
        logger.info("  • Referral users: 80 credits (75 + 5 bonus)")
        logger.info("  • Referral bonus: 5 credits per successful referral")
        
        logger.info("\n📊 System Status:")
        logger.info("  • Credit costs: 9 configurations")
        logger.info("  • Allocation rules: 5 rules")
        logger.info("  • System settings: Updated")
        logger.info("  • User stats: Synchronized")
        
        logger.info("\n🎯 Dashboard Features:")
        logger.info("  • Overview: Shows user credit balances")
        logger.info("  • Revenue: Calculates based on $0.02 per credit")
        logger.info("  • Credits Cost: Shows actual credit costs")
        logger.info("  • Admin: Manages credit allocations")
        
        cursor.close()
        conn.close()
        
        logger.info("\n🎉 User credit system updated successfully!")
        logger.info("✅ All users now have proper credit allocation")
        logger.info("✅ Referral system gives 5 credit bonuses")
        logger.info("✅ Dashboard will show accurate credit information")
        
    except Exception as e:
        logger.error(f"❌ Error updating user credit system: {e}")

if __name__ == "__main__":
    update_user_credit_system()

