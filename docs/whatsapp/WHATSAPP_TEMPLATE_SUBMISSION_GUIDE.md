# WhatsApp Message Template Submission Guide

## Overview

This guide provides step-by-step instructions for submitting all 15 message templates to WhatsApp Business Manager for Meta approval.

## Prerequisites

1. **Facebook Business Manager Account** (verified)
2. **WhatsApp Business API Account** (or pending approval)
3. **Business verification documents** ready
4. **Domain ownership verification** (neuronet.co.zw)

## Step-by-Step Submission Process

### Step 1: Access WhatsApp Business Manager

1. Go to: https://business.facebook.com/
2. Log in with your business account
3. Navigate to: **WhatsApp Business API** > **Message Templates**

### Step 2: Create New Template

For each template, follow these steps:

1. Click **"Create Template"**
2. Select **"Utility"** as category
3. Select **"English"** as language
4. Fill in template details (see individual templates below)

### Step 3: Submit All 15 Templates

Copy and paste each template exactly as provided:

---

## TEMPLATE 1: Welcome & Consent

**Template Name:** `nerdx_welcome_consent`  
**Category:** UTILITY  
**Language:** English  

**Body:**
```
🎓 Welcome to NerdX ZIMSEC Study Bot!

Your AI-powered companion for Form {{1}} {{2}} studies.

⚖️ CONSENT REQUIRED
To comply with WhatsApp Business Policy, we need your permission to:
• Send educational content and quiz questions
• Track your learning progress
• Send study reminders

✅ Reply YES to start learning
❌ Reply NO to decline

Business: Neuronet AI Solutions Pvt Ltd
Reg: 51491A0272025 | Zimbabwe
```

**Variables:** Form level, Subject name

---

## TEMPLATE 2: Quiz Question - MCQ Format

**Template Name:** `nerdx_quiz_mcq`  
**Category:** UTILITY  
**Language:** English  

**Body:**
```
📚 {{1}} - {{2}}
Question {{3}} of {{4}}

{{5}}

A) {{6}}
B) {{7}}
C) {{8}}
D) {{9}}

⏱️ Select your answer
💡 Cost: {{10}} credits

NerdX | Powered by Neuronet AI
```

**Variables:** Subject, Topic, Question number, Total questions, Question text, Option A, Option B, Option C, Option D, Credit cost

---

## TEMPLATE 3: Answer Feedback - Correct

**Template Name:** `nerdx_answer_correct`  
**Category:** UTILITY  
**Language:** English  

**Body:**
```
✅ *Correct Answer!*

{{1}}

📊 Your Progress:
• Streak: {{2}} in a row
• Total Score: {{3}} points
• Accuracy: {{4}}%

🎯 {{5}}

Reply CONTINUE for next question
Reply MENU to return home

NerdX ZIMSEC Study Bot
```

**Variables:** Explanation text, Current streak, Total score, Accuracy percentage, Encouraging message

---

## TEMPLATE 4: Answer Feedback - Incorrect

**Template Name:** `nerdx_answer_incorrect`  
**Category:** UTILITY  
**Language:** English  

**Body:**
```
❌ *Incorrect*

The correct answer is: {{1}}

💡 Explanation:
{{2}}

📊 Progress:
• Score: {{3}} points
• Accuracy: {{4}}%

Don't give up! Learning from mistakes helps you grow. 💪

Reply CONTINUE for next question
Reply MENU to return home

NerdX Study Companion
```

**Variables:** Correct answer, Detailed explanation, Current score, Accuracy percentage

---

## TEMPLATE 5: Registration Confirmation

**Template Name:** `nerdx_registration_complete`  
**Category:** UTILITY  
**Language:** English  

**Body:**
```
🎉 *Registration Successful!*

Welcome {{1}}! Your NerdX ID: {{2}}

📚 FREE CREDITS: {{3}} credits
📊 Starting Level: Form {{4}}

*What you can do:*
✓ Practice ZIMSEC questions
✓ Track your progress
✓ Earn achievements
✓ Get detailed explanations

Reply MENU to start learning!

Neuronet AI Solutions | Zimbabwe
Reg: 51491A0272025
```

**Variables:** Student name, NerdX ID, Starting credits, Form level

---

## TEMPLATE 6: Daily Study Reminder

**Template Name:** `nerdx_study_reminder`  
**Category:** UTILITY  
**Language:** English  

