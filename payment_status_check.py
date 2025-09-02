#!/usr/bin/env python3
"""
Quick Payment Status Check
========================
Check current payment system health
"""

import sys
sys.path.append('.')

def quick_payment_check():
    """Quick check of payment system status"""
    try:
        from database.external_db import make_supabase_request
        
        print("🔍 Quick Payment System Check")
        print("=" * 40)
        
        # Check recent payments (last 10)
        payments = make_supabase_request(
            'GET', 
            'payment_transactions',
            select='reference_code,amount,status,created_at',
            filters={'limit': '10', 'order': 'created_at.desc'}
        )
        
        if payments:
            print(f"📊 Last 10 Payments:")
            approved = rejected = pending = 0
            
            for payment in payments:
                ref = payment['reference_code'][:8]
                amount = f"${payment['amount']:.2f}"
                status = payment['status']
                date = payment['created_at'][:10]
                
                if status == 'approved': 
                    approved += 1
                    icon = "✅"
                elif status == 'rejected': 
                    rejected += 1
                    icon = "❌"
                else:
                    pending += 1
                    icon = "⏳"
                
                print(f"  {icon} {ref} - {amount} - {status} ({date})")
            
            print(f"\n📈 Summary: ✅{approved} ❌{rejected} ⏳{pending}")
            
            success_rate = (approved / len(payments)) * 100 if payments else 0
            print(f"📊 Success Rate: {success_rate:.1f}%")
            
            if rejected > approved:
                print("🚨 WARNING: High rejection rate detected!")
            elif success_rate > 70:
                print("✅ Payment system healthy")
        else:
            print("ℹ️ No payments found")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    quick_payment_check()