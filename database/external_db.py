#!/usr/bin/env python3
"""
Direct database operations for the WhatsApp bot using Supabase
This module handles all database interactions with Supabase REST API
"""

import os
import requests
import random
import json
import string
from datetime import datetime, timedelta
from typing import Optional, Dict, List
import logging

from utils.credit_units import CREDIT_UNITS_PER_CREDIT, format_credits

logger = logging.getLogger(__name__)

# Supabase configuration - use environment variables
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

# Use service role key as default for backward compatibility
SUPABASE_KEY = os.getenv("SUPABASE_KEY", SUPABASE_ANON_KEY)

_is_configured = SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY and SUPABASE_ANON_KEY

# Validate environment variables
if _is_configured:
    logger.info("Supabase properly configured and ready")
else:
    logger.warning("Supabase not configured - external database features will be disabled")

def create_users_registration_table():
    """Create users_registration table via SQL execution"""
    try:
        # SQL to create the users_registration table
        sql_query = """
        CREATE TABLE IF NOT EXISTS users_registration (
            id SERIAL PRIMARY KEY,
            chat_id VARCHAR(255) UNIQUE NOT NULL,
            name VARCHAR(255) NOT NULL,
            surname VARCHAR(255) NOT NULL,
            date_of_birth VARCHAR(10) NOT NULL,
            nerdx_id VARCHAR(10) UNIQUE NOT NULL,
            referred_by_nerdx_id VARCHAR(10),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_users_registration_chat_id ON users_registration(chat_id);
        CREATE INDEX IF NOT EXISTS idx_users_registration_nerdx_id ON users_registration(nerdx_id);
        CREATE INDEX IF NOT EXISTS idx_users_registration_referred_by ON users_registration(referred_by_nerdx_id);

        -- Enable Row Level Security
        ALTER TABLE users_registration ENABLE ROW LEVEL SECURITY;

        -- Create policy to allow all operations (adjust as needed for production)
        DROP POLICY IF EXISTS "Allow all operations on users_registration" ON users_registration;
        CREATE POLICY "Allow all operations on users_registration" ON users_registration
            FOR ALL USING (true) WITH CHECK (true);
        """

        headers = {
            "apikey": SUPABASE_SERVICE_ROLE_KEY,
            "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
            "Content-Type": "application/json"
        }

        # Try multiple methods to create the table

        # Check if table already exists by trying to query it
        try:
            logger.info("Checking if users_registration table exists...")
            test_result = make_supabase_request("GET", "users_registration", limit=1, use_service_role=True)
            if test_result is not None:
                logger.info("Users registration table already exists and is accessible")
                return True
        except Exception as check_error:
            logger.warning(f"Table check failed: {check_error}")

        # If table doesn't exist, provide clear instructions
        logger.warning("Users registration table does not exist. Please create it manually in Supabase SQL Editor:")
        logger.warning("""
        CREATE TABLE IF NOT EXISTS users_registration (
            id SERIAL PRIMARY KEY,
            chat_id VARCHAR(255) UNIQUE NOT NULL,
            name VARCHAR(255) NOT NULL,
            surname VARCHAR(255) NOT NULL,
            date_of_birth VARCHAR(10) NOT NULL,
            nerdx_id VARCHAR(10) UNIQUE NOT NULL,
            referred_by_nerdx_id VARCHAR(10),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_users_registration_referred_by ON users_registration(referred_by_nerdx_id);

        -- Enable Row Level Security
        ALTER TABLE users_registration ENABLE ROW LEVEL SECURITY;

        -- Create policy to allow all operations
        DROP POLICY IF EXISTS "Allow all operations on users_registration" ON users_registration;
        CREATE POLICY "Allow all operations on users_registration" ON users_registration
            FOR ALL USING (true) WITH CHECK (true);
        """)

        headers = {
            "apikey": SUPABASE_SERVICE_ROLE_KEY,
            "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
            "Content-Type": "application/json"
        }

        # Try to create table via direct request if possible (often not possible with REST unless RPC)
        # So we just log the instruction as done above.
        return False

    except Exception as e:
        logger.error(f"Error creating users_registration table: {e}")
        return False

def create_essay_submissions_table():
    """Create english_essay_submissions table"""
    # SQL definition for the user to run manually if needed, or for documentation
    sql = """
    CREATE TABLE IF NOT EXISTS english_essay_submissions (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id TEXT NOT NULL,
        essay_type TEXT NOT NULL, -- 'free_response' or 'guided'
        topic_title TEXT,
        original_essay TEXT,
        corrected_essay TEXT,
        teacher_comment TEXT,
        detailed_feedback JSONB,
        score INTEGER,
        max_score INTEGER,
        pdf_report_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
    );

    CREATE INDEX IF NOT EXISTS idx_essay_submissions_user_id ON english_essay_submissions(user_id);
    CREATE INDEX IF NOT EXISTS idx_essay_submissions_created_at ON english_essay_submissions(created_at);
    """
    
    # We check if table exists by trying to select from it
    try:
        result = make_supabase_request("GET", "english_essay_submissions", limit=1, use_service_role=True)
        if result is not None:
            logger.info("english_essay_submissions table exists")
            return True
        else:
            raise Exception("Table check returned None (404)")
    except Exception:
        logger.warning("english_essay_submissions table may not exist. Please run SQL in Supabase.")
        logger.info(f"SQL:\n{sql}")
        return False

def create_payment_transactions_table():
    """Create payment_transactions table via SQL execution"""
    try:
        # SQL to create the payment_transactions table
        sql_query = """
        CREATE TABLE IF NOT EXISTS payment_transactions (
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            package_id VARCHAR(50) NOT NULL,
            reference_code VARCHAR(100) UNIQUE NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            credits INTEGER NOT NULL,
            status VARCHAR(50) DEFAULT 'pending',
            payment_proof TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            proof_submitted_at TIMESTAMP,
            approved_at TIMESTAMP,
            credits_added INTEGER DEFAULT 0
        );

        CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON payment_transactions(user_id);
        CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);
        CREATE INDEX IF NOT EXISTS idx_payment_transactions_created_at ON payment_transactions(created_at);
        """

        # Check if table already exists by trying to query it
        test_result = make_supabase_request("GET", "payment_transactions", limit=1, use_service_role=True)
        if test_result is not None:
            logger.info("Payment transactions table already exists and is accessible")
            return True

        # If table doesn't exist, we'll need to create it manually in Supabase
        logger.warning("Payment transactions table does not exist. Please create it manually in Supabase SQL Editor:")
        logger.warning("""
        CREATE TABLE IF NOT EXISTS payment_transactions (
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            package_id VARCHAR(50) NOT NULL,
            reference_code VARCHAR(100) UNIQUE NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            credits INTEGER NOT NULL,
            status VARCHAR(50) DEFAULT 'pending',
            payment_proof TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            proof_submitted_at TIMESTAMP,
            approved_at TIMESTAMP,
            credits_added INTEGER DEFAULT 0
        );

        CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON payment_transactions(user_id);
        CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);
        CREATE INDEX IF NOT EXISTS idx_payment_transactions_created_at ON payment_transactions(created_at);
        """)

        return True

    except Exception as e:
        logger.error(f"Error creating payment_transactions table: {e}")
        return False


def create_user_projects_table():
    """Create user_projects table for ZIMSEC Project Assistant"""
    try:
        sql_query_projects = """
        CREATE TABLE IF NOT EXISTS user_projects (
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            project_title VARCHAR(500),
            subject VARCHAR(100),
            current_stage VARCHAR(50) DEFAULT 'Selection',
            project_data JSONB NOT NULL DEFAULT '{}'::jsonb,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            completed BOOLEAN DEFAULT FALSE
        );

        CREATE INDEX IF NOT EXISTS idx_user_projects_user_id ON user_projects(user_id);
        CREATE INDEX IF NOT EXISTS idx_user_projects_completed ON user_projects(completed);
        """
        
        sql_query_chat = """
        CREATE TABLE IF NOT EXISTS project_chat_history (
            id SERIAL PRIMARY KEY,
            project_id INTEGER REFERENCES user_projects(id) ON DELETE CASCADE,
            role VARCHAR(50) NOT NULL,
            content TEXT NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_project_chat_history_project_id ON project_chat_history(project_id);
        """
        
        test_result = make_supabase_request("GET", "user_projects", limit=1, use_service_role=True)
        if test_result is not None:
            logger.info("User projects table already exists and is accessible")
            # Check chat table too
            test_chat = make_supabase_request("GET", "project_chat_history", limit=1, use_service_role=True)
            if test_chat is None:
                logger.warning("Project chat history table does not exist. Please create it manually:")
                logger.warning(sql_query_chat)
            return True
        
        logger.warning("User projects table does not exist. Please create it manually in Supabase SQL Editor:")
        logger.warning(sql_query_projects)
        logger.warning(sql_query_chat)
        
        return True
        
    except Exception as e:
        logger.error(f"Error creating user_projects table: {e}")
        return False


