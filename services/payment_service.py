import logging
import uuid
import os
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from database.external_db import make_supabase_request, add_credits

logger = logging.getLogger(__name__)

class PaymentService:
    """Handle EcoCash payments and credit packages with manual verification"""
    
    def __init__(self):
        self.ecocash_number = "+263 785494594"  # Fixed payment number
        if not os.getenv('ECOCASH_API_KEY'):
            logger.warning("EcoCash API key not configured - payment features will be limited")
        
        self.packages = [
            {
                'id': 'pocket',
                'name': 'POCKET PACKAGE',
                'price': 1.00,
                'credits': 50,
                'description': 'Perfect for quick help',
                'best_for': '1-2 study sessions',
                'icon': '🟤'
            },
            {
                'id': 'mini',
                'name': 'MINI PACKAGE', 
                'price': 2.00,
                'credits': 120,
                'description': 'Extended trial value',
                'best_for': 'Week of light studying',
                'icon': '🟢'
            },
            {
                'id': 'quick',
                'name': 'QUICK PACKAGE',
                'price': 5.00,
                'credits': 350,
                'description': 'Most popular choice',
                'best_for': 'Regular study routine',
                'icon': '🔵'
            },
            {
                'id': 'boost',
                'name': 'BOOST PACKAGE',
                'price': 10.00,
                'credits': 750,
                'description': 'Maximum value',
                'best_for': 'Intensive study periods',
                'icon': '🟡'
            }
        ]
    
    def get_credit_packages_display(self) -> str:
        """Get formatted credit packages display"""
        message = f"💰 **CREDIT STORE**\n\n"
        
        for package in self.packages:
            message += f"{package['icon']} **{package['name']}** - ${package['price']:.2f}\n"
            message += f"   {package['credits']} Credits | {package['description']}\n"
            message += f"   💡 Best for: {package['best_for']}\n\n"
        
        return message
    
    def get_package_by_id(self, package_id: str) -> Optional[Dict]:
        """Get package details by ID"""
        for package in self.packages:
            if package['id'] == package_id:
                return package
        return None
    
    def get_package_selection_buttons(self) -> List[Dict]:
        """Get buttons for package selection"""
        buttons = []
        for package in self.packages:
            buttons.append({
                'text': f"{package['icon']} {package['credits']} Credits - ${package['price']:.2f}",
                'callback_data': f"select_package_{package['id']}"
            })
        
        buttons.append({
            'text': '⬅️ Back to Menu',
            'callback_data': 'main_menu'
        })
        
        return buttons
    
    def get_package_details_message(self, package_id: str) -> str:
        """Get detailed package information message"""
        package = self.get_package_by_id(package_id)
        if not package:
            return "❌ Package not found."
        
        cost_per_credit = package['price'] / package['credits']
        
        message = f"{package['icon']} **{package['name']} - ${package['price']:.2f}**\n\n"
        message += f"📊 **PACKAGE DETAILS:**\n"
        message += f"💳 Credits: {package['credits']} credits\n"
        message += f"💰 Cost per credit: ${cost_per_credit:.3f}\n"
        message += f"🎯 Perfect for: {package['best_for']}\n\n"
        message += f"✨ {package['description']}\n"
        
        return message
    
    def generate_payment_reference(self, user_id: str, package_id: str) -> str:
        """Generate unique payment reference code"""
        timestamp = datetime.now().strftime("%m%d%H%M")
        user_suffix = user_id[-4:] if len(user_id) >= 4 else user_id
        return f"NX{timestamp}{user_suffix}{package_id.upper()[:2]}"
    
    def get_payment_instructions_message(self, user_id: str, package_id: str) -> Dict:
        """Get EcoCash payment instructions"""
        package = self.get_package_by_id(package_id)
        if not package:
            return {'success': False, 'message': 'Package not found'}
        
        reference_code = self.generate_payment_reference(user_id, package_id)
        
        # Save payment intent to pending_payments table
        payment_data = {
            'user_id': user_id,
            'transaction_reference': reference_code,
            'amount_expected': package['price'],
            'credits_to_add': package['credits'],
            'status': 'pending',
            'package_type': package_id,
            'created_at': datetime.now().isoformat()
        }
        
        try:
            # Save to pending_payments table (exists in Supabase)
            make_supabase_request("POST", "pending_payments", payment_data)
            logger.info(f"Payment intent saved to pending_payments: {reference_code}")
        except Exception as e:
            logger.error(f"Error saving payment intent to pending_payments: {e}")
            # Save to session database as fallback
            try:
                from database.session_db import save_user_session
                save_user_session(f"payment_{user_id}", {
                    'session_type': 'payment_transaction',
                    'payment_data': payment_data
                })
                logger.info(f"Payment intent saved to session database as fallback")
            except Exception as session_e:
                logger.error(f"Error saving to session database: {session_e}")
        
        message = f"💳 **PAYMENT INSTRUCTIONS**\n\n"
        message += f"📱 **PAY VIA ECOCASH:**\n"
        message += f"📞 **Number**: {self.ecocash_number}\n"
        message += f"👤 **Name**: Ngonidzashe Zimbwa\n"
        message += f"💰 **Amount**: ${package['price']:.2f} USD\n"
        message += f"📋 **Reference**: {reference_code}\n\n"
        message += f"⚠️ **IMPORTANT STEPS:**\n"
        message += f"1️⃣ Send ${package['price']:.2f} to {self.ecocash_number}\n"
        message += f"2️⃣ Copy your EcoCash confirmation SMS\n"
        message += f"3️⃣ Paste it in the next message\n"
        message += f"4️⃣ Wait for approval (usually within 30 minutes)\n\n"
        message += f"💡 **Why this process?**\n"
        message += f"Secure verification ensures your payment is protected and credits are accurately added."
        
        return {
            'success': True,
            'message': message,
            'reference_code': reference_code,
            'package': package
        }
    
    def get_payment_instructions_buttons(self) -> List[Dict]:
        """Get buttons for payment instructions"""
        return [
            {'id': 'submit_payment_proof', 'title': "✅ I'VE SENT THE MONEY - SUBMIT PROOF"},
            {'id': 'payment_help', 'title': "❓ NEED HELP?"},
            {'id': 'buy_credits', 'title': "⬅️ BACK"}
        ]
    
    def get_payment_proof_submission_message(self, reference_code: str) -> str:
        """Get payment proof submission message"""
        # Get payment details from database
        try:
            result = make_supabase_request(
                "GET", 
                "pending_payments", 
                filters={"transaction_reference": f"eq.{reference_code}"}
            )
            
            if result and len(result) > 0:
                payment = result[0]
                package = self.get_package_by_id(payment.get('package_type', 'unknown'))
                package_name = package['name'] if package else 'Unknown Package'
                amount = payment.get('amount_expected', 0)
            else:
                package_name = 'Unknown Package'
                amount = '0.00'
                
        except Exception as e:
            logger.error(f"Error getting payment details: {e}")
            package_name = 'Unknown Package'
            amount = '0.00'
        
        message = f"📝 **SUBMIT PAYMENT PROOF**\n\n"
        message += f"💳 **Package**: {package_name} - ${amount}\n"
        message += f"📞 **Payment Number**: {self.ecocash_number}\n"
        message += f"🔢 **Reference Code**: {reference_code}\n\n"
        message += f"📋 **PASTE YOUR ECOCASH CONFIRMATION MESSAGE:**\n"
        message += f"(Copy and paste the entire SMS confirmation you received)\n\n"
        message += f"Example format:\n"
        message += f"\"Confirmed. You have sent ${amount} to {self.ecocash_number}. Transaction ID: ABC123XYZ...\""
        
        return message
    
    def calculate_credit_packages(self) -> List[Dict]:
        """Get available credit packages - updated for compatibility"""
        return [
            {
                'credits': pkg['credits'],
                'amount': pkg['price'],
                'currency': 'USD',
                'description': pkg['description']
            } for pkg in self.packages
        ]
    
    def get_credit_packages(self) -> List[Dict]:
        """Get credit packages - compatibility method"""
        return self.calculate_credit_packages()
    
    def submit_payment_proof(self, user_id: str, reference_code: str, proof_text: str) -> Dict:
        """Submit payment proof for verification"""
        try:
            # Update payment transaction with proof
            update_data = {
                'payment_proof': proof_text,
                'proof_submitted_at': datetime.now().isoformat(),
                'status': 'proof_submitted'
            }
            
            try:
                success = make_supabase_request(
                    "PATCH", 
                    "pending_payments", 
                    update_data,
                    filters={"transaction_reference": f"eq.{reference_code}"}
                )
                logger.info(f"Payment proof updated in pending_payments: {reference_code}")
            except Exception as e:
                logger.error(f"Error updating pending_payments table: {e}")
                # Fallback to session database
                from database.session_db import save_user_session
                save_user_session(f"payment_proof_{user_id}", {
                    'session_type': 'payment_proof',
                    'reference_code': reference_code,
                    'proof_text': proof_text,
                    'submitted_at': datetime.now().isoformat(),
                    'status': 'proof_submitted'
                })
                logger.info(f"Payment proof saved to session database as fallback")
                success = True  # Treat as success since we saved to fallback
            
            if success:
                return {
                    'success': True,
                    'message': self.get_payment_under_review_message(reference_code)
                }
            else:
                return {
                    'success': False,
                    'message': 'Error submitting payment proof. Please try again.'
                }
                
        except Exception as e:
            logger.error(f"Error submitting payment proof: {e}")
            return {
                'success': False,
                'message': 'Error submitting payment proof. Please try again.'
            }
    
    def get_payment_under_review_message(self, reference_code: str) -> str:
        """Get payment under review message"""
        try:
            result = make_supabase_request(
                "GET", 
                "pending_payments", 
                filters={"transaction_reference": f"eq.{reference_code}"}
            )
            
            if result and len(result) > 0:
                payment = result[0]
                package = self.get_package_by_id(payment.get('package_type', 'unknown'))
                package_name = package['name'] if package else 'Unknown Package'
                amount = payment.get('amount_expected', 0)
                timestamp = datetime.now().strftime("%H:%M on %d/%m/%Y")
            else:
                package_name = 'Unknown Package'
                amount = '0.00'
                timestamp = datetime.now().strftime("%H:%M on %d/%m/%Y")
                
        except Exception as e:
            logger.error(f"Error getting payment details: {e}")
            package_name = 'Unknown Package'
            amount = '0.00'
            timestamp = datetime.now().strftime("%H:%M on %d/%m/%Y")
        
        message = f"⏳ **PAYMENT UNDER REVIEW**\n\n"
        message += f"✅ **Submission Successful!**\n\n"
        message += f"📋 **Details:**\n"
        message += f"💰 Package: {package_name}\n"
        message += f"💳 Amount: ${amount}\n"
        message += f"🔢 Reference: {reference_code}\n"
        message += f"⏰ Submitted: {timestamp}\n\n"
        message += f"🕐 **Processing Time**: Usually 5-30 minutes\n"
        message += f"📧 **Status**: Payment verification in progress...\n\n"
        message += f"💡 **What happens next?**\n"
        message += f"• Our team verifies your EcoCash transaction\n"
        message += f"• Once confirmed, credits are instantly added\n"
        message += f"• You'll receive a confirmation message\n\n"
        message += f"🔔 **You'll be notified when approved!**"
        
        return message
    
    def approve_payment(self, reference_code: str) -> Dict:
        """Approve payment and add credits (admin function)"""
        try:
            # Get payment details
            result = make_supabase_request(
                "GET", 
                "pending_payments", 
                filters={"transaction_reference": f"eq.{reference_code}"}
            )
            
            if not result or len(result) == 0:
                return {'success': False, 'message': 'Payment not found'}
            
            payment = result[0]
            user_id = payment['user_id']
            credits = payment['credits_to_add']
            package = self.get_package_by_id(payment.get('package_type', 'unknown'))
            
            # Add credits to user account
            add_success = add_credits(
                user_id, 
                credits, 
                'credit_purchase', 
                f"Credit purchase: {package['name'] if package else 'Package'}"
            )
            
            if add_success:
                # Update payment status
                update_data = {
                    'status': 'approved',
                    'approved_at': datetime.now().isoformat(),
                    'credits_added': credits
                }
                
                # Update status in pending_payments and add to completed payments
                make_supabase_request(
                    "PATCH", 
                    "pending_payments", 
                    update_data,
                    filters={"transaction_reference": f"eq.{reference_code}"}
                )
                
                # Also add to payments table for dashboard analytics
                completed_payment = {
                    'user_id': user_id,
                    'amount_paid': payment.get('amount_expected', 0),
                    'credits_added': credits,
                    'transaction_reference': reference_code,
                    'status': 'completed',
                    'created_at': payment.get('created_at'),
                    'completed_at': datetime.now().isoformat()
                }
                make_supabase_request("POST", "payments", completed_payment)
                
                return {
                    'success': True,
                    'user_id': user_id,
                    'credits': credits,
                    'package': package,
                    'message': self.get_payment_approved_message(reference_code)
                }
            else:
                return {'success': False, 'message': 'Error adding credits'}
                
        except Exception as e:
            logger.error(f"Error approving payment: {e}")
            return {'success': False, 'message': 'Error processing approval'}
    
    def get_payment_approved_message(self, reference_code: str) -> str:
        """Get payment approved message"""
        try:
            result = make_supabase_request(
                "GET", 
                "pending_payments", 
                filters={"transaction_reference": f"eq.{reference_code}"}
            )
            
            if result and len(result) > 0:
                payment = result[0]
                package = self.get_package_by_id(payment.get('package_type', 'unknown'))
                package_name = package['name'] if package else 'Unknown Package'
                credits = payment.get('credits_to_add', 0)
                timestamp = datetime.now().strftime("%H:%M on %d/%m/%Y")
            else:
                package_name = 'Unknown Package'
                credits = 0
                timestamp = datetime.now().strftime("%H:%M on %d/%m/%Y")
                
        except Exception as e:
            logger.error(f"Error getting payment details: {e}")
            package_name = 'Unknown Package'
            credits = 0
            timestamp = datetime.now().strftime("%H:%M on %d/%m/%Y")
        
        message = f"🎉 **PAYMENT APPROVED!**\n\n"
        message += f"✅ **Transaction Successful**\n\n"
        message += f"💰 **Package**: {package_name}\n"
        message += f"💳 **Credits Added**: +{credits} credits\n"
        message += f"🔢 **Transaction ID**: {reference_code}\n"
        message += f"📅 **Date**: {timestamp}\n\n"
        message += f"🚀 **Your credits are ready to use!**\n"
        message += f"🎯 **Start learning now and make the most of your purchase!**"
        
        return message

# Global instance
payment_service = PaymentService()
