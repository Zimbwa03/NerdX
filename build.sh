#!/usr/bin/env bash
# NerdX Render Build Script
# Builds both the NerdXWeb React frontend AND installs Python dependencies.
# This ensures the student-facing web app is available at the root URL.

set -e  # Exit on any error

echo "==> Installing Python dependencies..."
pip install -r requirements.txt

echo "==> Building NerdXWeb (React frontend)..."
cd NerdXWeb
npm ci
npm run build

# Verify the build produced index.html
if [ ! -f dist/index.html ]; then
  echo "ERROR: NerdXWeb build failed - dist/index.html not found!"
  exit 1
fi

echo "==> NerdXWeb build successful! dist/index.html exists."
cd ..

echo "==> Build complete! Both Python backend and React frontend are ready."
