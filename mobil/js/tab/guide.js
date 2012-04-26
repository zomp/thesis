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
	
	
	var canteens = $('<div class="group"><h3>Menzy</h3><ul/></div>');
	var canteensData = {
		'menza Studentský dům': 2,
		'Technická menza': 3,
		'Masarykova kolej': 5,
		'menza Strahov': 1,
		'menza Podolí': 4,
		'Pizzerie la fontanella': 10
	};
	for (var name in canteensData) {
		(function () { //uzávěr kvůli proměnným
			var canteenmenu = $('<li>Jídelníček ' + name + '</li>');
			canteens.find('ul').append(canteenmenu);
			
			createLoaderButton(canteenmenu, 'http://agata.suz.cvut.cz/jidelnicky/nove/index.php?clPodsystem=' + canteensData[name], function (data) {
				var ret = $(data).find('#ap-jidelnicek table');
				//odstranění stylů a přebytečných sloupců
				ret.find('tr td:nth-child(6), tr th:nth-child(6)').remove();
				ret.find('th[colspan="6"]').attr('colspan', 5);
				ret.find('td, th').css('width', '');
				return ret.length ? ret : '<p>Aktuálně pro toto zařízení neexistuje žádný jídelníček.</p>';
			});
		})();
	}
	
	
	var openings = $('<div class="group"><h3>Otevírací doby</h3><ul/></div>');
	var fitstoopenings = $('<li>Studijní odddělení FIT</li>');
	var canteensopenings = $('<li>Menzy, bufety...</li>');
	openings.find('ul').append(fitstoopenings, canteensopenings);
	
	createLoaderButton(fitstoopenings, 'http://fit.cvut.cz/student/studijni/kontakt', function (data) {
		var ret = $(data).find('table').last();
		//přeformátování
		ret.find('*').andSelf().removeAttr('style');
		ret.find('tr td:first-child, tr:first-child td').css({'text-transform': 'capitalize', 'font-weight': 'bold'})
		return ret;
	});
	createLoaderButton(canteensopenings, 'http://agata.suz.cvut.cz/jidelnicky/nove/oteviraci-doby.php', function (data) {
		var ret = $(data).find('#ap-otdoby');
		//odstranění stylů a výplní
		ret.find('*').andSelf().removeAttr('style');
		ret.find('br').remove();
		ret.find('.offset6').remove();
		return ret;
	});
	
	
	var contacts = $('<div class="group"><h3>Kontakty</h3><ul/></div>');
	var fitstocontacts = $('<li>Studijní odddělení FIT</li>');
	var canteenscontacts = $('<li>Menzy, bufety...</li>');
	contacts.find('ul').append(fitstocontacts, canteenscontacts);
	
	createLoaderButton(fitstocontacts, 'http://fit.cvut.cz/student/studijni/kontakt', function (data) {
		var ret = $(data).find('table').first();
		//přeformátování
		ret.find('*').andSelf().removeAttr('style');
		ret.find('tr td:first-child, tr:first-child td').css({'text-transform': 'capitalize', 'font-weight': 'bold'})
		return ret;
	});
	createLoaderButton(canteenscontacts, 'http://agata.suz.cvut.cz/jidelnicky/nove/kontakty.php', function (data) {
		var ret = $(data).find('#ap-otdoby');
		//odstranění stylů
		ret.find('*').andSelf().removeAttr('style');
		return ret;
	});
	
	
	var events = $('<div class="group"><h3>Akce</h3><ul/></div>');
	var ctuevents = $('<li>Kalendář akcí ČVUT</li>');
	events.find('ul').append(ctuevents);
	
	createLoaderButton(ctuevents, 'http://akce.cvut.cz/', function (data) {
		return $('#ap-calendar_events', $(data.replace(/%E2%8C%A9/g, '&lang')));
	});
	
	
	return $('<div/>').append(canteens, openings, contacts, events);
};
