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

# Wait for Flask to start
sleep 2

echo -e "${GREEN}👉 Starting ngrok tunnel...${NC}"
ngrok http 5000 > ngrok.log &
NGROK_PID=$!

# Wait for ngrok to initialize
sleep 3 &
spinner

# Fetch ngrok URL
NGROK_URL=$(curl --silent http://127.0.0.1:4040/api/tunnels | grep -o 'https://[^"]*')

if [ -z "$NGROK_URL" ]; then
  echo -e "${RED}❌ Failed to fetch ngrok URL. Aborting.${NC}"
  kill -9 $FLASK_PID $NGROK_PID
  exit 1
fi

echo -e "${GREEN}✅ ngrok URL is: $NGROK_URL${NC}"

echo -e "${GREEN}👉 Verifying backend is reachable at $NGROK_URL...${NC}"
HEALTH_CHECK=$(curl --silent --max-time 5 "$NGROK_URL/couriers" | grep -o 'CR00[1-9]')

if [ -z "$HEALTH_CHECK" ]; then
  echo -e "${RED}❌ Backend is not responding properly. Check Flask or ngrok logs.${NC}"
  kill -9 $FLASK_PID $NGROK_PID
  exit 1
fi

echo -e "${GREEN}✅ Backend is reachable and responding.${NC}"


# Backup original API line in .env
ORIGINAL_API_LINE=$(grep "VITE_API_URL" "$ENV_FILE")

echo -e "${GREEN}👉 Updating API URL in: $ENV_FILE...${NC}"
sed -i '' "s|VITE_API_URL=.*|VITE_API_URL=${NGROK_URL}|" "$ENV_FILE"
echo -e "${GREEN}✅ API URL set to ngrok.${NC}"

# Commit and push updated API URL to GitHub
echo -e "${GREEN}👉 Committing updated API URL to GitHub...${NC}"
cd "$FRONTEND_DIR"
git add "$ENV_FILE"
git commit -m "Set VITE_API_URL to $NGROK_URL for Netlify deploy"
git push origin main
echo -e "${GREEN}✅ API URL pushed to GitHub.${NC}"

# Optional wait for GitHub to sync before build
echo -e "${GREEN}⌛ Waiting 10 seconds for GitHub/Netlify to sync...${NC}"
sleep 10

# Build frontend
echo -e "${GREEN}👉 Building frontend...${NC}"
npm run build > /dev/null 2>&1 &
spinner
BUILD_STATUS=$?
cd "$PROJECT_DIR"

if [ $BUILD_STATUS -ne 0 ]; then
  echo -e "${RED}❌ Frontend build failed.${NC}"
  kill -9 $FLASK_PID $NGROK_PID
  exit 1
fi
echo -e "${GREEN}✅ Frontend build successful.${NC}"

# Deploy to Netlify from dist/ (Vite output)
echo -e "${GREEN}👉 Setting VITE_API_URL for build time...${NC}"
export VITE_API_URL=$NGROK_URL
echo -e "${GREEN}👉 Building frontend with injected VITE_API_URL...${NC}"
npm run build > /dev/null 2>&1 &
spinner
DEPLOY_STATUS=$?

if [ $DEPLOY_STATUS -ne 0 ]; then
  echo -e "${RED}❌ Netlify deployment failed.${NC}"
  kill -9 $FLASK_PID $NGROK_PID
  exit 1
fi
echo -e "${GREEN}✅ Netlify deployment successful.${NC}"

# Restore original API URL in .env
echo -e "${GREEN}👉 Restoring local API URL...${NC}"
sed -i '' "s|VITE_API_URL=.*|VITE_API_URL=${LOCAL_API_URL}|" "$ENV_FILE"
git add "$ENV_FILE"
git commit -m "Revert VITE_API_URL back to localhost"
git push origin main
echo -e "${GREEN}✅ API URL restored to localhost and pushed.${NC}"

# Final display
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