


module.exports = {
   createDB: function() {
     const sqlite3 = require('sqlite3');
     const db = new sqlite3.Database('recipes.db');
  
       // create a new database table for users if it does not already exist
       db.all(
         'SELECT name FROM sqlite_master WHERE type=\'table\' AND name=\'users\'',
         {},
         (err, rows) => {
           if(err){
             console.log("Error creating users table");
           }
           if(rows.length == 0){
             db.run("CREATE TABLE users (username TEXT, password TEXT)");
             console.log('successfully created users table in recipes.db');
           }
         }
       );

       // create new table for ingredients if it does not already exists
       db.all(
         'SELECT name FROM sqlite_master WHERE type=\'table\' AND name=\'ingredients\'',
         {},
         (err, rows) => {
           if(err){
             console.log("Error creating ingredients table");
           }
           if(rows.length == 0){
             db.run("CREATE TABLE ingredients (username TEXT, ingredients TEXT)");
             console.log('successfully created ingredients table in recipes.db');
           }
         }
       );
  

     db.close();
   }
}
