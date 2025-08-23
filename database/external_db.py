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
import logging

logger = logging.getLogger(__name__)

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://your-project.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "your-anon-key")

# Validate environment variables
if SUPABASE_URL == "https://your-project.supabase.co":
    logger.error("SUPABASE_URL not properly configured")
if SUPABASE_KEY == "your-anon-key":
    logger.error("SUPABASE_KEY not properly configured")

print(f"Supabase URL: {SUPABASE_URL}")
print(f"Supabase Key: {SUPABASE_KEY[:20]}..." if SUPABASE_KEY else "No key found")

def make_supabase_request(method, table, data=None, select="*", filters=None, limit=None):
    """Make a request to Supabase REST API"""
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
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

    try:
        print(f"Making {method} request to {url}")
        print(f"Headers: {headers}")
        print(f"Params: {params}")
        print(f"Data: {data}")

        response = None
        if method == "GET":
            response = requests.get(url, headers=headers, params=params, timeout=30)
        elif method == "POST":
            response = requests.post(url, headers=headers, json=data, params=params, timeout=30)
        elif method == "PATCH":
            response = requests.patch(url, headers=headers, json=data, params=params, timeout=30)
        
        if response is None:
            logger.error(f"Unsupported HTTP method: {method}")
            return None

        print(f"Response status: {response.status_code}")
        print(f"Response text: {response.text}")

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

        # Log XP transaction
        xp_transaction = {
            "user_id": user_id,
            "activity_type": activity_type,
            "xp_earned": xp_amount,
            "xp_before": current_xp,
            "xp_after": new_xp,
            "level_before": current_level,
            "level_after": new_level,
            "description": description,
            "created_at": datetime.now().isoformat()
        }
        make_supabase_request("POST", "xp_transactions", xp_transaction)

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

def get_user_credits(user_id):
    """Get user's current credit balance"""
    result = make_supabase_request("GET", "user_stats", select="credits", filters={"user_id": f"eq.{user_id}"})
    if result and len(result) > 0:
        return result[0].get("credits", 0)
    return 0

def deduct_credits(user_id, amount, transaction_type, description):
    """Deduct credits from user account and log transaction"""
    current_credits = get_user_credits(user_id)

    if current_credits < amount:
        return False

    new_credits = current_credits - amount

    # Update user credits
    success = make_supabase_request("PATCH", "user_stats", {"credits": new_credits}, filters={"user_id": f"eq.{user_id}"})

    if success:
        # Log credit transaction
        transaction = {
            "user_id": user_id,
            "transaction_type": transaction_type,
            "credits_used": amount,
            "credits_before": current_credits,
            "credits_after": new_credits,
            "description": description,
            "created_at": datetime.now().isoformat()
        }
        make_supabase_request("POST", "credit_transactions", transaction)
        return True

    return False

def add_credits(user_id, amount, transaction_type="purchase", description="Credit purchase"):
    """Add credits to user account"""
    current_credits = get_user_credits(user_id)
    new_credits = current_credits + amount

    # Update user credits
    success = make_supabase_request("PATCH", "user_stats", {"credits": new_credits}, filters={"user_id": f"eq.{user_id}"})

    if success:
        # Log credit transaction
        transaction = {
            "user_id": user_id,
            "transaction_type": transaction_type,
            "credits_used": -amount,  # Negative because it's an addition
            "credits_before": current_credits,
            "credits_after": new_credits,
            "description": description,
            "created_at": datetime.now().isoformat()
        }
        make_supabase_request("POST", "credit_transactions", transaction)
        return True

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

