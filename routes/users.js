// contains pages related to users. eg. users/login, users/register
const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');

const User = require("../config/usermodel.js");

router.get('/login', (req,res) => {    // =>  /users/login
  res.render('login')
})

router.get('/register', (req,res) => {   // => /users/register
  res.render('register')
})


//handle register
router.post('/register',(req,res)=>{
  const {name, email, password, password2} = req.body;
  var errors = [];


  // check required fields...
  if(!name || !email || !password || !password2){
    errors.push({message: "Please fill all fields"});
  }

  // check password match
  if(password !== password2){
    errors.push({message: "Passwords do not match"});
  }

  if(errors.length > 0){
    res.render("register",{
      errors,name,email,password,password2
    });
  }else{
    // VALIDATION PASSED...
    User.findOne({email: email}, function(err,user){
      if(err){
        console.log(err);
      }else{
        if(user){
          // user already exists
          errors.push({message:"User already exits"});
          res.render("register",{
            errors,name,email,password,password2
          });
        }else{
            var success = [];
            const newUser = new User({
              name,email,password
            });
              //hash password
              bcrypt.genSale(10,(err,salt) =>
              bcrypt.hash(newUser.password,salt,(err,hash)=>{
                if(err) throw err;
                // set password to hashed password
                newUser.password = hash;
                // save the user...
                newUser.save();
              }));
              success.push({message: "User Registerd. You can now Login."})

            res.render("login", {success});
        }
      }
    })

  }
});

module.exports = router;
