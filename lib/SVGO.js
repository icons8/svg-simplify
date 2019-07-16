var
  Super = require('svgo'),
  Util = require('util'),
  Crypto = require('crypto');

module.exports = SVGO;

function SVGO() {
  Super.apply(this, arguments);
}

Util.inherits(SVGO, Super);

function hash(data) {
  return Crypto.createHash('sha1').update(data).digest('hex');
}

// see https://github.com/svg/svgo/blob/master/lib/svgo.js#L24
// Only difference is that instead of using the svg string lengths
// to detect if there is a difference between the result of each
// optimize() pass, we use a hash.
SVGO.prototype.optimize = function(svgstr, info) {
  return new Promise((resolve, reject) => {
    if (this.config.error) {
        reject(this.config.error);
        return;
    }

    var config = this.config,
        maxPassCount = config.multipass ? 10 : 1,
        counter = 0,
        prevHash = null,
        optimizeOnceCallback = (svgjs) => {
            if (svgjs.error) {
                reject(svgjs.error);
                return;
            }

            var dataHash = hash(svgjs.data);

            if (++counter < maxPassCount && dataHash != prevHash) {
                prevHash = dataHash;
                this._optimizeOnce(svgjs.data, info, optimizeOnceCallback);
            } else {
                if (config.datauri) {
                    svgjs.data = encodeSVGDatauri(svgjs.data, config.datauri);
                }
                if (info && info.path) {
                    svgjs.path = info.path;
                }
                resolve(svgjs);
            }
        };

    this._optimizeOnce(svgstr, info, optimizeOnceCallback);
  });
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