def create_user_registration(chat_id, name, surname, date_of_birth, referred_by_nerdx_id=None):
    """Create new user registration - matches backup function signature exactly"""
    try:
        nerdx_id = generate_nerdx_id()

        registration_data = {
            'chat_id': chat_id,
            'name': name,
            'surname': surname,
            'date_of_birth': date_of_birth,
            'nerdx_id': nerdx_id,
            'referred_by_nerdx_id': referred_by_nerdx_id,
            'created_at': datetime.utcnow().isoformat()
        }

        result = make_supabase_request("POST", "users_registration", registration_data)

        if result and len(result) > 0:
            logger.info(f"User registration created for {chat_id} with NerdX ID: {nerdx_id}")
            return result[0]

        return None
    except Exception as e:
        logger.error(f"Error creating user registration: {e}")
        return None

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
    """Add 50 credits to referrer when someone they referred registers"""
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

        # Add referral bonus credits (50 credits)
        referral_bonus = 50
        description = f'Referral bonus: {new_user_name} joined using your code'
        success = add_credits(referrer_chat_id, referral_bonus, 'referral_bonus', description)

        if success:
            logger.info(f"Added {referral_bonus} referral credits to {referrer_name} ({referrer_chat_id}) for referring {new_user_name} ({new_user_chat_id})")
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
        total_credits_earned = total_referrals * 50  # 50 credits per referral

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

def get_random_exam_question(subject=None):
    """Get a random exam question with priority for image questions"""
    try:
        filters = {}
        if subject:
            # For Combined Science, get questions from Biology, Chemistry, Physics categories
            if subject == "Combined Science":
                # Get questions from all science subjects
                science_subjects = ["Biology", "Chemistry", "Physics"]
                all_questions = []
                
                for science_subject in science_subjects:
                    subject_filters = {"category": f"eq.{science_subject}"}
                    questions = make_supabase_request("GET", "questions", filters=subject_filters, limit=20)
                    if questions:
                        all_questions.extend(questions)
                
                if all_questions:
                    question = random.choice(all_questions)
                    # Ensure consistency in field names
                    if 'answer' in question:
                        question['correct_answer'] = question['answer']
                    logger.info(f"Retrieved combined science question ID: {question.get('id')} from category: {question.get('category')}")
                    return question
            else:
                filters["subject"] = f"eq.{subject}"

        # First try to get questions with images (40% preference)
        if not subject or subject != "Combined Science":
            if random.random() < 0.4:  # 40% chance to prioritize image questions
                image_filters = filters.copy()
                image_filters["image_url"] = "not.is.null"
                result = make_supabase_request("GET", "questions", filters=image_filters, limit=20)

                if result and len(result) > 0:
                    question = random.choice(result)
                    # Ensure consistency in field names
                    if 'answer' in question:
                        question['correct_answer'] = question['answer']
                    logger.info(f"Retrieved image question ID: {question.get('id')}")
                    return question

            # Fallback to any question from the subject
            result = make_supabase_request("GET", "questions", filters=filters, limit=50)

            if result and len(result) > 0:
                question = random.choice(result)
                # Ensure consistency in field names
                if 'answer' in question:
                    question['correct_answer'] = question['answer']
                logger.info(f"Retrieved exam question ID: {question.get('id')}")
                return question

        logger.warning(f"No exam questions found for subject: {subject}")
        return None

    except Exception as e:
        logger.error(f"Error retrieving random exam question: {e}")
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

def count_questions_by_category_and_topic(category, topic):
    """Count questions in database by category and topic"""
    questions = get_questions_by_category_and_topic(category, topic)
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
        "created_at": datetime.now().isoformat()
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
            "created_at": datetime.now().isoformat()
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

def test_connection():
    """Test database connection"""
    try:
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

        # Check if users_registration table exists by trying to query it
        try:
            make_supabase_request("GET", "users_registration", limit=1)
        except:
            logger.info("users_registration table might not exist, but continuing...")

        logger.info("Database connection successful")
        return True
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        return False

# Legacy function compatibility
def get_connection():
    """Legacy function for compatibility - not used with Supabase"""
    logger.warning("get_connection() called - Supabase uses REST API, not direct connections")
    return None

# Additional helper functions for compatibility
def check_user_exists(chat_id: str) -> bool:
    """Check if user exists - wrapper for is_user_registered"""
    return is_user_registered(chat_id)

if __name__ == "__main__":
    # Test the connection
    if test_connection():
        print("✅ Database connection successful!")
    else:
        print("❌ Database connection failed!")