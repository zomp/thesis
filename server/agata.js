/**
 * Zpracování jídelníčků.
 */

var http = require('http');
var Iconv = require('iconv').Iconv;
var $ = require('jquery');
var url = require('url');

var process = function () {
	var uris = [ //adresy jídelníčků
		'http://agata.suz.cvut.cz/jidelnicky/index.php?clPodsystem=1',
		'http://agata.suz.cvut.cz/jidelnicky/index.php?clPodsystem=2',
		'http://agata.suz.cvut.cz/jidelnicky/index.php?clPodsystem=3',
		'http://agata.suz.cvut.cz/jidelnicky/index.php?clPodsystem=4',
		'http://agata.suz.cvut.cz/jidelnicky/index.php?clPodsystem=5',
		'http://agata.suz.cvut.cz/jidelnicky/index.php?clPodsystem=6',
		'http://agata.suz.cvut.cz/jidelnicky/index.php?clPodsystem=8',
		'http://agata.suz.cvut.cz/jidelnicky/index.php?clPodsystem=9',
		'http://agata.suz.cvut.cz/jidelnicky/index.php?clPodsystem=10'
	];
	
	for (var i = uris.length - 1, uri; uri = uris[i]; --i) {
		(function () { //uzávěr
			var options = { //rozparsování URL
				host: url.parse(uri).host,
				port: url.parse(uri).port || 80,
				path: url.parse(uri).pathname + url.parse(uri).search
			};

			var request = http.get(options);
			
			request.on('error', function(e) {
				console.error("Error: " + e.message);
			});
			
			request.on('response', function (r) {
				var html = '';
				
				r.on('data', function (chunk) {
					html += chunk; //sestavení postupně doručovaných částí
				});
				
				r.on('end', function () {
					var jqo = $(html);
					
					var jqomeals = $("#jidelnicek .table tbody tr td", jqo).parent(); //jídla
					var canteenname = $.trim($("#myModal h3", jqo).text()); //název menzy
					
					var rdfstore = require('rdfstore');
					require('date-utils');
					var diacritics = require('./data/diacritics.js').diacritics; //tabulka s diaktritikou
					
					var store = rdfstore.create(
						require('./rdfstore.js').config,
						function (store) {
							var graph = store.rdf.createGraph(); //graf
							
							store.rdf.setPrefix("lode", "http://linkedevents.org/ontology/");
							store.rdf.setPrefix("time", "http://www.w3.org/2006/time#");
							store.rdf.setPrefix("food", "http://www.w3.org/TR/2003/PR-owl-guide-20031209/food#");
							store.rdf.setPrefix("prf", "http://pruvodce.fit.cvut.cz/ontology/");
							
							/**
							* Normalizace řetězce.
							* @param term Řetězec k normalizování.
							* @return Řetězec po normalizování.
							*/
							var normalize = function (term) {
								var norm = '';
								term = term.toLowerCase();
								
								for (var i = 0, max = term.length; i < max; ++i) {
									norm += diacritics[term.charAt(i)] || term.charAt(i);
								}
								
								return norm;
							};
							
							var date = new Date(); //datum
							
							jqomeals.each(function () {
								var mealid = $(this).find('.tstarradektd input:eq(1)').attr('id').split('_')[1]; //id jídla
								
								var meal = store.rdf.createNamedNode(store.rdf.resolve("prf:event/meal/" + mealid + "_" + date.toYMD()));
								
								graph.add(
									store.rdf.createTriple(
										meal,
										store.rdf.createNamedNode(store.rdf.resolve("rdf:type")),
										store.rdf.createNamedNode(store.rdf.resolve("lode:Event"))
									)
								);
								graph.add(
									store.rdf.createTriple(
										meal,
										store.rdf.createNamedNode(store.rdf.resolve("rdfs:label")),
										store.rdf.createLiteral($.trim($(this).find('td:eq(1)').text()))
									)
								);
								
								graph.add(
									store.rdf.createTriple(
										meal,
										store.rdf.createNamedNode(store.rdf.resolve("lode:atPlace")),
										store.rdf.createNamedNode(store.rdf.resolve("prf:place/" + normalize(canteenname)))
									)
								);
								graph.add(
									store.rdf.createTriple(
										meal,
										store.rdf.createNamedNode(store.rdf.resolve("lode:involved")),
										store.rdf.createNamedNode(store.rdf.resolve("prf:meal/" + mealid))
									)
								);
								var time = store.rdf.createBlankNode(); //čas jídla
								graph.add(
									store.rdf.createTriple(
										meal,
										store.rdf.createNamedNode(store.rdf.resolve("lode:atTime")),
										time
									)
								);
								graph.add(
									store.rdf.createTriple(
										time,
										store.rdf.createNamedNode(store.rdf.resolve("rdf:type")),
										store.rdf.createNamedNode(store.rdf.resolve("time:Instant"))
									)
								);
								graph.add(
									store.rdf.createTriple(
										time,
										store.rdf.createNamedNode(store.rdf.resolve("time:inXSDDateTime")),
										store.rdf.createLiteral(date.toYMD() + "T00:00:00+" + date.getUTCOffset().substring(0, 2) + ":" + date.getUTCOffset().substring(2))
									)
								);
							});
							
							store.insert(
								graph,
								function () {console.log("Graph has been inserted.")}
							);
						}
					);
				});
			});
		})();
	}
};

module.exports.process = process;
