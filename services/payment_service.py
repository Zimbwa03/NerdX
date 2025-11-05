import logging
import uuid
import os
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from database.external_db import make_supabase_request, add_credits
from services.paynow_service import paynow_service

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
        """Get artistic formatted credit packages display"""
        message = f"""✨ 𝗖𝗥𝗘𝗗𝗜𝗧 𝗦𝗧𝗢𝗥𝗘 ✨
╔═══════════════════╗
║ 💎 PREMIUM PLANS 💎 ║
╚═══════════════════╝

"""
        
        for package in self.packages:
            cost_per_credit = package['price'] / package['credits']
            message += f"{package['icon']} **{package['name']}** - ${package['price']:.2f}\n"
            message += f"   💎 {package['credits']} Credits • ${cost_per_credit:.3f}/credit\n"
            message += f"   🎯 {package['description']}\n"
            message += f"   💡 Best for: {package['best_for']}\n\n"
        
        return message
    
    def get_package_by_id(self, package_id: str) -> Optional[Dict]:
        """Get package details by ID"""
        for package in self.packages:
            if package['id'] == package_id:
                return package
        return None
    
    def get_package_selection_buttons(self) -> List[Dict]:
        """Get compact buttons for package selection to prevent truncation"""
        buttons = []
        for package in self.packages:
            # Compact format: icon + credits + price only
            buttons.append({
                'text': f"{package['icon']} {package['credits']}cr • ${package['price']:.2f}",
                'callback_data': f"select_package_{package['id']}"
            })
        
        buttons.append({
            'text': '⬅️ 𝗕𝗮𝗰𝗸 𝘁𝗼 𝗠𝗲𝗻𝘂',
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
                'id': pkg['id'],
                'name': pkg['name'],
                'price': pkg['price'],
                'credits': pkg['credits'],
                'amount': pkg['price'],
                'currency': 'USD',
                'description': pkg['description'],
                'best_for': pkg['best_for'],
                'icon': pkg['icon']
            } for pkg in self.packages
        ]
    
    def get_credit_packages(self) -> List[Dict]:
        """Get credit packages - compatibility method"""
        return self.calculate_credit_packages()
    
    def submit_payment_proof(self, user_id: str, package_id: str, reference_code: str, proof_text: str) -> Dict:
        """Submit payment proof for manual verification using the correct database schema"""
        try:
            package = self.get_package_by_id(package_id)
            if not package:
                return {'success': False, 'message': 'Package not found'}
            
            # Create payment transaction record with correct schema for admin review
            payment_data = {
                'user_id': user_id,
                'package_id': package_id,  # Correct field name
                'reference_code': reference_code,  # Correct field name  
                'amount': float(package['price']),  # Correct field name and type
                'credits': int(package['credits']),  # Correct field name and type
                'payment_proof': proof_text,  # Correct field name
                'status': 'pending',
                'created_at': datetime.now().isoformat(),
                'proof_submitted_at': datetime.now().isoformat(),  # Track submission time
                'credits_added': 0  # Will be updated when approved
            }
            
            # Store in payment_transactions table for admin review
            logger.info(f"Attempting to submit payment proof to payment_transactions table...")
            result = make_supabase_request("POST", "payment_transactions", payment_data)
            
            if result:
                logger.info(f"Payment proof submitted for user {user_id}, ref: {reference_code}")
                return {
                    'success': True,
                    'message': 'Payment proof submitted successfully. Awaiting admin verification.',
                    'reference_code': reference_code,
                    'package': package
                }
            else:
                logger.error(f"Failed to submit payment proof - Supabase returned no result")
                # Try to get more detailed error information
                try:
                    # Check if table exists
                    table_check = make_supabase_request("GET", "payment_transactions", limit=1, use_service_role=True)
                    if table_check is None:
                        return {
                            'success': False, 
                            'message': '❌ **Payment System Error**\n\n'
                                      'The payment system is currently unavailable due to database configuration issues.\n\n'
                                      '🔧 **What to do:**\n'
                                      '1. Please try again in a few minutes\n'
                                      '2. If the problem persists, contact support\n'
                                      '3. We are working to resolve this issue\n\n'
                                      '📞 **Support**: Contact the admin team'
                        }
                except Exception as check_error:
                    logger.error(f"Error checking table existence: {check_error}")
                
                return {
                    'success': False, 
                    'message': '❌ **Payment Proof Submission Failed**\n\n'
                              'We encountered an error while processing your payment proof.\n\n'
                              '🔄 **Please try again** or contact support if the problem persists.\n\n'
                              '📞 **Support**: Contact the admin team'
                }
                
        except Exception as e:
            logger.error(f"Error submitting payment proof: {e}")
            return {'success': False, 'message': f'Error submitting payment proof: {str(e)}'}
    
    def approve_payment(self, reference_code: str) -> Dict:
        """Approve a pending payment and add credits to user"""
        try:
            # Get pending payment details from payment_transactions table
            result = make_supabase_request(
                "GET", 
                "payment_transactions", 
                filters={"reference_code": f"eq.{reference_code}"}
            )
            
            if not result or len(result) == 0:
                return {'success': False, 'message': 'Payment not found'}
            
            payment = result[0]
            user_id = payment['user_id']
            credits = payment['credits']  # Updated field name
            package = self.get_package_by_id(payment.get('package_id', 'unknown'))  # Updated field name
            
            # Add credits to user account using advanced credit system
            from services.advanced_credit_service import advanced_credit_service
            add_success = advanced_credit_service.add_credits_for_purchase(user_id, credits, f"Credit purchase: {package['name'] if package else 'Package'}")
            
            if add_success:
                # Update payment status to approved
                update_data = {
                    'status': 'approved',
                    'approved_at': datetime.now().isoformat(),
                    'credits_added': credits
                }
                
                # Update status in payment_transactions table
                make_supabase_request(
                    "PATCH", 
                    "payment_transactions", 
                    update_data,
                    filters={"reference_code": f"eq.{reference_code}"}
                )
                
                # Add to completed payments table for dashboard analytics
                completed_payment = {
                    'user_id': user_id,
                    'amount_paid': payment.get('amount', 0),  # Updated field name
                    'credits_added': credits,
                    'transaction_reference': reference_code,
                    'status': 'completed',
                    'payment_method': 'ecocash',
                    'created_at': payment.get('created_at'),
                    'completed_at': datetime.now().isoformat()
                }
                make_supabase_request("POST", "payments", completed_payment)
                
                # Send WhatsApp notification to user
                self.send_payment_approval_notification(user_id, reference_code, package, credits)
                
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
    
    def reject_payment(self, reference_code: str, reason: str) -> Dict:
        """Reject a pending payment"""
        try:
            # Get pending payment details from payment_transactions table
            result = make_supabase_request(
                "GET", 
                "payment_transactions", 
                filters={"reference_code": f"eq.{reference_code}"}
            )
            
            if not result or len(result) == 0:
                return {'success': False, 'message': 'Payment not found'}
            
            payment = result[0]
            user_id = payment['user_id']
            
            # Update payment status to rejected
            update_data = {
                'status': 'rejected',
                'rejection_reason': reason,
                'rejected_at': datetime.now().isoformat()
            }
            
            success = make_supabase_request(
                "PATCH", 
                "payment_transactions", 
                update_data,
                filters={"reference_code": f"eq.{reference_code}"}
            )
            
            if success:
                # Send rejection notification to user
                self.send_payment_rejection_notification(user_id, reference_code, reason)
                
                return {
                    'success': True,
                    'message': 'Payment rejected successfully',
                    'user_id': user_id,
                    'reason': reason
                }
            else:
                return {'success': False, 'message': 'Failed to reject payment'}
                
        except Exception as e:
            logger.error(f"Error rejecting payment: {e}")
            return {'success': False, 'message': 'Error processing rejection'}
    
    def send_payment_approval_notification(self, user_id: str, reference_code: str, package: Dict, credits: int) -> None:
        """Send payment approval notification to user"""
        try:
            from services.whatsapp_service import WhatsAppService
            whatsapp_service = WhatsAppService()
            
            message = f"""🎉 **PAYMENT APPROVED!**

✅ **Transaction Successful**

💰 **Package**: {package['name']}
💳 **Credits Added**: +{credits} credits
🔢 **Transaction ID**: {reference_code}
📅 **Date**: {datetime.now().strftime('%Y-%m-%d %H:%M')}

🚀 **Your credits are ready to use!**
🎯 **Start learning now and make the most of your purchase!**

📚 **CONTINUE LEARNING**
🏠 **MAIN MENU**
💰 **BUY MORE CREDITS**"""
            
            buttons = [
                {"text": "📚 CONTINUE LEARNING", "callback_data": "start_quiz"},
                {"text": "🏠 MAIN MENU", "callback_data": "back_to_menu"},
                {"text": "💰 BUY MORE CREDITS", "callback_data": "credit_store"}
            ]
            
            whatsapp_service.send_interactive_message(user_id, message, buttons)
            
        except Exception as e:
            logger.error(f"Error sending payment approval notification: {e}")
    
    def send_payment_rejection_notification(self, user_id: str, reference_code: str, reason: str) -> None:
        """Send payment rejection notification to user"""
        try:
            from services.whatsapp_service import WhatsAppService
            whatsapp_service = WhatsAppService()
            
            message = f"""⚠️ **PAYMENT REQUIRES CLARIFICATION**

❗ **Issue Identified:**
{reason}

📋 **Next Steps:**
1️⃣ Check your EcoCash SMS again
2️⃣ Ensure you sent the exact amount
3️⃣ Resubmit complete confirmation message

💡 **Common Issues:**
• Incomplete SMS text copied
• Wrong amount sent
• Payment to wrong number

🔄 **RESUBMIT PAYMENT PROOF**
💬 **CONTACT SUPPORT**
🏠 **BACK TO MAIN MENU**"""
            
            buttons = [
                {"text": "🔄 RESUBMIT PAYMENT PROOF", "callback_data": "credit_store"},
                {"text": "💬 CONTACT SUPPORT", "callback_data": "contact_support"},
                {"text": "🏠 BACK TO MAIN MENU", "callback_data": "back_to_menu"}
            ]
            
            whatsapp_service.send_interactive_message(user_id, message, buttons)
                
        except Exception as e:
            logger.error(f"Error sending payment rejection notification: {e}")
    
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
    
    def get_payment_approved_message(self, reference_code: str) -> str:
        """Get payment approved message"""
        try:
            result = make_supabase_request(
                "GET", 
                "payment_transactions", 
                filters={"reference_code": f"eq.{reference_code}"}
            )
            
            if result and len(result) > 0:
                payment = result[0]
                package = self.get_package_by_id(payment.get('package_id', 'unknown'))  # Updated field name
                package_name = package['name'] if package else 'Unknown Package'
                credits = payment.get('credits', 0)  # Updated field name
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
    
    # PAYNOW USD ECOCASH INTEGRATION
    # ===============================
    
    def create_paynow_payment(self, user_id: str, package_id: str, phone_number: str, email: str) -> Dict:
        """
        Create a USD EcoCash payment using Paynow integration
        
        Args:
            user_id: User's unique identifier
            package_id: Selected package ID
            phone_number: EcoCash phone number (format: 0771234567)
            email: User's email address (required by Paynow)
            
        Returns:
            Dict with payment creation results
        """
        try:
            package = self.get_package_by_id(package_id)
            if not package:
                return {'success': False, 'message': 'Package not found'}
            
            # Check if Paynow service is available
            if not paynow_service.is_available():
                logger.warning("Paynow service not available, falling back to manual payment")
                return self.get_payment_instructions_message(user_id, package_id)
            
            # Generate unique reference code
            reference_code = self.generate_payment_reference(user_id, package_id)
            
            # Create Paynow payment
            logger.info(f"Creating Paynow payment: {reference_code} - ${package['price']:.2f} for {phone_number}")
            
            payment_result = paynow_service.create_usd_ecocash_payment(
                amount=package['price'],
                phone_number=phone_number,
                email=email,
                reference=reference_code,
                description=f"NerdX {package['name']} - {package['credits']} credits"
            )
            
            if payment_result['success']:
                # Store payment transaction in database
                # Note: Only include columns that exist in payment_transactions table schema
                payment_data = {
                    'user_id': user_id,
                    'package_id': package_id,
                    'reference_code': reference_code,
                    'amount': float(package['price']),
                    'credits': int(package['credits']),
                    'status': 'initiated',  # Paynow-specific status
                    'payment_method': 'paynow_ecocash',
                    'credits_added': 0,
                    'admin_notes': f"Phone: {phone_number} | Email: {email} | Poll URL: {payment_result.get('poll_url')}"
                }
                
                # Save to payment_transactions table
                result = make_supabase_request("POST", "payment_transactions", payment_data)
                
                if result:
                    logger.info(f"Paynow payment initiated: {reference_code}")
                    
                    # Start background payment monitoring
                    poll_url = payment_result.get('poll_url')
                    if poll_url:
                        self._start_payment_monitoring(reference_code, poll_url, user_id)
                    
                    return {
                        'success': True,
                        'payment_type': 'paynow',
                        'reference_code': reference_code,
                        'instructions': payment_result['instructions'],
                        'poll_url': payment_result['poll_url'],
                        'status': 'initiated',
                        'message': f"💳 **PAYNOW USD ECOCASH PAYMENT**\n\n"
                                  f"📱 **Payment initiated to {phone_number}**\n"
                                  f"💰 **Amount**: ${package['price']:.2f} USD\n"
                                  f"📞 **EcoCash Number**: {phone_number}\n"
                                  f"🔢 **Reference**: {reference_code}\n\n"
                                  f"{payment_result['instructions']}\n\n"
                                  f"⏰ **Status will be updated automatically once payment is confirmed.**",
                        'package': package
                    }
                else:
                    return {'success': False, 'message': 'Failed to save payment transaction'}
            else:
                logger.error(f"Paynow payment failed: {payment_result.get('error')}")
                # Fall back to manual payment process
                logger.info("Falling back to manual payment process")
                return self.get_payment_instructions_message(user_id, package_id)
                
        except Exception as e:
            logger.error(f"Error creating Paynow payment: {e}")
            # Fall back to manual payment process
            return self.get_payment_instructions_message(user_id, package_id)
    
    def check_paynow_payment_status(self, reference_code: str) -> Dict:
        """
        Check status of Paynow payment and update database if needed
        
        Args:
            reference_code: Payment reference code
            
        Returns:
            Dict with payment status
        """
        try:
            # Get payment from database first
            result = make_supabase_request(
                "GET", 
                "payment_transactions", 
                filters={"reference_code": f"eq.{reference_code}"}
            )
            
            if not result or len(result) == 0:
                return {'success': False, 'message': 'Payment not found'}
            
            payment = result[0]
            current_status = payment.get('status', 'unknown')
            poll_url = payment.get('paynow_poll_url')
            
            # If already completed, return current status
            if current_status in ['approved', 'paid', 'completed']:
                return {
                    'success': True,
                    'status': current_status,
                    'paid': True,
                    'amount': payment.get('amount', 0),
                    'credits': payment.get('credits', 0)
                }
            
            # Check with Paynow if poll_url exists
            if poll_url and paynow_service.is_available():
                paynow_status = paynow_service.check_payment_status(poll_url)
                
                if paynow_status['success']:
                    # Update database if status changed
                    if paynow_status['paid'] and current_status != 'approved':
                        # Payment confirmed - approve automatically
                        approval_result = self.approve_paynow_payment(reference_code)
                        if approval_result['success']:
                            return {
                                'success': True,
                                'status': 'approved',
                                'paid': True,
                                'amount': payment.get('amount', 0),
                                'credits': payment.get('credits', 0),
                                'message': 'Payment confirmed and credits added!'
                            }
                    
                    # Update status in database
                    update_data = {
                        'status': 'paid' if paynow_status['paid'] else 'pending',
                        'paynow_reference': paynow_status.get('paynow_reference')
                    }
                    
                    make_supabase_request(
                        "PATCH", 
                        "payment_transactions", 
                        update_data,
                        filters={"reference_code": f"eq.{reference_code}"}
                    )
                    
                    return paynow_status
            
            # Return current status from database
            return {
                'success': True,
                'status': current_status,
                'paid': current_status == 'approved',
                'amount': payment.get('amount', 0),
                'credits': payment.get('credits', 0)
            }
            
        except Exception as e:
            logger.error(f"Error checking Paynow payment status: {e}")
            return {'success': False, 'message': 'Error checking payment status'}
    
    def approve_paynow_payment(self, reference_code: str) -> Dict:
        """
        Approve a Paynow payment and add credits (called automatically when payment confirmed)
        
        Args:
            reference_code: Payment reference code
            
        Returns:
            Dict with approval results
        """
        try:
            # Get payment details
            result = make_supabase_request(
                "GET", 
                "payment_transactions", 
                filters={"reference_code": f"eq.{reference_code}"}
            )
            
            if not result or len(result) == 0:
                return {'success': False, 'message': 'Payment not found'}
            
            payment = result[0]
            user_id = payment['user_id']
            credits = payment['credits']
            package_id = payment.get('package_id', 'unknown')
            
            # Add credits to user account
            credit_result = add_credits(user_id, credits)
            
            if credit_result:
                # Update payment status to approved
                update_data = {
                    'status': 'approved',
                    'approved_at': datetime.now().isoformat(),
                    'credits_added': credits
                }
                
                make_supabase_request(
                    "PATCH", 
                    "payment_transactions", 
                    update_data,
                    filters={"reference_code": f"eq.{reference_code}"}
                )
                
                logger.info(f"Paynow payment approved: {reference_code} - {credits} credits added to {user_id}")
                
                package = self.get_package_by_id(package_id)
                package_name = package['name'] if package else 'Package'
                
                # 🚨 CRITICAL: Send WhatsApp confirmation message
                self.send_paynow_confirmation_message(user_id, credits, reference_code, package_name)
                
                return {
                    'success': True,
                    'message': f'Payment approved! {credits} credits added to your account.',
                    'credits_added': credits,
                    'package_name': package_name,
                    'user_id': user_id
                }
            else:
                return {'success': False, 'message': 'Failed to add credits'}
                
        except Exception as e:
            logger.error(f"Error approving Paynow payment: {e}")
            return {'success': False, 'message': 'Error approving payment'}
    
    def process_paynow_webhook(self, webhook_data: Dict) -> Dict:
        """
        Process Paynow webhook notification
        
        Args:
            webhook_data: Webhook payload from Paynow
            
        Returns:
            Dict with processing results
        """
        try:
            if not paynow_service.is_available():
                return {'success': False, 'message': 'Paynow service not available'}
            
            # Process webhook through Paynow service
            webhook_result = paynow_service.process_webhook(webhook_data)
            
            if webhook_result['success'] and webhook_result['valid']:
                reference_code = webhook_result['reference']
                
                if webhook_result['paid']:
                    # Payment confirmed - approve automatically
                    approval_result = self.approve_paynow_payment(reference_code)
                    
                    if approval_result['success']:
                        logger.info(f"Webhook processed: {reference_code} - payment approved")
                        return {
                            'success': True,
                            'message': 'Payment confirmed via webhook',
                            'reference_code': reference_code,
                            'approved': True
                        }
                else:
                    # Update payment status but don't approve yet
                    update_data = {
                        'status': webhook_result['status'].lower(),
                        'paynow_reference': webhook_result.get('paynow_reference')
                    }
                    
                    make_supabase_request(
                        "PATCH", 
                        "payment_transactions", 
                        update_data,
                        filters={"reference_code": f"eq.{reference_code}"}
                    )
                    
                    return {
                        'success': True,
                        'message': 'Payment status updated',
                        'reference_code': reference_code,
                        'status': webhook_result['status']
                    }
            
            return {'success': False, 'message': 'Invalid webhook data'}
            
        except Exception as e:
            logger.error(f"Error processing Paynow webhook: {e}")
            return {'success': False, 'message': 'Webhook processing error'}
    
    def get_payment_method_selection_message(self) -> str:
        """Get message for payment method selection"""
        return """💳 **CHOOSE PAYMENT METHOD**

🚀 **PAYNOW USD ECOCASH** (Recommended)
✅ Instant confirmation
✅ Automated processing  
✅ Real-time credit top-up
✅ Secure Paynow gateway

📱 **MANUAL ECOCASH**
⏱️ Manual verification required
⏱️ Up to 30 minutes processing
💬 Submit SMS proof

Select your preferred payment method below:"""
    
    def get_payment_method_buttons(self) -> List[Dict]:
        """Get buttons for payment method selection"""
        buttons = []
        
        if paynow_service.is_available():
            buttons.append({
                'text': '🚀 PAYNOW USD ECOCASH (Instant)',
                'callback_data': 'payment_method_paynow'
            })
        
        buttons.extend([
            {
                'text': '📱 Manual EcoCash Payment',
                'callback_data': 'payment_method_manual'
            },
            {
                'text': '⬅️ Back to Packages',
                'callback_data': 'buy_credits'
            }
        ])
        
        return buttons
    
    def _start_payment_monitoring(self, reference_code: str, poll_url: str, user_id: str):
        """Start background monitoring for payment confirmation"""
        try:
            import threading
            import time
            
            def monitor_payment():
                """Background thread to monitor payment status"""
                max_checks = 20  # Check for up to 10 minutes (20 * 30s)
                check_interval = 30  # Check every 30 seconds
                
                for attempt in range(max_checks):
                    try:
                        time.sleep(check_interval)
                        
                        # Check payment status
                        status_result = self.check_paynow_payment_status(reference_code)
                        
                        if status_result.get('paid'):
                            logger.info(f"✅ Payment confirmed via monitoring: {reference_code}")
                            break
                        
                        logger.info(f"⏳ Payment monitoring attempt {attempt + 1}/{max_checks}: {reference_code} - status: {status_result.get('status')}")
                        
                    except Exception as monitor_error:
                        logger.error(f"Payment monitoring error: {monitor_error}")
                        
                logger.info(f"Payment monitoring stopped for {reference_code}")
            
            # Start monitoring thread
            monitor_thread = threading.Thread(target=monitor_payment, daemon=True)
            monitor_thread.start()
            logger.info(f"🔍 Started payment monitoring thread for {reference_code}")
            
        except Exception as e:
            logger.error(f"Error starting payment monitoring: {e}")
    
    def send_paynow_confirmation_message(self, user_id: str, credits: int, reference_code: str, package_name: str):
        """
        Send WhatsApp confirmation message for successful Paynow payment
        
        Args:
            user_id: User's chat ID
            credits: Number of credits added
            reference_code: Payment reference
            package_name: Name of purchased package
        """
        try:
            from services.whatsapp_service import WhatsAppService
            whatsapp_service = WhatsAppService()
            
            message = f"""🎉 **PAYMENT CONFIRMED!** 🎉

✅ **Your Paynow USD EcoCash payment has been successfully processed!**

📦 **Package:** {package_name}
💰 **Credits Added:** {credits} credits
🔗 **Reference:** {reference_code}
⚡ **Status:** Instant confirmation

🚀 **You can now continue your studies with NerdX!**

Click below to get started:"""

            # Send confirmation message
            success = whatsapp_service.send_message(user_id, message)
            
            if success:
                logger.info(f"✅ Paynow confirmation sent to {user_id} for payment {reference_code}")
                
                # Send follow-up buttons for quick access
                try:
                    buttons = [
                        {"text": "📚 Start Studying", "callback_data": "main_menu"},
                        {"text": "📊 View My Stats", "callback_data": "stats"},
                        {"text": "💳 Buy More Credits", "callback_data": "buy_credits"}
                    ]
                    
                    whatsapp_service.send_interactive_message(
                        user_id, 
                        "🎯 **What would you like to do next?**", 
                        buttons
                    )
                    
                except Exception as e:
                    logger.warning(f"Failed to send follow-up buttons: {e}")
                    
            else:
                logger.error(f"❌ Failed to send Paynow confirmation to {user_id}")
                
        except Exception as e:
            logger.error(f"🚨 Error sending Paynow confirmation: {e}")
            # Don't fail the payment approval if message sending fails

# Global instance
payment_service = PaymentService()
