const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'prabhu0712',
    database: 'cooking_recipe_db'
};

async function addCategories() {
    const connection = await mysql.createConnection(dbConfig);
    
    try {
        const categories = [
            { name: 'Breakfast', regional: false, is_veg: true },
            { name: 'Lunch', regional: false, is_veg: false },
            { name: 'Dinner', regional: false, is_veg: false },
            { name: 'Dessert', regional: false, is_veg: true },
            { name: 'Snacks', regional: false, is_veg: true },
            { name: 'Indian', regional: true, is_veg: false },
            { name: 'Italian', regional: true, is_veg: false },
            { name: 'Chinese', regional: true, is_veg: false },
            { name: 'Mexican', regional: true, is_veg: false }
        ];

        for (const category of categories) {
            await connection.query(
                'INSERT INTO Category (category_name, regional, is_veg) VALUES (?, ?, ?)',
                [category.name, category.regional, category.is_veg]
            );
            console.log(`Added category: ${category.name}`);
        }

        console.log('All categories added successfully!');
    } catch (error) {
        console.error('Error adding categories:', error);
    } finally {
        await connection.end();
    }
}

addCategories(); 