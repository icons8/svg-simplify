'use strict';

// Inspired by https://github.com/svg/svgo/blob/4d74b492bc4c7f42d461cbeb45a0d93a48e8499e/plugins/moveGroupAttrsToElems.js

exports.type = 'perItem';
exports.active = true;

var
  svgoDefinitions = require('./utils/svgoDefinitions'),
  containerElements = svgoDefinitions.elemsGroups.container,
  shapeElements = svgoDefinitions.elemsGroups.shape,
  inheritableAttrs = svgoDefinitions.inheritableAttrs,
  attributes = inheritableAttrs.filter(function(attr) {
    return attr != 'transform';
  }),
  elements = [].concat(containerElements, shapeElements);

/**
 * Move group attrs to the content elements.
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 */
exports.fn = function(item) {
  var
    attrs;

  if (item.isElem(containerElements) && !item.isEmpty()) {

    attrs = attributes
      .filter(function(attr) {
        return item.hasAttr(attr);
      });

    item.content.forEach(function(inner) {
      if (inner.isElem(elements)) {
        attrs.forEach(function(attr) {
          var
            v;

          if (!inner.hasAttr(attr)) {
            v = item.attr(attr);

            inner.addAttr({
              name: v.name,
              value: v.value,
              prefix: v.prefix,
              local: v.local
            });
          }
        });
      }
    });

    item.removeAttr(attrs);
  }

};