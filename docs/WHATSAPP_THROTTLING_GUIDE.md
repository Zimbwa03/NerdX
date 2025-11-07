# WhatsApp Business API Throttling & Ban Prevention Guide

## Overview

This document explains the intelligent throttling system implemented in NerdX to prevent WhatsApp Business API bans while ensuring all legitimate user interactions are delivered smoothly.

## WhatsApp Business API 2025 Rate Limits

### Official Limits
- **Per-Second Limit**: 80 messages/second per business phone number (can scale to 1,000 MPS)
- **Pair Rate Limit**: 1 message every 6 seconds to the same user (~10 messages/minute)
- **Daily Tier Limits**: Based on unique users contacted (250 → 1K → 10K → 100K → Unlimited)
- **Quality Rating System**: GREEN (high) → YELLOW (medium) → RED (low/flagged)

### What Causes Bans
1. **Spam Reports**: Users blocking or reporting your messages
2. **Low Quality Rating**: Poor engagement, high complaint rates
3. **No Opt-In**: Sending to users who didn't consent
4. **Rate Limit Violations**: Exceeding pair rate or per-second limits
5. **Policy Violations**: Misclassifying Marketing as Utility templates

## Our Implementation

### Throttling Parameters
```python
# services/message_throttle.py
min_delay_between_messages = 3.0  # 3 seconds (conservative vs WhatsApp's 6-second pair rate)
max_messages_per_minute = 10      # Matches WhatsApp's pair rate limit
max_lock_duration = 30.0           # Prevents stuck locks
```

### How It Works

#### 1. Critical Message Detection
All legitimate user interactions bypass throttling to ensure smooth UX:

```python
# services/whatsapp_service.py - _is_critical_user_response()

Critical message categories:
- Registration & Onboarding (consent, welcome, name input)
- Payment & Credits (PayNow, EcoCash, transactions)
- Quiz & Questions (answers, scores, explanations)
- Subject Selection (Mathematics, Biology, etc.)
- User Requests (hints, solutions, help)
- Menu & Navigation (main menu, back buttons)
- Project Assistant (research, image generation)
- Comprehension (passages, reading questions)
- Graph Practice (equations, plots)
- Exam Mode (timed tests, past papers)
- Feedback & Results (performance, statistics)
- Error Messages (retry prompts, apologies)
```

#### 2. Throttling Flow

```
Message Arrives
    ↓
Is it a critical user response?
    ↓ YES → Bypass throttling → Send immediately
    ↓ NO
    ↓
Check quality monitor
    ↓ If quality rating RED → Block non-critical messages
    ↓
Check message throttle
    ↓ Within limits? → Send
    ↓ Over limits? → Wait 3 seconds → Retry
    ↓ Still over? → Block message
```

#### 3. Lock Mechanism
Prevents concurrent message sends to the same user:

```
Acquire Lock
    ↓ Locked? 
        ↓ Critical message → Retry 2 times (1.0s, 1.5s delays)
        ↓ Still locked → Force release lock
        ↓ Non-critical → Block immediately
    ↓
Send Message
    ↓
Release Lock
```

## Quality Monitoring

### Tracked Metrics
- **Message Counts**: Sent, delivered, read
- **Response Rate**: User replies per message sent
- **Complaint Rate**: Reports/blocks per 10,000 messages
- **Delivery Rate**: Successfully delivered messages
- **Read Rate**: Messages opened by users

### Quality Thresholds
```python
# services/quality_monitor.py
max_complaint_rate = 0.05        # 5 complaints per 10,000 messages
min_response_rate = 0.85         # 85% of messages should get responses
max_daily_messages = 50,000      # Conservative daily limit
max_messages_per_user_per_day = 50
min_engagement_score = 0.3
max_block_rate = 0.01            # 1 block per 10,000 messages
```

### Quality Rating System
- **GREEN** (High): Complaint rate ≤0.01% AND Response rate ≥90%
- **YELLOW** (Medium): Complaint rate ≤0.03% AND Response rate ≥80%
- **RED** (Low): Above thresholds → Automatic throttling activated

## Ban Prevention Strategies

### ✅ What We Do Right

1. **User Opt-In**
   - Explicit consent required before messaging
   - Clear opt-out mechanisms (STOP, UNSUBSCRIBE)
   - Consent tracking in database

2. **High-Quality Content**
   - Educational content (ZIMSEC curriculum)
   - User-initiated interactions
   - Personalized quiz responses

