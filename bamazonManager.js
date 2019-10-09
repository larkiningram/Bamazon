var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Cookie9!",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    menu();
});

function menu() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
            name: "menu"
        }
    ]).then(function (res) {
        if (res.menu === "View Products for Sale") {
            viewProducts();
        }
        else if (res.menu === "View Low Inventory") {
            lowInventory();
        }
        else if (res.menu === "Add to Inventory") {
            addInventory();
        }
        else if (res.menu === "Add New Product") {
            addProduct();
        }
    })
};

function viewProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        for (i in res) {
            console.log("---------------------------")
            console.log("PRODUCT ID:", res[i].item_id);
            console.log("PRODUCT NAME:", res[i].product_name);
            console.log("PRODUCT PRICE:", res[i].price);
            console.log("QUANTITY AVAILABLE", res[i].stock_quantity);
        }
        menu()
    });
};

function lowInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        for (i in res) {
            if (parseInt(res[i].stock_quantity) < 5) {
                console.log("---------------------------")
                console.log("PRODUCT ID:", res[i].item_id);
                console.log("PRODUCT NAME:", res[i].product_name);
                console.log("QUANTITY AVAILABLE", res[i].stock_quantity);
            }
        }
        menu()
    });
};

function addProduct() {

    inquirer.prompt([
        {
            messsage: "What would you like to add to the inventory?",
            name: "item"
        },
        {
            messsage: "What department does it belong in?",
            name: "department"
        },
        {
            messsage: "What is the price for each unit of this product?",
            name: "price"
        },
        {
            messsage: "How many of these items would you like to add?",
            name: "stock"
        }
    ]).then(function (add) {

        connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUE (?, ?, ?, ?)",
            [
                {
                    product_name: add.item
                },
                {
                    department_name: add.department
                },
                {
                    price: parseFloat(add.price)
                },
                {
                    stock_quantity: parseFloat(add.stock)
                }
            ],
            function (err, resp) {
                if (err) throw err;
                console.log(resp.affectedRows + " items updated!\n");
            });

    });
    menu();

};

function addInventory() {

    inquirer.prompt([
        {
            messsage: "Which product would you like to restock?",
            name: "item"
        },
        {
            messsage: "What would you like the new stock quantity to be?",
            name: "stock"
        }
    ]).then(function (add) {
        var query = connection.query(
            "UPDATE products SET ? WHERE ?",
            [
                {
                    stock_quantity: parseFloat(add.stock)
                },
                {
                    product_name: (add.item)
                }
            ],
            function (err, resp) {
                if (err) throw err;
                console.log(resp.affectedRows + " items updated!\n");
            }
        );
        console.log(query.sql);

    });

    menu();

};
