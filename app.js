const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const app = express();


//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//BODYPARSER
app.use(express.urlencoded({extended:false}));

//other files
var index = require('./routes/index.js');
var users = require('./routes/users.js');

// routes
app.use('/', index);    // => /home/...
app.use('/users', users);   // => /users/...



//setting up port
const PORT = process.env.PORT || 3000;
app.listen(PORT, function(){
  console.log('Server started on port 3000');
})
