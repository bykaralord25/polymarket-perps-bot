@echo off
setlocal
cd /d "%~dp0"
title Polymarket Perps Bot Setup

echo Checking project...
call npm.cmd install || goto :fail
call npm.cmd run check || goto :fail
call npm.cmd test || goto :fail
call npm.cmd run build || goto :fail

if not exist .env (
  copy /Y .env.example .env >nul
  powershell -NoProfile -Command "(Get-Content '.env') -replace 'MARKET_SOURCE=polymarket','MARKET_SOURCE=mock' | Set-Content '.env'"
)

echo.
echo ==========================================
echo Setup complete.
echo Double-click START-BOT.bat next time.
echo Default mode is PAPER + MOCK.
echo ==========================================
pause
exit /b 0

:fail
echo.
echo Setup failed. Read the error above.
pause
exit /b 1
