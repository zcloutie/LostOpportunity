//import $ from "jquery";
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
const AWS = require('aws-sdk');
const request = require('request');
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
global.fetch = require('node-fetch');

const poolData = {
UserPoolId : "us-east-1_3qxBN0BTv",
ClientId : "2i4rao45r680rdb69sce6hu20p"
};
const pool_region = 'us-east-1';

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

const express = require('express');
const router = express.Router();
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

function Login(email, password) {
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
            console.log('access token + ' + result.getAccessToken().getJwtToken());
            console.log('id token + ' + result.getIdToken().getJwtToken());
            console.log('refresh token + ' + result.getRefreshToken().getToken());
        },
        onFailure: function(err) {
            console.log(err);
        },

    });
}

function RegisterUser(email, password, firstname, lastname, accesslevel){
    var attributeList = [];
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"email",Value:email}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"password",Value:password}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"firstname",Value:firstname}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"lastname",Value:lastname}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"accesslevel",Value:accesslevel}));


    userPool.signUp(email, password, attributeList, null, function(err, result){
        if (err) {
            console.log(err);
            return;
        }
        cognitoUser = result.user;
        console.log('user name is ' + cognitoUser.getUsername());
    });
}

function DeleteUser() {
        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: username, //unsure where this username came from. might have to take username and password as the function's arguments
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
}

function deleteAttributes(username, password){
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
}

function ChangePassword(username, password, newpassword) {
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
}

function ValidateToken(token) {
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
}

function renew() {
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


RegisterUser("sample@gmail.com", "ABC123!@", "John", "Doe", "psychologist");
//LOGIN PAGE
router.get('/', (req, res) => {
  res.render('login');
});

router.post('/', (req, res) => {
  console.log(req.body.email);
  console.log(req.body.password);
  Login(req.body.email, req.body.password);
  res.render('login', { title: 'Registration form' });
});


module.exports = router;
/*
router.post('/',
[//can add requirements for inputs here
  body('firstname').isLength({min: 1}),
  body('lastname').isLength({min: 1}),
  body('email').isLength({min: 1}),
  body('accesslevel').isLength({min: 1}),
  body('password').isLength({min: 1}),
],
(req, res) => {
  const errors = validationResult(req);
  if(errors.isEmpty()){
    res.send('You are now registered');
  }
  else{//this part will hook up directly to a database. Then you will pull the info from there to make the do the user pool stuff
    res.render('login', {
      title: 'Registration',
      errors: errors.array(),
      data: req.body,
    });
  }
});
*/

//access_level is patient by default

/*
//To register, a user need: email (primary), given_name, family_name, access_level (string), password (min 8 char, 1 letter, 1 cap, 1 num, 1 special)
*/
