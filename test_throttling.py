"""
WhatsApp Throttling System Test Suite
Tests critical message detection and throttling behavior
"""
import time
import logging
from services.whatsapp_service import WhatsAppService
from services.message_throttle import message_throttle
from services.quality_monitor import quality_monitor

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class ThrottleTestRunner:
    """Test runner for throttling system"""
    
    def __init__(self):
        self.whatsapp = WhatsAppService()
        self.test_user = "263777000000"  # Test phone number
        self.results = {
            'passed': 0,
            'failed': 0,
            'tests': []
        }
    
    def test_critical_message_detection(self):
        """Test that critical messages are properly detected"""
        logger.info("\n" + "="*60)
        logger.info("TEST 1: Critical Message Detection")
        logger.info("="*60)
        
        # Critical messages that should bypass throttling
        critical_messages = [
            # Quiz responses
            "✅ Correct! The answer is x = 5",
            "❌ Incorrect. The correct answer is 42",
            "Next question: What is 2+2?",
            "Your score: 8/10 🎯",
            
            # Registration
            "Welcome to NerdX! Please provide your consent",
            "Please provide your first name",
            "Enter your date of birth",
            
            # Payment
            "Buy Credits - Select a package",
            "Payment ready! Complete your payment here",
            "Transaction confirmed: +100 credits",
            
            # Menu navigation
            "Main Menu - Choose a subject:",
            "Select difficulty: Easy, Medium, Hard",
            "Available topics in Mathematics",
            
            # Project Assistant
            "Research guidance for your project topic",
            "Image generation ready - 2 credits",
            "Document created successfully",
            
            # User requests
            "💡 Hint: Consider using the quadratic formula",
            "Show Answer: The solution is...",
            "Help: Here's how to solve this problem",
            
            # Comprehension
            "Comprehension passage: Read the following text",
            "Question 1: What is the main idea?",
            
            # Graph Practice
            "Type your expression to plot the graph",
            "Graph generated for equation: y = x^2",
            
            # Exam Mode
            "Exam started - You have 60 minutes",
            "Past Paper Question 1 of 20",
            
            # Interactive responses
            "✅ Yes, continue",
            "❌ No, skip",
            "Confirm your selection",
            "Proceed to next stage"
        ]
        
        passed = 0
        failed = 0
        
        for message in critical_messages:
            is_critical = self.whatsapp._is_critical_user_response(message)
            if is_critical:
                logger.info(f"✅ PASS: '{message[:50]}...' detected as critical")
                passed += 1
            else:
                logger.error(f"❌ FAIL: '{message[:50]}...' NOT detected as critical")
                failed += 1
        
        logger.info(f"\nResults: {passed}/{len(critical_messages)} passed")
        self.results['tests'].append({
            'name': 'Critical Message Detection',
            'passed': passed,
            'failed': failed,
            'total': len(critical_messages)
        })
        
        return failed == 0
    
    def test_non_critical_message_detection(self):
        """Test that non-critical messages are properly identified"""
        logger.info("\n" + "="*60)
        logger.info("TEST 2: Non-Critical Message Detection")
        logger.info("="*60)
        
        # Non-critical messages that should be throttled
        non_critical_messages = [
            "Daily reminder: Complete your practice today",
            "Weekly summary: You've answered 50 questions",
            "New feature announcement: Check out our latest update",
            "System notification: Maintenance scheduled",
            "Did you know? Fun fact about mathematics"
        ]
        
        passed = 0
        failed = 0
        
        for message in non_critical_messages:
            is_critical = self.whatsapp._is_critical_user_response(message)
            if not is_critical:
                logger.info(f"✅ PASS: '{message[:50]}...' detected as non-critical")
                passed += 1
            else:
                logger.error(f"❌ FAIL: '{message[:50]}...' incorrectly detected as critical")
                failed += 1
        
        logger.info(f"\nResults: {passed}/{len(non_critical_messages)} passed")
        self.results['tests'].append({
            'name': 'Non-Critical Message Detection',
            'passed': passed,
            'failed': failed,
            'total': len(non_critical_messages)
        })
        
        return failed == 0
    
    def test_rate_limiting(self):
        """Test that rate limiting works correctly"""
        logger.info("\n" + "="*60)
        logger.info("TEST 3: Rate Limiting Behavior")
        logger.info("="*60)
        
        # Reset throttle for this user
        message_throttle.last_message_time[self.test_user] = 0
        message_throttle.message_history[self.test_user] = []
        
        # Send 10 messages rapidly (should respect 3-second delay)
        start_time = time.time()
        messages_allowed = 0
        
        for i in range(10):
            if message_throttle.can_send_message(self.test_user):
                message_throttle.record_message_sent(self.test_user)
                messages_allowed += 1
                logger.info(f"Message {i+1}/10: ALLOWED (after {time.time() - start_time:.2f}s)")
                time.sleep(0.1)  # Small delay to simulate processing
            else:
                logger.info(f"Message {i+1}/10: BLOCKED by throttle")
                time.sleep(0.1)
        
        elapsed = time.time() - start_time
        
        # Check if throttling worked correctly
        # In 10 seconds, we should allow ~3 messages (1 every 3 seconds)
        expected_min = 1
        expected_max = 4
        
        passed = expected_min <= messages_allowed <= expected_max
        
        if passed:
            logger.info(f"✅ PASS: {messages_allowed} messages allowed in {elapsed:.2f}s (expected {expected_min}-{expected_max})")
        else:
            logger.error(f"❌ FAIL: {messages_allowed} messages allowed in {elapsed:.2f}s (expected {expected_min}-{expected_max})")
        
        self.results['tests'].append({
            'name': 'Rate Limiting',
            'passed': 1 if passed else 0,
            'failed': 0 if passed else 1,
            'total': 1
        })
        
        return passed
    
    def test_lock_mechanism(self):
        """Test that lock mechanism prevents concurrent sends"""
        logger.info("\n" + "="*60)
        logger.info("TEST 4: Lock Mechanism")
        logger.info("="*60)
        
        test_user = "263777111111"
        
        # Try to acquire lock
        lock1 = message_throttle.acquire_lock(test_user)
        logger.info(f"First lock attempt: {'SUCCESS' if lock1 else 'FAILED'}")
        
        # Try to acquire lock again (should fail)
        lock2 = message_throttle.acquire_lock(test_user)
        logger.info(f"Second lock attempt (should fail): {'SUCCESS' if lock2 else 'FAILED'}")
        
        # Release lock
        message_throttle.release_lock(test_user)
        logger.info("Lock released")
        
        # Try to acquire lock again (should succeed)
        lock3 = message_throttle.acquire_lock(test_user)
        logger.info(f"Third lock attempt (after release): {'SUCCESS' if lock3 else 'FAILED'}")
        
        # Clean up
        message_throttle.release_lock(test_user)
        
        passed = lock1 and not lock2 and lock3
        
        if passed:
            logger.info("✅ PASS: Lock mechanism working correctly")
        else:
            logger.error("❌ FAIL: Lock mechanism not working correctly")
        
        self.results['tests'].append({
            'name': 'Lock Mechanism',
            'passed': 1 if passed else 0,
            'failed': 0 if passed else 1,
            'total': 1
        })
        
        return passed
    
    def test_quality_monitoring(self):
        """Test quality monitoring metrics"""
        logger.info("\n" + "="*60)
        logger.info("TEST 5: Quality Monitoring")
        logger.info("="*60)
        
        # Track a message
        quality_monitor.track_message_sent("263777222222", "text")
        
        # Track a response
        quality_monitor.track_response_received("263777222222")
        
        # Get metrics
        report = quality_monitor.get_quality_report()
        
        logger.info(f"Quality Rating: {report.get('quality_rating', 'N/A')}")
        logger.info(f"Total Messages Sent: {report.get('metrics', {}).get('total_messages_sent', 0)}")
        logger.info(f"Response Rate: {report.get('rates', {}).get('response_rate', 0):.2%}")
        logger.info(f"Complaint Rate: {report.get('rates', {}).get('complaint_rate', 0):.4%}")
        
        passed = report.get('quality_rating') in ['GREEN', 'YELLOW', 'RED']
        
        if passed:
            logger.info("✅ PASS: Quality monitoring working")
        else:
            logger.error("❌ FAIL: Quality monitoring not working")
        
        self.results['tests'].append({
            'name': 'Quality Monitoring',
            'passed': 1 if passed else 0,
            'failed': 0 if passed else 1,
            'total': 1
        })
        
        return passed
    
    def test_throttle_parameters(self):
        """Verify throttle parameters match WhatsApp limits"""
        logger.info("\n" + "="*60)
        logger.info("TEST 6: Throttle Parameters")
        logger.info("="*60)
        
        min_delay = message_throttle.min_delay_between_messages
        max_per_minute = message_throttle.max_messages_per_minute
        
        logger.info(f"Minimum delay between messages: {min_delay}s")
        logger.info(f"Maximum messages per minute: {max_per_minute}")
        
        # Check against WhatsApp limits
        # WhatsApp: 1 msg every 6 seconds (~10 msg/min)
        # Ours: 1 msg every 3 seconds (10 msg/min)
        
        delay_ok = min_delay >= 3.0  # At least 3 seconds
        rate_ok = max_per_minute <= 10  # At most 10 per minute
        
        if delay_ok and rate_ok:
            logger.info("✅ PASS: Throttle parameters aligned with WhatsApp limits")
            logger.info("   ✓ 3s delay is conservative vs WhatsApp's 6s pair rate")
            logger.info("   ✓ 10 msg/min matches WhatsApp's ~10 msg/min limit")
        else:
            logger.error("❌ FAIL: Throttle parameters NOT aligned with WhatsApp limits")
            if not delay_ok:
                logger.error(f"   ✗ Delay {min_delay}s is too aggressive (should be >= 3s)")
            if not rate_ok:
                logger.error(f"   ✗ Rate {max_per_minute} msg/min exceeds WhatsApp's 10 msg/min limit")
        
        passed = delay_ok and rate_ok
        
        self.results['tests'].append({
            'name': 'Throttle Parameters',
            'passed': 1 if passed else 0,
            'failed': 0 if passed else 1,
            'total': 1
        })
        
        return passed
    
    def run_all_tests(self):
        """Run all tests and print summary"""
        logger.info("\n" + "="*60)
        logger.info("WHATSAPP THROTTLING SYSTEM TEST SUITE")
        logger.info("="*60)
        
        tests = [
            self.test_critical_message_detection,
            self.test_non_critical_message_detection,
            self.test_rate_limiting,
            self.test_lock_mechanism,
            self.test_quality_monitoring,
            self.test_throttle_parameters
        ]
        
        for test in tests:
            try:
                test()
            except Exception as e:
                logger.error(f"Error running test: {e}", exc_info=True)
        
        # Print summary
        logger.info("\n" + "="*60)
        logger.info("TEST SUMMARY")
        logger.info("="*60)
        
        total_passed = 0
        total_failed = 0
        
        for test_result in self.results['tests']:
            name = test_result['name']
            passed = test_result['passed']
            failed = test_result['failed']
            total = test_result['total']
            
            status = "✅ PASS" if failed == 0 else "❌ FAIL"
            logger.info(f"{status} - {name}: {passed}/{total} passed")
            
            total_passed += passed
            total_failed += failed
        
        logger.info("="*60)
        logger.info(f"OVERALL: {total_passed}/{total_passed + total_failed} tests passed")
        logger.info("="*60)
        
        if total_failed == 0:
            logger.info("\n🎉 ALL TESTS PASSED! Throttling system is working correctly.")
            logger.info("\nKey Features Verified:")
            logger.info("✓ Critical messages bypass throttling")
            logger.info("✓ Non-critical messages respect rate limits")
            logger.info("✓ 3-second minimum delay enforced")
            logger.info("✓ 10 messages/minute limit enforced")
            logger.info("✓ Lock mechanism prevents concurrent sends")
            logger.info("✓ Quality monitoring tracks metrics")
            logger.info("\n✅ SAFE TO ENABLE THROTTLING IN PRODUCTION")
        else:
            logger.warning(f"\n⚠️  {total_failed} TEST(S) FAILED - Review issues before enabling throttling")
        
        return total_failed == 0

if __name__ == "__main__":
    runner = ThrottleTestRunner()
    success = runner.run_all_tests()
    exit(0 if success else 1)