def make_supabase_request(method, table, data=None, select="*", filters=None, limit=None, offset=None, use_service_role=False):
    """Make a request to Supabase REST API with proper authentication"""

    # Use SERVICE_ROLE_KEY for write operations and admin tasks, ANON_KEY for reads
    if method in ["POST", "PATCH", "DELETE"] or use_service_role:
        api_key = SUPABASE_SERVICE_ROLE_KEY
        logger.info(f"Using SERVICE_ROLE_KEY for {method} operation on {table}")
    else:
        api_key = SUPABASE_ANON_KEY
        logger.info(f"Using ANON_KEY for {method} operation on {table}")

    headers = {
        "apikey": api_key,
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    # Add return preference for POST/PATCH operations
    if method in ["POST", "PATCH"]:
        headers["Prefer"] = "return=representation"

    url = f"{SUPABASE_URL}/rest/v1/{table}"

    params = {}
    if select and method == "GET":
        params["select"] = select
    if filters:
        params.update(filters)
    if limit:
        params["limit"] = str(limit)
    if offset:
        params["offset"] = str(offset)

    try:
        logger.debug(f"Making {method} request to {table}")
        
        response = None
        if method == "GET":
            response = requests.get(url, headers=headers, params=params, timeout=30)
        elif method == "POST":
            response = requests.post(url, headers=headers, json=data, params=params, timeout=30)
        elif method == "PATCH":
            response = requests.patch(url, headers=headers, json=data, params=params, timeout=30)
        elif method == "DELETE":
            # For DELETE, we want to return representation to confirm deletion
            headers["Prefer"] = "return=representation"
            response = requests.delete(url, headers=headers, params=params, timeout=30)

        if response is None:
            logger.error(f"Unsupported HTTP method: {method}")
            return None

        logger.debug(f"Response status: {response.status_code} for {method} {table}")
        
        # For DELETE, check status code before raising
        if method == "DELETE":
            if response.status_code == 204:
                # 204 No Content means successful deletion
                logger.info(f"DELETE successful (204) for {table}")
                return []
            elif response.status_code == 200:
                # 200 with representation
                try:
                    deleted_records = response.json()
                    logger.info(f"DELETE successful (200) for {table}, deleted: {len(deleted_records) if isinstance(deleted_records, list) else 1} record(s)")
                    return deleted_records
                except:
                    logger.info(f"DELETE successful (200) for {table}, empty response")
                    return []
            else:
                # Unexpected status code
                logger.warning(f"DELETE returned status {response.status_code} for {table}")
                response.raise_for_status()
                return []
        
        response.raise_for_status()
        return response.json()
    except requests.exceptions.HTTPError as e:
        if 'response' in locals() and response:
            logger.error(f"HTTP Error {response.status_code}: {response.text}")
        else:
            logger.error(f"HTTP Error: {e}")
        return None
    except Exception as e:
        logger.error(f"Supabase request failed: {e}")
        return None

def get_or_create_user_stats(user_id, username=None, first_name=None):
    """Get user stats or create new user with 100 free credits"""
    try:
        # Validate inputs
        if not user_id:
            logger.error("user_id is required")
            return None

        # Try to get existing user
        result = make_supabase_request("GET", "user_stats", filters={"user_id": f"eq.{user_id}"})

        if result and len(result) > 0:
            logger.info(f"Found existing user: {user_id}")
            return result[0]

        logger.info(f"Creating new user: {user_id}")

        # Create new user with free credits
        new_user = {
            "user_id": str(user_id),
            "username": username or f"user_{str(user_id)[-4:]}",
            "first_name": first_name or "User",
            "total_attempts": 0,
            "correct_answers": 0,
            "xp_points": 0,
            "level": 1,
            "streak": 0,
            "max_streak": 0,
            "credits": 100
        }

        result = make_supabase_request("POST", "user_stats", new_user)
        if result and len(result) > 0:
            logger.info(f"Successfully created user: {user_id}")
            return result[0]
        else:
            logger.error(f"Failed to create user: {user_id}")
            return new_user

    except Exception as e:
        logger.error(f"Error in get_or_create_user_stats: {e}")
        return None

def get_user_stats(user_id):
    """Get user statistics"""
    result = make_supabase_request("GET", "user_stats", filters={"user_id": f"eq.{user_id}"})
    return result[0] if result and len(result) > 0 else None

def update_user_stats(user_id, updates):
    """Update user statistics"""
    result = make_supabase_request("PATCH", "user_stats", updates, filters={"user_id": f"eq.{user_id}"})
    return result[0] if result else None

def add_xp(user_id, xp_amount, activity_type, description="XP earned"):
    """Add XP to user account and update level"""
    try:
        # Get current user stats
        user_stats = get_user_stats(user_id)
        if not user_stats:
            user_stats = get_or_create_user_stats(user_id)

        current_xp = user_stats.get('xp_points', 0) if user_stats else 0
        current_level = user_stats.get('level', 1) if user_stats else 1

        new_xp = current_xp + xp_amount

        # Calculate new level based on XP
        new_level = calculate_level_from_xp(new_xp)

        # Update user stats
        updates = {
            'xp_points': new_xp,
            'level': new_level
        }

        result = update_user_stats(user_id, updates)

        # Log XP transaction (non-blocking - continue if table doesn't exist)
        try:
            xp_transaction = {
                "user_id": user_id,
                "activity_type": activity_type,
                "xp_earned": xp_amount,
                "xp_before": current_xp,
                "xp_after": new_xp,
                "level_before": current_level,
                "level_after": new_level,
                "description": description,
                "transaction_date": datetime.now().isoformat()
            }
            make_supabase_request("POST", "xp_transactions", xp_transaction)
            logger.info(f"XP transaction logged for {user_id}: +{xp_amount} XP")
        except Exception as xp_log_error:
            logger.warning(f"Could not log XP transaction (non-critical): {xp_log_error}")
            # Continue execution - XP tracking failure should not block main functionality

        return True
    except Exception as e:
        logger.error(f"Error adding XP: {e}")
        return False

def update_streak(user_id):
    """Update user's learning streak"""
    try:
        user_stats = get_user_stats(user_id)
        if not user_stats:
            return False

        current_streak = user_stats.get('streak', 0)
        last_activity = user_stats.get('last_activity')

        today = datetime.now().date()

        # Check if user was active yesterday or today
        if last_activity:
            last_date = datetime.fromisoformat(last_activity).date()
            days_diff = (today - last_date).days

            if days_diff == 0:
                # Same day, no streak update needed
                return True
            elif days_diff == 1:
                # Consecutive day, increment streak
                new_streak = current_streak + 1
            else:
                # Streak broken, reset to 1
                new_streak = 1
        else:
            # First activity, start streak
            new_streak = 1

        # Update user stats
        updates = {
            'streak': new_streak,
            'last_activity': today.isoformat()
        }

        # Update max streak if needed
        max_streak = user_stats.get('max_streak', 0)
        if new_streak > max_streak:
            updates['max_streak'] = new_streak

        update_user_stats(user_id, updates)
        return True

    except Exception as e:
        logger.error(f"Error updating streak: {e}")
        return False

def calculate_level_from_xp(xp):
    """Calculate user level based on XP"""
    # Level calculation: Level = sqrt(XP / 100) + 1
    import math
    level = int(math.sqrt(xp / 100)) + 1
    return max(level, 1)  # Minimum level is 1

def get_user_credits(user_id: str, check_expiry: bool = True) -> int:
    """
    Get user's current credit balance in units from users_registration table (primary source).
    Automatically checks and expires credits if subscription has expired.
    
    Args:
        user_id: User ID
        check_expiry: Whether to check and expire credits (default: True)
    """
    try:
        # Check and expire credits if needed
        if check_expiry:
            check_and_expire_user_credits(user_id)
        
        result = make_supabase_request("GET", "users_registration", 
                                     select="credits,purchased_credits", 
                                     filters={"chat_id": f"eq.{user_id}"})

        if result and len(result) > 0:
            free_credits = int(result[0].get('credits', 0) or 0)
            purchased_credits = int(result[0].get('purchased_credits', 0) or 0)
            total = free_credits + purchased_credits
            return total
        else:
            logger.warning(f"No user registration found for {user_id}")
            return 0

    except Exception as e:
        logger.error(f"Error getting user credits for {user_id}: {e}")
        return 0

def check_and_expire_user_credits(user_id: str) -> bool:
    """
    Check if user's subscription has expired and expire purchased credits if so.
    Returns True if credits were expired, False otherwise.
    """
    try:
        # Get user's subscription expiry
        result = make_supabase_request("GET", "users_registration", 
                                     select="subscription_expires_at,purchased_credits", 
                                     filters={"chat_id": f"eq.{user_id}"})
        
        if not result or len(result) == 0:
            return False
        
        user_data = result[0]
        expiry_str = user_data.get('subscription_expires_at')
        purchased_credits = int(user_data.get('purchased_credits', 0) or 0)
        
        # If no expiry date or no purchased credits, nothing to expire
        if not expiry_str or purchased_credits == 0:
            return False
        
        # Parse expiry date
        from dateutil import parser
        try:
            expiry_date = parser.parse(expiry_str)
        except:
            logger.warning(f"Could not parse expiry date: {expiry_str}")
            return False
        
        # Check if expired
        if expiry_date < datetime.now():
            # Expire purchased credits
            update_data = {
                "purchased_credits": 0,
                "last_credit_expiry_check": datetime.now().isoformat()
            }
            make_supabase_request("PATCH", "users_registration", update_data, 
                                filters={"chat_id": f"eq.{user_id}"}, use_service_role=True)
            
            logger.info(f"⏰ Expired {purchased_credits} purchased credits for {user_id} (expired on {expiry_date.strftime('%Y-%m-%d')})")
            return True
        
        return False
        
    except Exception as e:
        logger.error(f"Error checking credit expiry for {user_id}: {e}")
        return False

def get_subscription_status(user_id: str) -> Dict:
    """
    Get user's subscription status including expiry date and days remaining.
    
    Returns:
        Dict with keys: is_active, expires_at, days_remaining, purchased_credits
    """
    try:
        result = make_supabase_request("GET", "users_registration", 
                                     select="subscription_expires_at,purchased_credits", 
                                     filters={"chat_id": f"eq.{user_id}"})
        
        if not result or len(result) == 0:
            return {
                "is_active": False,
                "expires_at": None,
                "days_remaining": 0,
                "purchased_credits": 0
            }
        
        user_data = result[0]
        expiry_str = user_data.get('subscription_expires_at')
        purchased_credits = int(user_data.get('purchased_credits', 0) or 0)
        
        if not expiry_str:
            return {
                "is_active": False,
                "expires_at": None,
                "days_remaining": 0,
                "purchased_credits": purchased_credits
            }
        
        from dateutil import parser
        try:
            expiry_date = parser.parse(expiry_str)
            now = datetime.now()
            is_active = expiry_date > now and purchased_credits > 0
            
            if is_active:
                days_remaining = (expiry_date - now).days
            else:
                days_remaining = 0
            
            return {
                "is_active": is_active,
                "expires_at": expiry_date.isoformat(),
                "days_remaining": max(0, days_remaining),
                "purchased_credits": purchased_credits
            }
        except Exception as e:
            logger.error(f"Error parsing expiry date: {e}")
            return {
                "is_active": False,
                "expires_at": None,
                "days_remaining": 0,
                "purchased_credits": purchased_credits
            }
        
    except Exception as e:
        logger.error(f"Error getting subscription status for {user_id}: {e}")
        return {
            "is_active": False,
            "expires_at": None,
            "days_remaining": 0,
            "purchased_credits": 0
        }

def deduct_credits(user_id: str, amount: int, transaction_type: str, description: str) -> bool:
    """
    Deduct credit units from user account with transaction logging.
    Priority: Purchased Credits -> Free/Bonus Credits
    Uses 'deduct_credits_atomic' RPC if available for atomic operations.
    """
    try:
        # 1. Try RPC atomic deduction first
        rpc_payload = {
            "p_user_id": user_id,
            "p_amount": amount,
            "p_transaction_type": transaction_type,
            "p_description": description
        }
        
        # Use RPC endpoint
        # Start with service role for write access
        api_key = SUPABASE_SERVICE_ROLE_KEY
        headers = {
            "apikey": api_key,
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        rpc_url = f"{SUPABASE_URL}/rest/v1/rpc/deduct_credits_atomic"
        
        try:
            rpc_response = requests.post(rpc_url, headers=headers, json=rpc_payload, timeout=10)
            
            if rpc_response.status_code == 200:
                result = rpc_response.json()
                # Parse boolean result or json object
                if isinstance(result, bool):
                     if result:
                         logger.info(f"✅ RPC Credit deduction successful for {user_id} (-{amount})")
                         return True
                     else:
                         # RPC returned false (insufficient credits)
                         return False
                elif isinstance(result, dict):
                    if result.get('success'):
                        logger.info(f"✅ RPC Credit deduction successful for {user_id} (-{amount}). New bal: {result.get('new_balance')}")
                        return True
                    else:
                        logger.warning(f"RPC deduction failed for {user_id}: {result.get('message')}")
                        return False
            else:
                logger.warning(f"RPC call failed (Status {rpc_response.status_code}), falling back to legacy method: {rpc_response.text}")
        except Exception as rpc_error:
            logger.warning(f"RPC connection failed ({rpc_error}), falling back to legacy method")

        # 2. Legacy Fallback (Subject to Race Conditions but keeps system running)
        logger.info("Using legacy deduction method (non-atomic)")
        
        # Get current credits from users_registration table
        result = make_supabase_request("GET", "users_registration", 
                                      select="credits,purchased_credits", 
                                      filters={"chat_id": f"eq.{user_id}"})
        
        if not result or len(result) == 0:
            logger.warning(f"User {user_id} not found for deduction")
            return False
            
        user_data = result[0]
        current_free = user_data.get('credits', 0) or 0
        current_purchased = user_data.get('purchased_credits', 0) or 0
        total_available = current_free + current_purchased
        
        if total_available < amount:
            logger.warning(f"Insufficient credits for {user_id}: has {total_available}, needs {amount}")
            return False

        # Calculate new balances
        new_purchased = current_purchased
        new_free = current_free
        
        remaining_deduction = amount
        
        # 1. Deduct from Purchased First
        if new_purchased > 0:
            if new_purchased >= remaining_deduction:
                new_purchased -= remaining_deduction
                remaining_deduction = 0
            else:
                remaining_deduction -= new_purchased
                new_purchased = 0
                
        # 2. Deduct from Free/Daily Second
        if remaining_deduction > 0:
            new_free -= remaining_deduction
            remaining_deduction = 0

        # Update user credits in users_registration table (primary source)
        update_data = {
            "credits": new_free,
            "purchased_credits": new_purchased
        }
        
        result = make_supabase_request("PATCH", "users_registration", update_data, 
                                     filters={"chat_id": f"eq.{user_id}"})

        if result:
            # Also update user_stats table for consistency
            try:
                make_supabase_request("PATCH", "user_stats", update_data, 
                                    filters={"user_id": f"eq.{user_id}"})
            except Exception as stats_error:
                logger.warning(f"Failed to sync credits to user_stats: {stats_error}")

            # Log the transaction (use try-catch to not fail credit deduction if logging fails)
            try:
                transaction = {
                    "user_id": user_id,
                    "transaction_type": transaction_type,
                    "action": transaction_type,
                    "credits_change": -amount,  # Negative for deduction
                    "balance_before": total_available,
                    "balance_after": new_free + new_purchased,
                    "description": description,
                    "transaction_date": datetime.now().isoformat()
                }
                make_supabase_request("POST", "credit_transactions", transaction, use_service_role=True)
                logger.info(f"✅ Credit deduction transaction logged for {user_id}")
            except Exception as tx_error:
                logger.warning(f"⚠️ Credit deduction successful but transaction logging failed: {tx_error}")

            logger.info(f"Deducted {amount} units from {user_id}. New Total: {new_free + new_purchased} (Free: {new_free}, Purchased: {new_purchased})")
            return True
        else:
            logger.error(f"Failed to update credits for {user_id}")
            return False

    except Exception as e:
        logger.error(f"Error deducting credits for {user_id}: {e}")
        return False

def add_credits(user_id, amount, transaction_type="purchase", description="Credit purchase", is_monthly_subscription=True):
    """
    Add credit units to user account with monthly subscription support.
    
    Args:
        user_id: User ID
        amount: Credit units to add
        transaction_type: Type of transaction (default: "purchase")
        description: Transaction description
        is_monthly_subscription: Whether this is a monthly subscription purchase (default: True)
    
    For monthly subscriptions:
    - Sets subscription_started_at to current time
    - Sets subscription_expires_at to 1 month from now
    - Adds credits to purchased_credits (not free credits)
    """
    from datetime import timedelta
    
    current_result = make_supabase_request("GET", "users_registration", 
                                         select="credits,purchased_credits", 
                                         filters={"chat_id": f"eq.{user_id}"})
    
    if not current_result or len(current_result) == 0:
        logger.warning(f"User {user_id} not found for credit addition")
        return False
    
    current_data = current_result[0]
    current_free = int(current_data.get('credits', 0) or 0)
    current_purchased = int(current_data.get('purchased_credits', 0) or 0)
    current_total = current_free + current_purchased
    
    # Calculate new balances
    if is_monthly_subscription:
        # Monthly subscription: Add to purchased_credits
        new_purchased = current_purchased + amount
        new_free = current_free
        new_total = new_purchased + new_free
        
        # Set subscription period (1 month from now)
        subscription_start = datetime.now()
        subscription_end = subscription_start + timedelta(days=30)  # 30 days = 1 month
        
        update_data = {
            "purchased_credits": new_purchased,
            "credits": new_free,  # Keep free credits separate
            "subscription_started_at": subscription_start.isoformat(),
            "subscription_expires_at": subscription_end.isoformat()
        }
    else:
        # Non-subscription (e.g., welcome bonus, referral): Add to free credits
        new_purchased = current_purchased
        new_free = current_free + amount
        new_total = new_purchased + new_free
        
        update_data = {
            "credits": new_free,
            "purchased_credits": new_purchased
            # Don't modify subscription dates for non-subscription credits
        }
    
    # Update user credits in the correct table (users_registration)
    success = make_supabase_request("PATCH", "users_registration", update_data, 
                                   filters={"chat_id": f"eq.{user_id}"}, use_service_role=True)

    if success:
        # Also update user_stats table for consistency
        try:
            stats_update = {
                "credits": new_free,
                "purchased_credits": new_purchased
            }
            make_supabase_request("PATCH", "user_stats", stats_update, 
                                filters={"user_id": f"eq.{user_id}"}, use_service_role=True)
            logger.info(f"✅ Credits synced to user_stats for {user_id}")
        except Exception as stats_error:
            logger.warning(f"Failed to sync credits to user_stats: {stats_error}")
        
        # Log credit transaction
        try:
            transaction = {
                "user_id": user_id,
                "action": transaction_type,
                "transaction_type": transaction_type,
                "credits_change": amount,
                "balance_before": current_total,
                "balance_after": new_total,
                "description": description,
                "transaction_date": datetime.now().isoformat()
            }
            
            # If monthly subscription, also log subscription period in payment_transactions
            if is_monthly_subscription:
                subscription_start = datetime.now()
                subscription_end = subscription_start + timedelta(days=30)
                transaction.update({
                    "subscription_period_start": subscription_start.isoformat(),
                    "subscription_period_end": subscription_end.isoformat(),
                    "is_monthly_subscription": True
                })
            
            make_supabase_request("POST", "credit_transactions", transaction, use_service_role=True)
            
            if is_monthly_subscription:
                logger.info(f"✅ Monthly subscription added for {user_id}: {amount} credits, expires {subscription_end.strftime('%Y-%m-%d')}")
            else:
                logger.info(f"✅ Transaction recorded for {user_id}: +{amount} credits (free/bonus)")
        except Exception as tx_error:
            logger.warning(f"⚠️ Credit addition successful but transaction logging failed: {tx_error}")
        
        return True

    return False

def sync_user_credits(user_id: str = None) -> dict:
    """Sync credit units from users_registration to user_stats (users_registration is the primary source)"""
    try:
        if user_id:
            # Sync specific user
            users_to_sync = make_supabase_request("GET", "users_registration", 
                                                select="chat_id,credits", 
                                                filters={"chat_id": f"eq.{user_id}"})
        else:
            # Sync all users
            users_to_sync = make_supabase_request("GET", "users_registration", 
                                                select="chat_id,credits")
        
        if not users_to_sync:
            return {"success": False, "message": "No users found to sync"}
        
        synced_count = 0
        failed_count = 0
        
        for user in users_to_sync:
            try:
                user_id_loop = user['chat_id']
                correct_credits = user['credits']
                
                # Update user_stats to match users_registration
                result = make_supabase_request("PATCH", "user_stats", 
                                             {"credits": correct_credits}, 
                                             filters={"user_id": f"eq.{user_id_loop}"}, 
                                             use_service_role=True)
                
                if result:
                    synced_count += 1
                    logger.info(f"✅ Synced credits for {user_id_loop}: {correct_credits}")
                else:
                    failed_count += 1
                    logger.warning(f"❌ Failed to sync credits for {user_id_loop}")
                    
            except Exception as e:
                failed_count += 1
                logger.error(f"Error syncing user {user.get('chat_id', 'unknown')}: {e}")
        
        return {
            "success": True,
            "synced": synced_count,
            "failed": failed_count,
            "message": f"Synced {synced_count} users, {failed_count} failed"
        }
        
    except Exception as e:
        logger.error(f"Error in credit sync: {e}")
        return {"success": False, "message": f"Sync failed: {str(e)}"}

# ============================================================
# NEW CREDIT SYSTEM FUNCTIONS (Welcome Bonus Only)
# ============================================================

WELCOME_BONUS_CREDITS = 150 * CREDIT_UNITS_PER_CREDIT  # 150 credits

def get_credit_breakdown(user_id: str) -> dict:
    """Get detailed credit breakdown for a user"""
    try:
        result = make_supabase_request("GET", "users_registration", 
                                      select="credits,purchased_credits,welcome_bonus_claimed", 
                                      filters={"chat_id": f"eq.{user_id}"})
        
        if result and len(result) > 0:
            user_data = result[0]
            credits = user_data.get('credits', 0) or 0
            purchased_credits = user_data.get('purchased_credits', 0) or 0
            welcome_claimed = user_data.get('welcome_bonus_claimed', False)
            
            # Calculate total available
            total = credits + purchased_credits
            
            return {
                "total": total,
                "free_credits": credits,
                "purchased_credits": purchased_credits,
                "welcome_bonus_claimed": welcome_claimed
            }
        
        return {"total": 0, "free_credits": 0, "purchased_credits": 0, "welcome_bonus_claimed": False}
        
    except Exception as e:
        logger.error(f"Error getting credit breakdown for {user_id}: {e}")
        return {"total": 0, "free_credits": 0, "purchased_credits": 0, "error": str(e)}

def claim_welcome_bonus(user_id: str) -> dict:
    """
    Award welcome bonus (150 credits) to a first-time user.
    Returns: {success: True/False, awarded: True/False, credits: amount}
    """
    try:
        # Check if welcome bonus already claimed
        result = make_supabase_request("GET", "users_registration", 
                                      select="credits,welcome_bonus_claimed", 
                                      filters={"chat_id": f"eq.{user_id}"})
        
        if not result or len(result) == 0:
            logger.warning(f"User {user_id} not found for welcome bonus")
            return {"success": False, "awarded": False, "message": "User not found"}
        
        user_data = result[0]
        already_claimed = user_data.get('welcome_bonus_claimed', False)
        
        if already_claimed:
            logger.info(f"User {user_id} already claimed welcome bonus")
            return {"success": True, "awarded": False, "message": "Already claimed"}
        
        # Award welcome bonus
        current_credits = user_data.get('credits', 0) or 0
        new_credits = current_credits + WELCOME_BONUS_CREDITS
        
        update_data = {
            "credits": new_credits,
            "welcome_bonus_claimed": True
        }
        
        update_result = make_supabase_request("PATCH", "users_registration", update_data, 
                                             filters={"chat_id": f"eq.{user_id}"}, use_service_role=True)
        
        if update_result:
            # Sync to user_stats
            try:
                make_supabase_request("PATCH", "user_stats", 
                                    {"credits": new_credits, "welcome_bonus_claimed": True}, 
                                    filters={"user_id": f"eq.{user_id}"}, use_service_role=True)
            except Exception:
                pass
            
            # Log transaction
            try:
                transaction = {
                    "user_id": user_id,
                    "action": "welcome_bonus",
                    "transaction_type": "welcome_bonus",
                    "credits_change": WELCOME_BONUS_CREDITS,
                    "balance_before": current_credits,
                    "balance_after": new_credits,
                    "description": f"Welcome bonus: {WELCOME_BONUS_CREDITS} credits",
                    "transaction_date": datetime.utcnow().isoformat()
                }
                make_supabase_request("POST", "credit_transactions", transaction, use_service_role=True)
            except Exception as e:
                logger.warning(f"Failed to log welcome bonus transaction: {e}")
            
            logger.info(f"✅ Awarded {WELCOME_BONUS_CREDITS} units welcome bonus to {user_id}")
            return {
                "success": True, 
                "awarded": True, 
                "credits": WELCOME_BONUS_CREDITS,
                "message": f"You received {format_credits(WELCOME_BONUS_CREDITS)} welcome credits!"
            }
        
        return {"success": False, "awarded": False, "message": "Failed to update credits"}
        
    except Exception as e:
        logger.error(f"Error claiming welcome bonus for {user_id}: {e}")
        return {"success": False, "awarded": False, "error": str(e)}

def add_purchased_credits(user_id: str, amount: int, description: str = "Credit purchase") -> bool:
    """
    Add purchased credits to user account.
    Purchased credits are tracked separately from free/welcome bonus credits.
    """
    try:
        result = make_supabase_request("GET", "users_registration", 
                                      select="credits,purchased_credits", 
                                      filters={"chat_id": f"eq.{user_id}"})
        
        if not result or len(result) == 0:
            logger.warning(f"User {user_id} not found for purchased credits")
            return False
        
        user_data = result[0]
        current_credits = user_data.get('credits', 0) or 0
        current_purchased = user_data.get('purchased_credits', 0) or 0
        new_purchased = current_purchased + amount
        
        # Add purchased credits
        update_data = {"purchased_credits": new_purchased}
        
        update_result = make_supabase_request("PATCH", "users_registration", update_data, 
                                             filters={"chat_id": f"eq.{user_id}"}, use_service_role=True)
        
        if update_result:
            # Sync to user_stats
            try:
                make_supabase_request("PATCH", "user_stats", {"purchased_credits": new_purchased}, 
                                    filters={"user_id": f"eq.{user_id}"}, use_service_role=True)
            except Exception:
                pass
            
            # Log transaction
            try:
                transaction = {
                    "user_id": user_id,
                    "action": "purchase",
                    "transaction_type": "purchase",
                    "credits_change": amount,
                    "balance_before": current_purchased,
                    "balance_after": new_purchased,
                    "description": description,
                    "transaction_date": datetime.utcnow().isoformat()
                }
                make_supabase_request("POST", "credit_transactions", transaction, use_service_role=True)
            except Exception:
                pass
            
            logger.info(f"✅ Added {amount} purchased credits to {user_id}. New balance: {new_purchased}")
            return True
        
        return False
        
    except Exception as e:
        logger.error(f"Error adding purchased credits for {user_id}: {e}")
        return False



def generate_nerdx_id():
    """Generate a unique NerdX ID in format NXXXXX"""
    while True:
        # Generate ID: N + 5 random alphanumeric characters
        chars = string.ascii_uppercase + string.digits
        nerdx_id = "N" + "".join(random.choices(chars, k=5))

        # Check if ID already exists
        if not check_nerdx_id_exists(nerdx_id):
            return nerdx_id

def check_nerdx_id_exists(nerdx_id):
    """Check if a NerdX ID already exists"""
    try:
        result = make_supabase_request("GET", "users_registration", select="nerdx_id", filters={"nerdx_id": f"eq.{nerdx_id}"})
        return result is not None and len(result) > 0
    except Exception as e:
        logger.error(f"Error checking NerdX ID: {e}")
        return False

def get_user_registration(chat_id):
    """Get user registration data - matches backup function exactly"""
    try:
        result = make_supabase_request("GET", "users_registration", filters={"chat_id": f"eq.{chat_id}"})
        if result and len(result) > 0:
            return result[0]
        return None
    except Exception as e:
        logger.error(f"Error getting user registration: {e}")
        return None

def create_user_registration(chat_id, name, surname, date_of_birth, referred_by_nerdx_id=None, password_hash=None, password_salt=None, email=None, phone_number=None):
    """Create new user registration - MUST succeed in Supabase or fail completely"""
    try:
        logger.info(f"🔄 Creating user registration for {chat_id} with referral: {referred_by_nerdx_id}")

        # Ensure the users_registration table exists
        logger.info("📋 Ensuring users_registration table exists...")
        table_created = create_users_registration_table()
        if not table_created:
            logger.error(f"❌ Failed to create/verify users_registration table")
            raise Exception("Database table creation failed")

        # Generate unique NerdX ID
        nerdx_id = generate_nerdx_id()
        logger.info(f"🆔 Generated NerdX ID: {nerdx_id}")

        # Convert date_of_birth from various formats to YYYY-MM-DD format for database
        try:
            if '/' in date_of_birth:
                # Parse DD/MM/YYYY format (with slashes)
                day, month, year = date_of_birth.split('/')
                # Ensure proper formatting with zero padding
                formatted_date = f"{year}-{month.zfill(2)}-{day.zfill(2)}"
                logger.info(f"Converted date from {date_of_birth} to {formatted_date}")
            elif len(date_of_birth) == 8 and date_of_birth.isdigit():
                # Parse DDMMYYYY format (no separators)
                day = date_of_birth[0:2]
                month = date_of_birth[2:4]
                year = date_of_birth[4:8]
                formatted_date = f"{year}-{month}-{day}"
                logger.info(f"📅 Converted date from {date_of_birth} (DDMMYYYY) to {formatted_date}")
            else:
                # Assume it's already in YYYY-MM-DD format
                formatted_date = date_of_birth
                logger.info(f"Date already in correct format: {formatted_date}")

            # Validate the converted date
            from datetime import datetime
            datetime.strptime(formatted_date, '%Y-%m-%d')
            logger.info(f"✅ Date validation successful: {formatted_date}")

        except (ValueError, IndexError) as e:
            logger.error(f"Invalid date format: {date_of_birth}, error: {e}")
            raise Exception(f"Invalid date format: {date_of_birth}. Expected DD/MM/YYYY or DDMMYYYY")

        # Prepare registration data
        registration_data = {
            'chat_id': chat_id,
            'name': name,
            'surname': surname,
            'date_of_birth': formatted_date,
            'nerdx_id': nerdx_id,
            'referred_by_nerdx_id': referred_by_nerdx_id,
            'registration_date': datetime.utcnow().isoformat()
        }

        # Add optional auth fields if provided
        if password_hash:
            registration_data['password_hash'] = password_hash
        if password_salt:
            registration_data['password_salt'] = password_salt
        if email:
            registration_data['email'] = email
        if phone_number:
            registration_data['phone_number'] = phone_number
        
        # Set registration_source: mobile if email+password provided, otherwise whatsapp
        if email and password_hash:
            registration_data['registration_source'] = 'mobile'
        else:
            registration_data['registration_source'] = 'whatsapp'

        logger.info(f"📝 Registration data prepared: {registration_data}")

        # --- NEW: Create Supabase Auth User (if email/password provided) ---
        if email and password_hash: # Note: We need original password, but here we only have hash.
            # ERROR: create_user_registration receives password_hash, not plain password.
            # api/mobile.py calls this. Let's check api/mobile.py first.
            pass 
            
        # Execute Supabase registration - using SERVICE_ROLE_KEY for write operation
        logger.info("🔄 Attempting Supabase user registration...")
        result = make_supabase_request("POST", "users_registration", registration_data, use_service_role=True)


        # Validate result
        if not result:
            logger.error(f"❌ Supabase registration failed - no response")
            raise Exception("Supabase registration returned no response")

        if not isinstance(result, list) or len(result) == 0:
            logger.error(f"❌ Supabase registration failed - invalid response format: {result}")
            raise Exception("Supabase registration returned invalid response")

        # Success!
        registered_user = result[0]
        logger.info(f"✅ User registration SUCCESSFUL for {chat_id}")
        logger.info(f"🎉 User ID: {registered_user.get('id')}, NerdX ID: {registered_user.get('nerdx_id')}")

        # Create or update user_stats entry for the new user
        try:
            # New users start with 0 credits in user_stats.
            # The welcome bonus (150 credits) is awarded via claim_welcome_bonus() 
            # during first login - this prevents duplication.
            total_credits = 0

            user_stats_data = {
                'user_id': chat_id,
                'username': f"{name}_{surname}".lower(),
                'first_name': name,
                'total_attempts': 0,
                'correct_answers': 0,
                'xp_points': 0,
                'level': 1,
                'streak': 0,
                'max_streak': 0,
                'credits': total_credits,
                'last_activity': datetime.utcnow().isoformat()
            }

            # Create user stats entry - try-catch block for resilience
            logger.info(f"Creating user stats for {chat_id} (credits will be added via welcome bonus)")
            stats_result = make_supabase_request("POST", "user_stats", user_stats_data, use_service_role=True)
            
            # If POST fails, it might be that stats already exist, so try PATCH
            if not stats_result:
                 logger.warning(f"POST new stats failed for {chat_id}, trying PATCH to initialize...")
                 make_supabase_request("PATCH", "user_stats", {"credits": total_credits, "level": 1}, 
                                      filters={"user_id": f"eq.{chat_id}"}, use_service_role=True)

            logger.info(f"✅ User stats initialized for {chat_id}")

            # Record the registration credit transaction
            if total_credits > 0:
                credit_transaction = {
                    'user_id': chat_id,
                    'action': 'new_user_registration',
                    'credits_change': total_credits,
                    'balance_before': 0,
                    'balance_after': total_credits,
                    'description': f'Welcome bonus: {format_credits(total_credits)} credits',
                    'transaction_type': 'new_user_registration',
                    'transaction_date': datetime.utcnow().isoformat()
                }

                try:
                    make_supabase_request("POST", "credit_transactions", credit_transaction, use_service_role=True)
                    logger.info(f"✅ Registration credit transaction recorded for {chat_id}")
                except Exception as e:
                    logger.error(f"Failed to record registration transaction: {e}")

        except Exception as stats_error:
            logger.error(f"❌ Error creating/initializing user stats: {stats_error}")
            # Even if stats creation fails, we don't want to roll back the user registration
            # The next login might try to fix it via get_or_create_user_stats

        # Handle referral bonus for the referrer (if applicable)
        if referred_by_nerdx_id:
            try:
                referrer_registration = get_user_by_nerdx_id(referred_by_nerdx_id)
                if referrer_registration:
                    referrer_chat_id = referrer_registration['chat_id']

                    # Add 5 credits (units) to referrer
                    current_referrer_credits = get_user_credits(referrer_chat_id)
                    new_referrer_credits = current_referrer_credits + (5 * CREDIT_UNITS_PER_CREDIT)

                    # Update referrer's credits
                    update_user_stats(referrer_chat_id, {'credits': new_referrer_credits})

                    # Record referrer credit transaction
                    referrer_transaction = {
                        'user_id': referrer_chat_id,
                        'action': 'referral_bonus',
                        'credits_change': 5 * CREDIT_UNITS_PER_CREDIT,
                        'balance_before': current_referrer_credits,
                        'balance_after': new_referrer_credits,
                        'description': f'Referral bonus for {name} {surname}',
                        'transaction_type': 'referral_bonus'
                    }

                    make_supabase_request("POST", "credit_transactions", referrer_transaction, use_service_role=True)
                    logger.info(f"✅ Awarded 5 referral credits to {referrer_chat_id} for referring {chat_id}")

                else:
                    logger.warning(f"Referrer with NerdX ID {referred_by_nerdx_id} not found")

            except Exception as e:
                logger.error(f"Error processing referral bonus: {e}")

        return registered_user

    except Exception as e:
        logger.error(f"💥 CRITICAL: User registration FAILED for {chat_id}: {e}", exc_info=True)
        logger.error(f"🚫 Registration cannot proceed without Supabase success")

        # Raise exception so the caller (API) knows it failed
        raise e

def is_user_registered(chat_id):
    """Check if user is already registered - matches backup function exactly"""
    registration = get_user_registration(chat_id)
    return registration is not None

def get_user_by_nerdx_id(nerdx_id):
    """Get user by NerdX ID"""
    try:
        result = make_supabase_request("GET", "users_registration", filters={"nerdx_id": f"eq.{nerdx_id}"})
        if result and len(result) > 0:
            return result[0]
        return None
    except Exception as e:
        logger.error(f"Error getting user by NerdX ID: {e}")
        return None

def add_referral_credits(referred_by_nerdx_id, new_user_chat_id):
    """Add 5 credits to referrer when someone they referred registers and send WhatsApp notification"""
    try:
        # Get the referrer's information
        referrer = get_user_by_nerdx_id(referred_by_nerdx_id)
        if not referrer:
            logger.error(f"Referrer with NerdX ID {referred_by_nerdx_id} not found")
            return False

        referrer_chat_id = referrer['chat_id']
        referrer_name = referrer.get('name', 'Unknown')

        # Get the new user's information for the description
        new_user = get_user_registration(new_user_chat_id)
        new_user_name = new_user.get('name', 'Unknown') if new_user else 'Unknown'
        new_user_surname = new_user.get('surname', '') if new_user else ''
        full_new_user_name = f"{new_user_name} {new_user_surname}".strip()

        # Add referral bonus credits (5 credits as requested)
        referral_bonus = 5 * CREDIT_UNITS_PER_CREDIT
        description = f'Referral bonus: {full_new_user_name} joined using your code'
        success = add_credits(referrer_chat_id, referral_bonus, 'referral_bonus', description)

        if success:
            logger.info(f"Added referral credits to {referrer_name} ({referrer_chat_id}) for referring {full_new_user_name} ({new_user_chat_id})")

            # 🎉 SEND WHATSAPP NOTIFICATION TO REFERRER
            try:
                from services.whatsapp_service import WhatsAppService
                whatsapp_service = WhatsAppService()

                # Get referrer's current credit balance
                current_credits = get_user_credits(referrer_chat_id)

                notification_message = f"""🎉 **Congratulations {referrer_name}!**

🔗 **{full_new_user_name}** just registered using your referral link!

💰 **You received +{format_credits(referral_bonus)} credits**
📊 **Your balance**: {format_credits(current_credits)} credits

🚀 Keep sharing your NerdX ID **{referred_by_nerdx_id}** to earn more referral bonuses!

Type 'menu' to continue learning."""

                whatsapp_service.send_message(referrer_chat_id, notification_message)
                logger.info(f"✅ Referral notification sent to {referrer_name} ({referrer_chat_id})")

            except Exception as notification_error:
                logger.error(f"❌ Failed to send referral notification to {referrer_chat_id}: {notification_error}")
                # Don't fail the whole process if notification fails

            return True
        else:
            logger.error(f"Failed to add referral credits to {referrer_chat_id}")
            return False

    except Exception as e:
        logger.error(f"Error adding referral credits: {e}")
        return False

def get_referral_stats(nerdx_id):
    """Get referral statistics for a user - matches backup function exactly"""
    try:
        # Get all users referred by this NerdX ID
        result = make_supabase_request("GET", "users_registration", filters={"referred_by_nerdx_id": f"eq.{nerdx_id}"})

        referrals = result if result else []
        total_referrals = len(referrals)
        total_credits_earned = total_referrals * 5  # 5 credits per referral

        # Format recent referrals with names and dates
        recent_referrals = []
        for referral in referrals:
            recent_referrals.append({
                'name': referral.get('name', 'Unknown'),
                'date': referral.get('created_at', '')[:10]  # Get date part only
            })

        # Sort by date, most recent first
        recent_referrals.sort(key=lambda x: x['date'], reverse=True)

        return {
            'total_referrals': total_referrals,
            'total_credits_earned': total_credits_earned,
            'recent_referrals': recent_referrals
        }

    except Exception as e:
        logger.error(f"Error getting referral stats: {e}")
        return {
            'total_referrals': 0,
            'total_credits_earned': 0,
            'recent_referrals': []
        }

def get_random_mcq_question(category=None):
    """Get a random MCQ question"""
    filters = {"question_type": "eq.mcq"}
    if category:
        filters["category"] = f"eq.{category}"

    result = make_supabase_request("GET", "questions", filters=filters, limit=50)

    if result and len(result) > 0:
        question = random.choice(result)
        # Map 'answer' field to 'correct_answer' for consistency
        if 'answer' in question:
            question['correct_answer'] = question['answer']
        return question

    return None

def get_random_exam_question(subject=None, user_id=None, avoid_recent=True):
    """Get a random exam question with enhanced anti-repetition logic"""
    try:
        # Import question history service for repetition prevention
        from services.question_history_service import question_history_service

        filters = {}
        max_attempts = 3  # Try multiple times to avoid repeats

        for attempt in range(max_attempts):
            all_questions = []

            if subject:
                # For Combined Science, get questions from Biology, Chemistry, Physics categories
                if subject == "Combined Science":
                    # Get questions from all science subjects with better randomization
                    science_subjects = ["Biology", "Chemistry", "Physics"]

                    for science_subject in science_subjects:
                        subject_filters = {"category": f"eq.{science_subject}"}

                        # Use random offset for better distribution (attempt-based)
                        offset = random.randint(0, 20) + (attempt * 30)
                        questions = make_supabase_request("GET", "questions", filters=subject_filters, limit=50, offset=offset)
                        if questions:
                            all_questions.extend(questions)

                    # Apply question history filtering if user provided
                    if user_id and avoid_recent and all_questions:
                        filtered_questions = question_history_service.filter_questions_by_history(
                            user_id, "Combined Science", all_questions, min_new_questions=5
                        )
                        if filtered_questions:
                            all_questions = filtered_questions

                    if all_questions:
                        # Enhanced random selection with multiple shuffle
                        random.shuffle(all_questions)
                        question = random.choice(all_questions)

                        # Ensure consistency in field names
                        if 'answer' in question:
                            question['correct_answer'] = question['answer']

                        # Add to history if user provided
                        if user_id and question.get('id'):
                            question_history_service.add_question_to_history(user_id, "Combined Science", str(question['id']))

                        logger.info(f"Retrieved combined science question ID: {question.get('id')} from category: {question.get('category')} (attempt {attempt + 1})")
                        return question

                else:
                    filters["subject"] = f"eq.{subject}"

            # For non-Combined Science subjects
            if not subject or subject != "Combined Science":
                # Enhanced image question logic with better randomization
                if random.random() < 0.4:  # 40% chance to prioritize image questions
                    image_filters = filters.copy()
                    image_filters["image_url"] = "not.is.null"

                    # Random offset for image questions
                    offset = random.randint(0, 10) + (attempt * 20)
                    result = make_supabase_request("GET", "questions", filters=image_filters, limit=40, offset=offset)

                    if result and len(result) > 0:
                        # Apply history filtering
                        if user_id and avoid_recent:
                            subject_key = subject or "General"
                            filtered_result = question_history_service.filter_questions_by_history(
                                user_id, subject_key, result, min_new_questions=3
                            )
                            if filtered_result:
                                result = filtered_result

                        random.shuffle(result)
                        question = random.choice(result)

                        # Ensure consistency in field names
                        if 'answer' in question:
                            question['correct_answer'] = question['answer']

                        # Add to history
                        if user_id and question.get('id'):
                            subject_key = subject or "General"
                            question_history_service.add_question_to_history(user_id, subject_key, str(question['id']))

                        logger.info(f"Retrieved image question ID: {question.get('id')} (attempt {attempt + 1})")
                        return question

                # Fallback to any question from the subject with enhanced randomization
                offset = random.randint(0, 50) + (attempt * 75)
                result = make_supabase_request("GET", "questions", filters=filters, limit=100, offset=offset)

                if result and len(result) > 0:
                    # Apply history filtering
                    if user_id and avoid_recent:
                        subject_key = subject or "General"
                        filtered_result = question_history_service.filter_questions_by_history(
                            user_id, subject_key, result, min_new_questions=5
                        )
                        if filtered_result:
                            result = filtered_result

                    random.shuffle(result)
                    question = random.choice(result)

                    # Ensure consistency in field names
                    if 'answer' in question:
                        question['correct_answer'] = question['answer']

                    # Add to history
                    if user_id and question.get('id'):
                        subject_key = subject or "General"
                        question_history_service.add_question_to_history(user_id, subject_key, str(question['id']))

                    logger.info(f"Retrieved exam question ID: {question.get('id')} (attempt {attempt + 1})")
                    return question

        logger.warning(f"No exam questions found for subject: {subject} after {max_attempts} attempts")
        return None

    except Exception as e:
        logger.error(f"Error retrieving random exam question: {e}")
        return None

def get_random_olevel_maths_question():
    """Get a random question from olevel_maths table"""
    try:
        # Ensure table exists first
        from services.analytics_tracker import AnalyticsTracker
        tracker = AnalyticsTracker()
        conn = tracker._get_connection()
        if conn:
            cursor = conn.cursor()
            tracker._ensure_olevel_maths_table(cursor)
            conn.commit()
            cursor.close()
            conn.close()
        
        # Get random question from olevel_maths table
        result = make_supabase_request("GET", "olevel_maths", limit=50)
        
        if result and len(result) > 0:
            question = random.choice(result)
            # Add source identifier to distinguish from olevel_math_questions
            question['table_source'] = 'olevel_maths'
            logger.info(f"Retrieved olevel_maths question ID: {question.get('id')}")
            return question
        
        logger.warning("No questions found in olevel_maths table")
        return None
        
    except Exception as e:
        logger.error(f"Error retrieving random olevel_maths question: {e}")
        return None

def get_question_by_id(question_id):
    """Get a specific question by ID"""
    result = make_supabase_request("GET", "questions", filters={"id": f"eq.{question_id}"})
    if result and len(result) > 0:
        question = result[0]
        if 'answer' in question:
            question['correct_answer'] = question['answer']
        return question
    return None

def save_ai_question_to_database(question_data, subject, topic):
    """Save AI-generated question to Supabase questions table"""
    try:
        # Handle both old format (list) and new format (dict) for options
        if isinstance(question_data.get('options'), list):
            # Old format - list of options
            options = question_data['options']
            option_a = options[0].replace("A. ", "").replace("A) ", "") if len(options) > 0 else ""
            option_b = options[1].replace("B. ", "").replace("B) ", "") if len(options) > 1 else ""
            option_c = options[2].replace("C. ", "").replace("C) ", "") if len(options) > 2 else ""
            option_d = options[3].replace("D. ", "").replace("D) ", "") if len(options) > 3 else ""
        elif isinstance(question_data.get('options'), dict):
            # New format - dictionary of options
            options = question_data['options']
            option_a = options.get('A', '')
            option_b = options.get('B', '')
            option_c = options.get('C', '')
            option_d = options.get('D', '')
        else:
            logger.error(f"Invalid options format: {question_data.get('options')}")
            return None

        # Prepare question data for database
        db_question = {
            "question": question_data['question'],
            "option_a": option_a,
            "option_b": option_b,
            "option_c": option_c,
            "option_d": option_d,
            "answer": question_data['correct_answer'],
            "explanation": question_data.get('explanation', ''),
            "category": subject,
            "subject": f"ZIMSEC Combined Science - {subject}",
            "topic": topic,
            "difficulty_level": question_data.get('difficulty', 'medium'),
            "question_type": "mcq"
        }

        result = make_supabase_request("POST", "questions", db_question)
        if result and len(result) > 0:
            logger.info(f"✅ AI question saved to database with ID: {result[0].get('id')}")
            return result[0]
        else:
            logger.error("Failed to save AI question to database")
            return None

    except Exception as e:
        logger.error(f"Error saving AI question to database: {e}")
        return None

def get_questions_by_category_and_topic(category, topic, limit=50):
    """Get questions from database by category and topic"""
    filters = {"category": f"eq.{category}", "topic": f"eq.{topic}"}
    result = make_supabase_request("GET", "questions", filters=filters, limit=limit)
    return result if result else []

def get_questions_by_subject_and_topic(subject, topic, limit=50):
    """Get questions from database by subject and topic for Combined Science"""
    filters = {"subject": f"eq.{subject}", "topic": f"eq.{topic}"}
    result = make_supabase_request("GET", "questions", filters=filters, limit=limit)
    return result if result else []

def count_questions_by_category_and_topic(category, topic):
    """Count questions in database by category and topic"""
    questions = get_questions_by_category_and_topic(category, topic)
    return len(questions) if questions else 0

def count_questions_by_subject_and_topic(subject, topic):
    """Count questions in database by subject and topic for Combined Science"""
    questions = get_questions_by_subject_and_topic(subject, topic)
    return len(questions) if questions else 0

def create_pending_payment(user_id, amount_usd, credits_to_add):
    """Create a pending payment entry"""
    transaction_ref = f"TXN_{user_id}_{int(datetime.now().timestamp())}"

    payment_data = {
        "user_id": user_id,
        "transaction_reference": transaction_ref,
        "amount_expected": amount_usd,
        "credits_to_add": credits_to_add,
        "status": "pending",
        "transaction_date": datetime.now().isoformat()
    }

    result = make_supabase_request("POST", "pending_payments", payment_data)
    return transaction_ref if result else None

def get_pending_payment(transaction_ref):
    """Get pending payment by reference"""
    result = make_supabase_request("GET", "pending_payments", filters={"transaction_reference": f"eq.{transaction_ref}"})
    return result[0] if result and len(result) > 0 else None

def complete_payment(transaction_ref, amount_paid):
    """Complete a payment and add credits to user"""
    payment = get_pending_payment(transaction_ref)
    if not payment:
        return False

    user_id = payment["user_id"]
    credits_to_add = payment["credits_to_add"]

    # Add credits to user account
    if add_credits(user_id, credits_to_add, f"Payment {transaction_ref}"):
        # Update pending payment status
        update_data = {
            "status": "completed",
            "updated_at": datetime.now().isoformat()
        }
        make_supabase_request("PATCH", "pending_payments", update_data, filters={"transaction_reference": f"eq.{transaction_ref}"})

        # Record completed payment
        payment_record = {
            "user_id": user_id,
            "transaction_reference": transaction_ref,
            "amount_paid": amount_paid,
            "credits_added": credits_to_add,
            "payment_method": "ecocash",
            "status": "completed",
            "transaction_date": datetime.now().isoformat()
        }
        make_supabase_request("POST", "payments", payment_record)

        return True

    return False

def process_ecocash_payment(sms_text, user_id):
    """Process EcoCash SMS and complete payment"""
    try:
        # Extract transaction details from SMS
        # Look for transaction reference, amount, and confirmation keywords
        import re

        # Check if this looks like an EcoCash SMS
        ecocash_keywords = ['ecocash', 'transaction', 'sent', 'received', 'confirmed', 'successful']
        if not any(keyword in sms_text.lower() for keyword in ecocash_keywords):
            logger.error("SMS does not appear to be from EcoCash")
            return False

        # Look for transaction reference (alphanumeric codes)
        ref_pattern = r'([A-Z0-9]{6,12})'
        matches = re.findall(ref_pattern, sms_text.upper())

        if not matches:
            logger.error("No transaction reference found in SMS")
            return False

        # Look for amount in USD format
        amount_pattern = r'\$?(\d+\.?\d*)\s*USD'
        amount_matches = re.findall(amount_pattern, sms_text, re.IGNORECASE)

        # Try to find a matching pending payment
        for ref in matches:
            payment = get_pending_payment(ref)
            if payment and payment['user_id'] == user_id:
                # Verify amount if found in SMS
                if amount_matches:
                    sms_amount = float(amount_matches[0])
                    if abs(sms_amount - payment['amount_expected']) > 0.01:
                        logger.error(f"Amount mismatch: SMS {sms_amount}, Expected {payment['amount_expected']}")
                        continue

                # Complete the payment
                success = complete_payment(ref, payment['amount_expected'])
                if success:
                    logger.info(f"Payment completed for user {user_id}, ref: {ref}")
                    return True

        logger.error("No matching pending payment found")
        return False

    except Exception as e:
        logger.error(f"Error processing EcoCash payment: {e}")
        return False

def get_user_payment_history(user_id, limit=10):
    """Get user's payment history"""
    result = make_supabase_request("GET", "payments", filters={"user_id": f"eq.{user_id}"}, limit=limit)
    return result if result else []

def get_user_credit_transactions(user_id, limit=20):
    """Get user's credit transaction history"""
    result = make_supabase_request("GET", "credit_transactions", filters={"user_id": f"eq.{user_id}"}, limit=limit)
    return result if result else []

def set_user_subscription(chat_id: str, is_active: bool) -> bool:
    """Update a user's subscription status in users_registration.is_active."""
    try:
        update = {"is_active": bool(is_active)}
        result = make_supabase_request(
            "PATCH",
            "users_registration",
            update,
            filters={"chat_id": f"eq.{chat_id}"},
            use_service_role=True,
        )

        # Best-effort activity log
        try:
            make_supabase_request(
                "POST",
                "activity_logs",
                {
                    "user_id": chat_id,
                    "activity_type": "subscription_update",
                    "description": f"Subscription set to {'active' if is_active else 'inactive'}",
                    "additional_data": {"is_active": bool(is_active)},
                },
                use_service_role=True,
            )
        except Exception:
            pass

        return bool(result)
    except Exception as e:
        logger.error(f"Error updating subscription for {chat_id}: {e}")
        return False

def diagnose_supabase_issues():
    """Comprehensive Supabase diagnostics"""
    try:
        logger.info("🔍 Starting Supabase diagnostics...")

        # Check environment variables
        if not SUPABASE_URL:
            logger.error("❌ SUPABASE_URL environment variable not set")
            return False

        if not SUPABASE_KEY:
            logger.error("❌ SUPABASE_KEY environment variable not set")
            return False

        logger.info(f"✅ Environment variables configured")
        logger.info(f"📍 Supabase URL: {SUPABASE_URL}")
        logger.info(f"🔑 Service Role Key: {SUPABASE_SERVICE_ROLE_KEY[:20]}...")
        logger.info(f"🔑 Anon Key: {SUPABASE_ANON_KEY[:20]}...")

        # Test different endpoints
        endpoints_to_test = ['user_stats', 'users_registration', 'payment_transactions']

        for endpoint in endpoints_to_test:
            try:
                logger.info(f"🧪 Testing {endpoint} table...")
                result = make_supabase_request("GET", endpoint, limit=1)

                if result is not None:
                    logger.info(f"✅ {endpoint} table accessible")
                else:
                    logger.warning(f"⚠️ {endpoint} table access failed")

            except Exception as e:
                logger.error(f"❌ {endpoint} table test error: {e}")

        logger.info("🔍 Diagnostics complete")
        return True

    except Exception as e:
        logger.error(f"💥 Diagnostics failed: {e}")
        return False

def test_connection():
    """Test database connection with diagnostics"""
    try:
        # Run diagnostics first
        diagnose_supabase_issues()

        # Simple test query to verify connection
        result = make_supabase_request("GET", "user_stats", limit=1)
        return result is not None
    except Exception as e:
        logger.error(f"Database connection test failed: {e}")
        return False

def init_database():
    """Initialize database tables"""
    try:
        # Test connection by querying user_stats table
        result = make_supabase_request("GET", "user_stats", limit=1)
        if result is None:
            logger.error("Failed to connect to user_stats table")
            return False

        # Create users_registration table if it doesn't exist
        try:
            logger.info("Creating users_registration table...")
            create_users_registration_table()
        except Exception as e:
            logger.warning(f"Could not create users_registration table: {e}")

        # Create payment_transactions table if it doesn't exist
        try:
            logger.info("Creating payment_transactions table...")
            create_payment_transactions_table()
        except Exception as e:
            logger.warning(f"Could not create payment_transactions table: {e}")
            logger.warning(f"Could not create payment_transactions table: {e}")
        
        logger.info("Database initialization complete")
        return True
        
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        return False

def get_random_comprehension_from_db(theme=None, form_level=None):
    """
    Get a random comprehension passage with questions from database
    
    Args:
        theme: Optional theme filter
        form_level: Optional form level filter (Form 3, Form 4)
        
    Returns:
        Dict with passage data and ordered questions, or None if not found
    """
    try:
        if not _is_configured:
            logger.warning("Supabase not configured")
            return None
            
        # Build filters for passage selection
        filters = {}
        select_fields = "*"
        
        if theme:
            filters['theme'] = f'eq.{theme}'
        if form_level:
            filters['form_level'] = f'eq.{form_level}'
            
        # Get random passage from comprehension_passages table
        passages_response = make_supabase_request(
            "GET",
            "comprehension_passages", 
            select=select_fields,
            filters=filters
        )
        
        if not passages_response or len(passages_response) == 0:
            logger.info(f"No comprehension passages found for theme: {theme}, form: {form_level}")
            return None
            
        # Select random passage
        import random
        selected_passage = random.choice(passages_response)
        passage_id = selected_passage['id']
        
        # Get questions for this passage in correct order
        questions_response = make_supabase_request(
            "GET",
            "english_comprehension_questions",
            select="*",
            filters={
                'passage_id': f'eq.{passage_id}',
                'order': 'question_order.asc'  # Ensure proper ordering
            }
        )
        
        if not questions_response:
            logger.warning(f"No questions found for passage ID: {passage_id}")
            return None
            
        # Format the response to match expected structure
        passage_data = {
            'passage': {
                'text': selected_passage.get('passage_text', ''),
                'title': selected_passage.get('title', 'Comprehension Passage'),
                'word_count': selected_passage.get('word_count', 0),
                'theme': selected_passage.get('theme', theme or 'General'),
                'form_level': selected_passage.get('form_level', form_level or 'Form 3-4')
            },
            'questions': []
        }
        
        # Add questions in order
        for q in questions_response:
            question_data = {
                'question': q.get('question_text', ''),
                'answer': q.get('expected_answer', ''),
                'type': q.get('question_type', 'literal'),
                'order': q.get('question_order', 0),
                'marks': q.get('marks', 2)
            }
            passage_data['questions'].append(question_data)
            
        # Sort questions by order to ensure correct sequence
        passage_data['questions'].sort(key=lambda x: x.get('order', 0))
        
        logger.info(f"✅ Retrieved passage from database: {selected_passage.get('title')} with {len(passage_data['questions'])} questions")
        return passage_data
        
    except Exception as e:
        logger.error(f"Error retrieving comprehension from database: {e}")
        return None

def get_comprehension_questions_by_passage_id(passage_id: int) -> List[Dict]:
    """
    Get comprehension questions for a specific passage ID in correct order
    
    Args:
        passage_id: The ID of the comprehension passage
        
    Returns:
        List of questions in correct order or empty list
    """
    try:
        if not _is_configured:
            return []
            
        questions_response = make_supabase_request(
            "GET",
            "english_comprehension_questions",
            select="*",
            filters={
                'passage_id': f'eq.{passage_id}',
                'order': 'question_order.asc'  # Critical: maintain order
            }
        )
        
        if not questions_response:
            return []
            
        # Ensure proper ordering even if database doesn't sort correctly
        questions_response.sort(key=lambda x: x.get('question_order', 0))
        
        return questions_response
        
    except Exception as e:
        logger.error(f"Error getting questions for passage {passage_id}: {e}")
        return []

def get_db_connection():
    """
    Get direct database connection using psycopg2
    Required for DKT service which performs complex transactions
    """
    try:
        import psycopg2
        import os
        database_url = os.getenv('DATABASE_URL')
        
        if not database_url:
            logger.error("DATABASE_URL environment variable not set - cannot establish direct connection")
            return None
            
        conn = psycopg2.connect(database_url)
        conn.autocommit = True
        return conn
    except ImportError:
        logger.error("psycopg2 not installed - cannot establish direct connection")
        return None
    except Exception as e:
        logger.error(f"Error connecting to database: {e}")
        return None

# --- Project Assistant Functions ---

def create_user_project(user_id, project_title, subject, project_data=None):
    """Create a new user project"""
    try:
        # Ensure table exists (idempotent check inside)
        create_user_projects_table()
        
        data = {
            "user_id": user_id,
            "project_title": project_title,
            "subject": subject,
            "project_data": project_data or {},
            "current_stage": "Selection",
            "completed": False
        }
        result = make_supabase_request("POST", "user_projects", data, use_service_role=True)
        if result and len(result) > 0:
            return result[0]
        return None
    except Exception as e:
        logger.error(f"Error creating user project: {e}")
        return None

def get_user_projects(user_id):
    """Get all projects for a user"""
    try:
        result = make_supabase_request("GET", "user_projects", filters={"user_id": f"eq.{user_id}"}, use_service_role=True)
        return result or []
    except Exception as e:
        logger.error(f"Error getting user projects: {e}")
        return []

def get_project_by_id(project_id):
    """Get project by ID"""
    try:
        result = make_supabase_request("GET", "user_projects", filters={"id": f"eq.{project_id}"}, use_service_role=True)
        if result and len(result) > 0:
            return result[0]
        return None
    except Exception as e:
        logger.error(f"Error getting project by ID: {e}")
        return None

def update_project_stage(project_id, stage, data_update=None):
    """Update project stage and data"""
    try:
        updates = {"current_stage": stage, "updated_at": datetime.utcnow().isoformat()}
        
        if data_update:
            # Fetch current project to merge data
            current_project = get_project_by_id(project_id)
            if current_project:
                current_data = current_project.get('project_data', {})
                if isinstance(current_data, str):
                     try:
                         current_data = json.loads(current_data)
                     except:
                         current_data = {}
                
                # Merge new data
                current_data.update(data_update)
                updates['project_data'] = current_data
            else:
                return None

        result = make_supabase_request("PATCH", "user_projects", updates, filters={"id": f"eq.{project_id}"}, use_service_role=True)
        if result and len(result) > 0:
            return result[0]
        return None
    except Exception as e:
        logger.error(f"Error updating project stage: {e}")
        return None

def save_project_chat_message(project_id, role, content):
    """Save a chat message to history"""
    try:
        data = {
            "project_id": project_id,
            "role": role,
            "content": content,
            "timestamp": datetime.utcnow().isoformat()
        }
        result = make_supabase_request("POST", "project_chat_history", data, use_service_role=True)
        return result is not None
    except Exception as e:
        logger.error(f"Error saving chat message: {e}")
        return False

def get_project_chat_history(project_id, limit=50):
    """Get chat history for a project"""
    try:
        # Order by timestamp ascending
        params = {
            "project_id": f"eq.{project_id}",
            "order": "timestamp.asc"
        }
        result = make_supabase_request("GET", "project_chat_history", filters=params, limit=limit, use_service_role=True)
        return result or []
    except Exception as e:
        logger.error(f"Error getting chat history: {e}")
        return []

def authenticate_supabase_user(identifier, password):
    """
    Authenticate a user directly with Supabase Auth REST API
    Handles both email and phone number authentication.
    Returns: User object if successful, None otherwise
    """
    try:
        url = f"{SUPABASE_URL}/auth/v1/token?grant_type=password"
        headers = {
            "apikey": SUPABASE_ANON_KEY,
            "Content-Type": "application/json"
        }
        
        # Determine if identifier is email or phone
        data = {}
        if '@' in identifier:
            data = {
                "email": identifier,
                "password": password
            }
        else:
            # Assume phone number
            data = {
                "phone": identifier,
                "password": password
            }
            
        logger.info(f"Attempting Supabase Auth for {identifier}...")
        
        response = requests.post(url, headers=headers, json=data)
        
        if response.status_code == 200:
            logger.info(f"✅ Supabase Auth successful for {identifier}")
            return response.json()
        else:
            logger.warning(f"Supabase Auth failed for {identifier}: {response.status_code} {response.text}")
            return None
            
    except Exception as e:
        logger.error(f"Error checking Supabase Auth: {e}")
        return None

def get_user_by_email_admin(email):
    """
    Look up a user by email using Supabase Admin API.
    Useful for finding users who signed up with Google/OAuth (no password).
    Returns: User object if found, None otherwise
    """
    try:
        if not SUPABASE_SERVICE_ROLE_KEY:
            logger.error("Supabase Service Role Key missing - cannot use Admin API")
            return None
            
        # Supabase Admin List Users endpoint doesn't support direct filtering by email in all versions/wrappers.
        # However, the /admin/users endpoint returns a list. We might need to filter manually if no search param.
        # UPDATE: GoTrue /admin/users usually supports usage of query params or we have to fetch and filter.
        # But `test_admin_auth.py` showed we can list users.
        # A more direct way specifically for *finding* might be `GET /admin/users/{id}` but we don't have ID.
        # We will try to rely on listing (with page/limit if needed) or just basic listing if user base is small, 
        # BUT this is risky for large user/bases.
        # Better approach: Try to create a dummy user with that email. 
        # If it fails with "User already registered", we know they exist! 
        # BUT that doesn't give us their ID/metadata to backfill.
        
        # Best effort: Use the list endpoint and filter.
        url = f"{SUPABASE_URL}/auth/v1/admin/users"
        headers = {
            "apikey": SUPABASE_SERVICE_ROLE_KEY,
            "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
            "Content-Type": "application/json"
        }
        
        logger.info(f"Admin lookup for: {email}")
        
        # Attempt to find user
        response = requests.get(url, headers=headers, params={"page": 1, "per_page": 100}) # Fetch first 100
        
        if response.status_code == 200:
            users = response.json().get('users', [])
            for user in users:
                if user.get('email', '').lower() == email.lower():
                    logger.info(f"✅ Found user in Admin list: {email}")
                    # Wrap it in a structure similar to authenticate_supabase_user for consistency if needed,
                    # or just return the user object. 
                    # authenticate_supabase_user returns: {'access_token':..., 'user': {...}}
                    # We will just return a structure containing 'user' so api/mobile.py can parse it same way.
                    return {'user': user}
                    
            logger.info(f"User {email} not found in first 100 admin users")
            return None
            
        else:
            logger.error(f"Admin API failed: {response.status_code} {response.text}")
            return None
            
    except Exception as e:
        logger.error(f"Error in admin user lookup: {e}")
        return None

def register_supabase_auth_user(email, password, data=None):
    """
    Register a new user in Supabase Auth via REST API.
    """
    try:
        url = f"{SUPABASE_URL}/auth/v1/signup"
        headers = {
            "apikey": SUPABASE_ANON_KEY,
            "Content-Type": "application/json"
        }
        
        payload = {
            "email": email,
            "password": password,
            "data": data or {}
        }
        
        logger.info(f"Attempting Supabase Auth Sign-Up for {email}...")
        response = requests.post(url, headers=headers, json=payload)
        
        if response.status_code == 200:
            logger.info(f"✅ Supabase Auth Sign-Up successful for {email}")
            return response.json()
        else:
            logger.error(f"Supabase Auth Sign-Up failed: {response.status_code} {response.text}")
            return None
            
    except Exception as e:
        logger.error(f"Error registering Supabase Auth user: {e}")
        return None
