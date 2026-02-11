# Deploy NerdXWeb to Azure Static Web Apps

Step-by-step guide to deploy the student-facing NerdXWeb app to Azure Static Web Apps, separate from the backend on Render.

---

## Prerequisites

- [ ] Azure account ([free at portal.azure.com](https://portal.azure.com))
- [ ] GitHub repository with NerdX code
- [ ] Backend API running on Render (`https://nerdx.onrender.com`)

---

## Step 1: Create the Static Web App in Azure Portal

1. Go to [Azure Portal](https://portal.azure.com) and sign in.
2. Click **Create a resource** (or search "Create a resource").
3. Search for **Static Web App**.
4. Click **Static Web App** → **Create**.

---

## Step 2: Basics Configuration

| Field | Value |
|-------|--------|
| **Subscription** | Your Azure subscription |
| **Resource group** | Create new: `nerdx-rg` (or use existing) |
| **Name** | `nerdx-web` (will be in URL: `nerdx-web.azurestaticapps.net`) |
| **Plan type** | **Free** (for getting started) |
| **Region** | Choose closest to your users (e.g. East US, West Europe) |

Click **Next: Deployment >**.

---

## Step 3: Deployment Configuration

| Field | Value |
|-------|--------|
| **Source** | **GitHub** |
| **Sign in with GitHub** | Click and authorize Azure to access your GitHub |
| **Organization** | Your GitHub username or org |
| **Repository** | `NerdX` (or your repo name) |
| **Branch** | `main` |

### Build Details

| Field | Value |
|-------|--------|
| **Build Presets** | **Custom** (we use a subdirectory) |
| **App location** | `NerdXWeb` |
| **Api location** | *(leave empty)* |
| **Output location** | `dist` |

Click **Review + create**, then **Create**.

---

## Step 4: Add the Build Environment Variable

The React app needs `VITE_API_BASE_URL` at build time to know where the backend API is.

### Option A: Via GitHub (recommended)

1. After the Static Web App is created, Azure will add a workflow file to your repo:
   - `.github/workflows/azure-static-web-apps-<random-name>.yml`
2. In your repo, open that workflow file.
3. Find the `Build And Deploy` step (the `Azure/static-web-apps-deploy@v1` action).
4. Add an `env` block to the step. It should look like this:

```yaml
- name: Build And Deploy
  id: builddeploy
  uses: Azure/static-web-apps-deploy@v1
  with:
    azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_xxx }}
    # ... other config ...
    app_location: "NerdXWeb"
    api_location: ""
    output_location: "dist"
  env:
    VITE_API_BASE_URL: "https://nerdx.onrender.com"
```

**Important:** Replace `https://nerdx.onrender.com` with your actual backend URL if different.

### Option B: Via GitHub Secrets (for sensitive values)

1. In your GitHub repo: **Settings** → **Secrets and variables** → **Actions**.
2. Click **New repository secret**.
3. Name: `VITE_API_BASE_URL`
4. Value: `https://nerdx.onrender.com`
5. In the workflow file, use:  
   `VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}`

---

## Step 5: Verify the Workflow Configuration

The auto-generated workflow may use `/` for `app_location`. Update it to:

| Setting | Correct Value |
|---------|----------------|
| `app_location` | `NerdXWeb` |
| `api_location` | `""` (empty) |
| `output_location` | `dist` |
| `app_build_command` | *(optional)* `npm run build` — default is fine |

---

## Step 6: Trigger the First Deployment

1. **Save and push** the workflow changes to your repo.
2. Go to **Actions** tab in GitHub — the workflow should run.
3. Wait for the build to complete (about 2–5 minutes).

---

## Step 7: Access Your App

1. In Azure Portal, open your Static Web App (`nerdx-web`).
2. Go to **Overview**.
3. Copy the **URL** (e.g. `https://nerdx-web.azurestaticapps.net`).
4. Students can use this URL to access NerdXWeb.

---

## Step 8: Optional — Monorepo Build Triggers

To build only when NerdXWeb changes (avoids builds on backend-only changes):

1. Open the workflow file: `.github/workflows/azure-static-web-apps-<name>.yml`
2. Add a `paths` filter under `on`:

```yaml
on:
  push:
    branches:
      - main
    paths:
      - 'NerdXWeb/**'
      - '.github/workflows/azure-static-web-apps-*.yml'
  pull_request:
    branches:
      - main
    paths:
      - 'NerdXWeb/**'
      - '.github/workflows/azure-static-web-apps-*.yml'
```

---

## SPA Routing (Already Configured)

The `staticwebapp.config.json` in `NerdXWeb/public/` is copied to the build output and configures SPA fallback. Direct links and refreshes (e.g. `/app/dashboard`) will serve `index.html` instead of 404.

---

## Final Architecture

| Component | URL | Purpose |
|-----------|-----|---------|
| **NerdXWeb (Students)** | `https://nerdx-web.azurestaticapps.net` | Student app |
| **Backend API** | `https://nerdx.onrender.com` | API, webhooks |
| **Admin Dashboard** | `https://nerdx.onrender.com/admin/login` | Admin only |

---

## Troubleshooting

### Build fails with "npm run build" error
- Check the Actions log for the exact error.
- Ensure `NerdXWeb/package.json` has a `build` script.
- If TypeScript errors appear, fix them or use:  
  `app_build_command: "npx vite build"` (skip type check).

### 404 on page refresh
- Confirm `NerdXWeb/public/staticwebapp.config.json` exists and includes `navigationFallback`.
- Redeploy after adding or changing the config.

### API calls fail (CORS)
- Backend already uses `CORS(app, origins=['*'])`.
- Confirm `VITE_API_BASE_URL` matches the backend URL exactly (no trailing slash).

### Wrong API URL
- Rebuild the app: change `VITE_API_BASE_URL` in the workflow, push, and let the workflow run again.  
  Vite injects it at build time, so a redeploy is required.

---

## Custom Domain (Optional)

1. In Azure Portal, open your Static Web App.
2. Go to **Custom domains**.
3. Add a domain (e.g. `app.nerdx.com`).
4. Follow the DNS verification steps.
