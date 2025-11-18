# NerdX Mobile App - Paynow EcoCash Payment Integration

## Overview
The mobile app payment system is fully integrated with Paynow for instant USD EcoCash payments, matching the WhatsApp bot functionality.

## Payment Flow

### 1. Student Initiates Purchase
- Opens Credits screen in mobile app
- Selects a credit package (e.g., 50 credits for $1.00)
- Enters phone number and email
- Taps "Confirm Purchase"

### 2. Backend Creates Paynow Payment
- API endpoint: `POST /api/mobile/credits/purchase`
- Creates payment transaction in database (status: pending)
- Calls Paynow API with `send_mobile()` for EcoCash
- Returns payment reference and instructions

### 3. Student Receives USSD Prompt
- EcoCash USSD prompt appears on student's phone (*151*2*7#)
- Student enters EcoCash PIN
- Student confirms payment amount

### 4. Paynow Webhook Confirms Payment
- Paynow sends webhook to: `https://nerdx.onrender.com/webhook/paynow/result`
- Webhook validates payment hash for security
- Updates payment status to "approved"
- **Automatically adds credits to student account**
- Updates database with confirmation details

### 5. Mobile App Polls for Status
- App polls every 3 seconds: `GET /api/mobile/payment/status/{reference}`
- When status = "completed" or "approved":
  - Shows success alert
  - Refreshes credit balance
  - Updates user dashboard

### 6. Student Confirmed
- Credits immediately available
- Can start using features right away

## Technical Implementation

### Backend Components

1. **Mobile API** (`api/mobile.py`)
   - `/api/mobile/credits/purchase` - Initiates payment
   - `/api/mobile/payment/status/{reference}` - Checks payment status

2. **Paynow Service** (`services/paynow_service.py`)
   - `create_usd_ecocash_payment()` - Creates mobile payment
   - `check_payment_status()` - Polls payment status
   - `process_webhook()` - Handles Paynow notifications

3. **Payment Service** (`services/payment_service.py`)
   - `approve_paynow_payment()` - Adds credits on confirmation
   - `process_paynow_webhook()` - Processes webhook data

4. **Webhook Handler** (`api/paynow_webhook.py`)
   - `/webhook/paynow/result` - Receives Paynow notifications
   - Validates hash for security
   - Triggers automatic credit top-up

### Mobile App Components

1. **Credits Screen** (`NerdXApp/src/screens/CreditsScreen.tsx`)
   - Displays credit packages
   - Handles payment initiation
   - Polls for payment confirmation
   - Shows success/failure alerts

2. **Credits API** (`NerdXApp/src/services/api/creditsApi.ts`)
   - `purchaseCredits()` - Initiates purchase
   - `checkPaymentStatus()` - Checks payment status

## Environment Variables Required

All configured in Replit Secrets:
- `PAYNOW_INTEGRATION_ID` - Your Paynow Integration ID
- `PAYNOW_INTEGRATION_KEY` - Your Paynow Integration Key
- `BASE_URL` - https://nerdx.onrender.com
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service key

## Database Schema

### payment_transactions table
```sql
CREATE TABLE payment_transactions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    package_id VARCHAR(50) NOT NULL,
    reference_code VARCHAR(100) UNIQUE NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    credits INTEGER NOT NULL,
    payment_method VARCHAR(50),
    status VARCHAR(50) DEFAULT 'pending',
    payment_proof TEXT,
    admin_notes TEXT,
    poll_url TEXT,
    phone_number VARCHAR(20),
    email VARCHAR(255),
    paynow_reference VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    proof_submitted_at TIMESTAMP,
    approved_at TIMESTAMP,
    rejected_at TIMESTAMP,
    credits_added INTEGER DEFAULT 0
);
```

## Payment Statuses
- `pending` - Payment initiated, waiting for confirmation
- `initiated` - Paynow payment sent to phone
- `approved` - Payment confirmed, credits added
- `completed` - Same as approved
- `failed` - Payment failed
- `cancelled` - Payment cancelled by user

## Testing

### Test the Complete Flow:
1. Build and install the mobile app APK
2. Register/login to your account
3. Navigate to Credits screen
4. Select a package (start with $1.00 package)
5. Enter your EcoCash number and email
6. Complete payment via USSD
7. App will automatically detect payment and update credits

### Monitor Backend:
- Check logs: `https://nerdx.onrender.com/health`
- View payment transactions in Supabase dashboard
- Monitor webhook calls in Render logs

## Security Features

✅ Webhook hash validation
✅ Environment variables for secrets (never hardcoded)
✅ JWT authentication for API calls
✅ Transaction validation before credit addition
✅ Unique reference codes per transaction
✅ Database integrity with foreign keys

## Credit Packages

| Package | Credits | Price | Best For |
|---------|---------|-------|----------|
| Starter | 50      | $1.00 | Trying out features |
| Basic   | 120     | $2.00 | Regular practice |
| Quick   | 350     | $5.00 | Serious learners |
| Boost   | 750     | $10.00| Power users |

## Troubleshooting

### Payment not confirming?
1. Check if webhook URL is accessible: `curl https://nerdx.onrender.com/webhook/paynow/result`
2. Verify Paynow secrets in environment
3. Check payment_transactions table in Supabase
4. Review backend logs for errors

### Credits not adding?
1. Verify webhook received: Check backend logs
2. Check payment status in database
3. Ensure `add_credits()` function is working
4. Verify user_stats table has correct user_id

### App not detecting payment?
1. Check network connection
2. Verify API base URL is correct: `https://nerdx.onrender.com`
3. Ensure polling is running (check console logs)
4. Try manual refresh of credits

## Support
For issues, check:
1. Backend logs in Render dashboard
2. Mobile app console in React Native debugger
3. Supabase database tables
4. Paynow dashboard transaction history
