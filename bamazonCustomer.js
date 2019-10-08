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
    read();
});

function read() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        for (i in res) {
            console.log("---------------------------")
            console.log("PRODUCT ID:", res[i].item_id);
            console.log("PRODUCT NAME:", res[i].product_name);
            console.log("PRODUCT PRICE:", res[i].price);
        }
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
                chosen.stock_quantity--;
                updateItems(chosen);
            }
        }

        // read();

    })
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
      function(err, resp) {
        if (err) throw err;
        console.log(resp.affectedRows + " items updated!\n");
      }
    );

    // console.log(query.sql);
    // read();

}