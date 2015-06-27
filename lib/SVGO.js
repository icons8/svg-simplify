var
  Super = require('svgo'),
  Util = require('util'),
  Crypto = require('crypto');

module.exports = SVGO;

function SVGO() {
  Super.apply(this, arguments);
}

Util.inherits(SVGO, Super);

// see https://github.com/svg/svgo/blob/4d74b492bc4c7f42d461cbeb45a0d93a48e8499e/lib/svgo.js#L25
SVGO.prototype.optimize = function(svgstr, callback) {
  var
    _this = this,
    config = this.config,
    maxPassCount = config.multipass ? 10 : 1,
    counter = 0,
    prevHash = null
    ;

  function optimizeOnceCallback(svgjs) {
    var
      dataHash;

    if (svgjs.error) {
      callback(svgjs);
      return;
    }

    dataHash = hash(svgjs.data);
    if (++counter < maxPassCount && dataHash != prevHash) {
      prevHash = dataHash;
      _this._optimizeOnce(svgjs.data, optimizeOnceCallback);
    }
    else {
      callback(svgjs);
    }
  }

  function hash(data) {
    return Crypto.createHash('sha1').update(data).digest('hex');
  }

  _this._optimizeOnce(svgstr, optimizeOnceCallback);
};


SVGO.prototype.pluginToDown = function(name) {
  var
    plugins = this.config.plugins,
    i,
    j,
    slices = [];

  for (i = 0; i < plugins.length; i++) {
    for (j = 0; j < plugins[i].length; j++) {
      if (plugins[i][j].name == name) {
        Array.prototype.push.apply(
          slices,
          plugins[i].splice(j --, 1)
        );
      }
    }

    if (Array.isArray(plugins[i]) && plugins[i].length == 0) {
      plugins.splice(i --, 1);
    }
  }

  if (slices.length > 0) {
    i = plugins.length -1;
    j = plugins[i].length - 1;
    if (plugins[i][j].type == slices[0].type) {

      Array.prototype.push.apply(
        plugins[i],
        slices
      );

    }
    else {
      plugins.push(slices);
    }
  }

};