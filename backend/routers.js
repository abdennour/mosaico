/**
* @author http://abdennoor.com
*/
const controllers = require('./controllers');
/**
* SYNTAX: { URI : {controller,action }
*--------
*/
const routers = {
  'upload' : {
    controller : controllers.UploadController,
    action: 'start'
  },
  'img' : {
    controller : controllers.ImageController,
    action : 'processing'
  },
  'dl':{
    controller controllers.ExportController
  }
};

module.exports = routers;
