var
  SVGO = require('svgo'),
  Promise = require('bluebird'),
  shapeToPathPlugin = require('./SVGOPlugins/shapeToPath');

module.exports = Simplify;

function Simplify(data) {
  if (this === global) {
    return new Simplify(data).perform();
  }

  this._data = data;
  this._svgo = new SVGO({
    multipass: true,
    plugins: [
      { shapeToPath: shapeToPathPlugin }
    ]
  });
}

Simplify.prototype = {

  perform: function() {
    var
      data = this._data,
      svgo = this._svgo;

    return new Promise(function(resolve, reject) {
      svgo.optimize(data, function(result) {
        if (!result.data || result.error) {
          reject(result.error || 'Unknown SVGO error');
          return;
        }
        resolve(result.data);
      });
    });

  }

};
