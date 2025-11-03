## WhatsApp Templates — Submission Pack (Aligned to Codebase)

Instructions
- Use the Name as the template name (lowercase with underscores).
- Category: as listed (Utility or Marketing).
- Language: en.
- Body: paste exactly as shown (keep {{1}}, {{2}} placeholders).
- In Meta UI, add Example values in the same order as Variables.

Note: All templates below mirror `services/whatsapp_template_service.py` exactly.

---

Template: nerdx_welcome_consent
- Category: Utility
- Language: en
- Variables: [form_level, subject_name]
- Example values: ["Form 3", "Mathematics"]
Body:
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

---

Template: nerdx_quiz_mcq
- Category: Utility
- Language: en
- Variables: [subject, topic, question_num, total_questions, question_text, option_a, option_b, option_c, option_d, credit_cost]
- Example values: ["Mathematics","Algebra","1","10","Solve for x...","2","3","4","5","1"]
Body:
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

---

Template: nerdx_answer_correct
- Category: Utility
- Language: en
- Variables: [explanation, streak, total_score, accuracy, encouragement]
- Example values: ["Factorization steps...", "3", "120", "88.5", "Great work! Keep the momentum."]
Body:
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

---

Template: nerdx_answer_incorrect
- Category: Utility
- Language: en
- Variables: [correct_answer, explanation, score, accuracy]
- Example values: ["B", "Because …", "100", "73.4"]
Body:
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

---

Template: nerdx_registration_complete
- Category: Utility
- Language: en
- Variables: [student_name, nerdx_id, starting_credits, lform_leve]
- Example values: ["Tariro", "NZX4G1", "75", "3"]
Body:
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

---

Template: nerdx_study_reminder
- Category: Utility
- Language: en
- Variables: [student_name, yesterday_questions, yesterday_accuracy, remaining_credits, subject, topic]
- Example values: ["Tariro","12","75","20","Mathematics","Algebra"]
Body:
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

---

Template: nerdx_achievement
- Category: Utility
- Language: en
- Variables: [achievement_name, student_name, total_questions, accuracy, study_streak, rank, bonus_credits]
- Example values: ["Level 3","Tariro","120","81","4","Silver","5"]
Body:
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

---

Template: nerdx_credit_warning
- Category: Utility
- Language: en
- Variables: [student_name, remaining_credits]
- Example values: ["Tariro","5"]
Body:
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

---

Template: nerdx_session_complete
- Category: Utility
- Language: en
- Variables: [student_name, total_questions, correct_answers, accuracy, credits_used, duration, subject_topic, mastery_percentage, feedback]
- Example values: ["Tariro","10","7","70.0","6","12","Algebra – Factorization","65.0","Nice progress—try a harder set next!"]
Body:
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

---

Template: nerdx_support
- Category: Utility
- Language: en
- Variables: []
Body:
```
📞 *NerdX Support Information*

Company: Neuronet AI Solutions Pvt Ltd
Registration: 51491A0272025

📍 Address:
9 Munino Mufakose
Harare, Zimbabwe

📧 Email: info@neuronet.co.zw
📱 Phone: +263 785494594
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

---

Template: nerdx_unsubscribe
- Category: Utility
- Language: en
- Variables: [student_name]
- Example values: ["Tariro"]
Body:
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

---

Template: nerdx_unsubscribe_confirmation
- Category: Utility
- Language: en
- Variables: []
Body:
```
✋ You have been unsubscribed from NerdX notifications. You can reply START to subscribe again.
```

---

Template: nerdx_privacy_policy
- Category: Utility
- Language: en
- Variables: []
Body:
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

---

Template: nerdx_error_retry
- Category: Utility
- Language: en
- Variables: [error_code, timestamp]
- Example values: ["E-500", "2025-11-03 12:10:33"]
Body:
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

---

Template: nerdx_low_credits
- Category: Utility
- Language: en
- Variables: [credits, buy_url]
- Example values: ["5","https://neuronet.co.zw/credits"]
Body:
```
You have {{1}} credits left. Get more to continue learning.

Buy credits: {{2}}
```

---

Template: nerdx_payment_pending
- Category: Utility
- Language: en
- Variables: [reference, amount]
- Example values: ["TX12345","$4.00"]
Body:
```
Payment received for review. Ref: {{1}}, Amount: {{2}}. We’ll notify you when approved.
```

---

Template: nerdx_payment_approved
- Category: Utility
- Language: en
- Variables: [reference, credits]
- Example values: ["TX12345","500"]
Body:
```
Payment approved. Ref: {{1}}. {{2}} credits added. Thank you!
```

---

Template: nerdx_payment_rejected
- Category: Utility
- Language: en
- Variables: [reference]
- Example values: ["TX12345"]
Body:
```
We couldn’t verify your payment (Ref: {{1}}). Please resubmit proof or contact support.
```

---

Template: nerdx_referral_invite
- Category: Marketing
- Language: en
- Variables: [referral_code, bonus]
- Example values: ["NZ1K8H","5"]
Body:
```
Study with NerdX and earn bonus credits. Share your code {{1}} with a friend. They get welcome credits; you earn {{2}} when they register. Reply STOP to opt out.
```

---

Template: nerdx_referral_reward
- Category: Utility
- Language: en
- Variables: [bonus, name, code]
- Example values: ["5","John","NZ1K8H"]
Body:
```
You earned {{1}} bonus credits for referring {{2}}. Keep sharing your code: {{3}}.
```

---

Template: nerdx_maintenance
- Category: Utility
- Language: en
- Variables: [resume_time]
- Example values: ["14:30 CAT"]
Body:
```
NerdX is undergoing maintenance. Service resumes at {{1}}. Thanks for your patience.
```

---

Template: nerdx_reengage_study_reminder
- Category: Marketing
- Language: en
- Variables: [subject]
- Example values: ["Mathematics"]
Body:
```
Ready to continue {{1}}? New practice sets are available. Reply MENU to start. Reply STOP to opt out.
```

---

Template: nerdx_registration_confirmation
- Category: Utility
- Language: en
- Variables: [name, nerdx_id, credits]
- Example values: ["Tariro","NZX4G1","75"]
Body:
```
Hi {{1}}, your NerdX account is set up. NerdX ID: {{2}}. Welcome credits: {{3}}. Reply MENU to see options.
```

---

Template: nerdx_resubscribe_confirmation
- Category: Utility
- Language: en
- Variables: []
Body:
```
You are now subscribed to NerdX study updates. You can reply STOP to unsubscribe anytime.
```

---

Template: nerdx_referral_success
- Category: Utility
- Language: en
- Variables: [referrer_name, new_user_name, referrer_credits, new_user_credits, total_referrals, total_earned, ereferral_cod]
- Example values: ["Tariro","John","5","75","3","15","NZ1K8H"]
Body:
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

---

Template: nerdx_payment_confirmed
- Category: Utility
- Language: en
- Variables: [student_name, amount, credits_added, payment_method, transaction_id, date, new_balance]
- Example values: ["Tariro","4.00","500","ecocash","TX12345","2025-11-03","620"]
Body:
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


