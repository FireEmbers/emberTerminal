var cconv = require('cconv');

var slopeArray;
var aspectArray;
var clcArray;

module.exports = function(coord, height, width, rows, cols, cb) {

  //var dataUnit = [MOISTUREPART, WINDU, WINDDIR];

  slopeArray = new Array(rows*cols);
  aspectArray = new Array(rows*cols);
  clcArray = new Array(rows*cols);

  var programString;

  var runnerCounter = 3;

  var sridA = 4258;
  var sridB = 3035;

  var cA = [ coord['lat'][0] + coord['lat'][1] / 60 + coord['lat'][2] /3600, -
  (coord['lon'][0] +  coord['lon'][1] / 60 + coord['lon'][2]/3600)];

  var f = true;

  cB = cconv(sridA, sridB, cA, f);

  var W = cB[0] - width/2;
  var E = cB[0] + width/2;
  var N = cB[1] + height/2;
  var S = cB[1] - height/2;

  loadClcMap(N, S, E, W, rows, cols, cb);

}

function loadClcMap(N, S, E, W, rows, cols, cb){

  var getCorine = require('./../postgisServer/clcServer');

  getCorine( N, S, E, W, rows, cols, onClcLoad );

  function onClcLoad(data){

    clcArray = data;

    loadGrassMaps(N, E, S, W, rows, cols, cb);

  }

}

function loadGrassMaps(N, E, S, W, rows, cols, cb){

  var grassServer = require('./../grassServer/grassServer');

  grassServer(N, S, E, W, rows, cols, onGrassLoad );

  function onGrassLoad(aspect, slope){

    aspectArray = aspect;
    slopeArray = slope;

    loadEngine(N-S, E-W, rows, cols, cb);

  }

}

function loadEngine(height, width, rows, cols, cb){

  var readFile = require('./../utils/readFile');

  readFile('program.min.js', onEngineLoad);

  function onEngineLoad(string){

    programString = string; 

    function RunString(){

      function Run(dataUnit){

        var engine = req('/home/fsousa/src/crp/embers/engine/src/program.js');

        return engine(dataUnit, rows, cols, aspectMap, slopeMap, clcMap, height, width);

      }

      var
       string = Run.toString() + ';' + programString +
      'var rows =' + rows.toString() + ';' +
      'var cols =' + cols.toString() + ';' +
      'var height =' + height.toString() + ';' +
      'var width =' + width.toString() + ';' +
      'var slopeMap =' + JSON.stringify(slopeArray) + ';' +
      'var aspectMap =' + JSON.stringify(aspectArray) + ';' +
      'var clcMap =' + JSON.stringify(clcArray) + ';';

      return string;
    }

    cb(RunString(), aspectArray, slopeArray, clcArray);

  }

}