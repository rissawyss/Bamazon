# HW Week 12 - {Node.js & MySQL}
Homework week 12 for UCLA Coding BootCamp.

This assignment entails creating an Amazon-like storefront using MySQL and Node.js.

## Description and Requirements
The app will take in orders from customers and deplete stock from the store's inventory. A *Customer View* and *Manager View* contain functionality for placing orders and managing inventory, respectively.

Using a MySQL Database called Bamazon, inventory is stored in a Table inside of that database called products.
	-The products Table contains the following information on each product:
		-item_id (unique id for each product)
		-product_name (Name of product)
		-department_name
		-price (cost to customer)
		-stock_quantity (how much of the product is available in stores)


### Customer View
Running the bamazonCustomer.js application will first display all of the items available for sale.
Then the app prompts users with two messages:
	-The ID of the product they would like to buy.
	-How many units of the product they would like to buy.
	-If store has enough inventory, the application should fulfill the customer's order, update the SQL database to reflect the remaining quantity, and show the customer the total cost of their purchase.


### Manager View
Running the bamazonManager.js application will list a set of menu options:
	-View Products for Sale: which lists every available item
	-View Low Inventory: which lists all items with inventory count less than five.
	-Add to Inventory: displays a prompt that will lets the manager "add more" of any item currently in the store.
	-Add New Product: allows the manager to add a completely new product to the store.

## Technologies Used
	-Node.js
	-MySQL
	-Node Package Module inquirer
	-Node Package Module MySQL
	-Node Package Module console.table


## CODE EXPLANATION
For the bamazonCustomer.js application, after capturing user input to purchase an item, I created a function to process a purchase which takes in parameters of the item id, order quantity, number in inventory and cost. The node.js mysql CRUD process for updating records was stored in a variable "updateRecord". When the processPurchase(id, orderQty, inv, cost) function runs, the database is updated with the new inventory quantity related to the item_id.

```
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

```

## CODE EXPLANATION
For the bamazonManager.js application, the managerStore(action) function runs respective actions depending on prompted user selection.
If Manager selects the option to add a product to inventory, the updateAddedInventory(id, incInv) function implements a node.js mysql CRUD process for updating the added inventory.

```
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

var updateRecord = 'UPDATE products SET stock_quantity = ? WHERE item_id=?';

function updateAddedInventory(id, incInv) {
  connection.query(updateRecord,[incInv, id], function(err, res){
    if(err) throw err;
    console.log("Our inventory has been updated!");
    runBamazon();
  });
};
 
```
## Bamazon Customer Screenshot1
![bamazoncustomerscreenshot1](https://cloud.githubusercontent.com/assets/22284225/25300897/e0231662-26ce-11e7-884c-b3279264c378.png)

## Bamazon Customer Screenshot2
![bamazonecustomerscreenshot2](https://cloud.githubusercontent.com/assets/22284225/25300911/1614c9be-26cf-11e7-989f-de83cdaadde3.png)

## Bamazon Manager Add Product
![bamazonmanager-addproduct](https://cloud.githubusercontent.com/assets/22284225/25300926/91d02436-26cf-11e7-95d0-ae36c2ec6143.png)

## Bamazon Manager Add to Inventory
![bamazonmanager-addtoinventory](https://cloud.githubusercontent.com/assets/22284225/25300931/bf25df52-26cf-11e7-8e10-341a71b6c09d.png)

## Bamazon Manager View Low Inventory
![bamazonmanager-viewproducts-viewlowinventory](https://cloud.githubusercontent.com/assets/22284225/25300939/038ae660-26d0-11e7-853d-9d4863788857.png)
