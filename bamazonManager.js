// dependency for mysql npm package
var mysql = require("mysql");

// dependency for console.table npm package
var tbl = require("console.table");

// dependency for inquirer npm package
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon_db"
});

connection.connect(function(err) {
  if (err) throw err;
  //console.log("connected as id " + connection.threadId);
  
});


var menuSelections = ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"];
var option;

function menu() {
inquirer.prompt([
      {
      name: "menuItems",
      message: "Please make selection",
      type: "rawlist",
      choices: menuSelections
      }
    ]).then(function(selection) {
      option = selection.menuItems;
      console.log(option);
      manageStore(option);
    });
};

menu();

function manageStore(action) {
  switch(action) {
    case "View Products for Sale":
        runBamazon();
        break;
    case "View Low Inventory":
        lowInventory();
        break;
    case "Add to Inventory":
        inventoryToAdd();
        break;
    case "Add New Product":
        newProductToAdd();
  };
};

var maxId;

function runBamazon() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
      console.table(res);
      maxId = res.length;
  });
};

function lowInventory() {
  connection.query("SELECT * FROM products WHERE stock_quantity<5", function (err, res) {
    if (err) throw err;
    console.table(res);
  });
};

function inventoryToAdd() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
      console.table(res);
      maxId = res.length;
    addInventory();
  });
};

function addInventory() {
  inquirer.prompt([
      {
        name: "item",
        message: "What is the ITEM_ID number of the product to which you would like to add inventory?",
        validate: function(value) {
          if (isNaN(value) === false && parseInt(value) > 0 && parseInt(value) <= maxId) {
            return true;
          }
          return false;
        }
      }, {
        name: "numitems",
        message: "How many units would you like to add?",
        validate: function(value) {
          if (isNaN(value) === false && parseInt(value) > 0) {
            return true;
          }
          return false;
      }
    }
    ]).then(function(answers) {
      var productSelected = answers.item;
      var numIncreased = answers.numitems;
      console.log("Your selections:");
      console.log("Item ID: " + productSelected);
      console.log("Quantity to be increase by: " + numIncreased);
      connection.query("SELECT * FROM products WHERE item_id=?", [productSelected], function (err, res) {
        if (err) throw err;
        console.table(res);
        var oldInv = res[0].stock_quantity;
        var newInv = (parseInt(numIncreased) + parseInt(oldInv));
        updateAddedInventory(productSelected, newInv);
      })  
    });
};

var updateRecord = 'UPDATE products SET stock_quantity = ? WHERE item_id=?';

function updateAddedInventory(id, incInv) {
  connection.query(updateRecord,[incInv, id], function(err, res){
    if(err) throw err;
    console.log("Our inventory has been updated!");
    runBamazon();
  });
};

function newProductToAdd() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
      console.table(res);
      maxId = res.length;
      addNewProduct();
  });
};


var insertRecord = 'INSERT INTO products(product_name, department_name, price, stock_quantity) VALUE(?,?,?,?)';


function addNewProduct() {
  inquirer.prompt([
      {
        name: "product",
        message: "Enter the name of the product you would like to add:"
        },
      {
        name: "dept",
        message: "Enter department name:"
        },
      {
        name: "price",
        message: "Enter the unit cost:"
        },
      {
        name: "qty",
        message: "Enter stock quantity:"
      }
    ]).then(function(newProduct) {
      var prodName = newProduct.product;
      var department = newProduct.dept;
      var unitCost = newProduct.price;
      var num = newProduct.qty;
      connection.query(insertRecord,[prodName, department, unitCost, num], function(err, res){
        if(err) throw err;
        console.log("Our inventory has been updated!");
        runBamazon();

      });
    });
};



