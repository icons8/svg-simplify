'use strict';

var
  ShapeConverter = require('./utils/ShapeConverter'),
  SvgPath = require('svgpath');

exports.type = 'perItem';
exports.active = true;

var
  NONE = { value: 0 };

/**
 *
 * @see http://www.w3.org/TR/SVG/shapes.html
 *
 * @param {Object} item current iteration item
 * @param {Object} params plugin params
 * @return {Boolean} if false, item will be filtered out
 *
 */
exports.fn = function(item) {

  if (item.isElem('rect')) {
    if (!item.hasAttr('width') || !item.hasAttr('height')) {
      return false;
    }
    else if (item.hasAttr('rx') || item.hasAttr('ry')) {
      rect(item);
    }
  }
  else if (item.isElem('circle')) {
    if (!item.hasAttr('r')) {
      return false;
    }
    circle(item);
  }
  else if (item.isElem('ellipse')) {
    if (!item.hasAttr('rx') || !item.hasAttr('ry')) {
      return false;
    }
    ellipse(item);
  }
};

function rect(item) {
  var
    x = +(item.attr('x') || NONE).value,
    y = +(item.attr('y') || NONE).value,
    width  = +item.attr('width').value,
    height = +item.attr('height').value,
    rx = +(item.attr('rx') || NONE).value,
    ry = +(item.attr('ry') || NONE).value;

  // see https://github.com/svg/svgo/blob/4d74b492bc4c7f42d461cbeb45a0d93a48e8499e/plugins/convertShapeToPath.js#L43
  if (isNaN(x - y + width - height + rx - ry)) return;

  item.addAttr({
    name: 'd',
    value: ShapeConverter.rect({
      x: x,
      y: y,
      width: width,
      height: height,
      rx: rx,
      ry: ry
    }),
    prefix: '',
    local: 'd'
  });

  item.renameElem('path')
    .removeAttr(['x', 'y', 'width', 'height', 'rx', 'ry']);
}

function circle(item) {
  var
    cx = +(item.attr('cx') || NONE).value,
    cy = +(item.attr('cy') || NONE).value,
    r = +(item.attr('r') || NONE).value,
    pathData;

  if (isNaN(cx - cy + r)) return;

  pathData = ShapeConverter.circle({
    cx: cx,
    cy: cy,
    r: r
  });

  pathData = new SvgPath(pathData)
    .unarc()
    .toString();

  item.addAttr({
    name: 'd',
    value: pathData,
    prefix: '',
    local: 'd'
  });

  item.renameElem('path')
    .removeAttr(['cx', 'cy', 'r']);
}

function ellipse(item) {
  var
    cx = +(item.attr('cx') || NONE).value,
    cy = +(item.attr('cy') || NONE).value,
    rx = +(item.attr('rx') || NONE).value,
    ry = +(item.attr('ry') || NONE).value,
    pathData;

  if (isNaN(cx - cy + rx - ry)) return;

  pathData = ShapeConverter.ellipse({
    cx: cx,
    cy: cy,
    rx: rx,
    ry: ry
  });

  pathData = new SvgPath(pathData)
    .unarc()
    .toString();

  item.addAttr({
    name: 'd',
    value: pathData,
    prefix: '',
    local: 'd'
  });

  item.renameElem('path')
    .removeAttr(['cx', 'cy', 'r']);
}