# Model Download Security - Production Configuration

## Overview

The NerdX app now uses **HTTPS** for all model downloads via Hugging Face Hub's CloudFront CDN. This fixes the Android cleartext HTTP traffic error and provides production-grade security.

## Changes Made

### ✅ Security Improvements

1. **HTTPS Only**: All model downloads now use secure HTTPS connections
2. **CloudFront CDN**: Files served through Amazon CloudFront for global distribution
3. **Android Compliance**: Meets Android 9+ security requirements (no cleartext traffic)
4. **Production Ready**: No local development servers in production builds

### 🔧 Configuration Updates

**File**: `src/services/ModelDownloadService.ts`

```typescript
// Production CDN URL (HTTPS)
const PRODUCTION_CDN_URL = 'https://huggingface.co/YOUR-USERNAME/nerdx-phi3-mini/resolve/main';

// Development mode disabled by default
const USE_LOCAL_SERVER = false;
```

## Security Benefits

| Feature | Before | After |
|---------|--------|-------|
| Protocol | HTTP (cleartext) | HTTPS (encrypted) |
| Server | Local IP (10.13.2.167) | Hugging Face CDN |
| Android Support | ❌ Blocked by OS | ✅ Fully supported |
| Man-in-the-Middle Protection | ❌ None | ✅ TLS/SSL encryption |
| Global Distribution | ❌ Single server | ✅ CloudFront CDN |
| Rate Limiting | ❌ None | ✅ 5,000 req/5min |

## Development vs Production

### Development Mode (Optional)

If you need to test with a local server:

1. Uncomment the `LOCAL_SERVER_URL` constant
2. Set `USE_LOCAL_SERVER = true`
3. **Important**: Only use for testing, never in production builds

```typescript
// For local testing only
const LOCAL_SERVER_URL = 'http://192.168.1.100:8080';
const USE_LOCAL_SERVER = true; // NEVER true in production
```

### Production Mode (Default)

The configuration defaults to production mode:
- `USE_LOCAL_SERVER = false`
- All downloads use HTTPS via Hugging Face
- Android security requirements met

## Setup Requirements

### For Users

**You must complete these steps:**

1. Upload model files to Hugging Face Hub (see [CDN_SETUP_GUIDE.md](./CDN_SETUP_GUIDE.md))
2. Update `PRODUCTION_CDN_URL` in `ModelDownloadService.ts` with your Hugging Face username
3. Rebuild the app with `eas build`

### For End Users (App Users)

✅ **No action required** - downloads work automatically over HTTPS

## Monitoring & Rate Limits

### Hugging Face Free Tier

- **Download Rate**: Up to 5,000 requests per 5-minute window
- **Storage**: Unlimited for public models
- **Bandwidth**: Unlimited via CloudFront CDN
- **File Size**: Up to 50GB per file

### What Happens at Rate Limits

If your app exceeds 5,000 downloads in 5 minutes:
- Hugging Face returns HTTP 429 (Too Many Requests)
- The app will show an error to the user
- Downloads resume automatically after the 5-minute window

For most educational apps, this limit is unlikely to be reached.

## Troubleshooting

### "Download Failed" Error

**Possible causes:**
1. `YOUR-USERNAME` not replaced in `PRODUCTION_CDN_URL`
2. Model files not uploaded to Hugging Face
3. Network connectivity issues

**Solutions:**
1. Verify your Hugging Face username in the URL
2. Check model is visible at `https://huggingface.co/YOUR-USERNAME/nerdx-phi3-mini`
3. Test URL in browser or with curl

### Android Still Blocking Downloads

**If this happens:**
1. Verify `USE_LOCAL_SERVER = false` in production build
2. Confirm URL starts with `https://` not `http://`
3. Rebuild app with `eas build` (don't use cached build)

## Best Practices

### ✅ DO

- Keep `USE_LOCAL_SERVER = false` in production
- Use Hugging Face public repositories for free hosting
- Monitor download success rates in analytics
- Test downloads on both WiFi and mobile data

### ❌ DON'T

- Enable `USE_LOCAL_SERVER` in production builds
- Use HTTP URLs in production
- Expose local development servers to the internet
- Commit access tokens to version control

## Compliance

This configuration meets the following security standards:

- ✅ Android 9+ Network Security Configuration
- ✅ App Store security requirements (Google Play, App Store)
- ✅ HTTPS-only data transmission
- ✅ TLS 1.2+ encryption

## Support

For issues or questions:
1. Check [CDN_SETUP_GUIDE.md](./CDN_SETUP_GUIDE.md) for setup help
2. Review [Hugging Face documentation](https://huggingface.co/docs/hub/models-uploading)
3. Verify your configuration matches this guide

---

**Last Updated**: 2025-11-27  
**Status**: ✅ Production Ready
