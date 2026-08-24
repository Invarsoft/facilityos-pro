@echo off
setlocal EnableExtensions
title FacilityOS Pro
cd /d "%~dp0"

echo.
echo  ============================================
echo    FacilityOS Pro - One-Click Runner
echo    (stops old servers, then starts everything)
echo  ============================================
echo.

REM ---------- 1. Check prerequisites ----------
where python >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python not found in PATH. Install Python 3.11+ from https://python.org
    echo         IMPORTANT: tick "Add Python to PATH" during installation.
    pause & exit /b 1
)

where node >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found in PATH. Install Node 18+ from https://nodejs.org
    pause & exit /b 1
)

for /f "tokens=2" %%v in ('python --version 2^>^&1') do set PYVER=%%v
for /f "tokens=1" %%v in ('node --version') do set NODEVER=%%v
echo [OK] Python %PYVER% found
echo [OK] Node %NODEVER% found
echo.

REM ---------- 2. Stop any previously running FacilityOS servers ----------
echo [..] Stopping old instances / freeing ports 3000 and 8000...
for %%p in (3000 8000) do (
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":%%p .*LISTENING" 2^>nul') do (
        taskkill /PID %%a /F >nul 2>&1
    )
)
echo [OK] Ports free
echo.

REM ---------- 3. Backend: virtual env + dependencies ----------
if not exist "backend\.venv\Scripts\python.exe" (
    echo [..] Creating Python virtual environment...
    python -m venv backend\.venv
    if errorlevel 1 ( echo [ERROR] Failed to create venv & pause & exit /b 1 )
)

echo [..] Installing / checking backend dependencies ^(first run takes a few minutes^)...
call backend\.venv\Scripts\python.exe -m pip install --quiet --disable-pip-version-check -r backend\requirements.txt
if errorlevel 1 ( echo [ERROR] Backend dependency install failed & pause & exit /b 1 )
echo [OK] Backend dependencies ready
echo.

REM ---------- 4. Seed database (only first time) ----------
if not exist "backend\facilityos.db" (
    echo [..] Seeding demo database...
    pushd backend
    .venv\Scripts\python.exe -m scripts.seed
    popd
    echo [OK] Database seeded
) else (
    echo [OK] Database already exists - skipping seed
)
echo.

REM ---------- 5. Frontend: dependencies ----------
if not exist "frontend\node_modules" (
    echo [..] Installing frontend dependencies ^(first run takes a few minutes^)...
    pushd frontend
    call npm install --no-audit --no-fund
    popd
    if errorlevel 1 ( echo [ERROR] npm install failed & pause & exit /b 1 )
)
if not exist "frontend\.env.local" (
    copy frontend\.env.example frontend\.env.local >nul
)
echo [OK] Frontend ready
echo.

REM ---------- 6. Launch both servers in their own windows ----------
echo [..] Starting backend  -^> http://localhost:8000  (API docs: /docs)
start "FacilityOS Backend" cmd /k "cd /d %~dp0backend && .venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000"

echo [..] Starting frontend -^> http://localhost:3000
start "FacilityOS Frontend" cmd /k "cd /d %~dp0frontend && set NEXT_PUBLIC_API_BASE_URL=http://localhost:8000&& npm run dev"

echo.
echo  ============================================
echo    All services started!
echo.
echo    App        : http://localhost:3000
echo    API Docs   : http://localhost:8000/docs
echo.
echo    Login (email tab):
echo      admin@woxsen.edu       / Admin@123
echo      manager@woxsen.edu     / Manager@123
echo      worker.plumbing@woxsen.edu / Worker@123
echo      student@woxsen.edu     / User@123
echo.
echo    To STOP: just close the two server windows
echo    (or run this file again to restart fresh)
echo  ============================================
echo.

REM ---------- 7. Wait for servers, then open the browser ----------
echo [..] Waiting for servers to come up...
set /a tries=0
:waitloop
ping -n 4 127.0.0.1 >nul
set /a tries+=1
curl -s -o nul http://localhost:3000 2>nul
if errorlevel 1 (
    if %tries% lss 30 goto waitloop
)
start "" http://localhost:3000
echo [OK] Browser opened. You can minimize this window.
ping -n 6 127.0.0.1 >nul
exit /b 0
