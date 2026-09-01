#!/bin/bash

# ==============================================================================
# Woxsen University Campus Portal (FacilityOS Pro) — Terminal Launcher Script
# ==============================================================================

echo "========================================================================"
echo "🎓 Launching Woxsen University Campus Operations & Maintenance Portal..."
echo "========================================================================"

# Navigate to frontend directory
cd "$(dirname "$0")/frontend" || exit 1

# Open project directory in Finder
open .

# Open browser testing links
open "http://localhost:3000"

echo ""
echo "🚀 Local Dev Server Link:   http://localhost:3000"
echo "📱 Mobile Device Link:     http://10.107.16.110:3000"
echo "🏢 Admin Panel:            http://localhost:3000/admin"
echo "🏛️ Warden Console:          http://localhost:3000/manager"
echo "🛠️ Technician Desk:         http://localhost:3000/worker"
echo ""
echo "Starting Next.js Server on port 3000 (0.0.0.0)..."
echo "Press Ctrl+C to stop the server anytime."
echo "------------------------------------------------------------------------"

# Run Next.js server bound to all network interfaces for mobile testing
npx next dev -H 0.0.0.0 -p 3000
