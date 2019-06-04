var jsdom = require("jsdom").JSDOM;
//const { JSDOM } = jsdom;
//const { window } = new JSDOM();
//const { document } = (new JSDOM('')).window;
//global.document = document;

//var $ = jQuery = require('jquery')(window);

var cognito = require('../routes/cognito');
 
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });
const express = require("express");
const router = express.Router();

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

jsdom.fromFile("./views/dashboard.html").then(dom => {
  const window = dom.window;
  const document = window.document;
  var $ = jQuery = require('jquery')(window);

  $(document).ready(function() {
    //console.log($("html").html());
    //console.log(window.location.href);
  // Display the dashboard page
  router.get("/", (req, res) => {
    res.render("dashboard");
  });
  //RegisterUser("demo@gmail.com", "Abc123!@", "Dr", "Lastnayme", "psychiatrist");
  router.post("/", urlencodedParser, (req, res) => {

      cognito.Login(req.body.email,  req.body.password, res)
      /*//console.log(Math.random());
      //After rendering the dashboard
      var xhr = new XMLHttpRequest();
      xhr.open("GET", "https://fw5kv4740f.execute-api.us-east-1.amazonaws.com/production/all", true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {
            var response = JSON.parse(xhr.responseText);
            for(k in response) {

            //$("#patients").html("");


              <div class="jumbotron col-sm-10">
        				<div class="row">
        					<div class="col col-lg-2">
        						<img src="../public/images/samplepatient3.jpg" height="100" width="100">
        					</div>
        					<div class="col-md-auto">
        						<h1><a href="../views/patientView3.html"> response[k].first_name + " " + response[k].middle_name + " " +  response[k].last_name </a></h1>
        						<p class="lead">Next Appointment: {{Date}} | Previous Appointment: {{Date}}</p>
        					</div>
        				</div>
        			</div>

              console.log(response[k].first_name + " " + response[k].middle_name + " " +  response[k].last_name);
              //im able to get the information but i cant dynamically change the page
            }
        }
      }
      xhr.send(null);
  */

  });

  });
  });
module.exports = router;
