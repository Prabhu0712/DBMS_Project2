# Recipe Management System

A full-stack web application for managing cooking recipes with a MySQL database backend.

## Project Structure
```
├── backend/           # Backend server (Node.js)
├── frontend/          # Frontend application
├── database.sql       # Database schema
└── setup_database.js  # Database initialization script
```

## Prerequisites
- Node.js (v14 or higher)
- MySQL Server (v8.0 or higher)
- Git

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <your-repository-url>
   cd <repository-name>
   ```

2. **Install MySQL**
   - Download and install MySQL from [MySQL website](https://dev.mysql.com/downloads/installer/)
   - During installation, set root password to: `prabhu0712`
   - Make sure MySQL service is running

3. **Setup Database**
   ```bash
   # Create and initialize the database
   node setup_database.js
   ```

4. **Install Dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

5. **Start the Application**
   ```bash
   # Start backend server (from project root)
   cd backend
   node server.js

   # In a new terminal, start frontend server
   cd frontend
   node serve.js
   ```

   Or use the provided batch file:
   ```bash
   # Windows
   .\start_all.bat
   ```

## Accessing the Application
- Frontend: http://localhost:8080
- Backend API: http://localhost:5000

## Database Configuration
The application uses the following database configuration:
- Database Name: `cooking_recipe_db`
- Username: `root`
- Password: `prabhu0712`
- Host: `localhost`

## Features
- Recipe management
- Ingredient tracking
- Category organization
- User authentication
- Recipe search and filtering

## API Endpoints
- GET /api/recipes - Get all recipes
- POST /api/recipes - Create new recipe
- GET /api/recipes/:id - Get specific recipe
- PUT /api/recipes/:id - Update recipe
- DELETE /api/recipes/:id - Delete recipe

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request 