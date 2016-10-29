const AbstractController = require('./AbstractController.js');
const extend = require('util')._extend;
const config = require('../../server-config.js');
class ExportController extends AbstractController {

  constructor() {
    super(...arguments);
  }

  index(){
    var that = this;
    var response = function(source) {
      if (that.request.body.action == 'download') {
          that.response.setHeader('Content-disposition', 'attachment; filename=' + that.request.body.filename);
          //that.response.setHeader('Content-type', 'text/html');
          that.response.writeHead(200, {"Content-Type": "text/html",'Content-disposition':'attachment; filename=' + that.request.body.filename});
          that.response.end(source);
      } else if (that.request.body.action == 'email') {
            var nodemailer = require('nodemailer');
            var transporter = nodemailer.createTransport(config.emailTransport);

            var mailOptions = extend({
                to: that.request.body.rcpt, // list of receivers
                subject: that.request.body.subject, // Subject line
                html: source // html body
            }, config.emailOptions);

            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                    that.response.status(500).send('Error: '+error);
                    that.response.write('ERR');
                } else {
                    console.log('Message sent: ' + info.response);
                    that.response.send('OK: '+info.response);
                }
            });
          }

        };

        /*
        var Styliner = require('styliner');
        var styliner = new Styliner(__dirname, { keepinvalid: true });
        styliner.processHTML(that.request.body.html).then(response);
        */
      response(that.request.body.html);
  }


  email() {

  }

  download() {

  }
}

module.exports = ExportController;
