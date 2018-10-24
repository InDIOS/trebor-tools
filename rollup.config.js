const path = require('path');

const input = path.join(__dirname, './src/index.js');
const output = [{
  format: 'es',
  file: path.join(__dirname, 'index.js'),
  sourcemap: true
}];

module.exports = { input, output };
