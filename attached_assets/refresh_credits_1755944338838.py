
#!/usr/bin/env python3
"""
Development script to refresh credits for all users
"""

from database import make_supabase_request, add_credits
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def refresh_all_user_credits(credits_to_add=500):
    """Add credits to all existing users for development testing"""
    try:
        # Get all users from user_stats table
        result = make_supabase_request("GET", "user_stats", select="user_id,username,first_name,credits")
        
        if not result:
            print("❌ No users found or failed to fetch users")
            return False
        
        print(f"🔄 Found {len(result)} users to refresh credits for...")
        print("=" * 60)
        
        successful_updates = 0
        
        for user in result:
            user_id = user['user_id']
            username = user.get('username', 'Unknown')
            current_credits = user.get('credits', 0)
            
            # Add development credits
            success = add_credits(
                user_id, 
                credits_to_add, 
                'development_refresh', 
                f'Development credit refresh - Added {credits_to_add} credits'
            )
            
            if success:
                new_credits = current_credits + credits_to_add
                print(f"✅ {username} ({user_id}): {current_credits} → {new_credits} credits")
                successful_updates += 1
            else:
                print(f"❌ Failed to update credits for {username} ({user_id})")
        
        print("=" * 60)
        print(f"🎉 Successfully updated {successful_updates}/{len(result)} users")
        print(f"💳 Added {credits_to_add} credits to each user")
        
        return successful_updates == len(result)
        
    except Exception as e:
        logger.error(f"Error refreshing credits: {e}")
        return False

def reset_specific_user_credits(user_id, new_credit_amount=1000):
    """Reset a specific user's credits to a specific amount"""
    try:
        # Update user credits directly
        update_data = {"credits": new_credit_amount}
        result = make_supabase_request("PATCH", "user_stats", update_data, filters={"user_id": f"eq.{user_id}"})
        
        if result:
            # Log the credit transaction
            transaction = {
                "user_id": user_id,
                "transaction_type": "development_reset",
                "credits_used": -new_credit_amount,  # Negative because it's an addition
                "credits_before": 0,  # We don't know the previous amount
                "credits_after": new_credit_amount,
                "description": f"Development credit reset to {new_credit_amount}",
                "created_at": "now()"
            }
            make_supabase_request("POST", "credit_transactions", transaction)
            
            print(f"✅ User {user_id} credits reset to {new_credit_amount}")
            return True
        else:
            print(f"❌ Failed to reset credits for user {user_id}")
            return False
            
    except Exception as e:
        logger.error(f"Error resetting user credits: {e}")
        return False

def show_current_credit_stats():
    """Show current credit statistics for all users"""
    try:
        result = make_supabase_request("GET", "user_stats", select="user_id,username,first_name,credits")
        
        if not result:
            print("❌ No users found")
            return
        
        print("\n📊 CURRENT CREDIT STATISTICS")
        print("=" * 60)
        
        total_credits = 0
        users_with_low_credits = 0
        
        for user in result:
            username = user.get('username', 'Unknown')
            credits = user.get('credits', 0)
            user_id = user['user_id']
            
            if credits < 50:
                users_with_low_credits += 1
                status = "🔴 LOW"
            elif credits < 200:
                status = "🟡 MED"
            else:
                status = "🟢 HIGH"
            
            print(f"{status} {username} ({user_id[-8:]}): {credits} credits")
            total_credits += credits
        
        print("=" * 60)
        print(f"👥 Total Users: {len(result)}")
        print(f"💰 Total Credits: {total_credits:,}")
        print(f"📊 Average Credits: {total_credits // len(result):,}")
        print(f"⚠️  Users with <50 credits: {users_with_low_credits}")
        
    except Exception as e:
        logger.error(f"Error showing credit stats: {e}")

def main():
    """Main function with interactive menu"""
    print("🛠️  DEVELOPMENT CREDIT MANAGEMENT TOOL")
    print("=" * 50)
    
    while True:
        print("\nSelect an option:")
        print("1. 📊 Show current credit statistics")
        print("2. 🔄 Refresh all users (+500 credits)")
        print("3. 💰 Give all users mega credits (+2000 credits)")
        print("4. 🎯 Reset specific user credits")
        print("5. 🚪 Exit")
        
        choice = input("\nEnter choice (1-5): ").strip()
        
        if choice == "1":
            show_current_credit_stats()
            
        elif choice == "2":
            print("\n🔄 Adding 500 credits to all users...")
            success = refresh_all_user_credits(500)
            if success:
                print("✅ All users credited successfully!")
            else:
                print("❌ Some users failed to update")
                
        elif choice == "3":
            print("\n💰 Adding 2000 MEGA credits to all users...")
            confirm = input("Are you sure? This gives everyone a lot of credits! (yes/no): ")
            if confirm.lower() == 'yes':
                success = refresh_all_user_credits(2000)
                if success:
                    print("✅ MEGA credits added to all users!")
                else:
                    print("❌ Some users failed to update")
            else:
                print("❌ Cancelled")
                
        elif choice == "4":
            user_id = input("Enter user ID: ").strip()
            amount = input("Enter credit amount (default 1000): ").strip()
            try:
                amount = int(amount) if amount else 1000
                reset_specific_user_credits(user_id, amount)
            except ValueError:
                print("❌ Invalid amount")
                
        elif choice == "5":
            print("👋 Goodbye!")
            break
            
        else:
            print("❌ Invalid choice")

if __name__ == "__main__":
    main()
