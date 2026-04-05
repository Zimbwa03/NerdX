# 🧪 Backend API Testing Guide

## Quick Start

### Step 1: Start Flask Server

Open a terminal and run:
```bash
python app.py
```

Wait for the server to start. You should see:
```
 * Running on http://127.0.0.1:5000
```

### Step 2: Run Test Script

Open **another terminal** and run:
```bash
python test_api_simple.py
```

## What the Test Does

The test script will:
1. ✅ Check if server is running
2. ✅ Test user registration
3. ✅ Test user login
4. ✅ Test protected endpoints:
   - User Profile
   - User Stats
   - Credits Balance
   - Credit Packages
   - Subjects List

## Expected Results

### Successful Test Output:
```
✅ Server is running!
✅ Registration Successful!
✅ Login Successful!
✅ User Profile Successful!
✅ User Stats Successful!
✅ Credits Balance Successful!
✅ Credit Packages Successful!
✅ Subjects Successful!
```

## Manual Testing with curl

### Test Registration
```bash
curl -X POST http://localhost:5000/api/mobile/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test\",\"surname\":\"User\",\"email\":\"test@example.com\",\"password\":\"test123\"}"
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/mobile/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"test123\"}"
```

### Test Protected Endpoint (replace TOKEN with actual token)
```bash
curl -X GET http://localhost:5000/api/mobile/user/profile \
  -H "Authorization: Bearer TOKEN"
```

## Troubleshooting

### Server Won't Start
- Check if port 5000 is already in use
- Check for import errors in `api/mobile.py`
- Verify `.env` file exists and has all required variables

### Registration Fails
- Check database connection (Supabase)
- Verify password storage columns exist
- Check server logs for errors

### Login Fails
- Verify user was created successfully
- Check password hash storage
- Verify JWT_SECRET is set in `.env`

### Protected Endpoints Fail
- Verify token is valid
- Check token format: `Bearer <token>`
- Verify user exists in database

## Common Issues

### "Connection refused"
- Server is not running
- Wrong port number
- Firewall blocking connection

### "Invalid credentials"
- Password doesn't match
- User doesn't exist
- Password hash not stored correctly

### "Authentication required"
- Token missing or invalid
- Token expired
- Wrong Authorization header format

## Next Steps After Testing

Once all tests pass:
1. ✅ Backend API is working
2. ✅ Ready to connect mobile app
3. ✅ Ready for production deployment

## Test Endpoints Summary

| Endpoint | Method | Auth Required | Status |
|----------|--------|---------------|--------|
| `/api/mobile/auth/register` | POST | No | ✅ |
| `/api/mobile/auth/login` | POST | No | ✅ |
| `/api/mobile/user/profile` | GET | Yes | ✅ |
| `/api/mobile/user/stats` | GET | Yes | ✅ |
| `/api/mobile/credits/balance` | GET | Yes | ✅ |
| `/api/mobile/credits/packages` | GET | Yes | ✅ |
| `/api/mobile/quiz/subjects` | GET | Yes | ✅ |

