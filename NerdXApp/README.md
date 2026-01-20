# NerdX Mobile Application

React Native mobile application for NerdX educational platform.

## Features

- 📚 Quiz System (Mathematics, Combined Science, English)
- 💳 Credit Management System
- 💰 Payment Integration (Paynow/EcoCash)
- 📊 Progress Tracking & Analytics
- 🎯 Referral System
- 📝 Essay Writing & Comprehension
- 📈 Math Graph Visualization
- 🔐 Secure Authentication

## Prerequisites

- Node.js 18+
- npm or yarn
- Android Studio (for Android development)
- Xcode (for iOS development, Mac only)

## Installation

```bash
npm install
```

## Running the App

### Android
```bash
npm run android
```

### iOS
```bash
npm run ios
```

## Development

Start Metro bundler:
```bash
npm start
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── screens/       # Screen components
├── services/      # API and business logic
├── navigation/    # Navigation configuration
├── utils/         # Utility functions
├── types/         # TypeScript type definitions
└── theme/         # Theme and styling
```

## Environment Variables

The app requires Supabase configuration for authentication (including Google OAuth). 

### Required Environment Variables

Create a `.env` file in the `NerdXApp` directory with:

```bash
# Supabase Configuration (Required for Authentication)
EXPO_PUBLIC_SUPABASE_URL=https://lzteiewcvxoazqfxfjgg.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**Where to get these values:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (`lzteiewcvxoazqfxfjgg`)
3. Navigate to **Settings** → **API**
4. Copy the **Project URL** and **anon/public key**

### For EAS Builds

If using EAS Build, set these in `eas.json` under the build profile's `env` section, or configure them in the EAS dashboard.

### Fallback Values

The app includes fallback values for the correct Supabase project, but using environment variables is recommended for flexibility and security.

## API Configuration

Update API base URL in `src/services/api/config.ts`

## License

Private - NerdX Platform

