// Create app for running server
var express = require("express");
var app = express();
var http = require('http').createServer(app);

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

// Partners route sends the list of partners
app.get("/partners", (req, res) => {
    res.sendFile(__dirname + "/public/partners.html");
});

// Settings route sends the settings page
app.get("/settings", (req, res) => {
    res.sendFile(__dirname + "/public/settings.html");
});

// Wildcard for when a user accesses a product page
app.get("/product/*", (req, res) => {
    // Response is the template main page that gets updated
    // by an internal jQuery getJSON method
    res.sendFile(__dirname+"/public/main.html");
})

// This sends the data related to the product ID
app.get("/data/*", (req, res) => {
    var test = new Ingredient_JSON("Apple", "Peru", ["Farmer Joe", "Harris Farm"], 1234, ["Nut", "Halal"]);
    var test1 = new Ingredient_JSON("Pear", "Austria", ["Farmer Bob", "IGA"], 4321, ["Vegan", "Halal"]);
    var testProd = new Product_JSON("Fruit Salad", [test, test1], ["Nut", "Halal"]);
    res.send(JSON.stringify(testProd));
})

app.get("/sdfj/*", (req, res) => {
    
    console.log(req.params[0]);
    var product_id = parseInt(req.params[0]);
    const queryString = "SELECT * FROM product_list WHERE product_id='"+product_id+"'";


    var prom = new Promise(function(resolve, reject) {
        connection.query(queryString, (err, rows, fields) => {
            if (err) {
                //res.send("ERROR");
                reject("Error");
            } else if (rows.length == 0) {
                //res.send("No such product");
                reject("No product");
            } else {
                var row = rows[0];
                var pro = new Product(row.ingredient_list, row.product_id, 
                    row.description, row.sale_location, row.company, row.allergen_list);
                
                //res.write("<h1>"+pro.desc+"</h1>");
                // socket.on('chat message', function(msg){
                //     io.emit('chat message', msg);
                // });
        
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
                        reje(s+"");
                    } else if (rows2.length == 0) {
                        reje("No product");
                    }

                    var my_res = {index: s, len: len, id: rows2[0].ingredient_ID, name: rows2[0].description};

                    reso(my_res);
                })
            })

            prom2.then((value) => {
                //res.write("<h2>"+value.name+"</h2>");
                var ingredients = [new Ingredient_Block(value.id, 
                                    "Null", "Farmer Joe", ["Nuts", "Vegan", "Halal"]),
                                new Ingredient_Block(value.id, 
                                    "Farmer Joe", "North Factory", ["Nuts", "Vegan", "Halal"]),
                                new Ingredient_Block(value.id, 
                                    "North Factory", "South Factory", ["Vegan", "Halal"]),
                                new Ingredient_Block(value.id, 
                                    "South Factory", "Harris Farm", ["Vegan"]),
                ];

                var len = ingredients.length;
                //res.write("<strong>Allergen certifications</strong>: " + ingredients[len-1].all_list);
                //res.write("<br><strong>History of ingredient</strong>: <ol><li>" + ingredients[0].dest);
                for (var k = 1; k < len; k++) {
                    //res.write("</li><li> " + ingredients[k].dest);
                }
                //res.write("</li></ol>");
                
                //res.write("Connect to blockchain here for allergens");
                if (value.index == value.len -1) {
                    //res.end();
                }
            }, (reason) => {
                //res.write(reason);
                if (reason == value.ing_list.length - 1) {
                    //res.end();
                } 
            });
        }

        // fulfillment
    }, (reason) => {
        // rejection
        res.end();
    });
});

// Sets the server to listen to port
http.listen(port, () => {
    console.log("Server is listening to port: " + port);
});