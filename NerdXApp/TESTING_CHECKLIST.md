# Testing Checklist for NerdX Mobile App

After building and installing the new APK, please test the following:

## ✅ Basic Launch & Navigation
- [ ] App launches (shows loading screen, not white screen)
- [ ] Login screen appears with logo and form
- [ ] Can type in email/phone field
- [ ] Can type in password field
- [ ] Can tap "Sign In" button
- [ ] Can navigate to "Sign Up" screen

## ✅ Registration Flow
- [ ] Registration form shows all fields
- [ ] Can enter name and surname
- [ ] Can enter email or phone number
- [ ] Can enter password
- [ ] Can submit registration
- [ ] Success/error messages appear correctly

## ✅ Login Flow
- [ ] Can login with valid credentials
- [ ] Error message shows for invalid credentials
- [ ] Loading spinner shows during login
- [ ] Navigates to dashboard after successful login

## ✅ Dashboard & Main Features
- [ ] Dashboard screen loads correctly
- [ ] Can see user's credits balance
- [ ] Can see available subjects
- [ ] All navigation buttons work
- [ ] Can access profile screen
- [ ] Can access credits/payment screen

## ✅ Quiz Features
- [ ] Can select a subject (Mathematics, English, Science)
- [ ] Can select a topic
- [ ] Quiz questions load correctly
- [ ] Can answer questions
- [ ] Can submit answers
- [ ] Results display correctly

## ✅ Advanced Features
- [ ] Teacher Mode works (if using)
- [ ] Project Assistant works (if using)
- [ ] Graph Practice works (if using)
- [ ] English Comprehension works (if using)
- [ ] English Essay works (if using)

## ✅ Payment & Credits
- [ ] Can view credit packages
- [ ] Payment buttons work
- [ ] Credit balance updates correctly

## ⚠️ If Any Feature Doesn't Work:

1. **Check the error message** - The app should now show what went wrong
2. **Shake your device** - This shows React Native debug menu with detailed errors
3. **Check backend logs** - Make sure your Flask server is running and accessible
4. **Verify API endpoint** - Check that the feature's API endpoint exists in your backend

## 🔍 Common Issues to Watch For:

### Network Errors
- Make sure your phone has internet connection
- Verify the API URL is accessible from your phone's network
- Check if the backend server is running

### Login Issues
- Verify Supabase is configured correctly
- Check that user accounts exist in the database
- Ensure JWT_SECRET is set in environment variables

### Feature Not Loading
- Check if the backend API endpoint exists (e.g., `/mobile/quiz/start`)
- Verify the endpoint returns the expected data format
- Check backend logs for errors

---

## 🐛 How to Report Issues:

If something doesn't work:
1. Note which feature/button isn't working
2. Note any error messages shown
3. Check backend logs for errors
4. Share the specific error details

---

The white screen issue is definitely fixed, but full functionality depends on:
- Backend API being accessible
- All endpoints working correctly
- Database being properly configured
- Proper data in the database
