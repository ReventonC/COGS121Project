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

  // TODO: check to see if the username and password are in the database

});

// Grab ingredients list and manipulate it
app.post('/kitchen.html', (req, res) => {

  const my_list = req.body;

  const fridge_list = my_list['fridge[]'];
  const spice_rack = my_list['spices[]'];
  const cupboard = my_list['cupboard[]'];

  //TODO: check whether these 3 lists are empty or not
  if(fridge_list == undefined){};
  if(spice_rack == undefined){};
  if(cupboard == undefined){};

console.log(my_list);
  console.log("Fridge List: " + fridge_list);
  console.log("Spice Rack: " + spice_rack);
  console.log("Cupboard: " + cupboard);

});


app.listen(3000, () => {
    console.log("Server started on http://localhost:3000/");
});
