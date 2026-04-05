# 🧪 How to Run API Tests

## Step-by-Step Instructions

### Step 1: Start Flask Server

Open **PowerShell Terminal 1** and run:
```powershell
python app.py
```

**Wait for this message:**
```
 * Running on http://127.0.0.1:5000
```

**Keep this terminal open!** The server must keep running.

### Step 2: Run Test Script

Open **PowerShell Terminal 2** (new window) and run:
```powershell
python test_api_simple.py
```

## Expected Output

You should see:
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

## Troubleshooting

### "Server is not running"
- Make sure Flask server is running in Terminal 1
- Check if port 5000 is available: `netstat -ano | findstr :5000`
- Try a different port if needed

### "Connection refused"
- Server not started yet - wait a few seconds
- Check firewall settings
- Verify server is listening on localhost:5000

### Import Errors
- Make sure you're in the project root directory
- Check that all dependencies are installed: `pip install -r requirements.txt`

## Quick Test Commands

**Test server is running:**
```powershell
curl http://localhost:5000/
```

**Test registration endpoint:**
```powershell
curl -X POST http://localhost:5000/api/mobile/auth/register -H "Content-Type: application/json" -d '{\"name\":\"Test\",\"surname\":\"User\",\"email\":\"test@example.com\",\"password\":\"test123\"}'
```

## Important Notes

1. **Two Terminals Required**: Server runs in one, tests in another
2. **Keep Server Running**: Don't close Terminal 1 while testing
3. **Wait for Startup**: Give server 2-3 seconds to fully start

## Next Steps After Successful Test

Once all tests pass:
1. ✅ Backend API is working correctly
2. ✅ Ready to connect mobile app
3. ✅ Ready for production deployment

