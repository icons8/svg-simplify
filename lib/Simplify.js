var
  SVGO = require('./SVGO'),
  Promise = require('bluebird'),
  shapeToPathPlugin = require('./SVGOPlugins/shapeToPath'),
  groupAttrsToElemsPlugin = require('./SVGOPlugins/groupAttrsToElems'),
  pathWithStrokeTransformPlugin = require('./SVGOPlugins/pathWithStrokeTransform');

module.exports = Simplify;

function Simplify(data) {
  if (this === global) {
    return new Simplify(data).perform();
  }

  this._data = data;
  this._svgo = new SVGO({
    multipass: true,
    plugins: [
      { moveElemsAttrsToGroup: false },
      { shapeToPath: shapeToPathPlugin },
      { groupAttrsToElems: groupAttrsToElemsPlugin },
      { strokedPathTransform: pathWithStrokeTransformPlugin },
      { sortAttrs: true }
    ]
  });
  this._svgo.pluginToDown('sortAttrs');
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
