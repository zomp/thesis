/**
 * Moduly menu.
 */
var tab = {};

/**
 * Akce prováděné po načtení stránky.
 */
$(document).ready(function () {

	/**
	 * Přepínání modulů menu.
	 * @param name Jméno modulu.
	 */
	var setTab = function (name) {
		$('#content').html(tab[name].getContent());
	};
	
	/**
	 * Použité moduly menu.
	 */
	var tabnames = config.tab.used;
	
	// Přidání jednotlivých modulů do menu.
	for (var tabname in tabnames) {
		(function () {
			var t = tabname;
			$.getScript("js/tab/" + tabnames[t] + ".js", function () {
				var menulink = $('<a href="#">' + tab[tabnames[t]].getName() + '</a>');
				menulink.click(function () {
					setTab(tabnames[t]);
					return false;
				});
				var menuli = $('<li id="m-' + tabnames[t] + '"></li>');
				menuli.append(menulink);
				$('#menu ul').append(menuli);
				
				if (config.tab.default == tabnames[t]) setTab(tabnames[t]);
			});
		})();
	}
	
	
});


/**
 * Vykonání SPARQL dotazu nad endpointem.
 * @param query SPARQL dotaz.
 * @return Objekt reprezentující výsledek.
 */
var querySparql = function (query, success, error) {
	$.ajax({
		url: config.sparql.url,
		accepts: 'application/json',
		data: {
			query: query
		},
		dataType: 'json',
		success: function (data, textStatus, jqXHR) {
			success(data);
		},
		error: function (jqXHR, textStatus, errorThrown) {
			if (jqXHR.responseText === 'Query malformed') {
				error('V syntaxi dotazu se vyskytuje chyba.');
				return;
			}
			error('Došlo k chybě označené \'' + textStatus + '\', pravděpodobně se nepodařilo navázat spojení se serverem.');
		}
	});
};