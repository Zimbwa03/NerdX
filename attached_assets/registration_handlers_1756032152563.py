#!/usr/bin/env python3
"""
Registration Handlers Module for NerdX ZIMSEC Combined Science Quiz Bot
Manages the multi-step user registration process.
"""

import re
import logging
from datetime import datetime
from typing import Dict, Optional

from database_direct import (
    is_user_registered, create_user_registration, get_user_by_nerdx_id,
    add_referral_credits
)
from session_manager import (
    get_registration_session, update_registration_session, clear_registration_session
)
from message_utils import send_whatsapp_message, send_whatsapp_button_message
from credit_system_config import CreditSystemConfig

logger = logging.getLogger(__name__)

def handle_register_command(from_number: str, message_body: str = None):
    """Handle registration command - start or continue registration process"""
    try:
        # Check if user is already registered
        if is_user_registered(from_number):
            message = """✅ *You're Already Registered!*

Your account is active and ready to use.

🎯 Send 'quiz' to start practicing
📊 Send 'stats' to view your progress
💳 Send 'credits' to check your balance"""
            
            buttons = [
                {"text": "📚 Start Quiz", "callback_data": "quiz"},
                {"text": "📊 View Stats", "callback_data": "stats"},
                {"text": "🏠 Main Menu", "callback_data": "main_menu"}
            ]
            
            return send_whatsapp_button_message(from_number, message, buttons)
        
        # Get or start registration session
        session = get_registration_session(from_number)
        
        if not session:
            # Start new registration
            start_registration(from_number)
        else:
            # Continue existing registration
            continue_registration(from_number, session, message_body)
            
    except Exception as e:
        logger.error(f"Error handling register command: {e}")
        send_whatsapp_message(from_number, "❌ Error starting registration. Please try again.")

def start_registration(from_number: str):
    """Start the registration process"""
    try:
        # Initialize registration session
        update_registration_session(from_number, "name")
        
        message = """🎓 *Welcome to NerdX ZIMSEC Quiz Bot!*

Let's create your account to start your ZIMSEC Combined Science journey.

📝 *Step 1 of 4: Your Name*

Please enter your first name:"""
        
        send_whatsapp_message(from_number, message)
        logger.info(f"Started registration for {from_number}")
        
    except Exception as e:
        logger.error(f"Error starting registration: {e}")
        send_whatsapp_message(from_number, "❌ Error starting registration. Please try again.")

def continue_registration(from_number: str, session: Dict, user_input: str = None):
    """Continue registration based on current step"""
    try:
        current_step = session.get('step')
        
        if current_step == "name":
            handle_name_step(from_number, user_input)
        elif current_step == "surname":
            handle_surname_step(from_number, user_input)
        elif current_step == "date_of_birth":
            handle_date_of_birth_step(from_number, user_input)
        elif current_step == "referral":
            handle_referral_step(from_number, user_input)
        else:
            logger.warning(f"Unknown registration step: {current_step}")
            start_registration(from_number)
            
    except Exception as e:
        logger.error(f"Error continuing registration: {e}")
        send_whatsapp_message(from_number, "❌ Error during registration. Please try 'register' to start over.")

def handle_name_step(from_number: str, name: str):
    """Handle name input step"""
    try:
        if not name or len(name.strip()) < 2:
            send_whatsapp_message(from_number, "Please enter a valid first name (at least 2 characters):")
            return
        
        # Validate name (letters, spaces, hyphens only) and prevent commands
        clean_name = name.strip()
        if clean_name.startswith('/') or clean_name.lower() in ['start', 'hi', 'hello', 'menu']:
            send_whatsapp_message(from_number, "Please enter your actual first name (not a command or greeting):")
            return
        
        if not re.match(r'^[a-zA-Z\s\-]+$', clean_name):
            send_whatsapp_message(from_number, "Please enter a valid name using only letters, spaces, and hyphens:")
            return
        
        # Update session with name and move to surname step
        update_registration_session(from_number, "surname", name=name.strip().title())
        
        message = f"""✅ Name recorded: {name.strip().title()}

📝 *Step 2 of 4: Your Surname*

Please enter your surname/last name:"""
        
        send_whatsapp_message(from_number, message)
        
    except Exception as e:
        logger.error(f"Error handling name step: {e}")
        send_whatsapp_message(from_number, "❌ Error processing name. Please try again.")

