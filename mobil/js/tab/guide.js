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
			if ($(this).html() === 'Zobrazit') {
				a.html('Skrýt');
				if (typeof navigator.onLine === 'undefined' || navigator.onLine) { //připojení k Internetu
					div.html('<p><img src="img/load.gif" alt="Načítám..."/> Načítám...</p>').show();
				} else {
					div.html('<p class="error">Pravděpodobně nejste připojeni k Internetu, ten je k vykonání požadované akce nezbytný.</p>').show();
				}
				$.getJSON(config.ajax.proxy, {url: resource}, function (data) {
					if (data && data.error) {
						div.html('<p class="error">' + data.error + '</p>');
					} else if (data && data.sitecontent) {
						var ret = presenter(data.sitecontent);
						if (ret.length !== 0) {
							div.html(ret);
						} else {
							div.html('<p class="error">Nastala chyba při zpracování zdroje. Požadovaná informace se možná nachází na <a href="' + resource + '" target="_blank">' + resource + '</a>.</p>');
						}
					} else {
						div.html('<p class="error">Nastala chyba serveru.</p>');
					}
				}).error(function () {
					div.html('<p class="error">Nepodařilo se navázat spojení se serverem.</p>');
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
	
	
	var studies = $('<div class="group"><h3>Studium</h3><ul/></div>');
	var studiesnews = $('<li>Novinky</li>');
	var studiesschedule = $('<li>Harmonogram akademického roku</li>');
	var studiesforms = $('<li>Formuláře</li>');
	var studieslinks = $('<li>Odkazy</li>');
	studies.find('ul').append(studiesnews, studiesschedule, studiesforms, studieslinks);
	
	createLoaderButton(studiesnews, 'http://fit.cvut.cz/', function (data) {
		var ret = $(data).find('.view-id-novinky .view-content');
		ret.find('a').attr('target', '_blank');
		return ret;
	});
	createLoaderButton(studiesschedule, 'http://fit.cvut.cz/student/studijni/harmonogram', function (data) {
		return $(data).find('h2:nth-child(2)').nextUntil('h2');
	});
	createLoaderButton(studiesforms, 'http://fit.cvut.cz/student/studijni/formulare', function (data) {
		var ret = $(data).find('.content-text ul');
		ret.find('a').attr('target', '_blank');
		return ret;
	});
	createLoaderButton(studieslinks, 'http://fit.cvut.cz/student/odkazy', function (data) {
		var mess = $(data).find('#ap-node-319');
		//pročištění
		mess.find('p').remove();
		mess.find('li').contents().unwrap().unwrap();
		var html = mess.html();
		html = '<ul><li>' + html.replace(/<br>/g, '</li><li>') + '</li></ul>';
		var tidy = $(html);
		tidy.find('li:first, li:last').remove();
		tidy.find('a').attr('target', '_blank');
		return tidy;
	});
	
	
	var openings = $('<div class="group"><h3>Otevírací doby</h3><ul/></div>');
	var openingsfitsto = $('<li>Studijní odddělení FIT</li>');
	var openingscanteens = $('<li>Menzy, bufety...</li>');
	var openingsidissuer = $('<li>Vydavatelství průkazů</li>');
	var openingsntk = $('<li>Národní technická knihovna</li>');
	openings.find('ul').append(openingsfitsto, openingscanteens, openingsidissuer, openingsntk);
	
	createLoaderButton(openingsfitsto, 'http://fit.cvut.cz/student/studijni/kontakt', function (data) {
		var ret = $(data).find('table').last();
		//přeformátování
		ret.find('*').andSelf().removeAttr('style');
		ret.find('tr td:first-child, tr:first-child td').css({'text-transform': 'capitalize', 'font-weight': 'bold'})
		return ret;
	});
	createLoaderButton(openingscanteens, 'http://agata.suz.cvut.cz/jidelnicky/nove/oteviraci-doby.php', function (data) {
		var ret = $(data).find('#ap-otdoby');
		//odstranění stylů a výplní
		ret.find('*').andSelf().removeAttr('style');
		ret.find('br').remove();
		ret.find('.offset6').remove();
		return ret;
	});
	createLoaderButton(openingsidissuer, 'http://www.cvut.cz/informace-pro-studenty/prukazy', function (data) {
		var ret = $(data).find('#ap-region-content ul li p').first().text().wrap('<p/>');
		return ret;
	});
	createLoaderButton(openingsntk, 'http://www.techlib.cz/cs/61-oteviraci-doby/', function (data) {
		var ret = $(data).find('#ap-contentWrapper table').first();
		//odstranění stylů a výplní
		ret.find('*').andSelf().removeAttr('style');
		ret.find('p').contents().unwrap();
		ret.find('td').each(function () {
			$(this).text($.trim($(this).text()));
		});
		ret.find('td[colspan=5]').css('text-align', 'center');
		return ret;
	});
	
	
	var contacts = $('<div class="group"><h3>Kontakty</h3><ul/></div>');
	var contactsfitsto = $('<li>Studijní odddělení FIT</li>');
	var contactscanteens = $('<li>Menzy, bufety...</li>');
	var contactsidissuer = $('<li>Vydavatelství průkazů</li>');
	var contactssuz = $('<li>Správa účelových zařízení</li>');
	contacts.find('ul').append(contactsfitsto, contactscanteens, contactsidissuer, contactssuz);
	
	createLoaderButton(contactsfitsto, 'http://fit.cvut.cz/student/studijni/kontakt', function (data) {
		var ret = $(data).find('table').first();
		//přeformátování
		ret.find('*').andSelf().removeAttr('style');
		ret.find('tr td:first-child, tr:first-child td').css({'text-transform': 'capitalize', 'font-weight': 'bold'});
		ret.find('a').attr('target', '_blank');
		return ret;
	});
	createLoaderButton(contactscanteens, 'http://agata.suz.cvut.cz/jidelnicky/nove/kontakty.php', function (data) {
		var ret = $(data).find('#ap-otdoby');
		//odstranění stylů
		ret.find('*').andSelf().removeAttr('style');
		ret.find('a').attr('target', '_blank');
		return ret;
	});
	createLoaderButton(contactsidissuer, 'http://www.cvut.cz/informace-pro-studenty/prukazy', function (data) {
		var ret = $(data).find('#ap-region-content ul li p').eq(1);
		ret.find('a').attr('target', '_blank');
		return ret;
	});
	createLoaderButton(contactssuz, 'http://www.suz.cvut.cz/kontakt/telefonni-a-e-mailovy-seznam', function (data) {
		var ret = $(data).find('#ap-rpart table');
// 		ret.find('a').attr('target', '_blank');
// 		ret.find('.superth').contents().wrap('<h3/>');
		return ret;
	});
	
	
	var events = $('<div class="group"><h3>Akce</h3><ul/></div>');
	var eventsctu = $('<li>Kalendář akcí ČVUT</li>');
	var eventsfit = $('<li>Pravidelné akce FIT</li>');
	events.find('ul').append(eventsctu, eventsfit);
	
	createLoaderButton(eventsctu, 'http://akce.cvut.cz/', function (data) {
		var ret = $(data.replace(/%E2%8C%A9/g, '&lang')).find('#ap-calendar_events');
		ret.find('a').attr('target', '_blank');
		return ret;
	});
	createLoaderButton(eventsfit, 'http://fit.cvut.cz/fakulta/pravidelne-akce', function (data) {
		var ret = $(data).find('#ap-node-931 .milestone');
		ret.find('.time').contents().unwrap().wrap('<h3/>');
		ret.find('a').attr('target', '_blank');
		return ret;
	});
	
	
	var timetable = $('<div class="group"><h3>Rozvrh</h3><ul/></div>');
	var timetablestudents = $('<li>Studenti</li>');
	var timetableteachers = $('<li>Učitelé</li>');
	var timetableclassrooms = $('<li>Místnosti</li>');
	var timetablesubjects = $('<li>Předměty</li>');
	var timetableoneshot = $('<li>Jednorázové akce</li>');
	timetable.find('ul').append(timetablestudents, timetableteachers, timetableclassrooms, timetablesubjects, timetableoneshot);
	
	createLoaderButton(timetablestudents, 'https://timetable.fit.cvut.cz/public/cz/studenti/index.html', function (data) {
		var ret = $(data).find('#ap-content');
		ret.find('a').attr('target', '_blank');
		return ret;
	});
	createLoaderButton(timetableteachers, 'https://timetable.fit.cvut.cz/public/cz/ucitele/index.html', function (data) {
		var ret = $(data).find('#ap-content div.block');
		ret.find('.top-href').remove();
		ret.find('.department').contents().unwrap().unwrap().wrap('<h3/>');
		ret.find('a').attr('target', '_blank');
		return ret;
	});
	createLoaderButton(timetableclassrooms, 'https://timetable.fit.cvut.cz/public/cz/mistnosti/index.html', function (data) {
		var ret = $(data).find('#ap-content table.classrooms a');
		ret.attr('target', '_blank');
		return ret.wrap('<li/>').parent().wrap('<ul/>').parent();
	});
	createLoaderButton(timetablesubjects, 'https://timetable.fit.cvut.cz/public/cz/predmety/indexa.html', function (data) {
		var ret = $(data).find('#ap-content .subject a');
		ret.attr('target', '_blank');
		return ret.wrap('<li/>').parent().wrap('<ul/>').parent();
	});
	createLoaderButton(timetableoneshot, 'https://timetable.fit.cvut.cz/public/cz/akce/index.html', function (data) {
		var ret = $(data).find('#ap-content div.block');
		ret.find('.top-href').remove();
		ret.find('.department').contents().unwrap().unwrap().wrap('<h3/>');
		ret.find('a').attr('target', '_blank');
		return ret;
	});
	
	
	var utilities = $('<div class="group"><h3>Užitečné</h3><ul/></div>');
	var utilstemp = $('<li>Teploměr (kolej Orlík)</li>');
	utilities.find('ul').append(utilstemp);
	
	createLoaderButton(utilstemp, 'http://teplomer.ok.cvut.cz/', function (data) {
		return $(data).find('table tr:lt(4)').wrap('<tbody/>').wrap('<table/>');
	});
	
	return $('<div/>').append(canteens, studies, openings, contacts, events, timetable, utilities);
};
