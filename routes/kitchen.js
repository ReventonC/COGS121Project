const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('recipes.db');
exports.view = function(req,res){
	res.render('kitchen');
}