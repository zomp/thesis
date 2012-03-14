var http = require('http');
var express = require('express');
var url = require('url');
var Iconv = require('iconv').Iconv;
var $ = require('jquery');
var icalendar = require('icalendar');

var port = 1337; //port serveru

var app = express.createServer();



app.get('/jidelnicky', function (req, res) {
	var uri = 'http://agata.suz.cvut.cz/jidelnicky/?clPodsystem=2&ID_jidelnicku=1';
	var name = 'http://agata.suz.cvut.cz/';
	
	var options = {
		host: url.parse(uri).host,
		port: url.parse(uri).port || 80,
		path: url.parse(uri).pathname + url.parse(uri).search
	};

	var request = http.get(options);
	
	request.on('error', function(e) {
		console.error("Error: " + e.message);
	});
	
	request.on('response', function (r) {
		var iconv = new Iconv('windows-1250', 'utf-8');
		var html = '';
		
		r.on('data', function (chunk) {
			html += iconv.convert(chunk).toString();;
		});
		
		r.on('end', function () {
			var jqo = $(html);
			
			//otevírací doby
			var jqoopen = $(".toteviracka", jqo);
			console.log(jqoopen.text());
// 			console.log($(".toteviracka", jqoopen).text());
			
			//jídla
			var jqomeals = $(".typ_stravy", jqo).parent();
			
			//zodpovědné osoby
			var jqorespon = $("table:last", jqo);
			$.each($("tr:last td", jqorespon), function(i, val) {
				console.log($("tr:first td:nth-child(" + i + ")", jqorespon).text());
				console.log($("tr:last td:nth-child(" + i + ")", jqorespon).text());
			});
		});
	});
	
	res.send("Source '" + name + "' enqueued for processing\n");
});



app.get('/akce', function (req, res) {
	var icsuri = 'https://akce.cvut.cz/ical.php?group=0';
	var xmluri = 'http://akce.cvut.cz/?node=rss&group=0';
	var name = 'http://akce.cvut.cz/';
	
	var ical = null;
	var xml = null;
	
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
	
	var onAllLoad = function () {
		console.log(ical.events());///příklad
		console.log(xml.find("title").text());///příklad
		
		
		
		var rdfstore = require('rdfstore');

		var store = rdfstore.create(
			{
				persistent: true, 
				engine: 'mongodb', 
				name: 'pruvodcefitcvut',
				overwrite: false,
				mongoDomain: 'localhost',
				mongoPort: 27017
			},
			function (store) {
				var graph = store.rdf.createGraph();
				
				store.rdf.setPrefix("ex", "http://example.org/people/");
				
				for (var i; i < ical.events().length; ++i) {
					graph.add(
						store.rdf.createTriple(
							store.rdf.createNamedNode(store.rdf.resolve("ex:Alice")),
							store.rdf.createNamedNode(store.rdf.resolve("foaf:name")),
							store.rdf.createLiteral("alice")
						)
					);
				}
				
				store.insert(
					graph,
					null,
					function () {console.log("Graph has been inserted.")}
				);
			}
		);
		
		
		
	};
	
	res.send("Source '" + name + "' enqueued for processing\n");
});



app.get('*', function (req, res) {
	res.send("Error: Service not found\n", 404);
});

app.listen(port);

console.log("Server running at port: " + port);
