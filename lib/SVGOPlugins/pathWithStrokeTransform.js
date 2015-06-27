'use strict';

exports.type = 'perItem';
exports.active = true;

var
  convertPathDataPlugin = require('./utils/convertPathDataPlugin'),
  svgoDefinitions = require('./utils/svgoDefinitions'),
  pathElems = svgoDefinitions.pathElems;

exports.params = convertPathDataPlugin.params;

/**
 * Force transform path elements with stroke.
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 */
exports.fn = function(item, params) {
  var
    stroke;

  if (item.isElem(pathElems) && item.hasAttr('d') && item.hasAttr('stroke') && item.hasAttr('transform')) {
    stroke = item.attr('stroke');
    item.removeAttr(stroke.name);
    convertPathDataPlugin.fn.call(this, item, params);
    item.addAttr(stroke);
  }

};