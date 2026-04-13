# NerdX Backend - Docker Image for Render
# Includes system dependencies for Manim (ffmpeg, latex) and Pix2Text (ML models)

FROM node:20-alpine AS web_build
WORKDIR /web
COPY NerdXWeb/package.json NerdXWeb/package-lock.json ./NerdXWeb/
RUN cd NerdXWeb && npm ci
COPY NerdXWeb ./NerdXWeb

# Production web/API public host (same origin when SPA + API are served together)
ARG VITE_API_BASE_URL=https://nerdx.co.zw
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ARG VITE_PUBLIC_SITE_URL=https://nerdx.co.zw
ENV VITE_PUBLIC_SITE_URL=$VITE_PUBLIC_SITE_URL

RUN cd NerdXWeb && npm run build \
    && test -f /web/NerdXWeb/dist/index.html || (echo "ERROR: NerdXWeb build failed - index.html not found" && exit 1)

FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies for Manim and media processing
RUN apt-get update && apt-get install -y --no-install-recommends \
    # Manim dependencies
    curl \
    ffmpeg \
    libcairo2-dev \
    libpango1.0-dev \
    # LaTeX for mathematical typesetting (minimal install)
    texlive-latex-base \
    texlive-fonts-recommended \
    texlive-latex-extra \
    # For Pix2Text OCR
    libgl1-mesa-glx \
    libglib2.0-0 \
    # Build tools
    gcc \
    g++ \
    pkg-config \
    # Cleanup
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements first for better caching
COPY requirements_render.txt .

# Upgrade pip and install Python dependencies
RUN pip install --upgrade pip setuptools wheel && \
    pip install --no-cache-dir -r requirements_render.txt

# Copy application code
COPY . .

# Copy NerdXWeb build output into the expected location for `routes.py`.
COPY --from=web_build /web/NerdXWeb/dist /app/NerdXWeb/dist
RUN test -f /app/NerdXWeb/dist/index.html || (echo "ERROR: NerdXWeb dist not copied correctly" && exit 1)

# Create directories for media output
RUN mkdir -p static/media temp

# Expose port
EXPOSE 10000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:10000/health || exit 1

# Start command
# Uses gevent workers so multiple concurrent AI requests don't block each other.
# --worker-class gevent + --worker-connections 50 handles up to 200 concurrent
# students on a single Render instance without any student blocking another.
CMD sh -c "gunicorn backend.main:app \
  --bind 0.0.0.0:${PORT:-10000} \
  --worker-class gevent \
  --workers ${WEB_CONCURRENCY:-2} \
  --worker-connections ${WORKER_CONNECTIONS:-100} \
  --timeout 30 \
  --keep-alive 5 \
  --log-level info \
  --preload"
