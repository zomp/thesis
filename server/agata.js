var http = require('http');
// var request = require('request');
var url = require('url');
var Iconv = require('iconv').Iconv;
var $ = require('jquery');

var uri = 'http://agata.suz.cvut.cz/jidelnicky/?clPodsystem=2&ID_jidelnicku=1';
var name = 'http://agata.suz.cvut.cz/';

// http.createServer(function (req, res) {
	var sitecontent = "baf";
	
	/*request({uri: url, encoding: null}, function (error, response, body) {
		if (error && response.statusCode !== 200) {
			console.log('Error when contacting ' + name)
		}

		var days = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];
		var jqo = $(body);

		//otevírací doby
		//vyparsování otevíracích dob a aktualizace od aktuálního data dále, pokud se od posledně změnilo
		var jqoopen = $(".toteviracka", jqo);
		console.log($(".toteviracka", jqoopen).text());
		
		//jídla
		var jqomeals = $(".typ_stravy", jqo).parent();
		
		//zodpovědné osoby
		var jqorespon = $("table:last", jqo);
		$.each($("tr:last td", jqorespon), function(i, val) {
			console.log($("tr:first td:nth-child(" + i + ")", jqorespon).text());
			console.log($("tr:last td:nth-child(" + i + ")", jqorespon).text() + "\n");
		});

	});*/
	
	var options = {
		host: url.parse(uri).host,
		port: url.parse(uri).port || 80,
		path: url.parse(uri).pathname + url.parse(uri).search
	};

	var request = http.get(options);
	
	request.on('error', function(e) {
		console.log("Got error: " + e.message);
	});
	
	request.on('response', function (r) {
		r.on('data', function (chunk) {
			var iconv = new Iconv('windows-1250', 'utf-8');
			console.log(iconv.convert(chunk).toString());
		});
	});
	
// 	res.writeHead(200, {'Content-Type': 'text/plain'});
// 	res.end('Data ' + sitecontent + ' z ' + name + ' zapsany do databaze\n');
// }).listen(1337);
// console.log('Server running at http://127.0.0.1:1337/');
