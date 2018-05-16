const express = require('express');
const http = require('http');
const handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const bodyParser = require("body-parser");
const path = require('path');
const sqlite3 = require('sqlite3');
const app = express();
const hbs = exphbs.create();
const db = new sqlite3.Database('recipes.db');

//for cookie
const cookie = require('cookie');
const cookieParser = require('cookie-parser');
app.use(cookieParser());


//require unirest for api
const unirest = require('unirest');

//use express's router
const router = express.Router();
module.exports = router;

// all environments
//app.use(bodyParser.urlencoded({ extended: true }));
//app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');



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

// Object holding all the ingredients to be inserted into the DB
const my_ingredients = { fridge: [], spices: [], cupboard: [] };

// The name of the user
let username = '';
let cookies = '';


// Check the login credentials
app.post('/', (req, res) => {

    //The inputted username and password
    const user = req.body.user;
    const pass = req.body.pass;
    const type = req.body.type;
    console.log("Username: " + user);
    console.log("Password: " + pass);

    username = user;

    // This is a Sign-in Attempt
    if (type == 0) {

        db.all(

            'SELECT * FROM users WHERE username=$user AND password=$pass',

            {
                $user: user,
                $pass: pass
            },

            (err, rows) => {
                console.log(rows);
                if (rows.length == 1) {
                    console.log("successfully logged in");  
                    //res.clearCookie("user");      
                    cookie.serialize ("user", username);           
                    //cookies = cookie.parse(req.headers.cookie || '');                  
                    res.send({user: user, pass: pass, loginRes: 0});
                } else {
                  console.log("username or password is incorrect");
                  //console.log(user);
                  res.send({user: 0, pass: 0, loginRes: 1});
                  //res.cookie('username', username).send('cookie set');
                  //console.log(req..username);

                  //cookie.serialize ("username", username);
                  //var cookies = cookie.parse(req.headers.cookie || '');
                  //Get the visitor name set in the cookie
                  //console.log(cookie.username);
                  //res.send({user: 0, pass: 0, loginRes: 1});
                }
            }
        );
    }

    // Sign up attempt
    if (type == 1) {

        db.run(

            'INSERT INTO users VALUES ($user, $pass)',
            {
                $user: user,
                $pass: pass
            },

            (err) => {
                if (err) {
                    console.log("There was an error inserting username and password")
                } else {
                    console.log("Successfully inserted new user into DB with username:", user, "and password:", pass);
                }
            }
        );
    }

});

// Grab ingredients list and manipulate it
app.post('/kitchen', (req, res) => {
    //get the ingredients from the database

    // Object of all ingredient types
    console.log(req.body);
    console.log(JSON.stringify());

    //console.log(cookie.username);
    const username = cookies.username;
    //console.log("hello");
    console.log("user in kitchen ", username);
    const newIngredient = req.body.name;

    //run this when the add ingredient button is pressed
    db.run(
      'INSERT INTO ingredients VALUES ($user, $ingredient)',
        { 
           $user: username,
           $ingredient: newIngredient,
        },

        (err) =>{
          if(err)
              console.log("error adding " + newIngredient);
          else
              console.log("successfully added " + newIngredient + " for " + username);
        } 
    );
});



// Grab all of the user recipes from the DB and send them to the users
//TODO: once routes are implemented, can make this a Get request that triggers when page loads,
// rather than having to make an ajax post request. then input the route name
app.post('/recipeList-bdszjfjfabjkcvbjkxzbcvjkblljdfbvjzbxcjklbvzcv', (req, res) => {
    let temp;
    let ingredientsList = [];
    // Grab the recipes from the list
    db.all(
        'SELECT * FROM ingredients WHERE username=$user',

        {
            $user: username
        },

        (err, rows) => {
            console.log('Grabbing ingredients for API call:', rows[0]);
            ingredientsList = ((JSON.parse(rows[0].fridge_list)).
                concat(JSON.parse(rows[0].spice_rack))).concat(JSON.parse(rows[0].cupboard));

            //TODO: find out how to break the api call into seperate strings
            //get the recipe information
            //let ingredientsList = ['apple', 'ice cream'];

            console.log("The given ingredients list is:", ingredientsList);
            temp = ingredientsList;
            let ingredients = '';
            const numResults = 2;
            ingredientsList.forEach((i) => {
                i.replace(" ", "+");
                ingredients += i + "%2C";
            });
            const apiCall = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients?fillIngredients=false&ingredients="
                + ingredients + "&limitLicense=false&number=" + numResults + "&ranking=1";


            //work with the actual recipe steps
            let id = []; //make a list of ids
            let apiRecipe = ''


            //testing the api
            //get gets all the parameters and sends it to the server for a request
            //headers are used as authentication
            //end specifies what to do with the request
            //unirest.get("https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients?fillIngredients=false&ingredients=apples%2Cflour%2Csugar&limit%2CLicense=false&number=5&ranking=1")
            unirest.get(apiCall)
                .header("X-Mashape-Key", "ZRc27DkA72mshgJldUbTYfADBUgnp1YbkANjsnMBCxTNjW5Krf")
                .header("Accept", "application/json")
                .end(function (result) {

                    //push the id numbers that would be used to find the recipeslater
                    result.body.forEach((i) => {
                        id.push(i.id);
                    });

                    //show the results
                    console.log(result.status, result.headers, result.body);

                    //store apiRecipe string here
                    apiRecipe = 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/' + id[1] + '/information?includeNutrition=false'; //string for api recipe
                    //get the actual recipe(gets info from recipe ID)

                    //recipe instructions
                    unirest.get(apiRecipe)
                        .header("X-Mashape-Key", "ZRc27DkA72mshgJldUbTYfADBUgnp1YbkANjsnMBCxTNjW5Krf")
                        .header("Accept", "application/json")
                        .end(function (result) {
                            console.log(result.status, result.headers, result.body);
                        });


                });
            //res.send(my_ingredients);
            console.log("HEEEERE:", temp);
            res.send({list: temp});
        });
}
);







app.listen(3000, () => {
    console.log("Server started on http://localhost:3000/");
});
