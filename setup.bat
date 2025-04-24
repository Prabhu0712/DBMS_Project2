@echo off
echo Starting Recipe Management System Setup...

REM Check if Node.js is installed
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if MySQL is installed
where mysql >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: MySQL is not installed
    echo Please install MySQL from https://dev.mysql.com/downloads/installer/
    echo During installation, set root password to: prabhu0712
    pause
    exit /b 1
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

REM Install frontend dependencies
echo Installing frontend dependencies...
cd ../frontend
call npm install
if %errorlevel% neq 0 (
    echo Error installing frontend dependencies
    pause
    exit /b 1
)

REM Setup database
echo Setting up database...
cd ..
node setup_database.js
if %errorlevel% neq 0 (
    echo Error setting up database
    pause
    exit /b 1
)

REM Start backend server
echo Starting backend server...
start "Backend Server" cmd /k "cd backend && node server.js"

REM Start frontend server
echo Starting frontend server...
start "Frontend Server" cmd /k "cd frontend && node serve.js"

echo.
echo Setup completed successfully!
echo Backend server running on http://localhost:5000
echo Frontend available at http://localhost:8080
echo.
echo Press any key to exit this window...
pause >nul 