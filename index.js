// Create app for running server
var express = require("express");
var app = express();
var http = require('http').createServer(app);

// Import the web3 library
var web3 = require("web3");

// Imports the MySQL library
var mysql = require("mysql");

// Import classes for Ingredients and Products
var Product = require("./product.js");
var Ingredient = require("./ingredient.js");
var Ingredient_JSON = require("./Ingredient_JSON.js");
var Ingredient_Block = require("./ingredient_block.js");
var Product_JSON = require("./product_JSON.js");
const connection = require("./connection.js");

// Define port to be either the port given by distributor, or 3030 by default
port = process.env.PORT || 3030;

// Main route sends the home page
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/home.html");
});

// Scanner route sends the QR scanner page, using InstaScan
app.get("/scanner", (req, res) => {
    res.sendFile(__dirname + "/public/scanner.html");
});

// Random Ingredient Block for testing
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function randomIngredient (value) {
    var farmers = ["Bob", "Joe", "Tom", "Nic"];
    var directions = ["North", "South", "East", "West"];
    var allergens = ["Nut Free", "Vegan", "Halal", "Gluten Free", "Sulphite Free"];
    var f = getRandomInt(3);
    var d = getRandomInt(3);
    var d1 = 1;
    if (d == 1) {
        d1 = 2;
    }
    var ingredients = { history: [new Ingredient_Block(value.id, 
        "Null", "Farmer "+farmers[f], []),
    new Ingredient_Block(value.id, 
        "Farmer "+farmers[f], directions[d]+" Factory", []),
    new Ingredient_Block(value.id, 
        directions[d]+" Factory", directions[d1]+" Factory", []),
    new Ingredient_Block(value.id, 
        directions[d1]+" Factory", "Harris Farm", []),
    ], name: value.name, origin: null, id: value.id, allergens: null, url: value.url};
    for (var i = 1; i < allergens.length; i++) {
        for (var j = 0; j < ingredients.history.length; j++) {
            if (getRandomInt(2) == 1) {
                ingredients.history[j].all_list.push(allergens[i]);
            }
        }
    }
    ingredients.history[ingredients.history.length-1].all_list.push(allergens[0]);
    ingredients.origin = ingredients.history[0].dest;
    return ingredients;
}

// Partners route sends the list of partners
app.get("/partners", (req, res) => {
    res.sendFile(__dirname + "/public/partners.html");
});

// About route sends the about page
app.get("/about", (req, res) => {
    res.sendFile(__dirname + "/public/about.html");
});

// Wildcard for when a user accesses a product page
app.get("/product/*", (req, res) => {
    // Response is the template main page that gets updated
    // by an internal jQuery getJSON method
    res.sendFile(__dirname+"/public/main.html");
})

// This sends the data related to the product ID
app.get("/data/*", (req, res) => {
    var product_id = parseInt(req.params[0]);
    const queryString = "SELECT * FROM product_list WHERE product_id='"+product_id+"'";


    var prom = new Promise(function(resolve, reject) {
        connection.query(queryString, (err, rows, fields) => {
            if (err) {
                reject("Error");
            } else if (rows.length == 0) {
                reject("No product");
            } else {
                var row = rows[0];
                var pro = new Product(row.ingredient_list, row.product_id, 
                    row.description, row.sale_location, row.company, row.allergen_list);

                var ing_list = pro.ing_list;
                for (var i = 0; i < ing_list.length; i++) {
                    ing_list[i] = parseInt(ing_list[i]);
                }

                resolve(pro);
            }
        })

    });

    prom.then((value) => {
        for (var m = 0; m < value.ing_list.length; m++) {
            var prom2 = new Promise(function(reso, reje) {
                var s = m;
                var len = value.ing_list.length;
                var queryString2 = "SELECT * FROM ingredient_list WHERE ingredient_ID='"+value.ing_list[m]+"'";
                connection.query(queryString2, (err, rows2, fields) => {
                    if (err) {
                        reje("Database Error");
                    } 

                    var my_res = {index: s, len: len, id: rows2[0].ingredient_ID, name: rows2[0].description, value: value, url: rows2[0].url};

                    reso(my_res);
                })
            })

            prom2.then((value) => {
                var ingredients = randomIngredient(value);
                ingredients.origin = ingredients.history[0].dest;
                ingredients.allergens = ingredients.history[ingredients.history.length-1].all_list;
                value.value.ing.push(ingredients);
                if (value.index == value.len -1) {
                    var my_json = {
                        name: value.value.desc,
                        all_list: [],
                        ingredients: value.value.ing
                    }
                    for (var q = 0; q < my_json.ingredients.length; q++) {
                        for (var w = 0; w < my_json.ingredients[q].allergens.length; w++) {
                            my_json.all_list.push(my_json.ingredients[q].allergens[w]);
                        }
                    }
                    my_json.all_list = [...new Set(my_json.all_list)];
                    res.send(my_json);
                }
            }, (reason) => {
                if (reason == value.ing_list.length - 1) {
                    //res.end();
                } 
            });
        }

        // fulfillment
    }, (reason) => {
        // rejection
        res.send({success: false});
    });
});

// Sets the server to listen to port
http.listen(port, () => {
    console.log("Server is listening to port: " + port);
});