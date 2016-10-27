const AbstractController = require('./AbstractController.js');

class UploadController extends AbstractController {

  constructor() {
    super(...arguments);
  }

  start(){
    var that = this ;
    var uploadHost = `${this.request.protocol}://${this.request.get('host')}`;

    this.uploadService.listFiles( uploadHost,  function (files) {
      that.response.json({files });
    });
  }
}

module.exports = UploadController;
