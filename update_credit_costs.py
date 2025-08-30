#!/usr/bin/env python3
"""
Update Credit Costs for NerdX Bot Dashboard
This script updates the credit costs table with the exact pricing structure specified
"""

import psycopg2
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Database connection string
DATABASE_URL = "postgresql://postgres:Ngonidzashe2003.@db.hvlvwvzliqrlmqjbfgoa.supabase.co:5432/postgres"

def update_credit_costs():
    """Update credit costs with the exact pricing structure"""
    
    try:
        # Connect to database
        conn = psycopg2.connect(DATABASE_URL)
        conn.autocommit = True
        cursor = conn.cursor()
        
        logger.info("💰 Updating credit costs with new pricing structure...")
        
        # Clear existing credit costs
        cursor.execute("DELETE FROM credit_costs")
        logger.info("✅ Cleared existing credit costs")
        
        # Insert new credit costs according to specifications
        credit_costs_data = [
            # Combined Science
            ('combined_science_topical', 'Combined Science Topical Questions', 'science', 1, 'Combined science topical practice questions', 'science'),
            ('combined_science_exam', 'Combined Science Exam Questions', 'science', 1, 'Combined science exam-style questions', 'science'),
            
            # Mathematics
            ('math_topical', 'Mathematics Topical Questions', 'math', 2, 'Mathematics topical practice questions', 'math'),
            ('math_exam', 'Mathematics Exam Questions', 'math', 1, 'Mathematics exam-style questions', 'math'),
            ('math_graphs', 'Mathematics Graphs', 'math', 3, 'Mathematics graph generation and practice', 'math'),
            
            # English
            ('english_topical', 'English Topical Questions', 'english', 1, 'English language topical practice', 'english'),
            ('english_comprehension', 'English Comprehension', 'english', 3, 'English reading comprehension', 'english'),
            ('english_essay_writing', 'English Essay Writing', 'english', 3, 'English essay writing assistance', 'english'),
            
            # Audio Features
            ('audio_generation', 'Audio Generation', 'features', 10, 'Audio question generation and voice features', 'features'),
        ]
        
        # Insert the new credit costs
        for cost_data in credit_costs_data:
            cursor.execute("""
                INSERT INTO credit_costs (action_key, action_name, category, cost, description, component)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, cost_data)
        
        logger.info(f"✅ Inserted {len(credit_costs_data)} new credit cost configurations")
        
        # Update system settings for credit costs
        logger.info("🔧 Updating system settings...")
        
        # Update admin system settings with new credit information
        try:
            # Check if system_settings table exists, if not create it
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS system_settings (
                    id SERIAL PRIMARY KEY,
                    setting_key VARCHAR(100) UNIQUE NOT NULL,
                    setting_value TEXT NOT NULL,
                    description TEXT,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            # Insert/update credit system settings
            credit_settings = [
                ('credit_cost_per_operation', '0.009', 'Cost per credit operation in USD'),
                ('credit_selling_price', '0.02', 'Selling price per credit to users in USD'),
                ('new_user_credits', '75', 'Default credits for new users'),
                ('referral_user_credits', '80', 'Credits for users with referral (75 + 5)'),
                ('referral_bonus_per_user', '5', 'Bonus credits for each successful referral'),
                ('credit_system_active', 'true', 'Credit system status'),
                ('last_credit_update', '2025-08-30', 'Last credit system update date')
            ]
            
            for setting in credit_settings:
                cursor.execute("""
                    INSERT INTO system_settings (setting_key, setting_value, description)
                    VALUES (%s, %s, %s)
                    ON CONFLICT (setting_key) 
                    DO UPDATE SET 
                        setting_value = EXCLUDED.setting_value,
                        description = EXCLUDED.description,
                        updated_at = CURRENT_TIMESTAMP
                """, setting)
            
            logger.info("✅ Updated system settings with credit information")
            
        except Exception as e:
            logger.error(f"❌ Error updating system settings: {e}")
        
        # Verify the update
        cursor.execute("SELECT action_key, action_name, cost FROM credit_costs ORDER BY category, cost")
        updated_costs = cursor.fetchall()
        
        logger.info("\n📋 Updated Credit Costs:")
        logger.info("="*60)
        
        current_category = ""
        for cost in updated_costs:
            action_key, action_name, credit_cost = cost
            
            # Group by category
            if 'science' in action_key:
                category = "🔬 Combined Science"
            elif 'math' in action_key:
                category = "📐 Mathematics"
            elif 'english' in action_key:
                category = "📚 English"
            else:
                category = "🎵 Features"
            
            if category != current_category:
                logger.info(f"\n{category}:")
                current_category = category
            
            # Calculate cost in USD
            cost_usd = credit_cost * 0.009
            selling_price_usd = credit_cost * 0.02
            
            logger.info(f"  • {action_name}: {credit_cost} credits (Cost: ${cost_usd:.3f}, Price: ${selling_price_usd:.2f})")
        
        # Display credit system summary
        logger.info("\n" + "="*60)
        logger.info("💰 CREDIT SYSTEM SUMMARY")
        logger.info("="*60)
        logger.info("📊 Credit Costs:")
        logger.info("  • Combined Science: 1 credit per question")
        logger.info("  • Mathematics: 1-3 credits per question")
        logger.info("  • English: 1-3 credits per question")
        logger.info("  • Audio Generation: 10 credits")
        
        logger.info("\n💵 Financial Structure:")
        logger.info("  • Cost per credit: $0.009")
        logger.info("  • Selling price per credit: $0.02")
        logger.info("  • Profit margin per credit: $0.011")
        
        logger.info("\n👥 User Credit Allocation:")
        logger.info("  • New users: 75 credits")
        logger.info("  • Referral users: 80 credits (75 + 5)")
        logger.info("  • Referral bonus: 5 credits per successful referral")
        
        # Count total records
        cursor.execute("SELECT COUNT(*) FROM credit_costs")
        total_costs = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM system_settings")
        total_settings = cursor.fetchone()[0]
        
        logger.info(f"\n📈 Database Status:")
        logger.info(f"  • Credit costs configured: {total_costs}")
        logger.info(f"  • System settings: {total_settings}")
        
        cursor.close()
        conn.close()
        
        logger.info("\n🎉 Credit costs updated successfully!")
        logger.info("✅ All dashboard features will now use the new credit structure")
        
    except Exception as e:
        logger.error(f"❌ Error updating credit costs: {e}")

if __name__ == "__main__":
    update_credit_costs()

