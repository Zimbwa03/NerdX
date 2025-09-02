#!/usr/bin/env python3
"""
Webhook Monitor for Paynow Payments
==================================
Monitor and debug Paynow webhook issues to prevent payment failures
"""

import sys
sys.path.append('.')

import logging
from datetime import datetime, timedelta
from database.external_db import make_supabase_request

logger = logging.getLogger(__name__)

def check_recent_payments():
    """Check for recent payments that might need attention"""
    try:
        # Get recent payment transactions (last 24 hours)
        since_time = (datetime.now() - timedelta(hours=24)).isoformat()
        
        payments = make_supabase_request(
            'GET', 
            'payment_transactions',
            select='user_id,reference_code,amount,credits,status,created_at,approved_at,rejected_at',
            filters={
                'created_at': f'gte.{since_time}',
                'order': 'created_at.desc'
            }
        )
        
        if not payments:
            print("ℹ️ No recent payments found")
            return
        
        print(f"\n📊 Recent Payments (Last 24h): {len(payments)} transactions")
        print("=" * 80)
        print(f"{'Reference':<12} {'Amount':<8} {'Credits':<8} {'Status':<12} {'Time':<16}")
        print("-" * 80)
        
        pending_count = 0
        rejected_count = 0
        approved_count = 0
        
        for payment in payments:
            ref = payment['reference_code'][:10]
            amount = f"${payment['amount']:.2f}"
            credits = payment['credits']
            status = payment['status']
            time = payment['created_at'][:16].replace('T', ' ')
            
            if status == 'pending':
                pending_count += 1
            elif status == 'rejected':
                rejected_count += 1
            elif status == 'approved':
                approved_count += 1
            
            print(f"{ref:<12} {amount:<8} {credits:<8} {status:<12} {time:<16}")
        
        print("-" * 80)
        print(f"✅ Approved: {approved_count} | ⏳ Pending: {pending_count} | ❌ Rejected: {rejected_count}")
        
        # Alert on high rejection rate
        total = len(payments)
        if total > 0:
            rejection_rate = (rejected_count / total) * 100
            if rejection_rate > 30:
                print(f"\n🚨 HIGH REJECTION RATE: {rejection_rate:.1f}% - Investigation needed!")
            elif rejection_rate > 10:
                print(f"\n⚠️ Elevated rejection rate: {rejection_rate:.1f}% - Monitor closely")
        
        return {
            'total': total,
            'approved': approved_count,
            'pending': pending_count,
            'rejected': rejected_count,
            'rejection_rate': rejection_rate if total > 0 else 0
        }
        
    except Exception as e:
        print(f"❌ Error checking payments: {e}")
        return None

def fix_stuck_payments():
    """Check for payments that might be stuck due to webhook issues"""
    try:
        # Look for old pending payments (over 1 hour old)
        old_time = (datetime.now() - timedelta(hours=1)).isoformat()
        
        stuck_payments = make_supabase_request(
            'GET', 
            'payment_transactions',
            select='user_id,reference_code,amount,credits,status,created_at',
            filters={
                'status': 'eq.pending',
                'created_at': f'lt.{old_time}'
            }
        )
        
        if stuck_payments:
            print(f"\n⚠️ Found {len(stuck_payments)} potentially stuck payments:")
            for payment in stuck_payments:
                print(f"  Reference: {payment['reference_code']} | Amount: ${payment['amount']} | Age: {payment['created_at']}")
            
            print("\n💡 Recommendation: Check these payments manually in admin dashboard")
        else:
            print("\n✅ No stuck payments found")
            
        return stuck_payments
        
    except Exception as e:
        print(f"❌ Error checking stuck payments: {e}")
        return []

if __name__ == "__main__":
    print("🔍 Paynow Payment Monitor")
    print("=" * 40)
    
    # Check recent payment status
    stats = check_recent_payments()
    
    # Check for stuck payments
    stuck = fix_stuck_payments()
    
    print(f"\n📋 Summary:")
    if stats:
        print(f"  Recent transactions: {stats['total']}")
        print(f"  Success rate: {100 - stats['rejection_rate']:.1f}%")
    
    if stuck:
        print(f"  Stuck payments: {len(stuck)}")
    else:
        print(f"  Stuck payments: 0")
    
    print("\n✅ Monitoring complete")