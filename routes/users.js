// contains pages related to users. eg. users/login, users/register
const express = require('express')
const bcrypt = require('bcryptjs');
const passport = require('passport');
const {forwardAuthenticated} = require('../config/auth.js');


const router = express.Router();
const User = require("../config/usermodel.js");

router.get('/login',forwardAuthenticated, (req, res) => { // =>  /users/login
  res.render('login')
})

router.get('/register',forwardAuthenticated, (req, res) => { // => /users/register
  res.render('register')
})


//handle register
router.post('/register', (req, res) => {
  const {
    name,
    email,
    password,
    password2
  } = req.body;
  var errors = [];


  // check required fields...
  if (!name || !email || !password || !password2) {
    errors.push({
      message: "Please fill all fields"
    });
  }

  // check password match
  if (password !== password2) {
    errors.push({
      message: "Passwords do not match"
    });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    // VALIDATION PASSED...
    User.findOne({
      email: email
    }, function(err, user) {
      if (err) {
        console.log(err);
      } else {
        if (user) {
          // user already exists
          errors.push({
            message: "User already exits"
          });
          res.render("register", {
            errors,
            name,
            email,
            password,
            password2
          });
        } else {
          const newUser = new User({
            name,
            email,
            password
          });
          //hash user's password
          bcrypt.genSalt(10, (err, salt) =>   // returns salt
            bcrypt.hash(newUser.password, salt, (err, hash) => {    // returns hash
              if (err) console.log(err);

              // set password to hashed password
              newUser.password = hash;

              // save the user...
              newUser.save()
                .then(user => {
                  // when we redirect, we can use flash to store messages in session...
                  req.flash("success_message", "You are now registered and can Login!");
                  res.redirect("/users/login");
                })
                .catch(err => console.log(err))
            }));
        }
      }
    })
  }
});

// handle Login
/*
Authenticating requests is as simple as calling passport.authenticate() and specifying which strategy to employ.

*/
router.post('/login', (req,res,next)=>{
  passport.authenticate('local',{
    successRedirect: '/dashboard',  // if auth is successfull, go to dashboard
    failureRedirect: '/users/login',  // if auth fails, go to login
    failureFlash: true,    // if auth fails, show the flash message
    successFlash: true
  })(req,res,next);
});

//handle logouts
router.get('/logout', (req,res)=>{
  // Invoking logout() will remove the req.user property and clear the login session (if any)
  req.logout();
  req.flash('success_message',"You are logged-out");
  res.redirect('login')
});

module.exports = router;
