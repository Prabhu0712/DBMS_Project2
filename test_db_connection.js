const mysql = require('mysql2/promise');

async function testConnection() {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'prabhu0712'
        });

        console.log('Successfully connected to MySQL server');
        
        // Check if database exists
        const [rows] = await connection.query('SHOW DATABASES');
        console.log('Available databases:', rows.map(row => row.Database));
        
        // Try to use the database
        await connection.query('USE cooking_recipe_db');
        console.log('Successfully using cooking_recipe_db');
        
        // Check tables
        const [tables] = await connection.query('SHOW TABLES');
        console.log('Available tables:', tables);
        
    } catch (error) {
        console.error('Error:', error);
        if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('Please check your MySQL username and password');
        } else if (error.code === 'ECONNREFUSED') {
            console.log('Please make sure MySQL server is running');
        }
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

testConnection(); 