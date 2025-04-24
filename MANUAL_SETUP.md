# Manual Setup Guide

If the automatic setup doesn't work, follow these steps:

## 1. Install MySQL
1. Download MySQL from: https://dev.mysql.com/downloads/mysql/
2. During installation:
   - Choose "Developer Default" installation type
   - Set root password as: prabhu0712
   - Complete the installation

## 2. Create Database
1. Open MySQL Command Line Client
2. Enter your password when prompted
3. Run these commands:
```sql
CREATE DATABASE cooking_recipe_db;
USE cooking_recipe_db;
source C:/path/to/your/database.sql;
```

## 3. Setup Backend
1. Open Command Prompt
2. Navigate to the backend folder:
```bash
cd backend
```
3. Install dependencies:
```bash
npm install
```
4. Start the server:
```bash
npm start
```

## 4. Run Frontend
1. Open frontend/index.html in your web browser
2. The application should now be running

## Troubleshooting
1. If MySQL commands don't work:
   - Add MySQL to your system PATH
   - Or use the full path to mysql.exe

2. If backend fails to start:
   - Make sure Node.js is installed
   - Check if port 5000 is available

3. If frontend doesn't connect:
   - Make sure backend is running
   - Check browser console for errors 