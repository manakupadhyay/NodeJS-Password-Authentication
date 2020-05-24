// LOGIN

const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// loading user model
const User = require("./usermodel.js");

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
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
            return done(null, user.email, { message: 'Password incorrect' });
          }
        });
      });
    })
  );
  // setting the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  //deleting the session
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
