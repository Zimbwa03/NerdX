# Hugging Face Setup Checklist

Quick checklist for setting up Phi-3 model on Hugging Face Hub.

## 1. Prepare Environment

```bash
# Install Hugging Face CLI
pip install huggingface_hub

# Login to Hugging Face
huggingface-cli login
```

## 2. Create Repository

```bash
huggingface-cli repo create nerdx-phi3-mini --type model
```

## 3. Upload Model Files

Navigate to your model files directory, then:

```bash
huggingface-cli upload nerdx-phi3-mini phi-3-mini-4k-instruct-cpu-int4-rtn-block-32-acc-level-4.onnx
huggingface-cli upload nerdx-phi3-mini phi-3-mini-4k-instruct-cpu-int4-rtn-block-32-acc-level-4.onnx.data
```

## 4. Update App Configuration

In `ModelDownloadService.ts`, replace `YOUR-USERNAME`:

```typescript
const PRODUCTION_CDN_URL = 'https://huggingface.co/YOUR-USERNAME/nerdx-phi3-mini/resolve/main';
```

**Example:** If your username is `john-doe`:
```typescript
const PRODUCTION_CDN_URL = 'https://huggingface.co/john-doe/nerdx-phi3-mini/resolve/main';
```

## 5. Verify URLs

Test in browser or terminal:
```bash
curl -I "https://huggingface.co/YOUR-USERNAME/nerdx-phi3-mini/resolve/main/phi-3-mini-4k-instruct-cpu-int4-rtn-block-32-acc-level-4.onnx"
```

Expected: `HTTP/2 200` or `HTTP/2 302`

## 6. Rebuild App

```bash
eas build --profile development --platform android
```

## 7. Test Download

1. Install new APK
2. Open "Offline AI Model" screen
3. Tap "Download Model"
4. Verify HTTPS download works ✅

---

**Need help?** See full guide in [CDN_SETUP_GUIDE.md](./CDN_SETUP_GUIDE.md)
