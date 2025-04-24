@echo off
echo Starting Recipe Management System...

REM Check if Node.js is installed
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    pause
    exit /b 1
)

REM Check if MySQL is installed
where mysql >nul 2>&1
if %errorlevel% neq 0 (
    echo Warning: MySQL is not installed or not in PATH
    echo Please make sure MySQL is installed and running
)

REM Install backend dependencies
echo Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Error installing backend dependencies
    pause
    exit /b 1
)

REM Start backend server
echo Starting backend server...
start "Backend Server" cmd /k "cd backend && node server.js"

REM Install frontend dependencies
echo Installing frontend dependencies...
cd ../frontend
call npm install
if %errorlevel% neq 0 (
    echo Error installing frontend dependencies
    pause
    exit /b 1
)

REM Start frontend server
echo Starting frontend server...
start "Frontend Server" cmd /k "cd frontend && node serve.js"

echo.
echo System started successfully!
echo Backend server running on http://localhost:5000
echo Frontend available at http://localhost:8080
echo.
echo Press any key to exit this window...
pause >nul 