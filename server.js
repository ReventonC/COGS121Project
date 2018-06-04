const express = require('express');
const http = require('http');
const handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const bodyParser = require("body-parser");
const path = require('path');
const sqlite3 = require('sqlite3');
const createDB = require('./create_db.js');
const app = express();
const hbs = exphbs.create();
createDB.createDB();
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


    // This is a Sign-in Attempt
    if (type == 0) {

        db.all(

            'SELECT * FROM users WHERE username=$user AND password=$pass',

            {
                $user: user,
                $pass: pass
            },

            (err, rows) => {
                if(err){
                  console.log("FAILED TO LOG IN");
                }
                console.log(rows);
                if (rows.length == 1) {
                    console.log("successfully logged in");                 
                    res.send({user: user, pass: pass, loginRes: 0});
                    
                } else {
                  console.log("username or password is incorrect");             
                  res.send({user: 0, pass: 0, loginRes: 1});

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
                    console.log("There was an error inserting username and password");
                } else {
                    console.log("Successfully inserted new user into DB with username:", user, "and password:", pass);
                }
            }
        );
    }

});

// Add ideangredients to the DB OR display current user's ingredients
app.post('/kitchen', (req, res) => {

    //Object with new ingredient
    const myNewIngredient = req.body;

    //Get type -- add ingredient or display ingredients
    // type 0: display ingredients
    // type 1: add ingredient
    // type 2: remove ingredient
    // type 3: edit ingredient
    const type = req.body.type;
    let oldIng = {};
    if(type == 3){
      oldIng.name = myNewIngredient.oldName;
      oldIng.category = myNewIngredient.oldCategory;
      oldIng.note = myNewIngredient.oldNote;

      console.log("OLD ING",oldIng);
      delete myNewIngredient.oldName;
      delete myNewIngredient.oldCategory;
      delete myNewIngredient.oldNote;

    }

    // The current user
    const username = myNewIngredient.user;
    delete myNewIngredient.user;
    delete myNewIngredient.type;

    // The ingredient name
    const newIngredientName = req.body.name;


    console.log(myNewIngredient);
    console.log("User", username, "in kitchen, with new ingredient:", newIngredientName);

    //First, find out if the user already has an entry in the DB for their ingredients
    db.all(
      'SELECT * FROM ingredients WHERE username=$user',
      {
        $user: username
      },
      (err, rows) => {
        if(err){
          console.log("FAILED GETTING TABLE ROW");
        }
        if (rows.length == 1){
           // Get all of current user's ingredients to display them in kitchen
          if(type == 0){
            const myCurrentIngredients = JSON.parse(rows[0].ingredients);
            console.log("myCurrIng:", myCurrentIngredients)
            res.send(myCurrentIngredients);
              
           // Added new ingredient to DB  
          } else if(type == 1){
            const myCurrentIngredients = JSON.parse(rows[0].ingredients);
            const updatedIngredients = myCurrentIngredients.concat(myNewIngredient);
            const updatedIngredientsString = JSON.stringify(updatedIngredients);

            db.run(
              'UPDATE ingredients SET ingredients=$ingredients WHERE username=$user',
              {
                $ingredients: updatedIngredientsString,
                $user: username
              },
              (err) => {
                if(err){
                  console.log("There was an error updating ingredient:", myNewIngredient);
                } else {
                  console.log("Successfully updated ingredient,", newIngredientName, ", for user:", username);
                }
              }
            );
          } else {
            const myCurrentIngredients = JSON.parse(rows[0].ingredients);
            const myNewIngredientStr = JSON.stringify(myNewIngredient);
            myCurrentIngredients.forEach((val, index) => {

              if(type == 2){
                // Remove an ingredient from the DB
                if(myNewIngredientStr === JSON.stringify(val)){
                  myCurrentIngredients.splice(index, 1);
                }
              } else if(type == 3) {
                
                // Edit ingredient in DB
                const myOldIng = JSON.stringify(oldIng);
                if(myOldIng === JSON.stringify(val)){
                  myCurrentIngredients[index] = myNewIngredient;
                }
              }
              return;
            });
            const newIngList = JSON.stringify(myCurrentIngredients);

            // Run the command to edit or remove ingredient
            db.run(
              'UPDATE ingredients SET ingredients=$ingredients WHERE username=$user',
              {
                $ingredients: newIngList,
                $user: username
              },
              (err) => {
                if(err){
                  console.log("There was an error removing or editing ingredient:", myNewIngredient);
                } else {
                  console.log("Successfully edited or removed ingredient,", newIngredientName, ", for user:", username);
                }
              }
            );
          }
          

        //User is inserting ingredients into their kitchen for the first time
        } else {
          if(type == 0){
            res.send({});
          }else{
            const myNewIngredientString = JSON.stringify(myNewIngredient);
            db.run(
              'INSERT INTO ingredients VALUES ($user, $ingredients)',
              {
                $user: username,
                $ingredients: "[" + myNewIngredientString + "]"
              },
              (err) => {
                if(err){
                  console.log("There was an error inserting ingredient:", myNewIngredient);
                } else {
                  console.log("Successfully inserted ingredient,", newIngredientName, ", for user:", username);
                }
              }
            );
          }
        }
      }
    );
});

