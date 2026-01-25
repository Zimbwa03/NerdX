#!/usr/bin/env python3
"""
Test script to verify welcome bonus functionality in Supabase
This script checks:
1. Recent user registrations
2. Welcome bonus claims status
3. Credit amounts
4. Tests the claim_welcome_bonus function
"""

import os
import sys
from datetime import datetime, timedelta

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database.external_db import (
    make_supabase_request,
    claim_welcome_bonus,
    get_user_registration,
    get_credit_breakdown
)
from config import Config
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_welcome_bonus_config():
    """Test that welcome bonus configuration is correct"""
    logger.info("=" * 60)
    logger.info("TEST 1: Welcome Bonus Configuration")
    logger.info("=" * 60)
    
    registration_bonus = Config.REGISTRATION_BONUS
    expected_units = 1500  # 150 credits = 1500 units
    
    logger.info(f"REGISTRATION_BONUS in config.py: {registration_bonus} units")
    logger.info(f"Expected: {expected_units} units (150 credits)")
    
    if registration_bonus == expected_units:
        logger.info("✅ Configuration is correct!")
        return True
    else:
        logger.error(f"❌ Configuration mismatch! Expected {expected_units}, got {registration_bonus}")
        return False

def test_recent_registrations():
    """Check recent user registrations and their welcome bonus status"""
    logger.info("\n" + "=" * 60)
    logger.info("TEST 2: Recent User Registrations")
    logger.info("=" * 60)
    
    try:
        # Get users registered in the last 7 days
        seven_days_ago = (datetime.utcnow() - timedelta(days=7)).isoformat()
        
        # Get recent users (Supabase REST API doesn't support order_by in filters)
        # We'll get all and sort in Python, or use a simpler query
        result = make_supabase_request(
            "GET",
            "users_registration",
            select="chat_id,name,surname,credits,welcome_bonus_claimed,created_at",
            limit=20,
            use_service_role=True
        )
        
        # Filter and sort in Python
        if result:
            filtered = [
                u for u in result 
                if u.get('created_at') and u.get('created_at') >= seven_days_ago
            ]
            # Sort by created_at descending
            filtered.sort(key=lambda x: x.get('created_at', ''), reverse=True)
            result = filtered[:10]
        
        if not result:
            logger.warning("No recent registrations found")
            return []
        
        logger.info(f"Found {len(result)} recent registrations:\n")
        
        for user in result:
            chat_id = user.get('chat_id', 'N/A')
            name = user.get('name', 'N/A')
            credits = user.get('credits', 0) or 0
            claimed = user.get('welcome_bonus_claimed', False)
            created = user.get('created_at', 'N/A')
            
            credits_display = credits / 10  # Convert units to credits
            
            status = "✅ Claimed" if claimed else "❌ NOT CLAIMED"
            credit_status = f"{credits_display} credits ({credits} units)"
            
            if credits < 1500:
                credit_status += " ⚠️ LESS THAN 150 CREDITS!"
            
            logger.info(f"User: {name} ({chat_id[:20]}...)")
            logger.info(f"  Created: {created}")
            logger.info(f"  Welcome Bonus: {status}")
            logger.info(f"  Credits: {credit_status}")
            logger.info("")
        
        return result
        
    except Exception as e:
        logger.error(f"Error checking recent registrations: {e}")
        return []

def test_specific_user(user_id: str):
    """Test welcome bonus for a specific user"""
    logger.info("\n" + "=" * 60)
    logger.info(f"TEST 3: Testing Welcome Bonus for User: {user_id}")
    logger.info("=" * 60)
    
    try:
        # Get user data before
        user_data_before = get_user_registration(user_id)
        if not user_data_before:
            logger.error(f"❌ User {user_id} not found in database")
            return False
        
        credits_before = user_data_before.get('credits', 0) or 0
        claimed_before = user_data_before.get('welcome_bonus_claimed', False)
        
        logger.info(f"Before claim_welcome_bonus:")
        logger.info(f"  Credits: {credits_before} units ({credits_before/10} credits)")
        logger.info(f"  Welcome Bonus Claimed: {claimed_before}")
        
        # Test claim_welcome_bonus function
        logger.info("\nCalling claim_welcome_bonus()...")
        result = claim_welcome_bonus(user_id)
        
        logger.info(f"\nResult: {result}")
        
        # Get user data after
        user_data_after = get_user_registration(user_id)
        if user_data_after:
            credits_after = user_data_after.get('credits', 0) or 0
            claimed_after = user_data_after.get('welcome_bonus_claimed', False)
            
            logger.info(f"\nAfter claim_welcome_bonus:")
            logger.info(f"  Credits: {credits_after} units ({credits_after/10} credits)")
            logger.info(f"  Welcome Bonus Claimed: {claimed_after}")
            
            if result.get('awarded', False):
                credits_added = credits_after - credits_before
                logger.info(f"\n✅ Welcome bonus awarded! Added {credits_added} units ({credits_added/10} credits)")
                
                if credits_added == Config.REGISTRATION_BONUS:
                    logger.info("✅ Correct amount awarded!")
                    return True
                else:
                    logger.warning(f"⚠️ Amount mismatch! Expected {Config.REGISTRATION_BONUS}, got {credits_added}")
                    return False
            else:
                logger.info(f"ℹ️ Welcome bonus not awarded. Reason: {result.get('message', 'Unknown')}")
                return True  # Not an error if already claimed
        
        return False
        
    except Exception as e:
        logger.error(f"Error testing user {user_id}: {e}", exc_info=True)
        return False

def test_credit_breakdown(user_id: str):
    """Test credit breakdown for a user"""
    logger.info("\n" + "=" * 60)
    logger.info(f"TEST 4: Credit Breakdown for User: {user_id}")
    logger.info("=" * 60)
    
    try:
        breakdown = get_credit_breakdown(user_id)
        logger.info(f"Credit Breakdown: {breakdown}")
        
        total = breakdown.get('total', 0)
        free = breakdown.get('free_credits', 0)
        purchased = breakdown.get('purchased_credits', 0)
        claimed = breakdown.get('welcome_bonus_claimed', False)
        
        logger.info(f"\nTotal Credits: {total} units ({total/10} credits)")
        logger.info(f"Free Credits: {free} units ({free/10} credits)")
        logger.info(f"Purchased Credits: {purchased} units ({purchased/10} credits)")
        logger.info(f"Welcome Bonus Claimed: {claimed}")
        
        return breakdown
        
    except Exception as e:
        logger.error(f"Error getting credit breakdown: {e}")
        return None

def main():
    """Run all tests"""
    logger.info("\n" + "=" * 60)
    logger.info("WELCOME BONUS SUPABASE TEST SUITE")
    logger.info("=" * 60)
    
    # Test 1: Configuration
    config_ok = test_welcome_bonus_config()
    
    # Test 2: Recent registrations
    recent_users = test_recent_registrations()
    
    # Test 3: Test specific users if provided
    if len(sys.argv) > 1:
        test_user_id = sys.argv[1]
        test_specific_user(test_user_id)
        test_credit_breakdown(test_user_id)
    elif recent_users:
        # Test the most recent user
        if recent_users:
            most_recent = recent_users[0]
            test_user_id = most_recent.get('chat_id')
            if test_user_id:
                logger.info(f"\nTesting most recent user: {test_user_id}")
                test_specific_user(test_user_id)
                test_credit_breakdown(test_user_id)
    
    logger.info("\n" + "=" * 60)
    logger.info("TEST SUITE COMPLETE")
    logger.info("=" * 60)
    
    if not config_ok:
        logger.error("\n❌ Configuration test failed! Please check config.py")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())
