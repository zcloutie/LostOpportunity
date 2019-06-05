var cognito = require('../routes/cognito');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });
const express = require("express");
const router = express.Router();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var jsdom = require("jsdom");
var fs = require("fs");
var jquery = require("jquery");
var patient_array = [];

// Display the dashboard page
router.get("/", (req, res) => {
  res.render("dashboard");
});
//RegisterUser("demo@gmail.com", "Abc123!@", "Dr", "Lastnayme", "psychiatrist");
router.post("/", urlencodedParser, (req, res) => {

  cognito.Login(req.body.email,  req.body.password, res)
  fs.readFile('./views/dashboard.html', 'utf8', (err, data) => {
      const dom = new jsdom.JSDOM(data);
      const $ = jquery(dom.window);

      var xhr = new XMLHttpRequest();
      xhr.open("GET", "https://fw5kv4740f.execute-api.us-east-1.amazonaws.com/production/all", true);
      xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {
            var response = JSON.parse(xhr.responseText);
            $('#patients').html(''); //clear the current stuff

            for(k in response) {
              var text = '<div class="jumbotron col-sm-10"> <div class="row"><div class="col col-lg-2"><img src="../public/images/person.png" height="100" width="100"></div><div class="col-md-auto"><h1><a href="../views/patientView';
              var text2 = '.html">';
              var text3 = '</a></h1><p class="lead">Next Appointment: {{Date}} | Previous Appointment: {{Date}}</p></div></div></div>';
              var result = text + response[k].user_reference + text2 + response[k].first_name + ' ' + response[k].middle_name + ' ' + response[k].last_name + text3;
              $('#patients').append(result);
              patient_array.push(response[k].user_reference);
            }

              patient_array.forEach(function(element) {

              fs.readFile('./views/patientView.html', 'utf8', (errr, data1) => {
                console.log(element);
                  const d = new jsdom.JSDOM(data1);
                  const jq = jquery(d.window);

                  var http = new XMLHttpRequest();
                  var url = "https://fw5kv4740f.execute-api.us-east-1.amazonaws.com/production/" + element;
                  //console.log(element);

                  http.open("GET", url, true);
                  http.setRequestHeader("Access-Control-Allow-Origin", "*");
                  http.setRequestHeader('Content-Type', 'application/json');
                  http.onreadystatechange = function() {
                    if(http.readyState == 4 && http.status == 200) {
                        var resp = JSON.parse(http.responseText);
                        jq('#patientDetails').html(''); //clear the current
                        var txt = '<p>';
                        for(i in resp) {
                          for(j in resp[i]){
                            txt += '<strong>' + j + '</strong>: ' + resp[i][j] + '</br>';
                          }
                        }
                        jq('#patientDetails').append(txt + '</p>');
                        jq('#patientName').html('');
                        jq('#patientName').append('<h1 class="mt-4">' + resp[0].first_name + ' ' +resp[0].middle_name + ' ' + resp[0].last_name + '</h1>');
                        fs.writeFile('views/patientView' + element + '.html', d.serialize(), errr => {
                            console.log('done' + element);
                        });
                        }
                    }
                  http.send(null);
              });
            });

              fs.writeFile('views/dashboard.html', dom.serialize(), err => {
                  console.log('actually done');
              });
            }
        }
      xhr.send(null);

  });
});
module.exports = router;
