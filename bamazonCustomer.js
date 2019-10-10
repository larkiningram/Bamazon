// updated portfolio https://larkiningram.github.io/Portfolio/portfolio.html

var mysql = require("mysql");
var inquirer = require("inquirer");

// create variable with necessary information to conncect to server
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

// open connection with server
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    read();
});

// function which creates a table of products in the database and displays it in the console
function read() {
    
    // create constructor for table
    function Table(item_id, product_name, price) {
        // this.dept_id = dept_id;
        this.item_id = item_id;
        this.product_name = product_name;
        this.price = price;
    };
    var stuff = {};
    
    // reads data from database table called products
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        // populates empty object stuff with product objects  
        for (i in res) {
            var prod = new Table(res[i].item_id, res[i].product_name, res[i].price);
            stuff[i] = prod;
        }
        console.table(stuff);
        questions(res)
    });
};

// function which prompts user with questions -- called within read()
function questions(res) {
    inquirer.prompt([
        {
            message: "What is the ID of the product you'd like to buy?",
            name: "productID"
        },
        {
            message: "How many units would you like to buy?",
            name: "units"
        }
    ]).then(function (ans) {

        // goes through data collected in read() and checks if they match the user's input
        for (i in res) {
            // if they do, and the requested number of units is within the stock quantity, the database is updated
            if (ans.productID == res[i].item_id) {
                console.log("You've chosen", res[i].product_name);
                var chosen = res[i];
                if (chosen.stock_quantity > ans.units) {
                    chosen.stock_quantity = chosen.stock_quantity - ans.units;
                    var cost = parseInt(ans.units) * parseInt(chosen.price);
                    console.log("Total cost:", cost)
                    updateSales(chosen, cost);
                    updateItems(chosen);
                }
                // if the requested number of units is not within the stock quantity, the database is not updated
                else {
                    console.log("Insufficient quantity, there are only", chosen.stock_quantity, " of those");
                    // asks if the user wants to make another purchase
                    another();
                }
            }
        }
    })
};

// function which updates the product sales for each item when a user makes a purchase
function updateSales(chosen, cost) {
    console.log("Updating your stock quantities...\n");
    // updates values within the database based on the user inputs
    var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                product_sales: (parseFloat(cost) + parseFloat(chosen.product_sales))
            },
            {
                item_id: parseFloat(chosen.item_id)
            }
        ],
        function (err, resp) {
            if (err) throw err;
            console.log(resp.affectedRows + " items updated!\n");
        }
    );
    console.log(query.sql);
};

// function which updates the stock quantity for each item when a user makes a purchase
function updateItems(chosen) {
    console.log("Updating your stock quantities...\n");
    // updates values within the database based on the user inputs
    var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: parseFloat(chosen.stock_quantity)
            },
            {
                item_id: parseFloat(chosen.item_id)
            }
        ],
        function (err, resp) {
            if (err) throw err;
            console.log(resp.affectedRows + " items updated!\n");
        }
    );
    console.log(query.sql);
    // asks if the user wants to make another purchase
    another()
};


// function asking the user if they want to make another purchase
function another() {
    inquirer.prompt([
        {
            type: "list",
            message: "Do you want to make another purchase?",
            choices: ["yes", "no"],
            name: "continue"
        }
    ]).then(function (res) {
        // runs whole program again if user selects yes
        if (res.continue === "yes") {
            read();
        }
        // ends server connection if user selects no
        else {
            connection.end();
        }
    })

};
