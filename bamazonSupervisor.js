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
    menu();
});

// function which displays a menu with commands for the user to choose from
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

// function which allows user to view a table with the sales records for each department
function viewSales() {
    // reads data from two tables (products and departments) and then joins them if their department names are the same
    var sql = "SELECT departments.dept_id, departments.department_name, departments.over_head_costs, products.product_sales FROM departments JOIN products ON departments.department_name=products.department_name"
    
    // create constructor for table
    function Table(department_name, over_head_costs, product_sales, total_profit) {
        this.department_name = department_name;
        this.over_head_costs = over_head_costs;
        this.product_sales = product_sales;
        this.total_profit = total_profit;
    };
    var stuff = {};
    connection.query(sql, function (err, res) {
        if (err) throw err;
        
        // populates empty object stuff with product objects  
        for (i in res) {
            // calculates profit for each department based on the product sales and overhead cost
            var profit = parseFloat(res[i].product_sales) - parseFloat(res[i].over_head_costs)
            var dept = new Table(res[i].department_name, res[i].over_head_costs, res[i].product_sales, profit);
            stuff[parseInt(i) + 1] = dept;
        };
        console.table(stuff)
        menu()
    });
};

// function which allows the user to create a new department and add it to the SQL database
function createDept() {
    inquirer.prompt([
        {   
            type:"input",
            name: "asdf",
            message: "What department would you like to add?"
        },
        {
            message: "What is the over head cost of this department?",
            name: "cost",
            type:"input"
        }
    ]).then(function (add) {
        // adds rows into departments table based on user input 
        connection.query("INSERT INTO departments (department_name, over_head_costs) VALUES ('" + add.name + "','" + add.cost + "')", function (err, resp) {
            if (err) throw err;
            console.log(resp.affectedRows + " items updated!\n");
            menu();
        });
    });
};
