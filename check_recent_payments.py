#!/usr/bin/env python3
"""
Check Recent Payments
====================
Quick script to check recent payment transactions in the database
"""

import sys
sys.path.append('.')

import logging
from datetime import datetime, timedelta
from database.external_db import make_supabase_request

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def check_recent_payments(hours=24):
    """Check for recent payments in the last N hours"""
    try:
        # Get recent payment transactions
        since_time = (datetime.now() - timedelta(hours=hours)).isoformat()
        
        print(f"\nChecking for payments in the last {hours} hours...")
        print("=" * 80)
        
        # Get all recent payments
        payments = make_supabase_request(
            'GET', 
            'payment_transactions',
            select='id,user_id,reference_code,amount,credits,status,payment_method,created_at,approved_at',
            filters={
                'created_at': f'gte.{since_time}',
            },
            order='created_at.desc',
            limit=50,
            use_service_role=True
        )
        
        if not payments:
            print(f"ℹ️ No payments found in the last {hours} hours")
            return
        
        print(f"\n📊 Found {len(payments)} payment(s) in the last {hours} hours:\n")
        print(f"{'Reference':<15} {'Amount':<10} {'Credits':<10} {'Status':<12} {'Method':<12} {'Time':<20}")
        print("-" * 100)
        
        total_amount = 0
        status_counts = {}
        
        for payment in payments:
            ref = payment.get('reference_code', 'N/A')[:14]
            amount = payment.get('amount', 0)
            credits = payment.get('credits', 0)
            status = payment.get('status', 'unknown')
            method = payment.get('payment_method', 'N/A') or 'N/A'
            created = payment.get('created_at', '')
            
            # Format time
            if created:
                try:
                    dt = datetime.fromisoformat(created.replace('Z', '+00:00'))
                    time_str = dt.strftime('%Y-%m-%d %H:%M:%S')
                except:
                    time_str = created[:19] if len(created) > 19 else created
            else:
                time_str = 'N/A'
            
            print(f"{ref:<15} ${amount:<9.2f} {credits:<10} {status:<12} {method:<12} {time_str:<20}")
            
            total_amount += float(amount or 0)
            status_counts[status] = status_counts.get(status, 0) + 1
        
        print("-" * 100)
        print(f"\n💰 Total Amount: ${total_amount:.2f}")
        print(f"\n📈 Status Breakdown:")
        for status, count in status_counts.items():
            print(f"   {status}: {count}")
        
        # Show most recent payment details
        if payments:
            latest = payments[0]
            print(f"\n🆕 Most Recent Payment:")
            print(f"   Reference: {latest.get('reference_code')}")
            print(f"   Amount: ${latest.get('amount', 0):.2f}")
            print(f"   Credits: {latest.get('credits', 0)}")
            print(f"   Status: {latest.get('status')}")
            print(f"   Method: {latest.get('payment_method') or 'N/A'}")
            print(f"   Time: {latest.get('created_at')}")
            if latest.get('approved_at'):
                print(f"   Approved: {latest.get('approved_at')}")
        
    except Exception as e:
        logger.error(f"Error checking payments: {e}", exc_info=True)
        print(f"\nError: {e}")

if __name__ == "__main__":
    # Check last 24 hours by default, or use command line argument
    hours = int(sys.argv[1]) if len(sys.argv) > 1 else 24
    check_recent_payments(hours)
