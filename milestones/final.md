(**Feel free to add stuff to what you did or the rest of the MD file, this is just an outline before final turn in **)

(* ADD DEMO VIDEO LINK HERE *)

(It says paragraphs or bullet points ?)

Yahav Erlich - Backend + Database

Zehua Chen - Frontend Design + Data Rendering

Aaron Wong - Backend + API

Erika Nunotani - Frontend Design + Graphic Design

server.js -- runs the server, does user account login checking, does all database stores and reads. Does all API calls and sends data to frontend for rendering by checking for HTTP reqeusts and sending back data accordingly.
             
create_db.js -- this script is run automatically by server.js if the database has not yet been created on the server. 
                Simply create SQLite tables
                
views/*.handlebars -- all of our HTML skeleton code that is the UI for our web app

routes/*.js -- all of our routing files so that we can render JavaScript on the frontend in different files

public/js/account.js, 
public/js/kitchen.js, 
public/js/login.js,   -- handles logging in and and calls to the database for each user. Uses                              Ajax calls to handle requests for a specific user. Also does checks                              for correct passwords.
public/js/recipeList.js, 
public/js/recipeResult.js -- all of the files that were routed to. All frontend JavaScript code. We used a library called
                             Vue that helps us render all the frontend UI data in an elegant manner. All Ajax calls are made 
                             in these files to send and grab data from backend.
                             
public/css/style.sass,
public/css/style.css
public/css/style.min.css -- .sass is the actual style sheet we write. It compiles to the 2 css files that are used in all the pages.
