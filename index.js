var express = require("express");
var app = express();

port = process.env.PORT || 3030;

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/main.html");
});

var server = app.listen(port, () => {
    console.log("Server is listening to port: " + port);
});