// Grab all of the user recipes from the DB and send them to the users
app.post('/recipeList', (req, res) => {
    let ingredientsList = [];
    let myRecipes = [];
    const checkedIngredients = JSON.parse(req.body.checked);
    console.log("MY CHECKED Ingredients:",checkedIngredients);

    // Grab the recipes from the list to use in API call to display all recipe results
    const username = req.body.user;

    db.all(
        'SELECT * FROM ingredients WHERE username=$user',

        {
            $user: username
        },

        (err, rows) => {

            console.log('Grabbing ingredients for API call:', rows[0]);
            const myIngredientsList = JSON.parse(rows[0].ingredients);
            for(const myIngObj of myIngredientsList){
              ingredientsList.push(myIngObj['name']);

            }

            // Everything below is API call
            console.log("The given ingredients list is:", ingredientsList);
            let ingredients = '';
            //CHANGE THIS NUM TO DISPLAY DIFFERENT AMOUNT OF RECIPE RESULTS
            const numResults = 8;
            //Uncomment the following line, to get ALL ingredients for user, rather than checked ones
            ingredientsList = checkedIngredients;
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

                    //UNCOMMENT TO SHOW RESULTS
                    //console.log(result.status);   //it prints '200' -- what does status 200 mean?
                    //console.log(result.headers);   //it prints information about the request - useless?
                    //console.log(result.body);   //print recipes
                    myRecipes = result.body;

                    //console.log("Recipes (API call):", myRecipes);  //PRINTS THE RECIPES!!!
                    res.send(myRecipes);

                    //store apiRecipe string here
                    apiRecipe = 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/' + id[1] + '/information?includeNutrition=false'; //string for api recipe
                    //get the actual recipe(gets info from recipe ID)

                    //recipe instructions
                    unirest.get(apiRecipe)
                        .header("X-Mashape-Key", "ZRc27DkA72mshgJldUbTYfADBUgnp1YbkANjsnMBCxTNjW5Krf")
                        .header("Accept", "application/json")
                        .end(function (result) {
                            //UNCOMMENT TO PRINT ALL THE INSTRUCTIONS!!!
                            //console.log(result.status, result.headers, result.body);
                        });


                });

        });
}
);

// Grab all recipes for API call, only for one single recipe that you click on
app.post('/recipeResult', (req, res) => {

   let ingredientsList = [];
    let myRecipes = [];

   //get the username
  const username = req.body.user;
  console.log(username,  "in recipeList page");
  db.all(
        'SELECT * FROM ingredients WHERE username=$user',

        {
            $user: username
        },

        (err, rows) => {
            console.log(rows);
            console.log('Grabbing ingredients for API call:', rows[0]);
            const myIngredientsList = JSON.parse(rows[0].ingredients);
            for(const myIngObj of myIngredientsList){
              ingredientsList.push(myIngObj['name']);

            }


            console.log("The given ingredients list is:", ingredientsList);
            let ingredients = '';
            //CHANGE THIS NUM TO DISPLAY DIFFERENT AMOUNT OF RECIPE RESULTS
            const numResults = 8;
            ingredientsList.forEach((i) => {
                i.replace(" ", "+");
                ingredients += i + "%2C";
            });
            const apiCall = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients?fillIngredients=false&ingredients="
                + ingredients + "&limitLicense=false&number=" + numResults + "&ranking=1";


            //work with the actual recipe steps
            let id = []; //make a list of ids
            let apiRecipe = '';
            //let chosenID = $(".backgroundImg").val();


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

                    //UNCOMMENT TO SHOW RESULTS
                    //console.log(result.status);   //it prints '200' -- what does status 200 mean?
                    //console.log(result.headers);   //it prints information about the request - useless?
                    //console.log(result.body);   //print recipes
                    myRecipes = result.body;

                    //get the id of the specific recipe
                    //console.log(req.cookies.id);
                    idNumber = req.cookies.id;


                    //console.log("Recipes (API call):", myRecipes);  //PRINTS THE RECIPES!!!

                    //store apiRecipe string here
                    apiRecipe = 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/' + idNumber + '/information?includeNutrition=false'; //string for api recipe
                    //get the actual recipe(gets info from recipe ID)

                    //recipe instructions
                    unirest.get(apiRecipe)
                        .header("X-Mashape-Key", "ZRc27DkA72mshgJldUbTYfADBUgnp1YbkANjsnMBCxTNjW5Krf")
                        .header("Accept", "application/json")
                        .end(function (result) {
                            //UNCOMMENT TO PRINT ALL THE INSTRUCTIONS!!!
                            //console.log(result.status, result.headers, result.body);
                            res.send(result.body);
                            //console.log(result.body);
                        });


                });

        });

});


// Start the server
app.listen(3000, () => {
    console.log("Server started on http://localhost:3000/");
});
