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

	/*var request = http.get(options);
	
	request.on('error', function(e) {
		console.error("Error: " + e.message);
	});
	
	request.on('response', function (r) {
		r.on('data', function (chunk) {
			var iconv = new Iconv('windows-1250', 'utf-8');
			var html = iconv.convert(chunk).toString();
// 			console.log("\n\n"+html+"\n\n");
			
			var fs = require('fs');
			fs.readFile('mi-dip/smaz.html', 'utf-8', function (err,data) {
				if (err) {
					console.error("Could not open file: %s", err);
					process.exit(1);
				}

				var $ = require('jquery');
// 				$(data).appendTo("body");
				console.log($(data).html());
// 			var jqo = $(
			});*/

			
			
// 			var $ = require('jquery');
// 			var jqo = $('<!DOCTYPE html><html xml:lang="cs" lang="cs"><head>	<meta http-equiv="content-type" content="text/html; charset=UTF-8" /><meta name="author" content="Jan Molnár" /><title>Zpěvník</title><script>alert("baf");</script></head><body onload="document.write(\"ahoj\");"><div><p>čau!</p></div></body></html>');
// 			console.log(jqo.html());
/**/
// 			var $ = require('jquery').create(jsdom(html).createWindow());
// 			$(html).appendTo("body");
// 			console.log($("body").html());
// 		});
// 	});
	
	
	var jsdom = require('jsdom').jsdom;
jsdom.env(uri, [
  'http://code.jquery.com/jquery-1.5.min.js'
],
function(errors, window) {
			var iconv = new Iconv('windows-1250', 'utf-8');
  console.log("there have been", iconv.convert(window.$("#Terminal").html()).toString(), "nodejs releases!");
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
