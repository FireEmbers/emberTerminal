var wrap = require('./wrap');
var write = require('./../utils/writeSync');
var createDataUnit = require('./../utils/createDataUnits');

var runs = 100
var moisture = 5;
var u = [2,10]; // 2m/s, 10%
var windDir = 135;

var rows = 100;
var cols = 100;

var coord = {lat:[41,1,2.00],lon:[-8,2,1.00]};

var height = 4000;
var width = 4000;

var dataUnits = createDataUnit( runs, moisture, u, windDir);

write(JSON.stringify(dataUnits),'data.json');

wrap(coord, height, width, rows, cols, function(RunFunc) {
  write(RunFunc,'Run.js'); 
});







