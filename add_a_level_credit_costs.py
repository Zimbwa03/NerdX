"""
Script to add A-Level credit costs to the database
This will fix the warning: "Credit cost for 'a_level_*' not found in database"
"""

import os
import logging

# Load environment variables from .env file
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    # python-dotenv not installed, continue without it
    pass

from database.credit_costs_db import credit_cost_service

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def add_a_level_credit_costs():
    """Add all A-Level credit costs to the database"""
    
    a_level_costs = [
        {
            'action_key': 'a_level_biology_topical',
            'cost': 5,
            'category': 'A-Level',
            'component': 'Biology Topical Questions',
            'description': 'Credit cost for A-Level Biology topical questions (MCQ, Structured, Essay)'
        },
        {
            'action_key': 'a_level_biology_exam',
            'cost': 8,
            'category': 'A-Level',
            'component': 'Biology Exam Practice',
            'description': 'Credit cost for A-Level Biology exam practice questions'
        },
        {
            'action_key': 'a_level_chemistry_topical',
            'cost': 5,
            'category': 'A-Level',
            'component': 'Chemistry Topical Questions',
            'description': 'Credit cost for A-Level Chemistry topical questions'
        },
        {
            'action_key': 'a_level_chemistry_exam',
            'cost': 8,
            'category': 'A-Level',
            'component': 'Chemistry Exam Practice',
            'description': 'Credit cost for A-Level Chemistry exam practice questions'
        },
        {
            'action_key': 'a_level_physics_topical',
            'cost': 5,
            'category': 'A-Level',
            'component': 'Physics Topical Questions',
            'description': 'Credit cost for A-Level Physics topical questions'
        },
        {
            'action_key': 'a_level_physics_exam',
            'cost': 8,
            'category': 'A-Level',
            'component': 'Physics Exam Practice',
            'description': 'Credit cost for A-Level Physics exam practice questions'
        },
        {
            'action_key': 'a_level_pure_math_topical',
            'cost': 5,
            'category': 'A-Level',
            'component': 'Pure Mathematics Topical Questions',
            'description': 'Credit cost for A-Level Pure Mathematics topical questions'
        },
        {
            'action_key': 'a_level_pure_math_exam',
            'cost': 8,
            'category': 'A-Level',
            'component': 'Pure Mathematics Exam Practice',
            'description': 'Credit cost for A-Level Pure Mathematics exam practice questions'
        }
    ]
    
    logger.info("🔧 Adding A-Level credit costs to database...")
    
    success_count = 0
    for cost_data in a_level_costs:
        try:
            success = credit_cost_service.add_credit_cost(
                action_key=cost_data['action_key'],
                cost=cost_data['cost'],
                category=cost_data['category'],
                component=cost_data['component'],
                description=cost_data['description']
            )
            if success:
                success_count += 1
                logger.info(f"✅ {cost_data['action_key']}: {cost_data['cost']} credits")
            else:
                logger.error(f"❌ Failed to add {cost_data['action_key']}")
        except Exception as e:
            logger.error(f"❌ Error adding {cost_data['action_key']}: {e}")
    
    logger.info(f"\n📊 Summary: Added/Updated {success_count}/{len(a_level_costs)} A-Level credit costs")
    
    # Verify by checking costs
    logger.info("\n🧪 Verifying A-Level credit costs...")
    for cost_data in a_level_costs:
        retrieved_cost = credit_cost_service.get_credit_cost(cost_data['action_key'])
        if retrieved_cost == cost_data['cost']:
            logger.info(f"✅ {cost_data['action_key']}: {retrieved_cost} credits (verified)")
        else:
            logger.warning(f"⚠️  {cost_data['action_key']}: Expected {cost_data['cost']}, got {retrieved_cost}")
    
    logger.info("\n🎉 A-Level credit costs update complete!")
    return success_count == len(a_level_costs)

if __name__ == "__main__":
    if not os.environ.get('DATABASE_URL'):
        logger.error("❌ DATABASE_URL environment variable not set")
        exit(1)
    
    success = add_a_level_credit_costs()
    exit(0 if success else 1)

