/**
 * Konfigurace aplikace
 */

var config = {}; //přístup ke konfiguraci
var tab = {}; //moduly menu

config.tab = { //moduly menu
	used: ['guide', 'navigation', 'sparql', 'help'], //použité moduly menu
	default: 'guide' //výchozí modul
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
