//SPARQL

tab.sparql = {}; //globální rozhraní tohoto souboru

tab.sparql.getName = function () {
	return 'SPARQL';
};

tab.sparql.getContent = function () {
	var query = $('<textarea>select * { ?s ?p ?o }</textarea>');
	
	var submit = $('<a href="#">Hledej!</a>');
	
	var form = $('<form id="search" action="#"></form>');
	
	var ressults = $('<div class="group" id="ressults">Nalezené výsledky.</div>');
	
	var search = function () {
		ressults.html('Vyhledávám...');
		
		querySparql(query.val(), function (data) {
			if (data.head.variables.length == 0)
				ressults.html('<p>Nebylo nic nalezeno.</p>');
			else
				ressults.html('<pre>' + JSON.stringify(data, null, 4) + '</pre>');
		}, function (error) {
			ressults.html('<span class="error">' + error + '</span>');
		});
		
		return false;
	}
	
	form.submit(search);
	submit.click(search);
	
	form.append(query);
	form.append(submit);
	
	return $('<div></div>').append($('<div class="group"></div>').append(form)).append(ressults);
};
