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
            // console.log("\n")
            createDept();
            console.log("\n")

        }
        else if (res.menu === "Exit") {
            connection.end();
        }
    })
};

function viewSales() {
    var sql = "SELECT departments.dept_id, departments.department_name, departments.over_head_costs, products.product_sales FROM departments JOIN products ON departments.department_name=products.department_name"
    function Table(department_name, over_head_costs, product_sales, total_profit) {
        // this.dept_id = dept_id;
        this.department_name = department_name;
        this.over_head_costs = over_head_costs;
        this.product_sales = product_sales;
        this.total_profit = total_profit;
    }
    var stuff = {};
    connection.query(sql, function (err, res) {
        if (err) throw err;
        for (i in res) {
            var profit = parseFloat(res[i].product_sales) - parseFloat(res[i].over_head_costs)
            var dept = new Table(res[i].department_name, res[i].over_head_costs, res[i].product_sales, profit);
            // console.log(dept);
            stuff[parseInt(i) + 1] = dept;
        };
        console.table(stuff)
        menu()
    });
};

function createDept() {
    inquirer.prompt([
        {
            messsage: "What department would you like to add?",
            name: "name"
        },
        {
            messsage: "What is the over head cost of this department?",
            name: "cost"
        }
    ]).then(function (add) {
        connection.query("INSERT INTO departments (department_name, over_head_costs) VALUES ('" + add.name + "','" + add.cost + "')", function (err, resp) {
            if (err) throw err;
            console.log(resp.affectedRows + " items updated!\n");
            menu();
        });
    });
};
