# Vertex AI Credentials Setup

## Test Results

✅ **DeepSeek API Key**: Present  
❌ **Vertex AI Credentials**: Missing

## Current Status

The WhatsApp bot migration to Vertex AI is **complete**, but Vertex AI credentials are not configured in the `.env` file. The system will automatically fallback to DeepSeek if Vertex AI is unavailable.

## Required Credentials for Vertex AI

To enable Vertex AI for WhatsApp bot, add **ONE** of the following to your `.env` file:

### Option 1: Service Account JSON (Recommended for Production)

Add the full service account JSON as a single environment variable:

```env
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"your-project-id","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"...","universe_domain":"googleapis.com"}
```

Also add:
```env
GOOGLE_CLOUD_PROJECT=your-gcp-project-id
GOOGLE_CLOUD_LOCATION=us-central1
GOOGLE_GENAI_USE_VERTEXAI=true
```

### Option 2: Credentials File Path (For Local Development)

If you have a service account JSON file:

```env
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/credentials.json
GOOGLE_CLOUD_PROJECT=your-gcp-project-id
GOOGLE_CLOUD_LOCATION=us-central1
GOOGLE_GENAI_USE_VERTEXAI=true
```

### Option 3: Application Default Credentials (ADC)

If you're running on Google Cloud (Compute Engine, Cloud Run, etc.), ADC will be used automatically. Just set:

```env
GOOGLE_CLOUD_PROJECT=your-gcp-project-id
GOOGLE_CLOUD_LOCATION=us-central1
GOOGLE_GENAI_USE_VERTEXAI=true
```

## How to Get Vertex AI Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select or create a project
3. Enable the Vertex AI API
4. Create a Service Account:
   - Go to IAM & Admin → Service Accounts
   - Click "Create Service Account"
   - Grant role: "Vertex AI User"
   - Create and download JSON key
5. Use the downloaded JSON file (Option 1 or 2 above)

## Testing

After adding credentials, run the test script:

```bash
python test_vertex_ai_generation.py
```

This will verify:
- ✅ Credentials are present
- ✅ Vertex AI service initializes
- ✅ Text generation works
- ✅ AI service generation works (WhatsApp platform)
- ✅ Math generator works (WhatsApp platform)

## Fallback Behavior

If Vertex AI credentials are not configured:
- ✅ WhatsApp bot will automatically fallback to DeepSeek
- ✅ All features will continue to work
- ✅ No breaking changes

## Current .env File Status

Your current `.env` file has:
- ✅ `GEMINI_API_KEY` (for Gemini API, not Vertex AI)
- ✅ `DEEPSEEK_API_KEY` (for fallback)
- ❌ Missing Vertex AI credentials

## Next Steps

1. Add Vertex AI credentials to `.env` file (choose one option above)
2. Run `python test_vertex_ai_generation.py` to verify
3. Test WhatsApp bot features to confirm Vertex AI is working
