
  const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
  const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
  const AWS = require('aws-sdk');
  const request = require('request');
  const jwkToPem = require('jwk-to-pem');
  const jwt = require('jsonwebtoken');
  global.fetch = require('node-fetch');

  const poolData = {
  UserPoolId : "us-east-1_g08JqU8wy",
  ClientId : "3candjflnfutjlsnaqe6qq2c51"
  };
  const pool_region = 'us-east-1';

  const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

  var success = false;
  var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

module.exports = {

  getPatientInfo: function(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://fw5kv4740f.execute-api.us-east-1.amazonaws.com/production/all", true);
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
    //console.log("HERE IS PATIENT INFO" + response);
    //return response;
  },

  Login: function(email, password, res) {
      var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
          Username : email,
          Password : password,
      });

      var userData = {
          Username : email,
          Pool : userPool
      };
      var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

      cognitoUser.authenticateUser(authenticationDetails, {
          onSuccess: function (result) {
              success = true;
              console.log('access token + ' + result.getAccessToken().getJwtToken());
              console.log('id token + ' + result.getIdToken().getJwtToken());
              console.log('refresh token + ' + result.getRefreshToken().getToken());

              console.log("THIS IS AFTER");
              res.render("dashboard");
          },
          onFailure: function(err) {
              success = false;
              console.log(err);
              res.redirect("/"); //probably will have to go to an error page
          },

      });
  },

  RegisterUser: function(email, password, firstname, lastname, accesslevel){
      var attributeList = [];
      attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"email",Value:email}));
    //  attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"password",Value:password}));
      attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"given_name",Value:firstname}));
      attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"family_name",Value:lastname}));
    //  attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"access_level",Value:accesslevel}));


      userPool.signUp(email, password, attributeList, null, function(err, result){
          if (err) {
              console.log(err);
              return;
          }
          cognitoUser = result.user;
          console.log('user name is ' + cognitoUser.getUsername());
      });
  },

  DeleteUser: function() {
          var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
              Username: username,
              Password: password,
          });

          var userData = {
              Username: username,
              Pool: userPool
          };
          var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

          cognitoUser.authenticateUser(authenticationDetails, {
              onSuccess: function (result) {
                  cognitoUser.deleteUser((err, result) => {
                      if (err) {
                          console.log(err);
                      } else {
                          console.log("Successfully deleted the user.");
                          console.log(result);
                      }
                  });
              },
              onFailure: function (err) {
                  console.log(err);
              },
          });
  },

  deleteAttributes: function(username, password){
          var attributeList = [];
          attributeList.push("custom:scope");
          attributeList.push("name");

          var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
              Username: username,
              Password: password,
          });

          var userData = {
              Username: username,
              Pool: userPool
          };
          var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

          cognitoUser.deleteAttributes(attributeList, (err, result) => {
              if (err) {
                  //handle error
              } else {
                  console.log(result);
              }
          });
  },

  ChangePassword: function(username, password, newpassword) {
          var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
              Username: username,
              Password: password,
          });

          var userData = {
              Username: username,
              Pool: userPool
          };
          var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

          cognitoUser.authenticateUser(authenticationDetails, {
              onSuccess: function (result) {
                  cognitoUser.changePassword(password, newpassword, (err, result) => {
                      if (err) {
                          console.log(err);
                      } else {
                          console.log("Successfully changed password of the user.");
                          console.log(result);
                      }
                  });
              },
              onFailure: function (err) {
                  console.log(err);
              },
          });
  },

  ValidateToken: function(token) {
          request({
              url: 'https://cognito-idp.${pool_region}.amazonaws.com/${poolData.UserPoolId}/.well-known/jwks.json',
              json: true
          }, function (error, response, body) {
              if (!error && response.statusCode === 200) {
                  pems = {};
                  var keys = body['keys'];
                  for(var i = 0; i < keys.length; i++) {
                      //Convert each key to PEM
                      var key_id = keys[i].kid;
                      var modulus = keys[i].n;
                      var exponent = keys[i].e;
                      var key_type = keys[i].kty;
                      var jwk = { kty: key_type, n: modulus, e: exponent};
                      var pem = jwkToPem(jwk);
                      pems[key_id] = pem;
                  }
                  //validate the token
                  var decodedJwt = jwt.decode(token, {complete: true});
                  if (!decodedJwt) {
                      console.log("Not a valid JWT token");
                      return;
                  }

                  var kid = decodedJwt.header.kid;
                  var pem = pems[kid];
                  if (!pem) {
                      console.log('Invalid token');
                      return;
                  }

                  jwt.verify(token, pem, function(err, payload) {
                      if(err) {
                          console.log("Invalid Token.");
                      } else {
                          console.log("Valid Token.");
                          console.log(payload);
                      }
                  });
              } else {
                  console.log("Error! Unable to download JWKs");
              }
          });
  },

  renew: function() {
      const RefreshToken = new AmazonCognitoIdentity.CognitoRefreshToken({RefreshToken: "your_refresh_token_from_a_previous_login"});

      const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

      const userData = {
          Username: "sample@gmail.com",
          Pool: userPool
      };

      const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

      cognitoUser.refreshSession(RefreshToken, (err, session) => {
          if (err) {
              console.log(err);
          } else {
              let retObj = {
                  "access_token": session.accessToken.jwtToken,
                  "id_token": session.idToken.jwtToken,
                  "refresh_token": session.refreshToken.token,
              }
              console.log(retObj);
          }
      })
  }

};
