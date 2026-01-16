#!/usr/bin/env python3
"""
NerdX User Upgrade Script
1. Makes neezykidngoni@gmail.com a Super Admin (admin_users table)
2. Creates/Updates App User for neezykidngoni@gmail.com (users_registration table) with correct password and high credits
"""

import psycopg2
import bcrypt
import logging
import hashlib
import secrets
import string
import random
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database connection string
DATABASE_URL = os.getenv('DATABASE_URL')
if not DATABASE_URL:
    # Fallback to the one found in .env if load_dotenv fails for some reason
    DATABASE_URL = "postgresql://postgres.lzteiewcvxoazqfxfjgg:Ngonidzashe@aws-1-eu-west-1.pooler.supabase.com:6543/postgres"

APP_PASSWORD = "Ngoni2003" # As requested
ADMIN_PASSWORD = "Ngoni2003" # As requested

def get_db_connection():
    return psycopg2.connect(DATABASE_URL)

def hash_password_app(password):
    """Hash password for App (users_registration) using PBKDF2"""
    salt = secrets.token_hex(16)
    password_hash = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
    return password_hash.hex(), salt

def generate_nerdx_id():
    """Generate ID like N12345"""
    chars = string.ascii_uppercase + string.digits
    return "N" + "".join(random.choices(chars, k=5))

def setup_admin_user(cursor):
    """Setup Super Admin in admin_users"""
    email = 'neezykidngoni@gmail.com'
    username = 'ngonidzashe'
    
    logger.info(f"👑 Setting up Admin User: {email}")
    
    # Hash for admin (bcrypt)
    salt = bcrypt.gensalt()
    password_hash = bcrypt.hashpw(ADMIN_PASSWORD.encode('utf-8'), salt).decode('utf-8')
    
    cursor.execute("SELECT id FROM admin_users WHERE email = %s", (email,))
    exists = cursor.fetchone()
    
    if exists:
        logger.info("   Admin user exists. Updating...")
        cursor.execute("""
            UPDATE admin_users 
            SET username = %s,
                password_hash = %s,
                role = 'super_admin',
                is_active = TRUE,
                updated_at = NOW()
            WHERE email = %s
        """, (username, password_hash, email))
    else:
        logger.info("   Creating new Admin user...")
        cursor.execute("""
            INSERT INTO admin_users (username, email, password_hash, full_name, role, is_active)
            VALUES (%s, %s, %s, 'Ngonidzashe Zimbwa', 'super_admin', TRUE)
        """, (username, email, password_hash))
    
    logger.info("✅ Admin User setup complete.")

def setup_app_user(cursor):
    """Setup App User in users_registration"""
    email = 'neezykidngoni@gmail.com'
    # Use email as chat_id for email-based login consistency
    chat_id = email 
    
    logger.info(f"📱 Setting up App User: {email}")
    
    # Hash for app (PBKDF2)
    p_hash, p_salt = hash_password_app(APP_PASSWORD)
    
    cursor.execute("SELECT id, credits, purchased_credits FROM users_registration WHERE chat_id = %s", (chat_id,))
    exists = cursor.fetchone()
    
    # PAID STATUS: 50,000 Credits
    PAID_CREDITS = 50000 
    
    if exists:
        logger.info(f"   App user exists (Credits: {exists[1]}, Purchased: {exists[2]}). Updating...")
        cursor.execute("""
            UPDATE users_registration
            SET password_hash = %s,
                password_salt = %s,
                email = %s,
                credits = GREATEST(credits, 1000), -- Ensure base free credits
                purchased_credits = GREATEST(purchased_credits, %s), -- Add lots of purchased credits
                updated_at = NOW()
            WHERE chat_id = %s
        """, (p_hash, p_salt, email, PAID_CREDITS, chat_id))
    else:
        logger.info("   Creating new App user...")
        nerdx_id = generate_nerdx_id()
        # Attempt minimal insert first, assuming columns exist
        # Based on external_db.py schema hints
        try:
            cursor.execute("""
                INSERT INTO users_registration (
                    chat_id, name, surname, date_of_birth, nerdx_id, 
                    email, password_hash, password_salt, 
                    credits, purchased_credits, 
                    created_at, updated_at
                )
                VALUES (%s, 'Ngonidzashe', 'Zimbwa', '2000-01-01', %s, 
                        %s, %s, %s, 
                        1000, %s, 
                        NOW(), NOW())
            """, (chat_id, nerdx_id, email, p_hash, p_salt, PAID_CREDITS))
        except Exception as e:
            logger.error(f"   Error inserting app user: {e}")
            raise e
            
    # Also sync to user_stats if possible
    try:
        cursor.execute("SELECT user_id FROM user_stats WHERE user_id = %s", (chat_id,))
        stats_exists = cursor.fetchone()
        
        if stats_exists:
             cursor.execute("""
                UPDATE user_stats
                SET credits = (SELECT credits + purchased_credits FROM users_registration WHERE chat_id = %s),
                    purchased_credits = (SELECT purchased_credits FROM users_registration WHERE chat_id = %s)
                WHERE user_id = %s
             """, (chat_id, chat_id, chat_id))
        else:
             cursor.execute("""
                INSERT INTO user_stats (user_id, username, first_name, credits, purchased_credits, level, xp_points)
                VALUES (%s, 'neezykid', 'Ngonidzashe', %s, %s, 10, 5000)
             """, (chat_id, 1000 + PAID_CREDITS, PAID_CREDITS))
        logger.info("   Synced to user_stats.")
    except Exception as e:
        logger.warning(f"   Could not sync user_stats (might be non-fatal): {e}")

    logger.info("✅ App User setup complete.")

def main():
    try:
        conn = get_db_connection()
        conn.autocommit = True
        cursor = conn.cursor()
        
        setup_admin_user(cursor)
        setup_app_user(cursor)
        
        cursor.close()
        conn.close()
        
        print("\n" + "="*50)
        print("🎉 UPGRADE COMPLETE")
        print("="*50)
        print(f"User: neezykidngoni@gmail.com")
        print(f"Password: {APP_PASSWORD} (Admin & App)")
        print(f"Status: Super Admin + Paid App User (50,000+ Credits)")
        print("="*50 + "\n")
        
    except Exception as e:
        logger.error(f"❌ Script failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
