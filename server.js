const express = require('express');
const handlebars = require('handlebars')
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, () => {
    console.log("Server started on http://localhost:3000/");
})