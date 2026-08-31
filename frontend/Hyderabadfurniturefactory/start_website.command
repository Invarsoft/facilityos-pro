#!/bin/bash
# macOS Double-Clickable Script for Hyderabad Furniture Factory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

clear
echo "========================================================"
echo "   HYDERABAD FURNITURE FACTORY - MACOS LAUNCHER"
echo "========================================================"
echo ""
echo "1. Checking build status..."

if [ ! -d "dist" ]; then
    echo "   Building production bundle..."
    npm run build
else
    echo "   Production build ready."
fi

echo ""
echo "2. Starting server on http://localhost:5173/ ..."

# Release port 5173 if busy
lsof -ti :5173 | xargs kill -9 2>/dev/null || true

# Start preview server in background
npx vite preview --port 5173 &

# Pause 2 seconds for server startup
sleep 2

echo ""
echo "3. Opening website in Safari/Chrome..."
echo "========================================================"
open "http://localhost:5173/"

echo ""
echo "Server is LIVE at http://localhost:5173/"
echo "Leave this Terminal window open while using the website."
echo "Press Ctrl+C in this window to stop the server."
echo "========================================================"

# Keep process running in Terminal
wait
