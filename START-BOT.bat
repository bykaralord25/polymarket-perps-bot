@echo off
setlocal
cd /d "%~dp0"
title Polymarket Perps Bot

echo ==========================================
echo        POLYMARKET PERPS BOT
echo ==========================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js 24+ is not installed.
  echo Install Node.js, then run this file again.
  pause
  exit /b 1
)

if not exist node_modules (
  echo [1/3] Installing dependencies...
  call npm.cmd install
  if errorlevel 1 goto :fail
)

if not exist .env (
  echo [2/3] Creating safe paper configuration...
  copy /Y .env.example .env >nul
  powershell -NoProfile -Command "(Get-Content '.env') -replace 'MARKET_SOURCE=polymarket','MARKET_SOURCE=mock' | Set-Content '.env'"
) else (
  echo [2/3] Existing .env found. Keeping your settings.
)

echo [3/3] Starting bot...
echo.
call npm.cmd run dev
goto :end

:fail
echo.
echo [ERROR] Setup failed. No real order was sent.
pause
exit /b 1

:end
echo.
echo Bot stopped.
pause
