'use strict';

const path = require('path');
const request = require('request');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const express = require('express');

let routes = require('./routes/index');

const app = express();


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authentication");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    next();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.listen(8001, function () {
    console.log(' The app is up on port: ', 8001);
});