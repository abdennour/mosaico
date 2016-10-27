const fs = require('fs');
const _ = require('lodash');

class UploadService {
  constructor() {

  }
  get uploadOptions () {
    return UploadService.uploadOptions;
  }
  listFiles(uploadHost, callback) {

      var files = [];
      var counter = 1;
      var finish = function () {
          if (!--counter)
              callback(files);
      };
      let options = this.uploadOptions ;
      fs.readdir(options.uploadDir, _.bind(function (err, list) {
          _.each(list, function (name) {
              var stats = fs.statSync(options.uploadDir + '/' + name);
              if (stats.isFile()) {
                  var file = {
                      name: name,
                      url: uploadHost + options.uploadUrl + '/' + name,
                      size: stats.size
                  };
                  _.each(options.imageVersions, function (value, version) {
                      counter++;
                      fs.exists(options.uploadDir + '/' + version + '/' + name, function (exists) {
                          if (exists)
                              file.thumbnailUrl = uploadHost + options.uploadUrl + '/' + version + '/' + name;
                          finish();
                      });
                  });
                  files.push(file);
              }
          }, this);
          finish();
      }, this));
  };
}
/**
* == Public Static  Attributes
**/
UploadService.uploadOptions = {
  tmpDir: process.cwd()+'/.tmp',
  uploadDir: process.cwd()+'/uploads',
  uploadUrl: '/uploads',
  imageVersions: { thumbnail: { width: 90, height: 90 } }
};
module.exports = UploadService;
