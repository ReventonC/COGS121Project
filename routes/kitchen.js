const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('recipes.db');
exports.view = function(req,res){
	//console.log(req);
	
	const username = req.cookies.username;	
	let ingredientsDB = [];	

	res.render('kitchen');

	db.all(
		'SELECT * FROM ingredients WHERE username=$user' ,
		{
			$user: username,
		},
		(err, rows) => {
			if(err)
				console.log("Couldn't get ingredients on the kitchen page");
			else{
				//Aaron: idk why it prints double ingredients
				console.log(rows);
				ingredientsDB = rows.map(e => e.ingredients);
				console.log("here are the ingredients we got from the db: " + ingredientsDB);
				//res.send(ingredientsDB);
			}
		}

	);
	res.render('kitchen');
	
}