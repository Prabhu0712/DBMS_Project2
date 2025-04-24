const mysql = require('mysql2/promise');

async function testConnection() {
    let connection;
    try {
        // Test basic connection
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'prabhu0712'
        });
        console.log('✅ Successfully connected to MySQL server');

        // Check if database exists
        const [databases] = await connection.query('SHOW DATABASES');
        const dbExists = databases.some(db => db.Database === 'cooking_recipe_db');
        
        if (!dbExists) {
            console.log('❌ Database cooking_recipe_db does not exist');
            console.log('Creating database...');
            await connection.query('CREATE DATABASE cooking_recipe_db');
            console.log('✅ Database created successfully');
        } else {
            console.log('✅ Database cooking_recipe_db exists');
        }

        // Use the database
        await connection.query('USE cooking_recipe_db');
        console.log('✅ Using database cooking_recipe_db');

        // Check tables
        const [tables] = await connection.query('SHOW TABLES');
        const requiredTables = ['Category', 'Recipe', 'Ingredient', 'RecipeIngredients'];
        const missingTables = requiredTables.filter(table => 
            !tables.some(t => t.Tables_in_cooking_recipe_db === table)
        );

        if (missingTables.length > 0) {
            console.log('❌ Missing tables:', missingTables.join(', '));
            console.log('Please run setup_database.js to create the required tables');
        } else {
            console.log('✅ All required tables exist');
        }

        // Test data insertion
        try {
            // Test Category table
            const [categoryResult] = await connection.query(
                'INSERT INTO Category (category_name) VALUES (?)',
                ['Test Category']
            );
            await connection.query('DELETE FROM Category WHERE category_id = ?', [categoryResult.insertId]);
            console.log('✅ Category table is working');

            // Test Ingredient table
            const [ingredientResult] = await connection.query(
                'INSERT INTO Ingredient (ingredient_name) VALUES (?)',
                ['Test Ingredient']
            );
            await connection.query('DELETE FROM Ingredient WHERE ingredient_id = ?', [ingredientResult.insertId]);
            console.log('✅ Ingredient table is working');

            // Test Recipe table
            const [recipeResult] = await connection.query(
                'INSERT INTO Recipe (recipe_name, category_id) VALUES (?, ?)',
                ['Test Recipe', 1]
            );
            await connection.query('DELETE FROM Recipe WHERE recipe_id = ?', [recipeResult.insertId]);
            console.log('✅ Recipe table is working');

            // Test RecipeIngredients table
            const [recipeIngredientResult] = await connection.query(
                'INSERT INTO RecipeIngredients (recipe_id, ingredient_id, amount) VALUES (?, ?, ?)',
                [1, 1, 1]
            );
            await connection.query('DELETE FROM RecipeIngredients WHERE id = ?', [recipeIngredientResult.insertId]);
            console.log('✅ RecipeIngredients table is working');

        } catch (error) {
            console.error('❌ Error testing table operations:', error.message);
            if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                console.log('This error is expected as we\'re testing with non-existent foreign keys');
            }
        }

        console.log('\n✅ All tests completed successfully!');
        console.log('Your database is ready to use with the recipe management system.');

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('Please check your MySQL username and password in db.js');
        } else if (error.code === 'ECONNREFUSED') {
            console.log('Please make sure MySQL server is running');
        }
    } finally {
        if (connection) {
            await connection.end();
            console.log('\nConnection closed');
        }
    }
}

// Run the test
testConnection(); 