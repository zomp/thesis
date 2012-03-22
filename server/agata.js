var http = require('http');
var Iconv = require('iconv').Iconv;
var $ = require('jquery');
var url = require('url');

var process = function () {
	var uri = 'http://agata.suz.cvut.cz/jidelnicky/?clPodsystem=2&ID_jidelnicku=1';
	
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
};

module.exports.process = process;
