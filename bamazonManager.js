var mysql = require("mysql");
var inquirer = require("inquirer");
var low = 0;
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "dbpassword!",
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
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "EXIT"],
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
        else if (res.menu === "EXIT") {
            connection.end();
        }
    })
};

function viewProducts() {
    function Table (product_name, price, stock_quantity) {
        // this.dept_id = dept_id;
        // this.item_id = item_id;
        this.product_name = product_name;
        this.price = price;
        this.stock_quantity = stock_quantity;

    };
    var stuff = {};
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        for (i in res) {
            var prod = new Table(res[i].product_name, res[i].price, res[i].stock_quantity);
            stuff[parseInt(i) + 1] = prod;
            // console.log("---------------------------")
            // console.log("PRODUCT ID:", res[i].item_id);
            // console.log("PRODUCT NAME:", res[i].product_name);
            // console.log("PRODUCT PRICE:", res[i].price);
            // console.log("QUANTITY AVAILABLE", res[i].stock_quantity);
        }
        console.table(stuff)
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
                low++;
            }
        }
        if (low === 0) {
            console.log("Nothing has low inventory");
        }
        menu()
    });
};

function addInventory() {
    // console.log()
    inquirer.prompt([
        {
            message: "Which product would you like to restock?",
            name: "item", 
            // type: "rawlist",

        },
        {
            message: "What would you like the new stock quantity to be?",
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
                menu();
            }
        );
        console.log(query.sql);

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

        connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUE ('" + add.item + "','" + add.department + "'," + parseFloat(add.price) + "," + parseFloat(add.stock) + ")",
            function (err, resp) {
                if (err) throw err;
                console.log(resp.affectedRows + " items updated!\n");
                menu();
            });

    });


};