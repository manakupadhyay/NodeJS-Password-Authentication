const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/usersDB", {useNewUrlParser: true, useUnifiedTopology: true})
// .then(() => console.log("Connected to DB");)
// .catch((err) => console.log(err););

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const user = mongoose.model('User', userSchema);

module.exports = user;
