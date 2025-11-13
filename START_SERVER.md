# 🚀 How to Start Flask Server and Test API

## Quick Start Guide

### Option 1: Two Terminal Windows (Recommended)

**Terminal 1 - Start Flask Server:**
```bash
python app.py
```

Keep this terminal open. You should see:
```
 * Running on http://127.0.0.1:5000
 * Debug mode: off
```

**Terminal 2 - Run Tests:**
```bash
python test_api_simple.py
```

### Option 2: Background Process

The server has been started in the background. Now run:
```bash
python test_api_simple.py
```

## What to Expect

The test script will:
1. ✅ Check server connection
2. ✅ Test user registration
3. ✅ Test user login  
4. ✅ Test protected endpoints

## If Server Won't Start

Check for errors:
- Port 5000 already in use? Try: `netstat -ano | findstr :5000`
- Import errors? Check `api/mobile.py` imports
- Database connection? Verify `.env` file has Supabase credentials

## Manual Test

Once server is running, test manually:
```bash
curl http://localhost:5000/
```

Should return HTML or redirect.

## Next Steps

After successful test:
1. ✅ API is working
2. ⏭️ Connect mobile app
3. ⏭️ Test on Android emulator

