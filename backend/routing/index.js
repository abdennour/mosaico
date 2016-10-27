const services = require('../services/index');
const url = require('url');
var routers = require('./routers.js');

const defaultRoutersProps = {
  action: 'index',
  methods:['get']
};

Object.keys(routers).forEach((uri) => {
     routers[uri] = Object.assign({}, defaultRoutersProps, routers[uri]);
});

const findRoutersByMethod = function(method ) {
    let _routers = Object.assign({}, routers);
    Object.keys(_routers).forEach((uri)=>{
        if (_routers[uri].methods.indexOf(method) < 0) {
          delete _routers[uri];
        }
    });
    return _routers;
}

const routingEngine = function(method) {

  var routersByMethod = findRoutersByMethod(method);
  return function(req, res) {
      try {
          var {controller,action} = routersByMethod[url.parse(req.url).pathname];
          new controller(req,res,services)[action]();
      } catch (e) {
        console.log(e);
        res.status(404).end();
      }
  };
};

module.exports = routingEngine ;
