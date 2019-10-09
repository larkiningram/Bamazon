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
            choices: ["View Product Sales by Department", "Create New Department", "Exit"],
            name: "menu"
        }
    ]).then(function (res) {
        if (res.menu === "View Product Sales by Department") {
            viewSales();
        }
        else if (res.menu === "Create New Department") {
            createDept();
        }
        else if (res.menu === "Exit") {
            connection.end();
        }
    })
};

function viewSales() {
    var sql = "SELECT departments.dept_id, departments.department_name, departments.over_head_costs, products.product_sales FROM departments JOIN products ON departments.department_name=products.department_name"

    connection.query(sql, function (err, res) {
        if (err) throw err;
        console.log("department id  ||  department name  ||  overhead costs  ||  product sales  ||  total profit")
        for (i in res) {
            var profit = parseFloat(res[i].product_sales) - parseFloat(res[i].over_head_costs)
            console.log(res[i].dept_id, " || ", res[i].department_name, " || ", res[i].over_head_costs, " || ", res[i].product_sales, " || ", profit)
        };
        menu()
    });
}