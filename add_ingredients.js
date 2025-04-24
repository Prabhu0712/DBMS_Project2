const mysql = require('mysql2/promise');

const ingredients = [
    // Vegetables
    { name: 'Tomatoes', type: 'vegetable', amount: 1.0 },
    { name: 'Onions', type: 'vegetable', amount: 1.0 },
    { name: 'Garlic', type: 'vegetable', amount: 1.0 },
    { name: 'Bell Peppers', type: 'vegetable', amount: 1.0 },
    { name: 'Carrots', type: 'vegetable', amount: 1.0 },
    { name: 'Potatoes', type: 'vegetable', amount: 1.0 },
    { name: 'Spinach', type: 'vegetable', amount: 1.0 },
    { name: 'Green Peas', type: 'vegetable', amount: 1.0 },
    { name: 'Cauliflower', type: 'vegetable', amount: 1.0 },
    { name: 'Mushrooms', type: 'vegetable', amount: 1.0 },
    
    // Spices
    { name: 'Black Pepper', type: 'spice', amount: 0.1 },
    { name: 'Salt', type: 'spice', amount: 0.1 },
    { name: 'Cumin', type: 'spice', amount: 0.1 },
    { name: 'Turmeric', type: 'spice', amount: 0.1 },
    { name: 'Coriander', type: 'spice', amount: 0.1 },
    { name: 'Ginger', type: 'spice', amount: 0.1 },
    { name: 'Cardamom', type: 'spice', amount: 0.1 },
    { name: 'Cinnamon', type: 'spice', amount: 0.1 },
    
    // Grains & Legumes
    { name: 'Rice', type: 'grain', amount: 1.0 },
    { name: 'Pasta', type: 'grain', amount: 1.0 },
    { name: 'Flour', type: 'grain', amount: 1.0 },
    { name: 'Lentils', type: 'legume', amount: 1.0 },
    { name: 'Chickpeas', type: 'legume', amount: 1.0 },
    { name: 'Quinoa', type: 'grain', amount: 1.0 },
    
    // Dairy & Alternatives
    { name: 'Milk', type: 'dairy', amount: 1.0 },
    { name: 'Cheese', type: 'dairy', amount: 1.0 },
    { name: 'Butter', type: 'dairy', amount: 0.5 },
    { name: 'Cream', type: 'dairy', amount: 0.5 },
    { name: 'Yogurt', type: 'dairy', amount: 1.0 },
    { name: 'Paneer', type: 'dairy', amount: 1.0 },
    
    // Fruits
    { name: 'Lemon', type: 'fruit', amount: 1.0 },
    { name: 'Lime', type: 'fruit', amount: 1.0 },
    { name: 'Apple', type: 'fruit', amount: 1.0 },
    { name: 'Orange', type: 'fruit', amount: 1.0 },
    { name: 'Mango', type: 'fruit', amount: 1.0 },
    { name: 'Banana', type: 'fruit', amount: 1.0 }
];

async function addIngredients() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'prabhu0712',
        database: 'cooking_recipe_db'
    });

    try {
        console.log('Connected to database');
        
        // Clear existing ingredients
        await connection.query('DELETE FROM RecipeIngredients');
        await connection.query('DELETE FROM Ingredient');
        console.log('Cleared existing ingredients');

        // Add new ingredients
        for (const ingredient of ingredients) {
            await connection.query(
                'INSERT INTO Ingredient (ingredient_name, ingredient_type, ingredient_amount) VALUES (?, ?, ?)',
                [ingredient.name, ingredient.type, ingredient.amount]
            );
            console.log(`Added ingredient: ${ingredient.name}`);
        }

        console.log('All vegetarian ingredients added successfully!');
    } catch (error) {
        console.error('Error adding ingredients:', error);
    } finally {
        await connection.end();
        console.log('Database connection closed');
    }
}

// Run the script
addIngredients(); 