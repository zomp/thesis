/**
 * Konfigurace aplikace
 */

var config = {}; //přístup ke konfiguraci

config.tab = { //moduly menu
	used: ['guide', 'navigation', 'sparql', 'help'], //použité moduly menu
	default: 'guide' //výchozí modul
};

config.sparql = { //SPARQL endpoint
// 	url: 'http://webdev.fit.cvut.cz/~molnaja2/store.json' //adresa endpointu
	url: 'http://server:8080/sparql' //adresa endpointu
};
