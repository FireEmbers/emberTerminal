var cconv = require('cconv');

var slopeArray = new Array(rows*cols);
var aspectArray = new Array(rows*cols);
var clcArray = new Array(rows*cols);

module.exports = function(coord, height, width, rows, cols, cb) {

  var dataUnit = [MOISTUREPART, WINDU, WINDDIR];

  

  var programString;

  var runnerCounter = 3;

  var sridA = 4258;
  var sridB = 3035;

  var cA = [ coord['lat'][0] + coord['lat'][1] / 60 + coord['lat'][2] /3600, -
  (coord['lon'][0] +  coord['lon'][1] / 60 + coord['lon'][2]/3600)];

  var f = true;

  cB = cconv(sridA, sridB, cA, f);

  var W = cB[0] - length/2;
  var E = cB[0] + length/2;
  var N = cB[1] + width/2;
  var S = cB[1] - width/2;

  loadClcMap(N, S, E, W, rows, cols, height, width, cb);

}

function loadClcMap(N, S, E, W, rows, cols, height, width, cb){

  var getCorine = require('../clcServer');

  getCorine( N, S, E, W, rows, cols, onClcLoad );

  function onClcLoad(data){

    clcArray = data;

    loadGrassMaps(N, E, S, W, rows, cols, height, width, cb);

  }

}

function loadGrassMaps(N, E, S, W, rows, cols, height, width, cb){

  var grassServer = require('grassServer');

  grassServer(N, S, E, W, rows, cols, onGrassLoad );

  function onGrassLoad(aspect, slope){

    aspectArray = aspect;
    slopeArray = slope;

    loadEngine(height, width, rows, cols, cb);

  }

}

function loadEngine(height, width, rows, cols, cb){

  var readFile = require('./../utils/readFile');

  readFile('program.min.js', onEngineLoad);

  function onEngineLoad(string){

    programString = string; 

    function RunString(){

      function Run(dataUnit){

        var core = req(1);

        return core(dataUnit, rows, cols, aspectMap, slopeMap, clcMap, height, width);

      }

      var
       string = Run.toString() + ';' + programString +
      'var rows =' + rows.toString() + ';' +
      'var cols =' + cols.toString() + ';' +
      'var height =' + height.toString() + ';' +
      'var width =' + width.toString() + ';' +
      'slopeMap =' + JSON.stringify(slopeArray) + ';' +
      'aspectMap =' + JSON.stringify(aspectArray) + ';' +
      'clcMap =' + JSON.stringify(clcArray) + ';';

      return string;
    }

    cb(RunString());

  }

}