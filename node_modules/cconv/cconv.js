function sin (x){
  return Math.sin(x);
}
function cos (x){
  return Math.cos(x);
}

function degToRad(x){
  return x*Math.PI/180;
}

function RadToDeg(x){
  return x*180/Math.PI;
}

module.exports = function(sridA, sridB, c, f){

  var srlst = {
  '4258':{  
    'a':6378137.0 ,//m
    'e':0.081819191 ,
    '1/f':298.2572221,
    'lat0': 0.907571211,
    'long0': 0.174532925 },//rad 
  '3035':{ 
    'FE': 4321000.0,
    'FN': 3210000.00 }
  };

  var e = srlst[sridA]['e'];
  var e2 = Math.pow(e,2);
  var a = srlst[sridA]['a'];
  var lat0 = srlst[sridA]['lat0'];
  var long0 = srlst[sridA]['long0'];

  var FE = srlst[sridB]['FE'];
  var FN = srlst[sridB]['FN'];


  var q0 = (1-e2)*( sin(lat0)/(1-e2*sin(lat0)*sin(lat0)) - (  (1/(2*e))*Math.log((1-e*sin(lat0))/(1+e*sin(lat0)))));
  var qp = (1-e2)*( 1/(1-e2) - (  (1/(2*e))*Math.log((1-e)/(1+e))));
  var beta0 = Math.asin(q0/qp);
  var Rq = a*Math.pow ((qp/2), 0.5 );
  var D = a* (cos(lat0)/Math.pow(1-e2*sin(lat0)*sin(lat0), 0.5)) / (Rq*cos(beta0));

  if (f){ //forward conputation

    var lat = degToRad(c[0]);
    var longi = degToRad(c[1]);

    var q = (1-e2)*( sin(lat)/(1-e2*sin(lat)*sin(lat)) - (  (1/(2*e))*Math.log((1-e*sin(lat))/(1+e*sin(lat)))));
    var beta = Math.asin(q/qp);
    var B = Rq*Math.pow((2/ (1+sin(beta0)*sin(beta) + (cos(beta0)*cos(beta)*cos(longi-long0))) ), 0.5);

    var E = FE + (B*D*cos(beta)*sin(longi-long0));
    var N = FN + B/D*(cos(beta0)*sin(beta) - sin(beta0)*cos(beta)*cos(longi- long0));

    return [E,N];

  }
  else{ //reverse computation

    var N = c[1];
    var E = c[0];

    var rho = Math.pow(( ((E-FE)/D)*((E-FE)/D) + ( D*(N-FN) )*(D*(N-FN)) ), 0.5);
    var C = 2*Math.asin(rho/(2*Rq));
    var betal = Math.asin( (cos(C)*sin(beta0)) + (D*(N-FN)*sin(C)*cos(beta0)/rho) ); 

    var lat = betal + (e2/3 + 31 * e2*e2/180 + 517*e2*e2*e2/5040)*sin(2*betal) + 
    (23*e2*e2/360 + 251*e2*e2*e2/3780)*sin(4*betal) + (761*e2*e2*e2/45360)*sin(6*betal) ;

    var longi = long0 + Math.atan( (E-FE)*sin(C)/(D*rho*cos(beta0)*cos(C) - D*D*(N-FN)*sin(beta0)*sin(C) ));

    return [ RadToDeg(lat), RadToDeg(longi)];
  }
};