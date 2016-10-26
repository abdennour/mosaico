"use strict";
/* global module: false, console: false, __dirname: false */

const express = require('express');
const upload = require('jquery-file-upload-middleware');
const bodyParser = require('body-parser');



const config = require('../server-config.js');
const extend = require('util')._extend;
const app = express();
const routers = require('./routers.js');
const services = require('./services');

app.use(require('connect-livereload')({ ignore: [/^\/dl/] }));
// app.use(require('morgan')('dev'));

app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  limit: '5mb',
  extended: true
}));
app.routingEngine = function(req, res) {
    try {
        var {Controller,action} = routers[req.params.uri];
        action = action || 'index';
        new Controller(req,res,services)[action]();
    } catch (e) {
      console.log(e);
      res.status(404).end();
    }
};
app.get('/:uri/', app.routingEngine);
app.post('/:uri/', app.routingEngine);
app.use('/upload/', upload.fileHandler(services.UploadService.uploadOptions));


module.exports = app;
