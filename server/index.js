var http = require('http');
var express = require('express');
var url = require('url');
var Iconv = require('iconv').Iconv;
// var $ = require('jquery');
// var jsdom = require('jsdom');

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
		r.on('data', function (chunk) {
			
			//v html je stažená stránka s diakritikou
			var iconv = new Iconv('windows-1250', 'utf-8');
			var html = iconv.convert(chunk).toString();
// 			console.log("\n\n"+html+"\n\n");

			
			//vypíše nalezený text s diakritikou
// 			var $ = require('jquery');
// 			var jqo = $('<!DOCTYPE html><html xml:lang="cs" lang="cs"><head>	<meta http-equiv="content-type" content="text/html; charset=windows-1250" /><meta name="author" content="Jan Molnár" /><title>Zpěvník</title><script>alert("baf");</script></head><body onload="document.write(\"ahoj\");"><div id="mojeid"><p>čau!</p></div></body></html>');
// 			console.log($("#mojeid", jqo).html());
			
			//vypíše nalezený text s diakritikou
			var $ = require('jquery');
			var jqo = $(html.toString());
			console.log($("a", jqo).length);
/**/
// 			var $ = require('jquery').create(jsdom(html).createWindow());
// 			$(html).appendTo("body");
// 			console.log($("body").html());
		});
	});
	
	
	res.send("Source '" + name + "' processed\n");
});

app.get('/dva', function (req, res) {
	res.send("2: Hello World\n");
});

app.get('*', function (req, res) {
	res.send("Error: Service not found\n", 404);
});

app.listen(port);

console.log("Server running at port: " + port);
