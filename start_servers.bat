@echo off
echo Starting Backend Server...
start cmd /k "cd backend && npm start"

echo Starting Frontend Server...
start cmd /k "cd frontend && npm start"

echo Servers are starting up...
echo Backend will be available at http://localhost:5000
echo Frontend will be available at http://localhost:8080

echo.
echo System started successfully!
echo Frontend: http://localhost:8080
echo Backend: http://localhost:5000
echo.
echo Press any key to exit...
pause > nul 