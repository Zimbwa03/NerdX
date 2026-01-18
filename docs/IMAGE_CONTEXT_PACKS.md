## Multi-image chat + Context Packs (Vertex AI Gemini)

This repo supports **ChatGPT-style** multi-image input (up to **10 images**) in:
- **Teacher Mode**
- **Project Assistant**

When a user attaches images and sends a prompt, the backend:
1. Uploads + validates the images
2. Runs a **single multi-image** Gemini multimodal call on **Vertex AI**
3. Stores a durable **Context Pack** (image summaries + extracted text + tags)
4. Sends the chat message grounded on that Context Pack, so follow-up questions work without re-uploading

### API endpoints (mobile)

- **POST** `/api/mobile/attachments/analyze` (multipart/form-data)
  - `images`: repeatable file field (1..10)
  - `prompt`: optional string (what the user wants from the images)
  - `chat_id`: optional string (e.g. teacher `session_id`, or `project:<id>`)

- **POST** `/api/mobile/teacher/message` (json)
  - `session_id`
  - `message` (can be empty if `context_pack_id` provided)
  - `context_pack_id` (optional; if omitted, Teacher Mode uses the last one in that session)

- **POST** `/api/mobile/project/<project_id>/chat` (json)
  - `message` (can be empty if `context_pack_id` provided)
  - `context_pack_id` (optional; if omitted, Project Assistant uses latest Context Pack for `project:<id>`)

### Vertex AI configuration

The code uses the **Google Gen AI Python SDK** (Vertex mode):

Set **one** of the following:

- **Service account file**
  - `GOOGLE_APPLICATION_CREDENTIALS=/path/to/service_account.json`

- **Inline JSON**
  - `GOOGLE_SERVICE_ACCOUNT_JSON='{"type":"service_account", ... }'`

Recommended env vars:

- `GOOGLE_GENAI_USE_VERTEXAI=True`
- `GOOGLE_CLOUD_PROJECT=<your-project-id>`
- `GOOGLE_CLOUD_LOCATION=global` (or a supported region)

Default model for image context packs:
- `gemini-2.5-flash`

### Where images are stored

Context Pack images are saved under:
- `static/context_packs/<context_pack_id>/*`

### Troubleshooting (“I don’t know” / low quality)

Check server logs for:
- **Image count / size / MIME**: ensure backend is receiving 1..10 images and correct MIME (`jpeg/png/webp`)
- **Vertex client initialization**: missing ADC / credentials causes Vertex to be unavailable
- **Model name**: must be a multimodal-capable Gemini model (default is `gemini-2.5-flash`)
- **Payload size**: if total uploads are too big, reduce image sizes (backend limits: 5MB/image, ~15MB total)

