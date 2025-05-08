#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# === CONFIGURATION ===
PROJECT_DIR="/Users/ernestofosu/Downloads/project 3"
FRONTEND_DIR="$PROJECT_DIR"
ENV_FILE="$FRONTEND_DIR/.env"
RENDER_URL=https://parcel-delivery-backend.onrender.com # REPLACE with actual Render URL
 NETLIFY_URL="https://comforting-syrniki-99725d.netlify.app"

echo -e "${GREEN}👉 Setting API to Render URL...${NC}"
sed -i '' "s|VITE_API_URL=.*|VITE_API_URL=${RENDER_URL}|" "$ENV_FILE"

# === Commit and push the updated .env file ===
cd "$FRONTEND_DIR"
git add "$ENV_FILE"
git commit -m "Set VITE_API_URL to Render for Netlify deploy" || echo "ℹ️ Nothing to commit."
 git push origin main

# === Sync Netlify environment variable ===
echo -e "${GREEN}👉 Syncing VITE_API_URL with Netlify...${NC}"
netlify env:set VITE_API_URL "$RENDER_URL" --force

# === Trigger Netlify rebuild ===
echo -e "${GREEN}👉 Triggering Netlify rebuild with empty commit...${NC}"
git commit --allow-empty -m "Trigger Netlify rebuild with Render API"
git push origin main

# === Build Frontend ===
echo -e "${GREEN}👉 Building frontend locally (optional)...${NC}"
npm run build

# === Done ===
echo -e "${GREEN}✅ Deployment script complete!${NC}"
echo -e "${GREEN}Frontend: $NETLIFY_URL${NC}"
echo -e "${GREEN}Backend (Render): $RENDER_URL${NC}"

# === Open Frontend ===
echo -e "${GREEN}👉 Opening frontend site...${NC}"
open "$NETLIFY_URL"
 