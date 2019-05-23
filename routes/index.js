//import $ from "jquery";
const express = require('express');
const router = express.Router();
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
//RegisterUser("sample@gmail.com", "Abc123!@", "John", "Doe", "psychologist");
//LOGIN PAGE
router.get('/', (req, res) => {
  res.render('login');
});

router.post('/', (req, res) => {
//  console.log(req.body.email);
//  console.log(req.body.password);
  //Login(req.body.email, req.body.password);


  res.render('login', { title: 'Registration form' });
});

function tryLogin(){
  console.log("hello");
  /*var email = document.getElementByID('inputEmail');
  var password = document.getElementById('inputPassword');
  console.log(email + password);
  Login(email, password);
  router.get("/", (req, res) => {
    res.render("dashboard");
  });

  router.post("/", (req, res) => {
    res.render("dashboard");
  });*/
}

module.exports = router;
