/**
 * Zpracování pseudorozvrhů - prozatimní řešení do zprovoznění KOSapi.
 */

var http = require('http');
var url = require('url');
var icalendar = require('icalendar');

var process = function () {
	var uri = 'http://www.google.com/calendar/ical/049u1d9uj5lf8hs10ni69vjmr4%40group.calendar.google.com/public/basic.ics'; //v budoucnu (až nebudou problémy s přístupem do KOSu) nahradit kosapi
	
	var request = http.get({
		host: url.parse(uri).host,
		port: url.parse(uri).port || 80,
		path: (url.parse(uri).pathname || '') + (url.parse(uri).search || '')
	});
	request.on('error', function(e) {
		console.error("Error: " + e.message);
	});
	request.on('response', function (r) {
		var data = '';
		r.on('data', function (chunk) {
			data += chunk;
		});
		r.on('end', function () {
			var ical = icalendar.parse_calendar(data);
			
			var rdfstore = require('rdfstore');
			
			var store = rdfstore.create(
				require('../rdfstore.js').config,
				function (store) {
					var graph = store.rdf.createGraph();
					
					store.rdf.setPrefix("lode", "http://linkedevents.org/ontology/");
					store.rdf.setPrefix("time", "http://www.w3.org/2006/time#");
					store.rdf.setPrefix("prf", "http://pruvodce.fit.cvut.cz/ontology/");
					store.rdf.setPrefix("usmp", "https://usermap.cvut.cz/profile/");
					
					for (var e in ical.events()) {
						var event;
						if (!ical.events()[e].properties.UID) event = store.rdf.createBlankNode();
						else event = store.rdf.createNamedNode(store.rdf.resolve("prf:event/" + ical.events()[e].properties.UID.value));
						
						graph.add(
							store.rdf.createTriple(
								event,
								store.rdf.createNamedNode(store.rdf.resolve("rdf:type")),
								store.rdf.createNamedNode(store.rdf.resolve("lode:Event"))
							)
						);
						if (ical.events()[e].properties.SUMMARY) {
							graph.add(
								store.rdf.createTriple(
									event,
									store.rdf.createNamedNode(store.rdf.resolve("rdfs:label")),
									store.rdf.createLiteral(ical.events()[e].properties.SUMMARY.value)
								)
							);
						}
						if (ical.events()[e].properties.DESCRIPTION) {
							graph.add(
								store.rdf.createTriple(
									event,
									store.rdf.createNamedNode(store.rdf.resolve("rdfs:comment")),
									store.rdf.createLiteral(ical.events()[e].properties.DESCRIPTION.value)
								)
							);
						}
						
						if (ical.events()[e].properties.LOCATION) {
							graph.add(
								store.rdf.createTriple(
									event,
									store.rdf.createNamedNode(store.rdf.resolve("lode:atPlace")),
									store.rdf.createNamedNode(store.rdf.resolve("prf:place/" + ical.events()[e].properties.LOCATION.value))
								)
							);
						}
						if (ical.events()[e].properties.DTSTART || ical.events()[e].properties.DTEND) {
							var time = store.rdf.createBlankNode();
							graph.add(
								store.rdf.createTriple(
									event,
									store.rdf.createNamedNode(store.rdf.resolve("lode:atTime")),
									time
								)
							);
							graph.add(
								store.rdf.createTriple(
									time,
									store.rdf.createNamedNode(store.rdf.resolve("rdf:type")),
									store.rdf.createNamedNode(store.rdf.resolve("time:Interval"))
								)
							);
							if (ical.events()[e].properties.DTSTART) {
								graph.add(
									store.rdf.createTriple(
										time,
										store.rdf.createNamedNode(store.rdf.resolve("time:hasBeginning")),
										store.rdf.createLiteral(ical.events()[e].properties.DTSTART.value.toJSON())
									)
								);
							}
							if (ical.events()[e].properties.DTEND) {
								graph.add(
									store.rdf.createTriple(
										time,
										store.rdf.createNamedNode(store.rdf.resolve("time:hasEnd")),
										store.rdf.createLiteral(ical.events()[e].properties.DTEND.value.toJSON())
									)
								);
							}
						}
						if (ical.events()[e].properties.DESCRIPTION) {
							var login = ical.events()[e].properties.DESCRIPTION.value.replace(/.+\(([^\)]+)\)$/, "$1");
							if (login) {
								require('./usermap.js').process(login);
								graph.add(
									store.rdf.createTriple(
										event,
										store.rdf.createNamedNode(store.rdf.resolve("lode:involvedAgent")),
										store.rdf.createNamedNode(store.rdf.resolve("usmp:" + login))
									)
								);
							}
						}
					}
					
					store.insert(
						graph,
						function () {console.log("Graph has been inserted.")}
					);
				}
			);
		});
	});
};

module.exports.process = process;
