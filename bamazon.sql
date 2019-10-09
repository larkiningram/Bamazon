DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
	item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(30) NULL, 
    department_name VARCHAR(50) NULL,
    price INT NULL,
    stock_quantity INT NULL,
    product_sales INT DEFAULT 0, 
    PRIMARY KEY(item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("thing1", "place1", 1, 10), ("thing2", "place2", 2, 20), ("thing3", "place3", 3, 30), 
("thing4", "place4", 4, 40), ("thing5", "place5", 5, 50), ("thing6", "place6", 6, 60), 
("thing7", "place7", 7, 70), ("thing8", "place8", 8, 80), ("thing9", "place9", 9, 90);

SELECT * FROM products;

CREATE TABLE departments (
	dept_id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(50) NULL,
    over_head_costs INT NULL,
    PRIMARY KEY(dept_id)
);

INSERT INTO departments (department_name, over_head_costs)
VALUE ("place1", 10), ("place2", 20), ("place3", 30), 
("place4",40), ( "place5", 50), ("place6", 60), 
("place7", 70), ("place8", 80), ("place9",90);

SELECT * FROM departments;


