const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('recipes.db');
exports.view = function(req,res){
	//console.log(req);
	
	const username = req.cookies.username;	
	console.log(res);

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
			}
		}

	);
	res.render('kitchen');
}