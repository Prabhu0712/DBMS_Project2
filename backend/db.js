const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'prabhu0712',
    database: 'cooking_recipe_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true // Allow multiple statements
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Test the connection
async function testConnection() {
    let connection;
    try {
        // First try without database
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'prabhu0712'
        });

        // Create database if not exists
        await connection.query('CREATE DATABASE IF NOT EXISTS cooking_recipe_db');
        await connection.query('USE cooking_recipe_db');

        console.log('Successfully connected to MySQL database');
        return true;
    } catch (error) {
        console.error('Error connecting to MySQL database:', error);
        if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('Please check your MySQL username and password');
        } else if (error.code === 'ECONNREFUSED') {
            console.log('Please make sure MySQL server is running');
        }
        return false;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Export the pool and test function
module.exports = {
    pool,
    query: async (sql, params) => {
        try {
            const [results] = await pool.query(sql, params);
            return [results];
        } catch (error) {
            console.error('Database query error:', error);
            throw error;
        }
    },
    testConnection
};
