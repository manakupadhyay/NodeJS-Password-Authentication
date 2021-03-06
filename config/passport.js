// LOGIN AUTHENTICATION

const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// LOAD USER-MODEL FROM DATABASE
const User = require("./usermodel.js");

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {  // email,password- entered by user
      // Match user
      User.findOne({
        email: email
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'Email not registered' });  // (error,user,option/message)
        }
        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          // user found
          if (isMatch) {
            return done(null, user,{message:'Welcome'});
          }
          // entered password is incorrect
          else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );
  // SET THE SESSION
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  // DELETE SESSION
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
