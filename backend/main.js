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


app.post('/dl/', function(req, res) {
    var response = function(source) {

        if (req.body.action == 'download') {
            res.setHeader('Content-disposition', 'attachment; filename=' + req.body.filename);
            res.setHeader('Content-type', 'text/html');
            res.write(source);
            res.end();
        } else if (req.body.action == 'email') {
            var nodemailer = require('nodemailer');
            var transporter = nodemailer.createTransport(config.emailTransport);

            var mailOptions = extend({
                to: req.body.rcpt, // list of receivers
                subject: req.body.subject, // Subject line
                html: source // html body
            }, config.emailOptions);

            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                    res.status(500).send('Error: '+error);
                    res.write('ERR');
                } else {
                    console.log('Message sent: ' + info.response);
                    res.send('OK: '+info.response);
                }
            });
        }

    };

    /*
    var Styliner = require('styliner');
    var styliner = new Styliner(__dirname, { keepinvalid: true });
    styliner.processHTML(req.body.html).then(response);
    */
    response(req.body.html);
});

module.exports = app;
