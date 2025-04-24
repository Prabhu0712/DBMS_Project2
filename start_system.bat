@echo off
echo Starting Cooking Recipe Management System...

REM Install dependencies if needed
echo Installing dependencies...
cd backend
npm install
cd ..

REM Start the backend server
echo Starting backend server...
cd backend
start cmd /k "node server.js"

REM Start the frontend
echo Starting frontend...
cd ../frontend
start http://localhost:5000

echo System started successfully!
echo Backend server running on http://localhost:5000
echo Frontend available at http://localhost:5000 