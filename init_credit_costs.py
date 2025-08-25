"""
Credit Costs Initialization Script
Run this to set up the credit costs database table
"""

import os
import logging
from database.credit_costs_db import create_credit_costs_table, credit_cost_service

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_credit_costs():
    """Initialize the credit costs system"""
    try:
        logger.info("🔧 Initializing credit costs system...")
        
        # Check if database URL is configured
        if not os.environ.get('DATABASE_URL'):
            logger.error("❌ DATABASE_URL environment variable not set")
            return False
        
        # Create the credit costs table
        logger.info("📊 Creating credit costs table...")
        success = create_credit_costs_table()
        
        if success:
            logger.info("✅ Credit costs table created successfully")
            
            # Test the system
            logger.info("🧪 Testing credit cost retrieval...")
            test_cost = credit_cost_service.get_credit_cost('combined_science_topical')
            logger.info(f"✅ Test successful - Combined Science topical cost: {test_cost}")
            
            # Display all costs
            logger.info("📋 Current credit costs:")
            costs_by_category = credit_cost_service.get_costs_by_category()
            
            for category, costs in costs_by_category.items():
                logger.info(f"  📂 {category}:")
                for cost in costs:
                    logger.info(f"    • {cost['component']}: {cost['cost']} credits")
            
            logger.info("🎉 Credit costs system initialized successfully!")
            return True
        else:
            logger.error("❌ Failed to create credit costs table")
            return False
            
    except Exception as e:
        logger.error(f"❌ Error initializing credit costs: {e}")
        return False

if __name__ == "__main__":
    init_credit_costs()
