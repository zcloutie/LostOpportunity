const express = require('express');
const path = require('path');
//const routes = require('./routes/index');
const bodyParser = require('body-parser');

const dashboard = require("./routes/dashboard");
const login = require("./routes/index");

const app = express();
app.set('views', path.join(__dirname, 'views'));
//app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, '/public')));
var engines = require('consolidate');
app.engine('html', engines.mustache);
app.set('view engine', 'html');
//app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: true }));

//set the routes
app.use('/', login);
app.use('/dashboard', dashboard);

module.exports = app;
