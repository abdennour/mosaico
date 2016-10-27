"use strict";
/* global module: false, console: false, __dirname: false */

const express = require('express');
const upload = require('jquery-file-upload-middleware');
const bodyParser = require('body-parser');



const config = require('../server-config.js');
const extend = require('util')._extend;
const app = express();
const routing = require('./routing');
const services = require('./services');

app.use(require('connect-livereload')({ ignore: [/^\/dl/] }));
// app.use(require('morgan')('dev'));

app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  limit: '5mb',
  extended: true
}));

app.post('/dl/', routing('post'));
app.get('/upload/', routing('get'));
app.get('/img/', routing('get'));

//---------------------



app.use('/upload/', upload.fileHandler(services.UploadService.uploadOptions));


module.exports = app;
