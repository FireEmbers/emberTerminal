#cconv - A Coordinate Conversion node module

In the chaotic world of GIS coordinate systems, a node module rises to bring a message of hope and understanding.

This module converts from geodesic latitude/longitude(degrees) to projected coordinates Easting/Northing (metres), and also the other way around.

##Usage

`var cconv= require('cconv');`

`cB = cconv(sridA, sridB, cA, f);`

`var sridA = 4258;` The srid of the coordinate system (eg: ETRS89)

`var sridB = 3035;` The srid of the projected system (eg: ETRS89-LAEA)

###Forward

`var f = true;`

`var cA = [50.000,5.000];` [ latitude, longitude]

`var cB = [];` [ Easting, Northing ]

###Reverse

`var f = true;`

`var cA = [3962799.45, 2999718.85 ];` [ Easting, Northing ]

`var cB = [];` [ latitude, longitude ]

##install
`npm install cconv`


##References
http://www.epsg.org/guides/docs/G7-2.pdf

(pag72 mainly)





