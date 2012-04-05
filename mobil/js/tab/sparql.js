//SPARQL

tab.sparql = {}; //globální rozhraní tohoto souboru

tab.sparql.getName = function () {
	return 'SPARQL';
};

tab.sparql.getContent = function () {
	var query = $('<textarea>select * { ?s ?p ?o }</textarea>');
	
	var submit = $('<a href="#">Hledej!</a>');
	
	var form = $('<form id="search"></form>');
	form.append(query);
	form.append(submit);
	
	var ressults = $('<div class="group" id="ressults">Nalezené výsledky.</div>');
	
	submit.click(function () {
		ressults.html('Vyhledávám...');
		
		querySparql(query.val(), function (data) {
			ressults.html('<pre>' + JSON.stringify(data, null, 4) + '</pre>');
		}, function (error) {
			ressults.html('<span class="error">' + error + '</span>');
		});
		
		return false;
	});
	
	return $('<div></div>').append($('<div class="group"></div>').append(form)).append(ressults);
};
