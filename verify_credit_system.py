import os
import sys
import logging
import time

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Add parent dir to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database.external_db import get_user_credits, deduct_credits, add_credits

def test_credit_system():
    logger.info("🧪 Starting Credit System Verification")
    
    # 1. Use a test user ID
    user_id = "TEST_USER_VERIFY"
    
    # 2. Ensure user has credits
    initial_credits = get_user_credits(user_id)
    logger.info(f"Initial credits for {user_id}: {initial_credits}")
    
    if initial_credits < 50:
        logger.info("Adding test credits...")
        add_credits(user_id, 100, "Verification Setup")
        initial_credits = get_user_credits(user_id)
        logger.info(f"New credits: {initial_credits}")

    # 3. Test Deduction (Atomic RPC or Fallback)
    deduct_amount = 5
    logger.info(f"Attempting to deduct {deduct_amount} credits...")
    
    start_time = time.time()
    success = deduct_credits(user_id, deduct_amount, "verify_test", "Verification Test Deduction")
    end_time = time.time()
    
    if success:
        new_credits = get_user_credits(user_id)
        logger.info(f"✅ Deduction successful!")
        logger.info(f"Old Balance: {initial_credits}")
        logger.info(f"New Balance: {new_credits}")
        logger.info(f"Time taken: {end_time - start_time:.4f}s")
        
        if initial_credits - new_credits == deduct_amount:
            logger.info("✅ Balance calculation correct")
        else:
            logger.error(f"❌ Balance mismatch! Expected change: {deduct_amount}, Actual: {initial_credits - new_credits}")
    else:
        logger.error("❌ Deduction failed")

if __name__ == "__main__":
    test_credit_system()
