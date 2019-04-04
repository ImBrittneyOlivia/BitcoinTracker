//require express and body-parser
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

//initialize app
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

//routes
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {
  //   console.log(req.body.crypto); -- confirms we are getting the value from the chosen crypto for instance if you chose lithercoins you should get LTC in console

  // holds the variables the user choose from the drop down menu
  var crypto = req.body.crypto;
  var fiat = req.body.fiat;
  var amount = req.body.amount;
  // var baseURL = "https://apiv2.bitcoinaverage.com/indices/global/ticker/";
  // var finalURL = baseURL + crypto + fiat;

  // looking at request() documentation
  // allows for options so we can create converter
  //requires url and then we can add other options to it
  var options = {
    url: "https://apiv2.bitcoinaverage.com/convert/global",
    method: "GET",
    qs: {
      from: crypto,
      to: fiat,
      amount: amount
    }
  };
  //error response body are what will be sent back to us once we make our request
  request(options, function(error, response, body) {
    //variable storing data we are getting from bitconaverages data/api
    //parse converts json object to javascript object to be used
    var data = JSON.parse(body);
    var price = data.price; //last is the key we are choosing to use from the json object
    //if we had wanted to get the average cost per week we can copy the path using our chrome extension and replace last with averages.week
    console.log(price);

    //grabs current date from json
    var currentDate = data.time;
    //if you want to send more than one thing to the browser you have to use res.write(). res.send() will only send one thing
    res.write("<p>The current date is " + currentDate + "</p>");
    res.write(
      "<h1>" +
        amount +
        " " +
        crypto +
        " is currently worth " +
        price +
        fiat +
        "</h1>"
    );
    //sends everything to browser
    res.send();
  });
});

//port you want app to render on
app.listen(3000, function() {
  console.log("Running on port 3000");
});
