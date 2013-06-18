var cconv= require('./cconv');

//
var cA = [ 41.7783, -8.151219444444445];

var cB = [];

var sridA = '4258';
var sridB = '3035';

var f = true;

cB = cconv(sridA, sridB, cA, f);

console.log(cB);