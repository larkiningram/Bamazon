// updated portfolio https://larkiningram.github.io/Portfolio/portfolio.html

var mysql = require("mysql");
var inquirer = require("inquirer");

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
    read();
});

function read() {
    function Table (item_id, product_name, price) {
        // this.dept_id = dept_id;
        this.item_id = item_id;
        this.product_name = product_name;
        this.price = price;
    };
    var stuff = {};

    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        for (i in res) {
            var prod = new Table(res[i].item_id, res[i].product_name, res[i].price);
            stuff[i] = prod;
        }
        console.table(stuff);
        questions(res)
    });
};

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

        for (i in res) {
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
                else {
                    console.log("Insufficient quantity, there are only", chosen.stock_quantity, " of those");
                    another();
                }
            }
        }

        // read();

    })
};

function updateSales(chosen, cost) {
    console.log("Updating your stock quantities...\n");
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

function updateItems(chosen) {
    console.log("Updating your stock quantities...\n");
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
    another()
};

function another() {
    inquirer.prompt([
        {
            type: "list",
            message: "Do you want to make another purchase?",
            choices: ["yes", "no"],
            name: "continue"
        }
    ]).then(function (res) {
        if (res.continue === "yes") {
            read();
        }
        else {
            connection.end();
        }
    })

};