3. **Conservative Rate Limits**
   - 3-second minimum delay (vs WhatsApp's 6 seconds)
   - 10 messages/minute (matches WhatsApp limit)
   - Never blocks critical user responses

4. **Business Verification**
   - Meta Business Verification completed
   - Approved message templates
   - Registered company information

5. **Template Management**
   - Separate Utility and Marketing templates
   - No promotional language in Utility templates
   - Under 550 characters for better engagement

6. **Quality Monitoring**
   - Real-time complaint/block tracking
   - Automatic throttling when quality drops
   - Alert system for critical issues

7. **Smart Throttling**
   - Only throttles non-critical messages
   - All user responses bypass throttling
   - Educational interactions never blocked

### ❌ What We Avoid

1. **Spam Patterns**
   - No unsolicited broadcasts
   - No marketing to non-consenting users
   - No message chains (automated sequences)

2. **Rate Violations**
   - Never exceed 10 messages/minute per user
   - 3-second minimum between messages
   - Lock prevents concurrent sends

3. **Policy Violations**
   - No misclassification of templates
   - No promotional content in Utility templates
   - No misleading or false information

## Emergency Override

If throttling needs to be temporarily disabled (development only):

```bash
# Set environment variable
export DISABLE_WHATSAPP_THROTTLE=true

# The system will check this every 30 seconds
# Quality monitor will still track metrics but won't block messages
```

**⚠️ WARNING**: Only use in development. Never disable throttling in production.

## Monitoring Dashboard

### Check Quality Status
The quality monitor provides real-time metrics:

```python
from services.quality_monitor import quality_monitor

# Get comprehensive report
report = quality_monitor.get_quality_report()

# Check specific metrics
complaint_rate = quality_monitor.get_complaint_rate()
response_rate = quality_monitor.get_response_rate()
quality_rating = quality_monitor.get_quality_rating()  # GREEN/YELLOW/RED

# Check if throttling is active
should_throttle = quality_monitor.should_throttle_messaging()
```

### Active Alerts
View quality alerts in real-time:

```python
active_alerts = quality_monitor.get_active_alerts()

# Example alert:
{
    'id': '1699123456_0',
    'level': 'critical',
    'message': 'Complaint rate exceeded: 0.06%',
    'timestamp': '2025-11-06T21:30:00',
    'status': 'active'
}
```

## Best Practices for Developers

### DO:
✅ Mark all user-response messages as critical patterns
✅ Consolidate related messages into single sends
✅ Use approved templates for business-initiated messages
✅ Monitor quality metrics regularly
✅ Test throttling with realistic user interactions
✅ Keep engagement high with quality content

### DON'T:
❌ Send unsolicited messages
❌ Create long automated message chains
❌ Override throttling in production
❌ Ignore quality alerts
❌ Send marketing content in Utility templates
❌ Exceed rate limits

## Testing Throttling

### Test Scenarios

1. **Quiz Flow** (should not be throttled)
   ```
   User selects Mathematics → Difficulty → Question → Answer → Result
   All messages should flow smoothly without delays
   ```

2. **Registration** (should not be throttled)
   ```
   Start → Consent → First Name → Surname → DOB → Complete
   All prompts delivered immediately
   ```

3. **Payment** (should not be throttled)
   ```
   Buy Credits → Select Package → Payment Method → Confirmation
   Time-sensitive flow must not be blocked
   ```

4. **Non-Critical Messages** (may be throttled)
   ```
   Automated reminders, daily summaries, promotional content
   These can be delayed or blocked if rate limits exceeded
   ```

## Troubleshooting

### Messages Getting Blocked

1. **Check if message is critical**
   - Review `_is_critical_user_response()` patterns
   - Add missing patterns if needed

2. **Check quality rating**
   ```python
   quality_monitor.get_quality_rating()
   # If RED, investigate complaint sources
   ```

3. **Check rate limits**
   ```python
   # Review message history
   message_throttle.message_history[user_id]
   
   # Check if user exceeded daily limit
   quality_monitor._is_user_exceeding_daily_limit(user_id)
   ```

### Quality Rating Dropped

1. **Review complaint sources**
   - Check which users blocked/reported
   - Analyze message content that triggered complaints

2. **Improve engagement**
   - Ensure content is relevant and valuable
   - Add more interactive elements
   - Personalize responses

3. **Monitor metrics**
   - Track response rates
   - Check message delivery rates
   - Review read rates

## Future Improvements

### Planned Enhancements
1. **Tier Monitoring**: Auto-detect current messaging tier
2. **Webhook Integration**: Real-time quality updates from WhatsApp
3. **Message Consolidation**: Automatically merge related messages
4. **A/B Testing**: Test message formats for better engagement
5. **Predictive Throttling**: AI-powered rate adjustment

### Template Optimization
1. Monitor template quality ratings
2. Pause low-performing templates
3. Diversify template usage
4. Test new template formats

## Conclusion

The intelligent throttling system ensures:
- ✅ **No bans**: Stays within WhatsApp rate limits
- ✅ **Smooth UX**: Critical messages never blocked
- ✅ **High quality**: Monitors engagement and complaints
- ✅ **Scalable**: Handles growth from 250 to unlimited tier
- ✅ **Compliant**: Follows WhatsApp Business policies

**Key Principle**: Throttle aggressively for non-critical content, but NEVER block legitimate user interactions.
