/**
 * Panel průvodce
 */

tab.guide = {}; //globální rozhraní tohoto souboru

tab.guide.getName = function () {
	return 'Průvodce';
};

tab.guide.getContent = function () {
	
	/**
	 * Obstarání zdroje od akcí tlačítka přes získání zdroje až po jeho vizualizaci.
	 * @param element Element obstarávaného zdroje.
	 * @param resource URL zdroje (musí být povolené na proxy!).
	 * @param presenter Callback prezentace zdroje.
	 */
	var createLoaderButton = function (element, resource, presenter) {
		var a = $('<a href="#" class="button">Zobrazit</a>');
		var div = $('<div class="innergroup" style="display:none;"/>');
		element.append(' ', a, div);
		
		a.click(function () {
			if (div.html() === "") {
				a.html('Skrýt');
				div.html('<img src="img/load.gif" alt="Načítám..."/> Načítám...').show();
				$.getJSON(config.ajax.proxy, {url: resource}, function (data) {
					div.html(data.error || (data.sitecontent && presenter(data.sitecontent)) || 'Nastala chyba serveru.');
				}).error(function () {
					div.html('Nepodařilo se navázat spojení se serverem.');
				});
			} else {
				div.hide().html('');
				a.html('Zobrazit');
			}
			return false;
		});
	};
	
	
	var canteens = $('<div class="group"><h3>Menzy</h3></div>');
	var strahovcanteenmenu = $('<li>Jídelníček Pizzerie la fontanella</li>');
	canteens.append($('<ul/>').append(strahovcanteenmenu));
	
	createLoaderButton(strahovcanteenmenu, 'http://agata.suz.cvut.cz/jidelnicky/nove/index.php?clPodsystem=10', function (data) {
		var ret = $('#ap-jidelnicek table', $(data));
		$('a', ret).remove();
		return ret.length ? ret : '<p>Aktuálně pro toto zařízení neexistuje žádný jídelníček.</p>';
	});
	
	
	var events = $('<div class="group"><h3>Akce</h3></div>');
	var ctuevents = $('<li>Kalendář akcí ČVUT</li>');
	events.append($('<ul/>').append(ctuevents));
	
	createLoaderButton(ctuevents, 'http://akce.cvut.cz/', function (data) {
		return $('#ap-calendar_events', $(data.replace(/%E2%8C%A9/g, '&lang')));
	});
	
	
	return $('<div></div>').append(canteens, events);
};
