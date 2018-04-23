const express = require('express');
const handlebars = require('handlebars')
const bodyParser = require("body-parser");
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Check the login credentials
app.post('/login.html', (req, res) => {
  console.log("Username: " + req.body.user);
  console.log("Password: " + req.body.pass);

  // Check to see if the username and password are in the database

});

// Grab ingredients list and manipulate it
app.post('/kitchen.html', (req, res) => {

  console.log("Fridge List: ");
  for(const i of req.body.fridge){
    console.log(i);
  }
  
  console.log("Spice Rack: " + req.body.spices);
  console.log("Cupboard: " + req.body.cupboard);

  // Check to see if the username and password are in the database

});


app.listen(3000, () => {
    console.log("Server started on http://localhost:3000/");
});
