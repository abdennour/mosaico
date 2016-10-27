/**
* @author http://abdennoor.com
*/
const controllers = require('../controllers/index');
/**
* SYNTAX: { URI : {controller,action,methods }
*--------
*/
const routers = {
  '/upload/' : {
    controller : controllers.UploadController,
    action: 'start',
    methods:['get']
  },
  '/img/' : {
    controller : controllers.ImageController,
    action : 'processing',
    methods:['get']
  },
  '/dl/':{
    controller :controllers.ExportController,
    methods:['post']
  }
};


module.exports = routers;
