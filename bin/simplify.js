#!/usr/bin/env node

const
  EXIT_ERROR = 1;

var
  Path = require('path'),
  Simplify = require('..'),
  execPath;

if (['-h', '--help'].indexOf(process.argv[2]) != -1) {
  execPath = Path.relative(process.cwd(), process.argv[1]);
  if (['.', Path.sep].indexOf(execPath[0]) == -1) {
    execPath = '.' + Path.sep + execPath;
  }

  process.stdout.write('Example: echo "<g><g transform=\\"rotate(1) scale(1,-1)\\"><circle r=\\"10\\" transform=\\"skewX(10)\\"/><rect width=\\"10\\" height=\\"10\\" /></g></g>" | ' + execPath + ' \n');
  process.exit();
}

var
  svg = '';

process.stdin.setEncoding('utf8');

process.stdin.on('readable', function() {
  var
    chunk = process.stdin.read();

  if (chunk !== null) {
    svg += chunk;
  }
});

process.stdin.on('end', function() {

  function errorHandler(e) {
    process.stderr.write(String(e) + '\n');
    process.exit(EXIT_ERROR);
  }

  try {
    Simplify(svg)
      .then(function(result) {
        process.stdout.write(result + '\n');
      })
      .catch(errorHandler);
  }
  catch(e) {
    errorHandler(e);
  }

});