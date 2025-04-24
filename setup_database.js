const mysql = require('mysql2/promise');

async function setupDatabase() {
    let connection;
    try {
        // Create connection without database
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'prabhu0712'
        });

        console.log('Connected to MySQL server');

        // Create database if not exists
        await connection.query('CREATE DATABASE IF NOT EXISTS cooking_recipe_db');
        console.log('Database created or already exists');

        // Use the database
        await connection.query('USE cooking_recipe_db');
        console.log('Using database cooking_recipe_db');

        // Create Category table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS Category (
                category_id INT AUTO_INCREMENT PRIMARY KEY,
                category_name VARCHAR(100) NOT NULL,
                regional BOOLEAN DEFAULT FALSE,
                is_veg BOOLEAN DEFAULT FALSE
            )
        `);
        console.log('Category table created');

        // Create Recipe table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS Recipe (
                recipe_id INT AUTO_INCREMENT PRIMARY KEY,
                recipe_name VARCHAR(100) NOT NULL,
                description TEXT,
                recipe_type VARCHAR(100),
                quantity FLOAT,
                category_id INT,
                image VARCHAR(255),
                FOREIGN KEY (category_id) REFERENCES Category(category_id)
            )
        `);
        console.log('Recipe table created');

        // Create Ingredient table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS Ingredient (
                ingredient_id INT AUTO_INCREMENT PRIMARY KEY,
                ingredient_name VARCHAR(100) NOT NULL,
                ingredient_type VARCHAR(100),
                ingredient_amount FLOAT,
                image VARCHAR(255)
            )
        `);
        console.log('Ingredient table created');

        // Create RecipeIngredients table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS RecipeIngredients (
                id INT AUTO_INCREMENT PRIMARY KEY,
                recipe_id INT,
                ingredient_id INT,
                amount FLOAT,
                FOREIGN KEY (recipe_id) REFERENCES Recipe(recipe_id),
                FOREIGN KEY (ingredient_id) REFERENCES Ingredient(ingredient_id)
            )
        `);
        console.log('RecipeIngredients table created');

        // Check if categories exist
        const [existingCategories] = await connection.query('SELECT COUNT(*) as count FROM Category');
        if (existingCategories[0].count === 0) {
            // Insert initial categories
            await connection.query(`
                INSERT INTO Category (category_name, regional, is_veg) VALUES
                ('Indian Cuisine', true, true),
                ('Italian Cuisine', true, true),
                ('Chinese Cuisine', true, true),
                ('Mexican Cuisine', true, true),
                ('Desserts', false, true),
                ('Vegetarian', false, true),
                ('Vegan', false, true),
                ('Breakfast', false, true),
                ('Lunch', false, true),
                ('Dinner', false, true),
                ('Appetizers', false, true),
                ('Main Course', false, true),
                ('Salads', false, true),
                ('Soups', false, true),
                ('Beverages', false, true)
            `);
            console.log('Initial categories inserted');
        }

        // Check if sample recipes exist
        const [existingRecipes] = await connection.query('SELECT COUNT(*) as count FROM Recipe');
        if (existingRecipes[0].count === 0) {
            // Insert sample recipes
            await connection.query(`
                INSERT INTO Recipe (recipe_name, description, category_id) VALUES
                ('Vegetable Biryani', 'A fragrant rice dish with mixed vegetables and aromatic spices', 1),
                ('Margherita Pizza', 'Classic Italian pizza with tomato, mozzarella, and fresh basil', 2),
                ('Vegetable Stir Fry', 'Colorful mix of fresh vegetables with soy sauce and ginger', 3),
                ('Vegetable Tacos', 'Mexican style tacos with fresh vegetables and salsa', 4),
                ('Chocolate Cake', 'Rich and moist chocolate cake with chocolate frosting', 5)
            `);
            console.log('Sample recipes inserted');
        }

        console.log('Database setup completed successfully!');
    } catch (error) {
        console.error('Error setting up database:', error);
        if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('Please check your MySQL username and password');
        } else if (error.code === 'ECONNREFUSED') {
            console.log('Please make sure MySQL server is running');
        }
    } finally {
        if (connection) {
            await connection.end();
            console.log('Database connection closed');
        }
    }
}

// Run the setup
setupDatabase(); 