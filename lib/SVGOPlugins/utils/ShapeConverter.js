
module.exports = {

  // see https://github.com/nfroidure/svgicons2svgfont/blob/1764298a2f14a2149fd62b449d710a96c59d09e1/src/index.js#L62
  rect: function(rect) {
    var
      x = rect.x || 0,
      y = rect.y || 0,
      w = rect.width || 0,
      h = rect.height || 0,
      rx = rect.rx || 0,
      ry = rect.ry || 0;

    ry = ry || rx;
    rx = rx || ry;

    if (rx == 0 && ry == 0) {
      return 'M' + x + ' ' + y + 'h' + w + 'v' + h + 'H' + x + 'V' + y + 'Z';
    }
    else {
      return '' +
        // start at the left corner
        'M' + (x + rx) + ' ' + y +
        // top line
        'h' + (w - (rx * 2)) +
        // upper right corner
        'a' + rx + ' ' + ry + ' 0 0 1 ' + rx + ' ' + ry +
        // Draw right side
        'v' + (h - (ry * 2)) +
        // Draw bottom right corner
        'a' + rx + ' ' + ry + ' 0 0 1 ' + (rx * -1) + ' ' + ry +
        // Down the down side
        'h' + ((w  - (rx * 2)) * -1) +
        // Draw bottom right corner
        'a' + rx + ' ' + ry + ' 0 0 1 ' + (rx * -1) + ' ' + (ry * -1) +
        // Down the left side
        'v' + ((h  - (ry * 2)) * -1) +
        // Draw bottom right corner
        'a' + rx + ' ' + ry + ' 0 0 1 ' + rx + ' ' + (ry * -1) +
        // Close path
        'z';
    }
  },

  circle: function(circle) {
    var
      cx = circle.cx || 0,
      cy = circle.cy || 0,
      r = circle.r || 0;

    return this.ellipse({
      cx: cx,
      cy: cy,
      rx: r,
      ry: r
    });
  },

  // Inspired by http://complexdan.com/svg-circleellipse-to-path-converter/
  // Inspired by http://stackoverflow.com/questions/5737975/circle-drawing-with-svgs-arc-path/10477334#10477334
  ellipse: function(ellipse) {
    var
      cx = ellipse.cx || 0,
      cy = ellipse.cy || 0,
      rx = ellipse.rx || 0,
      ry = ellipse.ry || 0;

    return 'M' + (cx + rx) + ',' + cy +
      'a' + rx + ',' + ry + ' 0 1,1 ' + (-rx * 2) + ',0' +
      'a' + rx + ',' + ry + ' 0 1,1 ' + (rx * 2) + ',0' +
      'z';
  }

};
