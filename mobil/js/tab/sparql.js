/**
 * This file is part of Průvodce FIT ČVUT.
 * Copyright (C) 2011-2012 Jan Molnár
 *
 * Průvodce FIT ČVUT is free software: you  can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * Průvodce FIT ČVUT is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty
 * of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with Průvodce FIT ČVUT. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Panel SPARQL
 */

tab.sparql = {}; //globální rozhraní tohoto souboru

tab.sparql.getName = function () {
	return 'SPARQL';
};

tab.sparql.getContent = function () {
	//vyhledávací formulář
	var query = $('<textarea rows="8">PREFIX foaf: &lt;http://xmlns.com/foaf/0.1/&gt;\nSELECT ?name ?email\nWHERE {\n' +
		'    ?person a foaf:Person.\n    ?person foaf:name ?name.\n    ?person foaf:mbox ?email.\n}\n</textarea>');
	var submit = $('<a href="#" class="submit">Hledej!</a>');
	var form = $('<form id="search" action="#"/>');
	
	//nalezené výsledky
	var results = $('<div class="group" id="results"><p>Nalezené výsledky.</p></div>');
	
	var search = function () {
		results.html('<p><img src="img/load.gif" alt="Načítám..."/> Vyhledávám...</p>');
		
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
	
	return $('<div/>').append($('<div class="group"/>').append(form)).append(results);
};
