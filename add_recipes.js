const mysql = require('mysql2/promise');

const recipes = [
    {
        name: 'Vegetable Biryani',
        description: 'A flavorful Indian rice dish with mixed vegetables and aromatic spices',
        category_id: 1, // Indian Cuisine
        ingredients: [
            { name: 'Rice', amount: 2.0 },
            { name: 'Onions', amount: 2.0 },
            { name: 'Garlic', amount: 0.5 },
            { name: 'Ginger', amount: 0.2 },
            { name: 'Carrots', amount: 1.0 },
            { name: 'Green Peas', amount: 1.0 },
            { name: 'Turmeric', amount: 0.1 },
            { name: 'Cumin', amount: 0.1 },
            { name: 'Coriander', amount: 0.2 }
        ]
    },
    {
        name: 'Pasta Primavera',
        description: 'Italian pasta with fresh vegetables in a creamy sauce',
        category_id: 2, // Italian Cuisine
        ingredients: [
            { name: 'Pasta', amount: 2.0 },
            { name: 'Bell Peppers', amount: 1.0 },
            { name: 'Tomatoes', amount: 2.0 },
            { name: 'Garlic', amount: 0.3 },
            { name: 'Cream', amount: 1.0 },
            { name: 'Cheese', amount: 0.5 },
            { name: 'Black Pepper', amount: 0.1 }
        ]
    },
    {
        name: 'Masala Dosa',
        description: 'South Indian crepe made from rice and lentils, served with spiced potato filling',
        category_id: 1, // Indian Cuisine
        ingredients: [
            { name: 'Rice', amount: 2.0 },
            { name: 'Lentils', amount: 1.0 },
            { name: 'Potatoes', amount: 2.0 },
            { name: 'Onions', amount: 1.0 },
            { name: 'Turmeric', amount: 0.1 },
            { name: 'Cumin', amount: 0.1 },
            { name: 'Coriander', amount: 0.2 }
        ]
    }
];

async function addRecipes() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'prabhu0712',
        database: 'cooking_recipe_db'
    });

    try {
        console.log('Connected to database');
        
        // Clear existing recipes
        await connection.query('DELETE FROM RecipeIngredients');
        await connection.query('DELETE FROM Recipe');
        console.log('Cleared existing recipes');

        for (const recipe of recipes) {
            // Insert recipe
            const [recipeResult] = await connection.query(
                'INSERT INTO Recipe (recipe_name, description, category_id) VALUES (?, ?, ?)',
                [recipe.name, recipe.description, recipe.category_id]
            );
            const recipeId = recipeResult.insertId;
            console.log(`Added recipe: ${recipe.name}`);

            // Get ingredient IDs and insert recipe ingredients
            for (const ingredient of recipe.ingredients) {
                const [rows] = await connection.query(
                    'SELECT ingredient_id FROM Ingredient WHERE ingredient_name = ?',
                    [ingredient.name]
                );
                
                if (rows.length > 0) {
                    await connection.query(
                        'INSERT INTO RecipeIngredients (recipe_id, ingredient_id, amount) VALUES (?, ?, ?)',
                        [recipeId, rows[0].ingredient_id, ingredient.amount]
                    );
                    console.log(`Added ingredient ${ingredient.name} to recipe ${recipe.name}`);
                }
            }
        }

        console.log('All recipes added successfully!');
    } catch (error) {
        console.error('Error adding recipes:', error);
    } finally {
        await connection.end();
        console.log('Database connection closed');
    }
}

// Run the script
addRecipes(); 