var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });
const express = require("express");
const router = express.Router();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

function getPatientInfo(){
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://fw5kv4740f.execute-api.us-east-1.amazonaws.com/production/all", true);
  xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function() {
    if(xhr.readyState == 4 && xhr.status == 200) {
        var response = JSON.parse(xhr.responseText);
        console.log(response);
        return response;
        for(k in response) {
          $("#patients").html('<div class="jumbotron col-sm-10"> <div class="row"> <div class="col col-lg-2">	<img src="../public/images/samplepatient3.jpg" height="100" width="100"> </div>	<div class="col-md-auto">	<h1><a href="../views/patientView3.html"> response[k].first_name + " " + response[k].middle_name + " " +  response[k].last_name </a></h1>	<p class="lead">Next Appointment: {{Date}} | Previous Appointment: {{Date}}</p>	</div></div></div>');
          }
        }
    }
  xhr.send(null);
}
