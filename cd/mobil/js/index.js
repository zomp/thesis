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
 * Akce prováděné po načtení stránky.
 */
$(document).ready(function () {

	/**
	 * Přepínání modulů menu.
	 * @param name Jméno modulu.
	 */
	var setTab = function (name) {
		$('#content').html(tab[name].getContent());
		$(window).triggerHandler('resize'); //nastavení velikostí v okně (mapa)
	};
	
	/**
	 * Použité moduly menu.
	 */
	var tabnames = config.tab.used;
	
	// Přidání jednotlivých modulů do menu.
	for (var tabname in tabnames) {
		(function () {
			var t = tabname; //neodstraňovat - uzávěr!
			
			var menulink = $('<a href="#">' + tab[tabnames[t]].getName() + '</a>');
			menulink.click(function () {
				setTab(tabnames[t]);
				return false;
			});
			var menuli = $('<li id="m-' + tabnames[t] + '"></li>');
			menuli.append(menulink);
			$('#menu ul').append(menuli);
			
			if (config.tab.dflt == tabnames[t]) setTab(tabnames[t]);
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
		accepts: {
			json: 'application/json'
		},
		data: {
			query: query
		},
		dataType: 'json',
		timeout: config.sparql.timeout,
		success: function (data, textStatus, jqXHR) {
			success(data);
		},
		error: function (jqXHR, textStatus, errorThrown) {
			if (jqXHR.responseText === 'Query malformed') {
				error('V syntaxi dotazu se vyskytuje chyba.');
				return;
			}
			if (textStatus === 'timeout') {
				error('Čas vypršel, nepodařilo se navázat spojení se serverem.');
				return;
			}
			error('Došlo k chybě označené \'' + textStatus + '\', pravděpodobně se nepodařilo navázat spojení se serverem.');
		}
	});
};