def handle_surname_step(from_number: str, surname: str):
    """Handle surname input step"""
    try:
        if not surname or len(surname.strip()) < 2:
            send_whatsapp_message(from_number, "Please enter a valid surname (at least 2 characters):")
            return
        
        # Validate surname and prevent commands
        clean_surname = surname.strip()
        if clean_surname.startswith('/') or clean_surname.lower() in ['start', 'hi', 'hello', 'menu']:
            send_whatsapp_message(from_number, "Please enter your actual surname (not a command or greeting):")
            return
        
        if not re.match(r'^[a-zA-Z\s\-]+$', clean_surname):
            send_whatsapp_message(from_number, "Please enter a valid surname using only letters, spaces, and hyphens:")
            return
        
        # Update session with surname and move to date of birth step
        update_registration_session(from_number, "date_of_birth", surname=surname.strip().title())
        
        message = f"""✅ Surname recorded: {surname.strip().title()}

📝 *Step 3 of 4: Date of Birth*

Please enter your date of birth in the format: DD/MM/YYYY

Example: 15/03/2005"""
        
        send_whatsapp_message(from_number, message)
        
    except Exception as e:
        logger.error(f"Error handling surname step: {e}")
        send_whatsapp_message(from_number, "❌ Error processing surname. Please try again.")

def handle_date_of_birth_step(from_number: str, date_input: str):
    """Handle date of birth input step"""
    try:
        if not date_input:
            send_whatsapp_message(from_number, "Please enter your date of birth (DD/MM/YYYY):")
            return
        
        # Validate date format
        date_pattern = r'^(\d{1,2})/(\d{1,2})/(\d{4})$'
        match = re.match(date_pattern, date_input.strip())
        
        if not match:
            message = """❌ Invalid date format.

Please enter your date of birth as DD/MM/YYYY

Examples:
• 15/03/2005
• 08/12/2004
• 25/07/2006"""
            send_whatsapp_message(from_number, message)
            return
        
        day, month, year = match.groups()
        
        # Validate date values
        try:
            datetime(int(year), int(month), int(day))
        except ValueError:
            send_whatsapp_message(from_number, "❌ Invalid date. Please check the day, month, and year are correct:")
            return
        
        # Validate age (should be reasonable for O-Level students)
        birth_year = int(year)
        current_year = datetime.now().year
        age = current_year - birth_year
        
        if age < 12 or age > 25:
            message = f"❌ Age validation: You appear to be {age} years old.\n\n"
            message += "This bot is designed for ZIMSEC O-Level students (typically 14-20 years old).\n\n"
            message += "Please enter your correct date of birth:"
            send_whatsapp_message(from_number, message)
            return
        
        # Format date consistently for display (keep DD/MM/YYYY for user)
        display_date = f"{day.zfill(2)}/{month.zfill(2)}/{year}"
        
        # Update session and move to referral step
        update_registration_session(from_number, "referral", date_of_birth=display_date)
        
        message = f"""✅ Date of birth recorded: {formatted_date}

📝 *Step 4 of 4: Referral Code (Optional)*

Do you have a referral code from a friend?

💡 Enter the code to get bonus credits, or type 'skip' to continue without one.

Referral codes look like: NERDX123"""
        
        send_whatsapp_message(from_number, message)
        
    except Exception as e:
        logger.error(f"Error handling date of birth step: {e}")
        send_whatsapp_message(from_number, "❌ Error processing date. Please try again.")

def handle_referral_step(from_number: str, referral_input: str):
    """Handle referral code input step (final step)"""
    try:
        session = get_registration_session(from_number)
        if not session:
            send_whatsapp_message(from_number, "❌ Registration session expired. Please start over with 'register'.")
            return
        
        referral_code = None
        
        if referral_input and referral_input.strip().lower() != 'skip':
            # Extract and validate referral code
            from message_utils import extract_referral_code
            referral_code = extract_referral_code(referral_input)
            
            if referral_code:
                # Check if referral code exists
                referred_by_user = get_user_by_nerdx_id(referral_code)
                
                if not referred_by_user:
                    message = f"❌ Referral code '{referral_code}' not found.\n\n"
                    message += "Please check the code and try again, or type 'skip' to continue:"
                    send_whatsapp_message(from_number, message)
                    return
                
                # Don't allow self-referral
                if referred_by_user['user_id'] == from_number:
                    message = "❌ You cannot use your own referral code.\n\n"
                    message += "Please enter a different code or type 'skip':"
                    send_whatsapp_message(from_number, message)
                    return
                
                logger.info(f"Valid referral code {referral_code} for {from_number}")
            else:
                message = f"❌ Invalid referral code format.\n\n"
                message += "Codes should look like: NERDX123\n\n"
                message += "Try again or type 'skip':"
                send_whatsapp_message(from_number, message)
                return
        
        # Complete registration
        complete_registration(from_number, session, referral_code)
        
    except Exception as e:
        logger.error(f"Error handling referral step: {e}")
        send_whatsapp_message(from_number, "❌ Error processing referral. Please try again.")

