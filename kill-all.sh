#!/bin/bash

echo "Stopping any running Flask and ngrok processes..."

# Kill Flask server (port 5000)
lsof -t -i :5000 | xargs kill -9 2>/dev/null

# Kill any ngrok processes
pkill -f ngrok 2>/dev/null

echo "All Flask servers and ngrok tunnels have been stopped."
