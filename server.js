const express = require('express');
const handlebars = require('handlebars')
const bodyParser = require("body-parser");
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Database
const my_ingredients = {};

// Check the login credentials
app.post('/login.html', (req, res) => {
  console.log("Username: " + req.body.user);
  console.log("Password: " + req.body.pass);

  // TODO: check to see if the username and password are in the database

});

// Grab ingredients list and manipulate it
app.post('/kitchen.html', (req, res) => {

  // Object of all ingredient types
  const my_list = req.body;

  // List of each type of ingredient
  const fridge_list = my_list['fridge[]'];
  const spice_rack = my_list['spices[]'];
  const cupboard = my_list['cupboard[]'];

  // Add all the ingredients to the database
  my_ingredients.fridge = fridge_list;
  my_ingredients.spices = spice_rack;
  my_ingredients.cupboard = cupboard;

  //TODO: check whether these 3 lists are empty or not
  if(fridge_list == undefined){};
  if(spice_rack == undefined){};
  if(cupboard == undefined){};

  // Print ingredients list
  console.log("Fridge List: " + fridge_list);
  console.log("Spice Rack: " + spice_rack);
  console.log("Cupboard: " + cupboard);

});

// Grab all of the user recipes from the DB and send them to the users
//TODO: once routes are implemented, can make this a Get request that triggers when page loads,
// rather than having to make an ajax post request. then input the route name
app.post('/recipeList.html', (req, res) => {
  res.send(my_ingredients);
});

app.listen(3000, () => {
    console.log("Server started on http://localhost:3000/");
});
