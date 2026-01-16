import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL')
# Fallback if env var not set matching the one in add_super_admin.py
if not DATABASE_URL:
    DATABASE_URL = "postgresql://postgres:Ngonidzashe2003.@db.hvlvwvzliqrlmqjbfgoa.supabase.co:5432/postgres"

def check_user():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        
        email = 'neezykidngoni@gmail.com'
        
        print(f"Checking for {email}...")
        
        # Check admin_users
        print("\n--- Admin Users ---")
        try:
            cursor.execute("SELECT id, username, email, role FROM admin_users WHERE email = %s", (email,))
            admin = cursor.fetchone()
            if admin:
                print(f"Found in admin_users: {admin}")
            else:
                print("Not found in admin_users")
        except Exception as e:
            print(f"Error checking admin_users: {e}")
            conn.rollback()
            
        # Check users_registration
        print("\n--- Users Registration (App Users) ---")
        try:
            # We use chat_id (which is email in this case)
            cursor.execute("SELECT id, chat_id, credits, purchased_credits, nerdx_id FROM users_registration WHERE chat_id = %s", (email,))
            user_reg = cursor.fetchone()
            if user_reg:
                print(f"Found in users_registration: {user_reg}")
                total_credits = (user_reg[2] or 0) + (user_reg[3] or 0)
                print(f"Total Credits: {total_credits}")
            else:
                print("Not found in users_registration")
        except Exception as e:
            print(f"Error checking users_registration: {e}")
            conn.rollback()
            
        # Check user_stats
        print("\n--- User Stats ---")
        try:
            cursor.execute("SELECT user_id, credits, purchased_credits FROM user_stats WHERE user_id = %s", (email,))
            stats = cursor.fetchone()
            if stats:
                print(f"Found in user_stats: {stats}")
            else:
                print("Not found in user_stats")
        except Exception as e:
            print(f"Error checking user_stats: {e}")
            conn.rollback()

        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Connection failed: {e}")

if __name__ == "__main__":
    check_user()
