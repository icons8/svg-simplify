var
  should = require('should-promised'),
  Simplify = require('..')
  ;

describe('Simplify', function () {


  it('should work', function() {

    Simplify('<svg><g transform="rotate(1)"><ellipse cx="10" cy="10" style="stroke: rgba(255,0,0,.5); fill: none;" stroke-dasharray="30,100" rx="10" ry="5"/><rect width="10"></rect><circle></circle></g></svg>')
      .should
      .finally
      .eql('<svg><path stroke-dasharray="30,100" stroke="rgba(255,0,0,.5)" fill="none" d="M19.822 10.348a10 5 1 1 1-19.997-.35 10 5 1 1 1 19.997.35z"/></svg>');

    Simplify('<svg><g transform="rotate(10)" style="fill:rgb(0,0,255);"><g transform="skewY(10) translate(2, 10) scale(1,-1)"><rect cx="0" cy="0" width="10" height="10"/></g><g><rect width="10" height="10" rx="2" ry="1" x="10" transform="rotate(-10)"/></g></g></svg>')
      .should
      .finally
      .eql('<svg><g fill="#00F"><path d="M.172 10.543l9.542 3.473 1.736-9.848L1.908.695z"/><path d="M12 0h6a2 1 0 0 1 2 1v8a2 1 0 0 1-2 1h-6a2 1 0 0 1-2-1V1a2 1 0 0 1 2-1z"/></g></svg>');

    Simplify('<svg><circle cx="10" cy="10" r="5" transform="skewX(10)" style="fill:rgba(0, 255, 0, .5)"></circle></svg>')
      .should
      .finally
      .eql('<svg><path fill="rgba(0, 255, 0, .5)" d="M16.763 10a5.46 4.58 42.48 1 1-10 0 5.46 4.58 42.48 1 1 10 0z"/></svg>')

  });


});