def complete_registration(from_number: str, session: Dict, referral_code: Optional[str]):
    """Complete the registration process"""
    try:
        # Create user registration
        registration_data = {
            'user_id': from_number,
            'name': session['name'],
            'surname': session['surname'],
            'date_of_birth': session['date_of_birth'],
            'referred_by_nerdx_id': referral_code
        }
        
        success = create_user_registration(registration_data)
        
        if not success:
            send_whatsapp_message(from_number, "❌ Error creating account. Please try again or contact support.")
            return
        
        # Process referral credits if applicable
        referral_bonus = 0
        if referral_code:
            try:
                # Add credits to new user
                referral_bonus = CreditSystemConfig.get_referral_bonus()
                add_referral_credits(from_number, referral_bonus, referral_code)
                
                # Add credits to referring user
                referred_by_user = get_user_by_nerdx_id(referral_code)
                if referred_by_user:
                    add_referral_credits(referred_by_user['user_id'], referral_bonus, f"referred_{from_number}")
                
                logger.info(f"Processed referral: {referral_code} -> {from_number}")
            except Exception as e:
                logger.error(f"Error processing referral credits: {e}")
                # Continue with registration even if referral fails
        
        # Clear registration session
        clear_registration_session(from_number)
        
        # Get user's NerdX ID
        from database_direct import get_user_registration
        user_reg = get_user_registration(from_number)
        nerdx_id = user_reg.get('nerdx_id', 'Unknown') if user_reg else 'Unknown'
        
        # Send success message
        message = f"""🎉 *Registration Complete!*

Welcome to NerdX ZIMSEC Quiz Bot, {session['name']}!

✅ **Account Details:**
👤 Name: {session['name']} {session['surname']}
🆔 Your NerdX ID: {nerdx_id}
🎂 Date of Birth: {session['date_of_birth']}"""

        if referral_code:
            message += f"""
🔗 Referral: {referral_code}
💳 Bonus Credits: +{referral_bonus}"""
        
        message += f"""

🚀 **You're ready to start learning!**

💳 Starting Credits: {CreditSystemConfig.get_starting_credits() + referral_bonus}
🎯 Send 'quiz' to begin practicing
📊 Send 'stats' to view your progress

Good luck with your ZIMSEC Combined Science studies! 🧪⚗️🔬"""
        
        buttons = [
            {"text": "📚 Start Quiz", "callback_data": "quiz"},
            {"text": "📊 View Stats", "callback_data": "stats"},
            {"text": "🏠 Main Menu", "callback_data": "main_menu"}
        ]
        
        send_whatsapp_button_message(from_number, message, buttons)
        logger.info(f"Registration completed for {from_number} ({session['name']} {session['surname']})")
        
    except Exception as e:
        logger.error(f"Error completing registration: {e}")
        send_whatsapp_message(from_number, "❌ Error finalizing registration. Please contact support.")

def handle_referral_command(from_number: str, message_body: str):
    """Handle referral code submission for existing users"""
    try:
        # Check if user is registered
        if not is_user_registered(from_number):
            send_whatsapp_message(from_number, "❌ Please register first before using referral codes. Send 'register' to start.")
            return
        
        # Extract referral code from message
        from message_utils import extract_referral_code
        referral_code = extract_referral_code(message_body)
        
        if not referral_code:
            message = """🔗 *Referral Code Entry*

Please send a valid referral code.

Format: NERDX123

Example: "My referral code is NERDX456"
Or simply: "NERDX789" """
            send_whatsapp_message(from_number, message)
            return
        
        # Check if user already used a referral
        from database_direct import get_user_registration
        user_reg = get_user_registration(from_number)
        
        if user_reg and user_reg.get('referred_by_nerdx_id'):
            message = f"❌ You've already used a referral code: {user_reg['referred_by_nerdx_id']}\n\n"
            message += "Each user can only use one referral code."
            send_whatsapp_message(from_number, message)
            return
        
        # Validate referral code
        referred_by_user = get_user_by_nerdx_id(referral_code)
        
        if not referred_by_user:
            send_whatsapp_message(from_number, f"❌ Referral code '{referral_code}' not found. Please check and try again.")
            return
        
        # Don't allow self-referral
        if referred_by_user['user_id'] == from_number:
            send_whatsapp_message(from_number, "❌ You cannot use your own referral code.")
            return
        
        # Apply referral
        try:
            referral_bonus = CreditSystemConfig.get_referral_bonus()
            
            # Add credits to current user
            add_referral_credits(from_number, referral_bonus, referral_code)
            
            # Add credits to referring user
            add_referral_credits(referred_by_user['user_id'], referral_bonus, f"referred_{from_number}")
            
            # Update user registration with referral
            # Note: This might need to be implemented in database_direct.py
            
            message = f"""✅ *Referral Applied Successfully!*

🎉 You received {referral_bonus} bonus credits!
🔗 Referral code: {referral_code}

💳 Check your balance with 'credits'
🚀 Start learning with 'quiz'

Thank you for using a referral code! 🙏"""
            
            send_whatsapp_message(from_number, message)
            logger.info(f"Referral applied: {referral_code} -> {from_number}")
            
        except Exception as e:
            logger.error(f"Error applying referral: {e}")
            send_whatsapp_message(from_number, "❌ Error applying referral code. Please try again.")
            
    except Exception as e:
        logger.error(f"Error handling referral command: {e}")
        send_whatsapp_message(from_number, "❌ Error processing referral. Please try again.")