const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:8080'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Test database connection
async function testDatabaseConnection() {
    try {
        const [rows] = await db.query('SELECT 1');
        console.log('Database connection test successful');
        return true;
    } catch (error) {
        console.error('Database connection test failed:', error);
        return false;
    }
}

// Test endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Backend server is running!' });
});

// Get all categories
app.get('/api/categories', async (req, res) => {
    try {
        console.log('Fetching categories...');
        const [results] = await db.query('SELECT * FROM Category ORDER BY category_name');
        console.log(`Found ${results.length} categories`);
        res.json(results);
    } catch (error) {
        console.error('Error in /api/categories:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            details: error.message 
        });
    }
});

// Get all recipes
app.get('/api/recipes', async (req, res) => {
    try {
        console.log('Fetching recipes...');
        const [results] = await db.query(`
            SELECT r.*, c.category_name, c.regional, c.is_veg 
            FROM Recipe r 
            LEFT JOIN Category c ON r.category_id = c.category_id 
            ORDER BY r.recipe_name
        `);
        console.log(`Found ${results.length} recipes`);
        res.json(results);
    } catch (error) {
        console.error('Error in /api/recipes:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            details: error.message 
        });
    }
});

// Get single recipe
app.get('/api/recipes/:id', async (req, res) => {
    try {
        const recipeId = req.params.id;
        const [results] = await db.query(`
            SELECT r.*, c.category_name, c.regional, c.is_veg 
            FROM Recipe r 
            LEFT JOIN Category c ON r.category_id = c.category_id 
            WHERE r.recipe_id = ?
        `, [recipeId]);
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Recipe not found' });
        }
        
        res.json(results[0]);
    } catch (error) {
        console.error('Error in GET /api/recipes/:id:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add a new recipe with ingredients
app.post('/api/recipes', async (req, res) => {
    try {
        console.log('Received recipe data:', req.body);
        const { recipe_name, description, category_id, ingredients } = req.body;

        if (!recipe_name || !category_id) {
            console.log('Missing required fields:', { recipe_name, category_id });
            return res.status(400).json({ error: 'Recipe name and category are required' });
        }

        if (!ingredients || ingredients.length === 0) {
            console.log('No ingredients provided');
            return res.status(400).json({ error: 'At least one ingredient is required' });
        }

        // Start a transaction
        await db.query('START TRANSACTION');

        try {
            // First, check if the category exists
            const [category] = await db.query(
                'SELECT * FROM Category WHERE category_id = ?',
                [category_id]
            );

            if (!category.length) {
                console.log('Category not found:', category_id);
                throw new Error('Category not found');
            }

            // Insert the recipe
            console.log('Inserting recipe:', { recipe_name, description, category_id });
            const [result] = await db.query(
                'INSERT INTO Recipe (recipe_name, description, category_id) VALUES (?, ?, ?)',
                [recipe_name, description, category_id]
            );

            const recipeId = result.insertId;
            console.log('Recipe inserted with ID:', recipeId);

            // Insert ingredients
            console.log('Processing ingredients:', ingredients);
            for (const ingredient of ingredients) {
                // Check if ingredient exists
                const [existingIngredient] = await db.query(
                    'SELECT * FROM Ingredient WHERE ingredient_id = ?',
                    [ingredient.ingredient_id]
                );

                if (!existingIngredient.length) {
                    console.log('Ingredient not found:', ingredient.ingredient_id);
                    throw new Error(`Ingredient with ID ${ingredient.ingredient_id} not found`);
                }

                // Insert recipe ingredient
                console.log('Inserting recipe ingredient:', { recipeId, ingredient });
                await db.query(
                    'INSERT INTO RecipeIngredients (recipe_id, ingredient_id, amount) VALUES (?, ?, ?)',
                    [recipeId, ingredient.ingredient_id, ingredient.amount]
                );
            }

            // Commit the transaction
            await db.query('COMMIT');
            console.log('Transaction committed successfully');

            // Get the complete recipe with ingredients
            const [recipe] = await db.query(`
                SELECT r.*, c.category_name, c.regional, c.is_veg 
                FROM Recipe r 
                LEFT JOIN Category c ON r.category_id = c.category_id 
                WHERE r.recipe_id = ?
            `, [recipeId]);

            const [recipeIngredients] = await db.query(`
                SELECT i.*, ri.amount 
                FROM Ingredient i
                JOIN RecipeIngredients ri ON i.ingredient_id = ri.ingredient_id
                WHERE ri.recipe_id = ?
            `, [recipeId]);

            console.log('Recipe created successfully:', { recipe: recipe[0], ingredients: recipeIngredients });
            res.status(201).json({
                ...recipe[0],
                ingredients: recipeIngredients
            });
        } catch (error) {
            // Rollback the transaction if there's an error
            console.error('Error in transaction, rolling back:', error);
            await db.query('ROLLBACK');
            throw error;
        }
    } catch (error) {
        console.error('Error in POST /api/recipes:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            details: error.message 
        });
    }
});

// Delete a recipe
app.delete('/api/recipes/:id', async (req, res) => {
    try {
        const recipeId = req.params.id;
        const [result] = await db.query('DELETE FROM Recipe WHERE recipe_id = ?', [recipeId]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        res.json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        console.error('Error in DELETE /api/recipes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all ingredients
app.get('/api/ingredients', async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM Ingredient ORDER BY ingredient_name');
        res.json(results);
    } catch (error) {
        console.error('Error in /api/ingredients:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add a new ingredient
app.post('/api/ingredients', async (req, res) => {
    try {
        const { ingredient_name, ingredient_type, ingredient_amount } = req.body;

        if (!ingredient_name) {
            return res.status(400).json({ error: 'Ingredient name is required' });
        }

        const [result] = await db.query(
            'INSERT INTO Ingredient (ingredient_name, ingredient_type, ingredient_amount) VALUES (?, ?, ?)',
            [ingredient_name, ingredient_type, ingredient_amount]
        );

        res.status(201).json({
            id: result.insertId,
            ingredient_name,
            ingredient_type,
            ingredient_amount
        });
    } catch (error) {
        console.error('Error in POST /api/ingredients:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get ingredients for a specific recipe
app.get('/api/recipes/:id/ingredients', async (req, res) => {
    try {
        const recipeId = req.params.id;
        const [results] = await db.query(`
            SELECT i.*, ri.amount 
            FROM Ingredient i
            JOIN RecipeIngredients ri ON i.ingredient_id = ri.ingredient_id
            WHERE ri.recipe_id = ?
        `, [recipeId]);
        
        res.json(results);
    } catch (error) {
        console.error('Error in GET /api/recipes/:id/ingredients:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add ingredients to a recipe
app.post('/api/recipes/:id/ingredients', async (req, res) => {
    try {
        const recipeId = req.params.id;
        const { ingredient_id, amount } = req.body;

        if (!ingredient_id || !amount) {
            return res.status(400).json({ error: 'Ingredient ID and amount are required' });
        }

        // Check if recipe exists
        const [recipe] = await db.query('SELECT * FROM Recipe WHERE recipe_id = ?', [recipeId]);
        if (!recipe.length) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        // Check if ingredient exists
        const [ingredient] = await db.query('SELECT * FROM Ingredient WHERE ingredient_id = ?', [ingredient_id]);
        if (!ingredient.length) {
            return res.status(404).json({ error: 'Ingredient not found' });
        }

        // Insert the recipe ingredient
        const [result] = await db.query(
            'INSERT INTO RecipeIngredients (recipe_id, ingredient_id, amount) VALUES (?, ?, ?)',
            [recipeId, ingredient_id, amount]
        );

        res.status(201).json({
            id: result.insertId,
            recipe_id: recipeId,
            ingredient_id,
            amount
        });
    } catch (error) {
        console.error('Error in POST /api/recipes/:id/ingredients:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            details: error.message 
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ 
        error: 'Something broke!',
        details: err.message 
    });
});

const PORT = process.env.PORT || 5000;

// Start server after testing database connection
async function startServer() {
    const dbConnected = await testDatabaseConnection();
    if (!dbConnected) {
        console.error('Failed to connect to database. Server will not start.');
        process.exit(1);
    }

    app.listen(PORT, () => {
        console.log(`Backend server running on http://localhost:${PORT}`);
        console.log('CORS enabled for http://localhost:8080');
    });
}

startServer();
