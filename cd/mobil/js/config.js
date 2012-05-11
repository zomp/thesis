/**
 * This file is part of Průvodce FIT ČVUT.
 * Copyright (C) 2011-2012 Jan Molnár
 *
 * Průvodce FIT ČVUT is free software: you  can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * Průvodce FIT ČVUT is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty
 * of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with Průvodce FIT ČVUT. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Konfigurace aplikace
 */

var config = {}; //přístup ke konfiguraci
var tab = {}; //moduly menu

config.tab = { //moduly menu
	used: ['guide', 'navigation', 'sparql', 'help'], //použité moduly menu
	dflt: 'guide' //výchozí modul (mimochodem, IE nemá rád proměnnou default)
};

config.sparql = { //SPARQL endpoint
// 	url: 'http://webdev.fit.cvut.cz/~molnaja2/store.json' //adresa endpointu
	url: 'http://server:8080/sparql', //adresa endpointu
	timeout: 5000 //timeout pro získání odpovědi
};

config.ajax = { //AJAXové spojení
	proxy: 'http://webdev.fit.cvut.cz/~molnaja2/thesis/ajaxproxy.php?callback=?' //proxy pro cross-origin spojení
// 	proxy: 'http://test.farnostnm.cz/thesis/ajaxproxy.php?callback=?' //náhrada za nefunkční webdev (viz práce)
};

config.map = { //parametry použité mapy
	svg: svgmapjs, //soubor s mapou
	places: placesjs, //soubor s místy na mapě
	animation: {
		steps: 3, //počet kroků animací
		delay: 100 //rozestup kroků v ms
	},
	corners: { //souřadnice rohů
		northwest: {
			lat: 50.10614,
			lon: 14.38562
		},
		northeast: {
			lat: 50.10614,
			lon: 14.39523
		},
		southeast: {
			lat: 50.10001,
			lon: 14.39525
		},
		southwest: {
			lat: 50.09992,
			lon: 14.38546
		}
	}
};
