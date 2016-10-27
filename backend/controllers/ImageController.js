const AbstractController = require('./AbstractController.js');

const gm = require('gm').subClass({imageMagick: true});

class ImageController extends AbstractController {
  constructor() {
    super(...arguments);
  }

  // imgProcessorBackend + "?src=" + encodeURIComponent(src) + "&method=" + encodeURIComponent(method) + "&params=" + encodeURIComponent(width + "," + height);
  processing() {
    var params = this.request.query.params.split(',');

    if (this.request.query.method == 'placeholder') {
        var out = gm(params[0], params[1], '#707070');
        this.response.set('Content-Type', 'image/png');
        var x = 0, y = 0;
        var size = 40;
        // stripes
        while (y < params[1]) {
            out = out
              .fill('#808080')
              .drawPolygon([x, y], [x + size, y], [x + size*2, y + size], [x + size*2, y + size*2])
              .drawPolygon([x, y + size], [x + size, y + size*2], [x, y + size*2]);
            x = x + size*2;
            if (x > params[0]) { x = 0; y = y + size*2; }
        }
        // text
        out = out.fill('#B0B0B0').fontSize(20).drawText(0, 0, params[0] + ' x ' + params[1], 'center');
        out.stream('png').pipe(this.response);

    } else if (this.request.query.method == 'resize') {
        var ir = gm(this.request.query.src);
        ir.format(function(err,format) {
            if (!err) this.response.set('Content-Type', 'image/'+format.toLowerCase());
            ir.autoOrient().resize(params[0] == 'null' ? null : params[0], params[1] == 'null' ? null : params[1]).stream().pipe(this.response);
        });

    } else if (this.request.query.method == 'cover') {
        var ic = gm(this.request.query.src);
        ic.format(function(err,format) {
            if (!err) this.response.set('Content-Type', 'image/'+format.toLowerCase());
            ic.autoOrient().resize(params[0],params[1]+'^').gravity('Center').extent(params[0], params[1]+'>').stream().pipe(this.response);
        });

    }
  }
}


module.exports = ImageController;
