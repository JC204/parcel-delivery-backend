#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

spinner() {
    local pid=$!
    local delay=0.1
    local spinstr='|/-\'
    while ps a | awk '{print $1}' | grep -q "$pid"; do
        local temp=${spinstr#?}
        printf " [%c]  " "$spinstr"
        spinstr=$temp${spinstr%"$temp"}
        sleep $delay
        printf "\b\b\b\b\b\b"
    done
    printf "    \b\b\b\b"
}

PROJECT_DIR="/Users/ernestofosu/Downloads/project 3"
FRONTEND_DIR="$PROJECT_DIR"
API_FILE="$FRONTEND_DIR/src/api/index.ts"
NETLIFY_URL="https://comforting-syrniki-99725d.netlify.app"
LOCAL_API_URL="http://localhost:5000"
ENV_FILE="$FRONTEND_DIR/.env"

echo -e "${GREEN}👉 Freeing port 5000 if busy...${NC}"
PID=$(lsof -ti:5000)
if [ -n "$PID" ]; then
  kill -9 $PID
  echo -e "${GREEN}✅ Port 5000 freed.${NC}"
else
  echo -e "${GREEN}✅ Port 5000 already free.${NC}"
fi

echo -e "${GREEN}👉 Starting Flask backend...${NC}"
cd "$PROJECT_DIR"
FLASK_APP=app.py flask run --host=0.0.0.0 --port=5000 > flask.log 2>&1 &
FLASK_PID=$!

# === Wait until Flask backend responds locally ===
echo -e "${GREEN}⌛ Waiting for Flask to start on ${LOCAL_API_URL}/couriers...${NC}"
until curl --silent "$LOCAL_API_URL/couriers" | jq '.' > /dev/null 2>&1; do
  echo -e "${RED}  Flask not ready yet. Retrying...${NC}"
  sleep 2
done
echo -e "${GREEN}✅ Flask is up locally!${NC}"

echo -e "${GREEN}👉 Starting ngrok tunnel...${NC}"
ngrok http 5000 > ngrok.log &
NGROK_PID=$!

sleep 15 &
spinner

# === Fetch and validate ngrok URL ===
NGROK_URL=$(curl --silent http://127.0.0.1:4040/api/tunnels | grep -o 'https://[^"]*' | head -n 1)

if [ -z "$NGROK_URL" ]; then
  echo -e "${RED}❌ Could not fetch ngrok URL. Aborting.${NC}"
  kill -9 $FLASK_PID $NGROK_PID
  exit 1
fi

echo -e "${GREEN}✅ ngrok URL is: $NGROK_URL${NC}"
echo -e "${GREEN}👉 Opening ngrok status page for confirmation...${NC}"
open http://127.0.0.1:4040

# === Wait until backend is actually serving valid JSON ===
echo -e "${GREEN}⌛ Waiting for backend to serve valid JSON from ${NGROK_URL}/couriers...${NC}"
until curl --silent "$NGROK_URL/couriers" | tee /tmp/ngrok_response.json | jq '.' > /dev/null 2>&1; do
  echo -e "${RED}  Backend not ready yet. Retrying...${NC}"
  cat /tmp/ngrok_response.json
  sleep 2
done
echo -e "${GREEN}✅ Backend is reachable and serving JSON!${NC}"

# === Update .env ===
ORIGINAL_API_LINE=$(grep "VITE_API_URL" "$ENV_FILE")
echo -e "${GREEN}👉 Updating API URL in: $ENV_FILE...${NC}"
sed -i '' "s|VITE_API_URL=.*|VITE_API_URL=${NGROK_URL}|" "$ENV_FILE"
echo -e "${GREEN}✅ API URL set to ngrok.${NC}"

# === Git push updated env ===
cd "$FRONTEND_DIR"
git add "$ENV_FILE"
git commit -m "Set VITE_API_URL to $NGROK_URL for Netlify deploy" || echo "ℹ️  Nothing to commit."
git push origin main
echo -e "${GREEN}✅ API URL pushed to GitHub.${NC}"

 # === Sync Netlify environment variable ===
echo -e "${GREEN}👉 Syncing VITE_API_URL with Netlify...${NC}"
netlify env:set VITE_API_URL "$NGROK_URL" --force
echo -e "${GREEN}👉 Triggering rebuild on Netlify with empty commit...${NC}"
git commit --allow-empty -m "Trigger Netlify rebuild for new ngrok URL"
git push origin main

if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Failed to sync VITE_API_URL with Netlify.${NC}"
  kill -9 $FLASK_PID $NGROK_PID
  exit 1
fi
echo -e "${GREEN}✅ Netlify env var set to $NGROK_URL.${NC}"

echo -e "${GREEN}⌛ Waiting 10 seconds for GitHub/Netlify to sync...${NC}"
sleep 10

# === Build frontend with correct environment variable ===
echo -e "${GREEN}👉 Building frontend...${NC}"
npm run build > /dev/null 2>&1 &
spinner
BUILD_STATUS=$?


if [ $BUILD_STATUS -ne 0 ]; then
  echo -e "${RED}❌ Frontend build failed.${NC}"
  kill -9 $FLASK_PID $NGROK_PID
  exit 1
fi
echo -e "${GREEN}✅ Frontend build successful.${NC}"

# === Redundant build for environment variable support ===
echo -e "${GREEN}👉 Setting VITE_API_URL for build time...${NC}"
export VITE_API_URL=$NGROK_URL
echo -e "${GREEN}👉 Building frontend again with injected VITE_API_URL...${NC}"
npm run build > /dev/null 2>&1 &
spinner
DEPLOY_STATUS=$?

if [ $DEPLOY_STATUS -ne 0 ]; then
  echo -e "${RED}❌ Netlify deployment failed.${NC}"
  kill -9 $FLASK_PID $NGROK_PID
  exit 1
fi
echo -e "${GREEN}✅ Netlify deployment successful.${NC}"

# === Revert API URL ===
echo -e "${GREEN}👉 Restoring local API URL...${NC}"
sed -i '' "s|VITE_API_URL=.*|VITE_API_URL=${LOCAL_API_URL}|" "$ENV_FILE"
git add "$ENV_FILE"
git commit -m "Revert VITE_API_URL back to localhost"
git push origin main
echo -e "${GREEN}✅ API URL restored to localhost and pushed.${NC}"

# === Final Summary ===
echo ""
echo -e "${GREEN}✅ Everything deployed successfully!${NC}"
echo -e "${GREEN}Backend (ngrok): ${NGROK_URL}${NC}"
echo -e "${GREEN}Frontend (Netlify): ${NETLIFY_URL}${NC}"
echo ""

sleep 2
echo -e "${GREEN}👉 Opening frontend site...${NC}"
open "$NETLIFY_URL"

echo ""
echo -e "${GREEN}🚀 Demo is live! Press Ctrl+C to stop Flask and ngrok.${NC}"

wait