const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

const app = express();
const initializePassport = require('./config/passport.js');
initializePassport(passport);   // calling function in passport.js

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//BODYPARSER
app.use(express.urlencoded({extended:false}));

// EXPRESS SESSION
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// PASSPORT MIDDLEWARE
app.use(passport.initialize());
app.use(passport.session());

// CONNECT FLASH
app.use(flash());

// GLOBAL VARIABLES
app.use((req,res,next)=>{
    res.locals.success_message = req.flash("success_message");
    res.locals.error_message = req.flash("error_message");
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// OTHER ROUTES
var index = require('./routes/index.js');
var users = require('./routes/users.js');

// routes
app.use('/', index);    // => /...
app.use('/users', users);   // => /users/...



// PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, function(){
  console.log('Server started on port 3000');
})
