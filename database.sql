-- Create a new database
CREATE DATABASE foodshare;

-- Use the newly created database
USE foodshare;

-- Create users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('restaurant', 'ngo') NOT NULL
);

-- Create food_posts table
CREATE TABLE food_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT NOT NULL,
    food_title VARCHAR(100) NOT NULL,
    meal_quantity INT NOT NULL,
    sufficient_for INT NOT NULL,
    expiry DATETIME NOT NULL,
    status ENUM('active', 'expired', 'accepted') NOT NULL,
    contact_details VARCHAR(255),
    FOREIGN KEY (restaurant_id) REFERENCES users(id)
);
