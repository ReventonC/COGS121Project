const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('recipes.db');

// run each database statement *serially* one after another
// (if you don't do this, then all statements will run in parallel,
//  which we don't want)
db.serialize(() => {
  // create a new database table:
  db.run("CREATE TABLE users (username TEXT, password TEXT)");
  db.run("CREATE TABLE ingredients (username TEXT, fridge_list TEXT, spice_rack TEXT, cupboard TEXT)");

  console.log('successfully created users and ingredients tables in recipes.db');
});

db.close();
