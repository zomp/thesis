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
 * Zpracování akcí ČVUT.
 */

var http = require('http');
var url = require('url');
var $ = require('jquery');
var icalendar = require('icalendar');

var process = function () {
	var icsuri = 'https://akce.cvut.cz/ical.php?group=0'; //adresa kalendáře v iCal formátu
	var xmluri = 'http://akce.cvut.cz/?node=rss&group=0'; //adresa kalendáře v RSS formátu
	
	var ical = null; //zpracovaný ical zdroj
	var xml = null; //zpracovaný rss zdroj
	
	var icsrequest = http.get({
		host: url.parse(icsuri).host,
		port: url.parse(icsuri).port || 80,
		path: url.parse(icsuri).pathname + url.parse(icsuri).search
	});
	icsrequest.on('error', function(e) {
		console.error("Error: " + e.message);
	});
	icsrequest.on('response', function (r) {
		var data = '';
		r.on('data', function (chunk) {
			data += chunk;
		});
		r.on('end', function () {
			ical = icalendar.parse_calendar(data);
			if (xml)
				onAllLoad();
		});
	});
	
	var xmlrequest = http.get({
		host: url.parse(xmluri).host,
		port: url.parse(xmluri).port || 80,
		path: url.parse(xmluri).pathname + url.parse(xmluri).search
	});
	xmlrequest.on('error', function(e) {
		console.error("Error: " + e.message);
	});
	xmlrequest.on('response', function (r) {
		var data = '';
		r.on('data', function (chunk) {
			data += chunk;
		});
		r.on('end', function () {
			xml = $(data);
			if (ical)
				onAllLoad();
		});
	});
	
	var onAllLoad = function () { //byl načten iCal i RSS
// 		console.log(ical.events());///příklad
// 		console.log(xml.find("title").text());///příklad
		
		
		var rdfstore = require('rdfstore');

		var store = rdfstore.create(
			require('../rdfstore.js').config,
			function (store) {
				var graph = store.rdf.createGraph();
				
				store.rdf.setPrefix("lode", "http://linkedevents.org/ontology/");
				store.rdf.setPrefix("time", "http://www.w3.org/2006/time#");
				store.rdf.setPrefix("prf", "http://pruvodce.fit.cvut.cz/ontology/");
				
				for (var e in ical.events()) {
					var event;
					if (!ical.events()[e].properties.URL) event = store.rdf.createBlankNode();
					else event = store.rdf.createNamedNode(ical.events()[e].properties.URL.value);
					
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
				}
				
				store.insert(
					graph,
					function () {console.log("Graph has been inserted.")}
				);
			}
		);
		
		
		
	};
};

module.exports.process = process;
