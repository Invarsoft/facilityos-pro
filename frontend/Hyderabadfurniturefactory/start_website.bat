@echo off
title Hyderabad Furniture Factory Website Launcher
echo ==================================================
echo   Hyderabad Furniture Factory - Website Launcher
echo ==================================================
cd /d "%~dp0"

if not exist dist (
    echo Building production website...
    call npm run build
)

echo Opening http://localhost:5173/ in default browser...
start http://localhost:5173/

echo Starting preview server on http://localhost:5173/...
call npm run preview -- --port 5173
pause
