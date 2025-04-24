# Cooking Recipe Management System - Setup Guide

## Prerequisites
1. Node.js installed (version 14 or higher)
2. MySQL installed and running
3. MySQL root password set to 'root' (or update the password in db.js)

## Step 1: Install MySQL
1. Download MySQL Installer from https://dev.mysql.com/downloads/installer/
2. Run the installer
3. Choose "Developer Default" installation type
4. During installation:
   - Set root password to 'root'
   - Make sure to start MySQL service automatically

## Step 2: Verify MySQL Installation
1. Open Command Prompt
2. Run: `mysql -u root -p`
3. Enter password: `root`
4. If you can connect, MySQL is working correctly

## Step 3: Install Project Dependencies
1. Open Command Prompt in project root directory
2. Run: `npm install`
3. Navigate to backend directory: `cd backend`
4. Run: `npm install`

## Step 4: Setup Database
1. Run the test connection script:
   ```bash
   node test_connection.js
   ```
2. If connection is successful, run the setup script:
   ```bash
   node setup_database.js
   ```

## Step 5: Start the System
1. Run the start script:
   ```bash
   start_system.bat
   ```
2. The system should start with:
   - Backend server on http://localhost:5000
   - Frontend interface accessible at http://localhost:5000

## Troubleshooting

### MySQL Connection Issues
1. Check if MySQL service is running:
   - Open Services (services.msc)
   - Look for "MySQL" service
   - Make sure it's running
2. Verify MySQL credentials in db.js
3. Try connecting to MySQL using command line:
   ```bash
   mysql -u root -p
   ```

### Backend Server Issues
1. Check if port 5000 is available
2. Verify all dependencies are installed
3. Check console for error messages

### Frontend Issues
1. Make sure backend server is running
2. Check browser console for errors
3. Verify CORS settings in server.js

## Common Errors and Solutions

1. "Error: ER_ACCESS_DENIED_ERROR"
   - Solution: Verify MySQL username and password
   - Update db.js with correct credentials

2. "Error: ER_BAD_DB_ERROR"
   - Solution: Run setup_database.js to create database

3. "Error: Cannot connect to server"
   - Solution: Check if MySQL service is running
   - Verify MySQL installation

4. "Error: Port 5000 already in use"
   - Solution: Find and close the process using port 5000
   - Or change the port in server.js

For additional help, check the console output for specific error messages. 