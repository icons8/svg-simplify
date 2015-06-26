var
  regNumber = /[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/g;

module.exports = parseNumbers;

function parseNumbers(value) {
  return (String(value).match(regNumber) || []).map(Number);
}