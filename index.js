var express = require("express");
var app = express();
var mysql = require("mysql");

port = process.env.PORT || 3030;

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "wagwan"
})

app.get("/", (req, res) => {
    res.send("<a href='/sample'>SAMPLE</a>");
});

class Product {
    constructor (ing_list, p_id, desc, loc, com, all_list) {
        this.ing_list = ing_list.split(",");
        this.p_id = p_id;
        this.desc = desc;
        this.loc = loc;
        this.com = com;
        this.all_list = all_list.split(",");
        this.ing = [];
    }
}

class Ingredient {
    constructor (ing_id, desc) {
        this.ing_id = ing_id;
        this.desc = desc;
    }
}

class Ingredient_Block {
    constructor (ing_id, source, dest, all_list) {
        this.ing_id = ing_id;
        this.source = source;
        this.dest = dest;
        this.all_list = all_list;
    }
}

app.get("/product/*", (req, res) => {
    var product_id = parseInt(req.params[0]);
    const queryString = "SELECT * FROM product_list WHERE product_id='"+product_id+"'";


    var prom = new Promise(function(resolve, reject) {
        connection.query(queryString, (err, rows, fields) => {
            if (err) {
                res.send("ERROR");
                reject("Error");
            } else if (rows.length == 0) {
                res.send("No such product");
                reject("No product");
            } else {
                var row = rows[0];
                var pro = new Product(row.ingredient_list, row.product_id, row.description, row.sale_location, row.company, row.allergen_list);
                
                res.write("<h1>"+pro.desc+"</h1>");
        
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
                res.write("<h2>"+value.name+"</h2>");
                var ingredients = [new Ingredient_Block(value.id, "Null", "Farmer Joe", ["Nuts", "Vegan", "Halal"]),
                                   new Ingredient_Block(value.id, "Farmer Joe", "North Factory", ["Nuts", "Vegan", "Halal"]),
                                   new Ingredient_Block(value.id, "North Factory", "South Factory", ["Vegan", "Halal"]),
                                   new Ingredient_Block(value.id, "South Factory", "Harris Farm", ["Vegan"]),
                ];

                res.write("<strong>Allergen certifications</strong>: " + ingredients[ingredients.length-1].all_list);
                res.write("<br><strong>History of ingredient</strong>: <ol><li>" + ingredients[0].dest);
                for (var k = 1; k < ingredients.length; k++) {
                    res.write("</li><li> " + ingredients[k].dest);
                }
                res.write("</li></ol>");
                
                //res.write("Connect to blockchain here for allergens");
                if (value.index == value.len -1) {
                    res.end();
                }
            }, (reason) => {
                res.write(reason);
                if (reason == value.ing_list.length - 1) {
                    res.end();
                } 
            });
        }

        // fulfillment
    }, (reason) => {
        // rejection
        res.end();
    });
});

app.get("/sample", (req, res) => {
    res.sendFile(__dirname + "/public/main.html");
})

var server = app.listen(port, () => {
    console.log("Server is listening to port: " + port);
});