/**
 * Panel SPARQL
 */

tab.sparql = {}; //globální rozhraní tohoto souboru

tab.sparql.getName = function () {
	return 'SPARQL';
};

tab.sparql.getContent = function () {
	//vyhledávací formulář
	var query = $('<textarea>select * { ?s ?p ?o }</textarea>');
	var submit = $('<a href="#">Hledej!</a>');
	var form = $('<form id="search" action="#"></form>');
	
	//nalezené výsledky
	var results = $('<div class="group" id="results"><p>Nalezené výsledky.</p></div>');
	
	var search = function () {
		results.html('<p>Vyhledávám...</p>');
		
		querySparql(query.val(), function (data) {
			if (data.head.variables.length == 0)
				results.html('<p>Nebylo nic nalezeno.</p>');
			else
				results.html('<pre>' + JSON.stringify(data, null, 4) + '</pre>');
		}, function (error) {
			results.html('<p class="error">' + error + '</p>');
		});
		
		return false;
	}
	
	form.submit(search);
	submit.click(search);
	
	form.append(query);
	form.append(submit);
	
	return $('<div></div>').append($('<div class="group"></div>').append(form)).append(results);
};
