//navigace

tab.navigation = {}; //globální rozhraní tohoto souboru

tab.navigation.getName = function () {
	return 'Navigace';
};

tab.navigation.getContent = function () {
	var query = $('<input type="text" value="T9:349">');
	
	var submit = $('<a href="#">Hledej!</a>');
	
	var form = $('<form id="search" action="#"></form>');
	
	var ressults = $('<div class="group" id="ressults">Nalezené výsledky.</div>');
	
	var search = function () {
		ressults.html('Vyhledávám...');
		
		querySparql(query.val(), function (data) {
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
