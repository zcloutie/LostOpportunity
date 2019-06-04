var cognito = require('../routes/cognito');
const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

router.get("/", (req, res) => {
  res.render("/");
});

router.post("/", urlencodedParser, (req, res) => {

  cognito.RegisterUser(req.body.email, req.body.password, req.body.first_name, req.body.last_name, "patient");
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "https://fw5kv4740f.execute-api.us-east-1.amazonaws.com/production", true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function() {
    if(xhr.readyState == 4 && xhr.status == 200) {
        console.log(xhr.responseText);
    }
  }
  xhr.send(JSON.stringify({
   user_reference: Math.random() * 100000000,
   gender: req.body.genderRadios,
   date_of_birth: req.body.DOB,
   ssn: req.body.SSN,
   address: req.body.address,
   city: req.body.city,
   state: req.body.state,
   zip_code: req.body.zip,
   cell_phone: req.body.cell,
   email: req.body.email,
   enroll_date: req.body.enroll,
   ethnicity: req.body.ethn,
   height: req.body.ft[0] * 12 + req.body.in[0],
   weight: req.body.weight,
   shoes: req.body.shoes,
   waist: req.body.waist,
   shirt_size: req.body.shirt,
   school_grade: req.body.grade,
   religious_pref: req.body.religion,
   any_note: "N/A"
 }));

 //SHould send to page 2 and then have the last page redirect to the login
  res.redirect("views/registration2.html");
});

module.exports = router;
