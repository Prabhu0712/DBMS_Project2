CREATE DATABASE IF NOT EXISTS cooking_recipe_db;

USE cooking_recipe_db;

-- Drop tables if they exist to avoid conflicts
DROP TABLE IF EXISTS RecipeIngredients;
DROP TABLE IF EXISTS Recipe;
DROP TABLE IF EXISTS Ingredient;
DROP TABLE IF EXISTS Category;
DROP TABLE IF EXISTS User;

CREATE TABLE Category (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    regional BOOLEAN DEFAULT FALSE,
    is_veg BOOLEAN DEFAULT FALSE
);

CREATE TABLE User (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    sign_in_account VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    user_type VARCHAR(50)
);

CREATE TABLE Ingredient (
    ingredient_id INT AUTO_INCREMENT PRIMARY KEY,
    ingredient_name VARCHAR(100),
    ingredient_type VARCHAR(100),
    ingredient_amount FLOAT,
    image VARCHAR(255)
);

CREATE TABLE Recipe (
    recipe_id INT AUTO_INCREMENT PRIMARY KEY,
    recipe_name VARCHAR(100) NOT NULL,
    description TEXT,
    recipe_type VARCHAR(100),
    quantity FLOAT,
    category_id INT,
    image VARCHAR(255),
    FOREIGN KEY (category_id) REFERENCES Category(category_id)
);

CREATE TABLE RecipeIngredients (
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

-- Insert vegetarian sample recipes
INSERT INTO Recipe (recipe_name, description, category_id) VALUES
('Vegetable Biryani', 'Fragrant rice dish with mixed vegetables and aromatic spices', 1),
('Margherita Pizza', 'Classic Italian pizza with tomato, mozzarella, and fresh basil', 2),
('Vegetable Stir Fry', 'Colorful mix of fresh vegetables with soy sauce and ginger', 3),
('Chocolate Cake', 'Rich and moist chocolate cake with chocolate frosting', 5),
('Greek Salad', 'Fresh salad with feta cheese, olives, cucumbers, and tomatoes', 13),
('Vegetable Pasta', 'Pasta with mixed vegetables in a creamy tomato sauce', 2),
('Vegetable Soup', 'Hearty soup with seasonal vegetables and herbs', 14),
('Fruit Smoothie', 'Refreshing blend of seasonal fruits and yogurt', 15);
