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
  console.log("connected as id " + connection.threadId);
});

var maxId;

// Running this application will first display all of the items available for sale. 
// Include the ids, names, and prices of products for sale.
function runBamazon() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
      console.table(res);
      maxId = res.length;
  placeOrder();
  });
};

runBamazon();

// The first should ask them the ID of the product they would like to buy.
// The second message should ask how many units of the product they would like to buy.
var placeOrder = function() {
inquirer.prompt([
      {
        name: "item",
        message: "What is the ITEM_ID number of the product you would like to buy?",
        validate: function(value) {
          if (isNaN(value) === false && parseInt(value) > 0 && parseInt(value) <= maxId) {
            return true;
          }
          return false;
        }
      }, {
        name: "numitems",
        message: "How many units would you like to buy?",
        validate: function(value) {
          if (isNaN(value) === false && parseInt(value) > 0) {
            return true;
          }
          return false;
      }
    }
    ]).then(function(answers) {
    	var productOrdered = answers.item;
    	var numProductOrdered = answers.numitems;
      console.log("Your selections:");
    	console.log("Item ID: " + productOrdered);
    	console.log("Quantity ordered: " + numProductOrdered);
      checkInventory(productOrdered, numProductOrdered);
    	});
    
};


function checkInventory(id, numOrdered) {
  console.log("checking inventory...");
    connection.query("SELECT * FROM products WHERE item_id=?", [id], function (err, res) {
    if (err) throw err;
    console.table(res);
      for (var i = 0; i < res.length; i++) {
      var stock = res[i].stock_quantity;
      var cost = res[i].price;
      };
      if (stock >= numOrdered) {
        console.log("We have enough in stock!");
        processPurchase(id, numOrdered, stock, cost);
      } else {
        console.log("Insufficient quantity! Here is our inventory:");
        console.log("=========================================================");
        runBamazon();
      }
    });
};

var updateRecord = 'UPDATE products SET stock_quantity = ? WHERE item_id=?';

function processPurchase(id, orderQty, inv, cost) {
  console.log("Your total cost for " + orderQty + " item(s) is: $" + (orderQty * cost));
  var newStock = (inv - orderQty);
  newStock.toFixed(2);
  connection.query(updateRecord,[newStock, id], function(err, res){
    if(err) throw err;
    console.log("Our inventory has been updated!");
    orderAgain();
    });
};

var orderAgain = function() {
inquirer.prompt([
      {
        name: "ques",
        type: "confirm",
        message: "Would you like to place another order?"
      }
    ]).then(function(answers) {
      var choice = answers.ques;
      if (choice) {
        runBamazon();
      } else {
        console.log("Thank you for your time. Please come back soon.");
      }
      });  
};