**Body:**
```
📖 Hi {{1}}! Time for your daily practice

📊 Yesterday's Progress:
• {{2}} questions completed
• {{3}}% accuracy
• {{4}} credits remaining

🎯 Today's Goal:
Continue {{5}} - {{6}}

Reply STUDY to continue learning
Reply CHANGE to switch subject

"Small daily progress leads to big results" 🌟

NerdX ZIMSEC Study Bot
Zimbabwe's #1 Study Companion
```

**Variables:** Student name, Questions completed yesterday, Yesterday's accuracy, Remaining credits, Subject, Current topic

---

## TEMPLATE 7: Achievement Unlocked

**Template Name:** `nerdx_achievement`  
**Category:** UTILITY  
**Language:** English  

**Body:**
```
🏆 *ACHIEVEMENT UNLOCKED!*

{{1}}

Congratulations {{2}}!

📈 Your Stats:
• Total Questions: {{3}}
• Accuracy: {{4}}%
• Study Streak: {{5}} days
• Rank: {{6}}

🎁 Bonus: {{7}} credits earned!

Keep up the excellent work! You're making amazing progress in your ZIMSEC journey.

NerdX | Neuronet AI Solutions
```

**Variables:** Achievement name, Student name, Total questions answered, Overall accuracy, Study streak, Current rank, Bonus credits

---

## TEMPLATE 8: Credit Low Warning

**Template Name:** `nerdx_credit_warning`  
**Category:** UTILITY  
**Language:** English  

**Body:**
```
⚠️ *Low Credits Alert*

Hi {{1}}, you have {{2}} credits left.

💳 Top-Up Options:
• 50 credits - $1 USD
• 120 credits - $2 USD
• 350 credits - $5 USD

💰 Payment via EcoCash or OneMoney

🎁 Refer friends to earn FREE credits!

Reply TOPUP to add credits
Reply REFER to get your referral link

NerdX Study Bot | Zimbabwe
Contact: info@neuronet.co.zw
```

**Variables:** Student name, Remaining credits

---

## TEMPLATE 9: Session Complete

**Template Name:** `nerdx_session_complete`  
**Category:** UTILITY  
**Language:** English  

**Body:**
```
✅ *Study Session Complete!*

Excellent work {{1}}! 🌟

📊 Session Summary:
• Questions Answered: {{2}}
• Correct: {{3}} ({{4}}%)
• Credits Used: {{5}}
• Time: {{6}} minutes

🎯 Mastery Level:
{{7}}: {{8}}%

{{9}}

Reply RETRY to practice again
Reply MENU for main menu
Reply STATS for detailed progress

NerdX ZIMSEC | Neuronet AI Solutions
Building Zimbabwe's Future Leaders
```

**Variables:** Student name, Total questions, Correct answers, Accuracy percentage, Credits used, Session duration, Subject/Topic, Mastery percentage, Personalized feedback

---

## TEMPLATE 10: Support & Contact

**Template Name:** `nerdx_support`  
**Category:** UTILITY  
**Language:** English  

**Body:**
```
📞 *NerdX Support Information*

Company: Neuronet AI Solutions Pvt Ltd
Registration: 51491A0272025

📍 Address:
9 Munino Mufakose
Harare, Zimbabwe

📧 Email: info@neuronet.co.zw
📱 Phone: +263 5494594
🌐 Web: neuronet.co.zw

⏰ Support Hours:
Monday-Friday: 8 AM - 6 PM CAT
Saturday: 9 AM - 2 PM CAT

💬 Common Issues:
Reply CREDITS for payment help
Reply TECHNICAL for tech support
Reply ACCOUNT for account issues

Response time: Within 24 hours

We're here to help your learning journey!
```

**Variables:** None (static template)

---

## TEMPLATE 11: Unsubscribe Confirmation

**Template Name:** `nerdx_unsubscribe`  
**Category:** UTILITY  
**Language:** English  

**Body:**
```
✋ *Unsubscribe Confirmed*

{{1}}, you've been successfully unsubscribed from NerdX Study Bot.

Your data:
• Account preserved for 12 months
• Progress saved
• Credits retained

To resubscribe anytime:
Reply SUBSCRIBE or send any message

📧 Feedback: info@neuronet.co.zw
We value your feedback to improve our service.

Thank you for using NerdX!

Neuronet AI Solutions Pvt Ltd
Zimbabwe | Reg: 51491A0272025
```

**Variables:** Student name

---

## TEMPLATE 12: Privacy Policy Notice

**Template Name:** `nerdx_privacy_policy`  
**Category:** UTILITY  
**Language:** English  

