const express = require('express');
const http = require('http');
const handlebars = require('handlebars')
const path = require('path');
const app = express();
const bodyParser = require('body-parser');

const account = require ('./routes/account');
const kitchen = require('./routes/kitchen');
const recipeList = require ('./routes/recipeList');
const recipeResult = require('./routes/recipeResult');

// all environments
/*app.use(bodyParser.urlencoded({extended: true}));
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('IxD secret key'));
app.use(express.session());
app.use(app.router); */
app.use(express.static(path.join(__dirname, 'public')));



app.get('/account', account.view);
app.get('/kitchen', kitchen.view);
app.get('/recipeList', recipeList.view);
app.get('/recipeResult', recipeResult.view);






app.listen(3000, () => {
    console.log("Server started on http://localhost:3000/");
})
