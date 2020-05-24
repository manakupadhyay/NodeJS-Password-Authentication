// contains home pages. eg. dashbord, home
const express = require('express')
const router = express.Router();

router.get('/', (req,res) => {    // =>  /
  res.render("welcome");
})

router.get('/about', (req,res) => {   // => /about/
  res.send("Welcome About");
})


module.exports = router;
