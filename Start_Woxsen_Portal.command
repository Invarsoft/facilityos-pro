#!/bin/bash

echo "========================================================================"
echo "🎓 Launching Woxsen University Campus Operations & Maintenance Portal..."
echo "========================================================================"

cd "$(dirname "$0")/frontend" || cd /Users/trigun/Desktop/facilityos/frontend || exit 1

open "http://localhost:3000"

echo ""
echo "🚀 Local Dev Server Link:   http://localhost:3000"
echo "📱 Mobile Device Link:     http://10.107.16.110:3000"
echo "🏢 Admin Panel:            http://localhost:3000/admin"
echo "🏛️ Warden Console:          http://localhost:3000/manager"
echo "🛠️ Technician Desk:         http://localhost:3000/worker"
echo ""
echo "Starting Next.js Server on port 3000..."
echo "------------------------------------------------------------------------"

npx next dev -H 0.0.0.0 -p 3000