**Body:**
```
🔒 *NerdX Privacy Policy*

Your privacy is important to us.

📋 What we collect:
• Name and phone number
• Learning progress and quiz responses
• Subject preferences
• Credit usage data

🛡️ Data Protection:
• Encrypted secure storage
• No third-party sharing
• Zimbabwe Data Protection compliant
• 12-month retention policy

✅ Your Rights:
• Access your data
• Request deletion
• Opt-out anytime
• Data portability

📄 Full policy: neuronet.co.zw/privacy

Questions? info@neuronet.co.zw

Neuronet AI Solutions Pvt Ltd
Reg: 51491A0272025 | Zimbabwe
```

**Variables:** None (static template)

---

## TEMPLATE 13: Error & Retry

**Template Name:** `nerdx_error_retry`  
**Category:** UTILITY  
**Language:** English  

**Body:**
```
⚠️ *Technical Error*

We encountered an issue processing your request.

Error Code: {{1}}
Time: {{2}}

Please try:
1. Reply RETRY to try again
2. Reply MENU to return home
3. Reply SUPPORT for assistance

If issue persists:
📧 info@neuronet.co.zw
📱 +263 5494594

We apologize for the inconvenience and are working to resolve this quickly.

NerdX Support Team
Neuronet AI Solutions | Zimbabwe
```

**Variables:** Error code, Timestamp

---

## TEMPLATE 14: Referral Success

**Template Name:** `nerdx_referral_success`  
**Category:** UTILITY  
**Language:** English  

**Body:**
```
🎁 *Referral Bonus Unlocked!*

Great news {{1}}!

{{2}} just joined using your referral code!

💰 Rewards:
• You earned: {{3}} credits
• {{2}} received: {{4}} credits

📊 Referral Stats:
• Total Referrals: {{5}}
• Total Earned: {{6}} credits

Your Referral Code: {{7}}

Share your code:
"Join NerdX with my code {{7}} and get {{4}} FREE credits!"

Keep sharing and earning! 🚀

NerdX | Neuronet AI Solutions
```

**Variables:** Referrer name, New user name, Credits earned by referrer, Credits given to new user, Total referrals, Total credits earned from referrals, Referral code

---

## TEMPLATE 15: Payment Confirmation

**Template Name:** `nerdx_payment_confirmed`  
**Category:** UTILITY  
**Language:** English  

**Body:**
```
✅ *Payment Received!*

Thank you {{1}}!

💳 Transaction Details:
• Amount: ${{2}} USD
• Credits Added: {{3}}
• Payment Method: {{4}}
• Transaction ID: {{5}}
• Date: {{6}}

💰 New Balance: {{7}} credits

Receipt sent to your number.

🎓 Ready to continue learning?
Reply STUDY to start

Questions about your payment?
📧 info@neuronet.co.zw
📱 +263 5494594

NerdX | Neuronet AI Solutions
Reg: 51491A0272025 | Zimbabwe
```

**Variables:** Student name, Amount paid, Credits purchased, Payment method, Transaction ID, Date, New balance

---

## Submission Checklist

Before submitting each template, verify:

- [ ] Template name matches exactly
- [ ] Category is set to "UTILITY"
- [ ] Language is set to "English"
- [ ] All variables use {{1}}, {{2}}, etc. format
- [ ] No special characters that might cause issues
- [ ] Business information is accurate
- [ ] Template content is educational and compliant

## Approval Timeline

- **Template Review:** 3-7 business days
- **Approval Notification:** Email from Meta
- **Status Updates:** Check in WhatsApp Business Manager
- **Rejection Reasons:** If rejected, Meta will provide specific feedback

## Common Rejection Reasons

1. **Inappropriate content** - Keep educational and professional
2. **Missing business context** - Ensure business information is clear
3. **Variable formatting** - Use {{1}}, {{2}} format only
4. **Too promotional** - Focus on educational value
5. **Unclear purpose** - Be specific about educational use

## After Approval

Once templates are approved:

1. **Update your code** to use template names
2. **Test each template** with sample data
3. **Monitor usage** and compliance
4. **Keep templates updated** as needed
5. **Renew annually** (templates expire after 1 year)

## Support

If you encounter issues during submission:

1. **Check Meta Business Help Center**
2. **Contact Meta Business Support**
3. **Review WhatsApp Business Policy**
4. **Ensure business verification is complete**

---

**Important:** Submit all 15 templates at once to avoid delays. Meta reviews them as a complete set for your business use case.









