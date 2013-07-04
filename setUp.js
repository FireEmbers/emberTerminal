var wrap = require('./wrap');
var write = require('./../utils/writeSync');
var write2D = require('./../utils/write2D');
var createDataUnit = require('./../utils/createDataUnits');

var runs = 1
var moisture = 5;
var u = [2*0.1,10]; // [U m/s, SD %] wind speed at 10 m * Wind Adjustment factor for U @ ~ 10 m to mid flame speed
var windDir = 135;

var rows = 500;
var cols = 500;

var coord = {lat:[41,43,16.46],lon:[ 8,9,8.32]}; 

var height = 10000;
var width = 10000;

var dataUnits = createDataUnit( runs, moisture, u, windDir);

write(JSON.stringify(dataUnits),'data.json');

wrap(coord, height, width, rows, cols, function(RunFunc, aspectArray, slopeArray, clcArray) {
  
  write(RunFunc,'Run.js'); 

  var nodeRun =
  'var write2D = require(\'./../utils/write2D\');'+
  'var parseArray = require(\'./../utils/parseArray\');'+ RunFunc +
  'write2D(parseArray(Run(['+ moisture + ', ' + u[0] + ', '+ windDir +']), '+ rows+ ', '+ cols+'), '+ rows+ ', '+ cols+', \'ignMap.dat\');'

  write(nodeRun, 'nodeRun.js');

  write2D(aspectArray, rows,cols,'aspect.map');
  write2D(slopeArray, rows,cols,'slope.map');
  write2D(clcArray, rows,cols,'clc.map');

});







