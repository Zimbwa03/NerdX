# Hugging Face CDN Setup Guide for Phi-3 Model

This guide walks you through hosting your Phi-3 Mini ONNX model on Hugging Face Hub with free HTTPS CloudFront CDN delivery.

## Prerequisites

- [ ] Hugging Face account (free) - [Sign up here](https://huggingface.co/join)
- [ ] Phi-3 ONNX model files locally available
- [ ] Python 3.7+ installed (for Hugging Face CLI)

## Step 1: Install Hugging Face CLI

Open PowerShell or Command Prompt and run:

```bash
pip install huggingface_hub
```

## Step 2: Login to Hugging Face

```bash
huggingface-cli login
```

This will:
1. Open your browser to get an access token
2. Click "New token" → "Write" access
3. Copy the token and paste it in the terminal

## Step 3: Locate Your Model Files

Find these two files from your Phi-3 model download:
- `phi-3-mini-4k-instruct-cpu-int4-rtn-block-32-acc-level-4.onnx` (~30-100 MB)
- `phi-3-mini-4k-instruct-cpu-int4-rtn-block-32-acc-level-4.onnx.data` (~2.5 GB)

> [!NOTE]
> These files are typically downloaded from [ONNX Model Zoo](https://github.com/microsoft/onnxruntime/blob/main/docs/Reduced-Operator-Kernel-build.md) or [Hugging Face transformers](https://huggingface.co/microsoft/Phi-3-mini-4k-instruct-onnx).

## Step 4: Create Model Repository

```bash
huggingface-cli repo create nerdx-phi3-mini --type model
```

This creates a public model repository at: `https://huggingface.co/YOUR-USERNAME/nerdx-phi3-mini`

## Step 5: Upload Model Files

Navigate to the directory containing your model files, then run:

```bash
# Upload main model file
huggingface-cli upload nerdx-phi3-mini phi-3-mini-4k-instruct-cpu-int4-rtn-block-32-acc-level-4.onnx

# Upload model data file
huggingface-cli upload nerdx-phi3-mini phi-3-mini-4k-instruct-cpu-int4-rtn-block-32-acc-level-4.onnx.data
```

> [!TIP]
> Large files may take 10-30 minutes to upload depending on your internet connection.

## Step 6: Get Your CDN URLs

After upload completes, your model files will be available at:

```
https://huggingface.co/YOUR-USERNAME/nerdx-phi3-mini/resolve/main/phi-3-mini-4k-instruct-cpu-int4-rtn-block-32-acc-level-4.onnx
https://huggingface.co/YOUR-USERNAME/nerdx-phi3-mini/resolve/main/phi-3-mini-4k-instruct-cpu-int4-rtn-block-32-acc-level-4.onnx.data
```

Replace `YOUR-USERNAME` with your actual Hugging Face username.

## Step 7: Verify Upload

Test your URLs in a browser or with curl:

```bash
curl -I "https://huggingface.co/YOUR-USERNAME/nerdx-phi3-mini/resolve/main/phi-3-mini-4k-instruct-cpu-int4-rtn-block-32-acc-level-4.onnx"
```

You should see `HTTP/2 200` or a redirect (302) which confirms the file is accessible.

## Step 8: Update NerdX App Configuration

1. Open `ModelDownloadService.ts`
2. Update the `PRODUCTION_CDN_URL` constant with your Hugging Face URL
3. Set `USE_LOCAL_SERVER = false`
4. Rebuild your app

See the code changes below for exact details.

## Alternative: Upload via Web Interface

If you prefer not to use CLI:

1. Go to https://huggingface.co/new (create new model)
2. Name it `nerdx-phi3-mini`
3. Click "Create model"
4. Click "Upload files"
5. Drag and drop both `.onnx` and `.onnx.data` files
6. Click "Commit changes to main"

## Hugging Face Free Tier Limits

| Feature | Free Tier |
|---------|-----------|
| Storage | Unlimited for public models |
| Bandwidth | Unlimited (CloudFront CDN) |
| Download Rate Limit | 5,000 requests / 5 minutes |
| File Size | Up to 50GB per file |
| Repository Size | Unlimited for public repos |

> [!WARNING]
> If you exceed 5,000 downloads in 5 minutes, Hugging Face will temporarily rate limit (HTTP 429). For typical app usage, this is unlikely to happen.

## Troubleshooting

### Upload fails with "Authentication error"
- Run `huggingface-cli login` again
- Ensure you created a token with **Write** access

### Files too large to upload
- Check your internet connection
- Upload files individually, not together
- Consider using Git LFS for files >5GB (not needed for Phi-3 Mini)

### 404 Not Found when accessing URL
- Verify repository is public (not private)
- Check your username is correct in the URL
- Wait a few minutes for CDN propagation

## Next Steps

After your model is uploaded:
1. ✅ Copy your Hugging Face username
2. ✅ Update `ModelDownloadService.ts` with your URLs
3. ✅ Test download in your app
4. ✅ Deploy to production

---

**Questions?** Check [Hugging Face documentation](https://huggingface.co/docs/hub/models-uploading) or ask in the NerdX development channel.
