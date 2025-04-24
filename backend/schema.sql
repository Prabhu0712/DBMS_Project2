-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS cooking_recipe_db;
USE cooking_recipe_db;

-- Create Category table
CREATE TABLE IF NOT EXISTS Category (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    regional BOOLEAN DEFAULT FALSE,
    is_veg BOOLEAN DEFAULT FALSE
);

-- Create Recipe table
CREATE TABLE IF NOT EXISTS Recipe (
    recipe_id INT AUTO_INCREMENT PRIMARY KEY,
    recipe_name VARCHAR(100) NOT NULL,
    description TEXT,
    recipe_type VARCHAR(100),
    quantity FLOAT,
    category_id INT,
    image VARCHAR(255),
    FOREIGN KEY (category_id) REFERENCES Category(category_id)
);

-- Create Ingredient table
CREATE TABLE IF NOT EXISTS Ingredient (
    ingredient_id INT AUTO_INCREMENT PRIMARY KEY,
    ingredient_name VARCHAR(100),
    ingredient_type VARCHAR(100),
    ingredient_amount FLOAT,
    image VARCHAR(255)
);

-- Create RecipeIngredients table
CREATE TABLE IF NOT EXISTS RecipeIngredients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipe_id INT,
    ingredient_id INT,
    amount FLOAT,
    FOREIGN KEY (recipe_id) REFERENCES Recipe(recipe_id),
    FOREIGN KEY (ingredient_id) REFERENCES Ingredient(ingredient_id)
);

-- Insert initial categories
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
('Beverages', false, true); 