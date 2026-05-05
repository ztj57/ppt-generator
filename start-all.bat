@echo off
echo Starting PPT Generator...
echo.
echo Starting Backend Server...
start "PPT Backend" cmd /k "cd /d "%~dp0backend" && py -m uvicorn main:app --host 0.0.0.0 --port 8000"

timeout /t 3 /nobreak > nul

echo Starting Frontend...
start "PPT Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo Both servers are starting...
echo Please wait a few seconds, then open http://localhost:3000 in your browser
echo.
pause