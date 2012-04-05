var http = require('http');
var https = require('https');
var fs = require('fs');
var url = require('url');
var $ = require('jquery');

var process = function (login) {
	if (!login)
		processAll();
	else
		processPerson(login);
};

var processAll = function () {
	var empuri = __dirname + '/data/employees.txt';
	var stuuri = __dirname + '/data/students.txt';
	var uris = [empuri, stuuri];
	
	for (var uri in uris)
		fs.readFile(uris[uri], function (err, data) {
			if (err)
				throw err;
			var lines = data.toString().split("\n");
			for (var line in lines)
				processPerson(lines[line].replace(/.+\(([^\)]+)\)$/, "$1"));
		});
};

var processPerson = function (login) {
	if (!login) return;
	
	var uri = 'https://usermap.cvut.cz/profile/' + login;
	
	var request = https.get({
		host: url.parse(uri).host,
		path: (url.parse(uri).pathname || '') + (url.parse(uri).search || '')
	});
	request.on('error', function(e) {
		console.error("Error: " + e.message);
	});
	request.on('response', function (r) {
		if (r.statusCode != 200) {
			console.log("Login " + login + " does not exist!");
			return;
		}
		var data = '';
		r.on('data', function (chunk) {
			data += chunk;
		});
		r.on('end', function () {
			var jqo = $(data);
			
			var rdfstore = require('rdfstore');
			
			var store = rdfstore.create(
				require('./rdfstore.js').config,
				function (store) {
					var graph = store.rdf.createGraph();
					
					store.rdf.setPrefix("prf", "http://pruvodce.fit.cvut.cz/ontology/");
					store.rdf.setPrefix("usmp", "https://usermap.cvut.cz/profile/");
					
					var person = store.rdf.createNamedNode(store.rdf.resolve("usmp:" + login));
					
					graph.add(
						store.rdf.createTriple(
							person,
							store.rdf.createNamedNode(store.rdf.resolve("rdf:type")),
							store.rdf.createNamedNode(store.rdf.resolve("foaf:Person"))
						)
					);
					
					graph.add(
						store.rdf.createTriple(
							person,
							store.rdf.createNamedNode(store.rdf.resolve("foaf:depiction")),
							store.rdf.createLiteral("https://usermap.cvut.cz/photos/" + login + "?type=jpg")
						)
					);
					if (jqo.find("#name").text()) {
						graph.add(
							store.rdf.createTriple(
								person,
								store.rdf.createNamedNode(store.rdf.resolve("foaf:name")),
								store.rdf.createLiteral(jqo.find("#name").text())
							)
						);
					}
					if (jqo.find("td.label:contains('E-mail:')").next("td").html()) {
						var mboxes = jqo.find("td.label:contains('E-mail:')").next("td").html().split("<br>");
						for (var mb in mboxes)
							if ($.trim(mboxes[mb]))
								graph.add(
									store.rdf.createTriple(
										person,
										store.rdf.createNamedNode(store.rdf.resolve("foaf:mbox")),
										store.rdf.createNamedNode("mailto:" + $.trim($(mboxes[mb]).text()))
									)
								);
					} else {
						graph.add(
							store.rdf.createTriple(
								person,
								store.rdf.createNamedNode(store.rdf.resolve("foaf:mbox")),
								store.rdf.createNamedNode("mailto:" + login + "@fit.cvut.cz")//nevyhovovalo by při rozšíření mimo FIT
							)
						);
					}
					if (jqo.find("td.label:contains('Telefon:')").next("td").html()) {
						var phones = jqo.find("td.label:contains('Telefon:')").next("td").html().split("<br>");
						for (var ph in phones)
							if ($.trim(phones[ph]))
								graph.add(
									store.rdf.createTriple(
										person,
										store.rdf.createNamedNode(store.rdf.resolve("foaf:phone")),
										store.rdf.createNamedNode("tel:" + $.trim(phones[ph].replace(/(^.+?)\(.*/m, "$1")))
									)
								);
					}
					if (jqo.find("td.label:contains('Soukromé telefonní číslo:')").next("td").html()) {
						var phones = jqo.find("td.label:contains('Soukromé telefonní číslo:')").next("td").html().split("<br>");
						for (var ph in phones)
							if ($.trim(phones[ph]))
								graph.add(
									store.rdf.createTriple(
										person,
										store.rdf.createNamedNode(store.rdf.resolve("foaf:phone")),
										store.rdf.createNamedNode("tel:" + $.trim(phones[ph].replace(/(^.+?)\(.*/m, "$1")))
									)
								);
					}
					if (jqo.find("td.label:contains('Osobní domovská stránka:')").next("td").html()) {
						var homepages = jqo.find("td.label:contains('Osobní domovská stránka:')").next("td").html().split("<br>");
						for (var hp in homepages)
							if ($.trim(homepages[hp]))
								graph.add(
									store.rdf.createTriple(
										person,
										store.rdf.createNamedNode(store.rdf.resolve("foaf:homepage")),
										store.rdf.createNamedNode($.trim(homepages[hp]))
									)
								);
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
