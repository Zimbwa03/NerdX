# 🚀 NerdX Mobile App - Quick Start Guide

## ✅ What's Complete

1. **React Native Mobile App** (`NerdXApp/`)
   - Complete project structure
   - All screens implemented
   - API service layer ready
   - Navigation configured
   - Theme system set up

2. **Backend Mobile API** (`api/mobile.py`)
   - All REST endpoints created
   - JWT authentication
   - Integrated with existing services
   - Registered in routes.py

## 🎯 Next Steps to Run

### Step 1: Install Backend Dependencies
```bash
# Ensure PyJWT is installed
pip install PyJWT
```

### Step 2: Set Environment Variable
Add to your `.env` file:
```bash
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### Step 3: Install Mobile App Dependencies
```bash
cd NerdXApp
npm install
```

### Step 4: Update API URL
Edit `NerdXApp/src/services/api/config.ts`:
```typescript
export const API_BASE_URL = __DEV__
  ? 'http://192.168.1.100:5000'  // Your computer's IP address
  : 'https://your-production-api.com';
```

**Important**: 
- For Android emulator: Use `http://10.0.2.2:5000`
- For physical device: Use your computer's IP (e.g., `http://192.168.1.100:5000`)

### Step 5: Start Backend Server
```bash
# In your main project directory
python app.py
# or
flask run
```

### Step 6: Start Mobile App
```bash
cd NerdXApp
npm start          # Start Metro bundler
npm run android    # Run on Android (in another terminal)
```

## 📱 Testing

### Test Backend API
```bash
# Test registration
curl -X POST http://localhost:5000/api/mobile/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","surname":"User","email":"test@example.com","password":"test123"}'

# Test login
curl -X POST http://localhost:5000/api/mobile/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### Test Mobile App
1. Open Android Studio
2. Create an Android Virtual Device (AVD)
3. Run `npm run android`
4. App should launch on emulator

## 🔧 Important Notes

### Password Storage
The mobile API currently needs password storage implementation. You have two options:

**Option 1**: Extend `users_registration` table
```sql
ALTER TABLE users_registration 
ADD COLUMN password_hash VARCHAR(255),
ADD COLUMN password_salt VARCHAR(255);
```

**Option 2**: Create separate `mobile_users` table (recommended)
See `MOBILE_API_SETUP.md` for SQL script

### CORS
CORS is already configured in `app.py` to allow all origins. For production, restrict to your mobile app domain.

## 📋 Checklist

- [ ] Install PyJWT: `pip install PyJWT`
- [ ] Add JWT_SECRET to .env
- [ ] Install mobile dependencies: `cd NerdXApp && npm install`
- [ ] Update API URL in mobile app config
- [ ] Set up Android development environment
- [ ] Implement password storage (choose Option 1 or 2)
- [ ] Test backend API endpoints
- [ ] Test mobile app connection
- [ ] Build APK for release

## 🐛 Troubleshooting

### Backend Issues
- **Import errors**: Ensure all services are imported correctly
- **JWT errors**: Check JWT_SECRET is set
- **Database errors**: Verify Supabase connection

### Mobile App Issues
- **Connection refused**: Check API URL and backend is running
- **Build errors**: Run `cd android && ./gradlew clean`
- **Metro bundler**: Run `npm start -- --reset-cache`

## 📚 Documentation

- `NerdXApp/README.md` - Mobile app documentation
- `NerdXApp/SETUP_GUIDE.md` - Detailed setup guide
- `MOBILE_API_SETUP.md` - Backend API documentation
- `NerdXApp/REACT_NATIVE_SETUP.md` - React Native setup

## 🎉 You're Ready!

Your mobile app and backend API are ready to test. Follow the steps above to get everything running!

