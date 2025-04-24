# Delicious Recipe Manager

A full-stack web application for managing and sharing vegetarian recipes. Built with Node.js, Express, MySQL, and vanilla JavaScript.

## Features

- 🍽️ Recipe Management
  - Add, view, edit, and delete recipes
  - Categorize recipes (Indian, Italian, etc.)
  - Filter recipes by category and type
  - Detailed recipe view with ingredients

- 🥬 Ingredient Management
  - Add and manage ingredients
  - Track ingredient types and amounts
  - Link ingredients to recipes

- 🎨 Modern UI
  - Responsive design
  - Beautiful recipe cards
  - Intuitive forms
  - Category filtering

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v14 or higher)
   - Download from [nodejs.org](https://nodejs.org/)

2. **MySQL** (v8.0 or higher)
   - Download from [mysql.com](https://dev.mysql.com/downloads/installer/)
   - During installation:
     - Set root password as: `prabhu0712`
     - Or update the password in `backend/db.js` and `setup_database.js`

3. **Git** (for version control)
   - Download from [git-scm.com](https://git-scm.com/downloads)

## Project Structure

```
DBMS_Project2/
├── backend/              # Backend server code
│   ├── node_modules/     # Backend dependencies
│   ├── server.js         # Express server
│   └── db.js            # Database configuration
├── frontend/             # Frontend code
│   ├── node_modules/     # Frontend dependencies
│   ├── index.html        # Main HTML file
│   ├── script.js         # Frontend JavaScript
│   ├── style.css         # Custom styles
│   └── serve.js          # Frontend server
├── node_modules/         # Root dependencies
├── add_ingredients.js    # Script to add ingredients
├── add_recipes.js        # Script to add recipes
├── setup_database.js     # Database setup script
└── package.json          # Project configuration
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd DBMS_Project2
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Set up the database**
   ```bash
   # Run from project root
   node setup_database.js
   ```

4. **Add initial data**
   ```bash
   # Add ingredients
   node add_ingredients.js

   # Add recipes
   node add_recipes.js
   ```

## Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   node server.js
   ```
   - Server runs on http://localhost:5000

2. **Start the frontend server**
   ```bash
   cd frontend
   node serve.js
   ```
   - Frontend runs on http://localhost:8080

3. **Access the application**
   - Open http://localhost:8080 in your browser

## API Endpoints

- `GET /api/recipes` - Get all recipes
- `GET /api/recipes/:id` - Get a specific recipe
- `POST /api/recipes` - Add a new recipe
- `DELETE /api/recipes/:id` - Delete a recipe
- `GET /api/ingredients` - Get all ingredients
- `POST /api/ingredients` - Add a new ingredient
- `GET /api/categories` - Get all categories

## Dependencies

### Backend
- express
- mysql2
- cors
- body-parser

### Frontend
- Bootstrap 5
- Bootstrap Icons
- Google Fonts

## Troubleshooting

1. **Port already in use**
   - Kill existing Node.js processes:
     ```bash
     # On Windows
     Get-Process -Name node | Stop-Process -Force
     ```

2. **Database connection issues**
   - Verify MySQL is running
   - Check database credentials in `backend/db.js`
   - Run `node test_db_connection.js` to test connection

3. **CORS errors**
   - Ensure backend is running on port 5000
   - Ensure frontend is running on port 8080
   - Check CORS configuration in `backend/server.js`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 