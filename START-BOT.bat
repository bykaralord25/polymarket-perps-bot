@echo off
setlocal
cd /d "%~dp0"
title Polymarket Perps Bot

echo ==========================================
echo        POLYMARKET PERPS BOT v0.9
echo ==========================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js 24+ is not installed.
  pause
  exit /b 1
)

if not exist node_modules (
  echo [1/4] Installing dependencies...
  call npm.cmd install
  if errorlevel 1 goto :fail
)

if not exist .env (
  echo [2/4] Creating safe PAPER + MOCK configuration...
  copy /Y .env.example .env >nul
  powershell -NoProfile -Command "(Get-Content '.env') -replace 'MARKET_SOURCE=polymarket','MARKET_SOURCE=mock' | Set-Content '.env'"
) else (
  echo [2/4] Existing .env found. Keeping your settings.
)

echo [3/4] Starting local dashboard...
start "Perps Dashboard Server" /min cmd /c "npm.cmd run dashboard"

echo [4/4] Opening dashboard and starting bot...
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:8787"
echo.
echo Dashboard: http://127.0.0.1:8787
echo Press Ctrl+C here to stop the bot.
echo.
call npm.cmd run dev
goto :cleanup

:fail
echo.
echo [ERROR] Setup failed. No real order was sent.
goto :cleanup

:cleanup
taskkill /FI "WINDOWTITLE eq Perps Dashboard Server*" /T /F >nul 2>nul
echo.
echo Bot and dashboard stopped.
pause
