const express = require('express');
const http = require('http');
const handlebars = require('handlebars')
const bodyParser = require("body-parser");
const path = require('path');
const app = express();

//use express's router
const router = express.Router();
module.exports = router;



// all environments
app.use(bodyParser.urlencoded({extended: true}));
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
//app.engine('handlebars', require('handlebars').__express);
app.set('view engine', 'handlebars');
//app.use(express.favicon());
//app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
//app.use(express.methodOverride());
//app.use(express.cookieParser('IxD secret key'));
//app.use(express.session());
//app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));



//routes
const login = require('./routes/login');
const account = require('./routes/account');
const kitchen = require('./routes/kitchen');
const recipeList = require('./routes/recipeList');
const recipeResult = require('./routes/recipeResult');

app.get('/', login.view)
app.get('/account', account.view);
app.get('/kitchen', kitchen.view);
app.get('/recipeList', recipeList.view);
app.get('/recipeResult', recipeResult.view);


app.use(express.static(path.join(__dirname, 'public')));
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Database
const my_ingredients = {};

// Check the login credentials
app.post('/login', (req, res) => {
  console.log("Username: " + req.body.user);
  console.log("Password: " + req.body.pass);

  // TODO: check to see if the username and password are in the database

});

// Grab ingredients list and manipulate it
app.post('/kitchen', (req, res) => {

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
app.post('/recipeList', (req, res) => {
  res.send(my_ingredients);
});

app.listen(3000, () => {
    console.log("Server started on http://localhost:3000/");
});
