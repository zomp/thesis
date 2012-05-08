/**
 * Panel navigace
 */

tab.navigation = {}; //globální rozhraní tohoto souboru

tab.navigation.getName = function () {
	return 'Navigace';
};

tab.navigation.getContent = function () {
	//vyhledávací formulář
	var query = $('<input type="text" value="T9:349">');
	var submit = $('<a href="#" class="submit">Hledej!</a>');
	var results = $('<div id="results"><p>Vyhledat můžete budovy, místnosti, body zájmu... Lze použít regulární výrazy.</p></div>');
	var form = $('<form id="search" action="#"/>');
	
	//ovládací prvky mapy - pozice, škálování, posun
	var position = $('<a href="#" class="button">Aktuální poloha</a>');
	var scaleup = $('<a href="#" class="button">Zvětšit</a>');
	var scaledown = $('<a href="#" class="button">Zmenšit</a>');
	var center = $('<a href="#" class="button">Centrovat</a>');
	var moveup = $('<a href="#" class="button">Nahoru</a>');
	var moveright = $('<a href="#" class="button">Doprava</a>');
	var movedown = $('<a href="#" class="button">Dolů</a>');
	var moveleft = $('<a href="#" class="button">Doleva</a>');
	var mapcontrol = $('<div class="group" id="mapcontrol"/>');
	
	//mapa
	var svgmap = null; //kořen SVG mapy
	var mapsize = {width: null, height: null}; //původní velikost SVG mapy
	var map = $('<div class="group" id="map" tabindex="0"><p>Zdá se, že aplikace nefunguje úplně správně &ndash; místo tohoto upozornění by se měla zobrazit mapa. Podporuje Váš prohlížeč SVG? V případě přetrvávajích problémů se, prosím, ozvěte autorovi, pokusí se Vám pomoci.</p></div>');
	
	//načtení mapy
	map.html(config.map.svg);
	
	svgmap = $('#svgmap', map)[0];
	
	//originální velikost mapy
	mapsize.width = svgmap.width.baseVal.value;
	mapsize.height = svgmap.height.baseVal.value;
	
	//změna velikosti displeje
	$(window).resize(function () {
		if (map.width() == svgmap.width.baseVal.value) return;
		
		var center = {
			x: svgmap.width.baseVal.value/2,
			y: svgmap.height.baseVal.value/2
		};
		
		var xRation = svgmap.viewBox.baseVal.width/svgmap.width.baseVal.value || 1;
		var yRation = svgmap.viewBox.baseVal.height/svgmap.height.baseVal.value || 1;
		
		svgmap.width.baseVal.value = map.width();
		svgmap.height.baseVal.value = $(window).height();
		
		svgmap.viewBox.baseVal.width = svgmap.width.baseVal.value * xRation;
		svgmap.viewBox.baseVal.height = svgmap.height.baseVal.value * yRation;
		
		move(center);
		
		$(svgmap).css('width', svgmap.width.baseVal.value + 'px');
	});
	
	$(svgmap).mousedown(function (e) {
		move({
			x: e.pageX - Math.round(map.offset().left) - 2,
			y: e.pageY - Math.round(map.offset().top) - 2
		});
		switch (e.which) {
			case 2: //prostřední tlačítko
				scale(3/2);
				break;
			case 3: //pravé tlačítko
				scale(2/3);
				break;
		}
	});
	$(svgmap).bind('contextmenu', function (e) {
		e.preventDefault();
		return false;
	});
	map.keydown(function (e) {
		switch (e.which) {
			case 38: //nahoru
				move({y: 0});
				e.preventDefault();
				break;
			case 39: //doprava
				move({x: svgmap.width.baseVal.value});
				e.preventDefault();
				break;
			case 40: //dolů
				move({y: svgmap.height.baseVal.value});
				e.preventDefault();
				break;
			case 37: //doleva
				move({x: 0});
				e.preventDefault();
				break;
			case 107: //plus
				scale(3/2);
				e.preventDefault();
				break;
			case 109: //minus
				scale(2/3);
				e.preventDefault();
				break;
		}
	});
	
	/**
	 * Vyhledání dotazu a vizualizace výsledků.
	 * @param data Konfigurační parametry (submit - potvrzení vyhledávání).
	 */
	var search = function () {
		results.html('<p><img src="img/load.gif" alt="Vyhledávám..."/> Vyhledávám...</p>');
		var queryval = $.trim(query.val());
		
		/**
		 * Normalizace řetězce pro hledání.
		 * @param term Řetězec k normalizování.
		 * @return Řetězec po normalizování.
		 */
		var normalize = function (term) {
			var norm = '';
			for (var i = 0, max = term.length; i < max; ++i) {
				norm += (typeof diacriticsjs[term.charAt(i)] !== 'undefined' ? diacriticsjs[term.charAt(i)] : term.charAt(i));
			}
			return norm;
		};
		
		try {
			var querymatch = new RegExp(queryval, 'i');
			var querymatchnorm = new RegExp(normalize(queryval), 'i');
		} catch (e) {
			results.html('<p><span class="error">Zadaná fráze je neplatným regulárním výrazem.</span> Nejčastější příčinou jsou chybějící výraz pro libovolný znak (<code>.</code>) nebo chybějící escape znak (<code>\\</code>) před následujícími znaky <code>*</code>, <code>?</code>, <code>+</code>, <code>[</code>, <code>]</code>, <code>(</code>, <code>)</code>, <code>{</code>, <code>}</code>, <code>\\</code>. Podrobnosti naleznete v nápovědě. </p>');
			var corrector = $('<a href="#" class="button">Naprav a hledej</a>');
			corrector.click(function () {
				query.val(queryval.replace(/[[\]{}()*+?.\\^$|]/g, '\\$&'));
				search();
				return false;
			});
			results.find('p').first().append(corrector);
			return false;
		}
		
		unpointAreas();
		
		var places = config.map.places; //databáze míst, ve kterých se vyhledává
		var found = []; //nalezená místa
		
		var i = places.length, j;
		while (i--) {
			j = places[i].phrase.length;
			while (j--) {
				if (querymatch.test(places[i].phrase[j]) || querymatchnorm.test(normalize(places[i].phrase[j]))) {
					found.push(places[i]);
					break;
				}
			}
		}
		
		if (found.length === 0) { //nic nenalezeno
			results.html('<p><span class="error">Nic nenalezeno.</span> Vyhledávejte budovy (<code>TK</code>), místnosti (<code>T9:349</code>), alternativní názvy (<code>Gočár</code>), body zájmu (<code>občerstvení</code>)...</p>');
		} else if (found.length === 1) { //nalezen pouze jeden objekt
			var othernames = '';
			for (j = 1; j < found[0].phrase.length; ++j) {
				if (querymatch.test(found[0].phrase[j]) || querymatchnorm.test(normalize(found[0].phrase[j]))) {
					othernames += ', <small>' + found[0].phrase[j] + '</small>';
				}
			}
			results.html('<p>Nalezené místo, <em>' + found[0].phrase[0] + othernames + '</em>, bylo vyznačeno na mapě.</p>');
			pointAreas(found[0].selector);
		} else { //nalezeno několik objektů
			var foundlist = $('<p>Nalezena tato místa: </p>');
			
			i = found.length;
			while (i--) { //vytvoření tlačítek reprezentujících nalezené objekty
				(function () { //uzávěr
					var foundselector = found[i].selector;
					var item = $('<a href="#" class="button">' + found[i].phrase[0] + '</a>');
					for (j = 1; j < found[i].phrase.length; ++j) {
						if (querymatch.test(found[i].phrase[j]) || querymatchnorm.test(normalize(found[i].phrase[j]))) {
							item.append(', <small>' + found[i].phrase[j] + '</small>');
						}
					}
					item.click(function () {
						unpointAreas();
						pointAreas(foundselector);
						return false;
					});
					foundlist.append(item);
				})();
			}
			
			results.empty();
			results.append(foundlist);
		}
		return false;
	};
	
	form.submit(search);
	submit.click(search);
// 	query.blur(search);
	query.keyup(search);
	
	form.append(query, results, submit);
	
	/**
	 * Škálování mapy v daném poměru.
	 * Lze zavolat i pro přenastavení viewBoxu mapy.
	 * @param s Poměr zvětšení mapy.
	 */
	var scale = function (s) {
		s = s || 1;
		
		var vb = svgmap.viewBox.baseVal;
		
		var x = vb.x || 0;
		var y = vb.y || 0;
		var w = vb.width || svgmap.width.baseVal.value;
		var h = vb.height || svgmap.height.baseVal.value;
		
		vb.x = x + w*(1 - 1/s)/2;
		vb.y = y + h*(1 - 1/s)/2;
		vb.width = w/s;
		vb.height = h/s;
	};
	
	/**
	 * Vycentrování mapy do daného bodu.
	 * V případě jediné souřadnice posouvá pouze po této ose.
	 * Bez souřadnic vycentruje na střed mapy.
	 * @param center Bod o souřadnicích x a y udávající střed vycentrování.
	 */
	var move = function (center) {
		if (center) {
			var xDiff = 0, yDiff = 0; //posun po osách
			('x' in center) && (xDiff = svgmap.viewBox.baseVal.width * (center.x/svgmap.width.baseVal.value - 1/2));
			('y' in center) && (yDiff = svgmap.viewBox.baseVal.height * (center.y/svgmap.height.baseVal.value - 1/2));
			
			var step = 0;
			var timer = setInterval(function () {
				svgmap.viewBox.baseVal.x += xDiff/config.map.animation.steps;
				svgmap.viewBox.baseVal.y += yDiff/config.map.animation.steps;
				if (++step >= config.map.animation.steps) clearInterval(timer);
			}, config.map.animation.delay);
		} else {
			svgmap.viewBox.baseVal.x = (mapsize.width - svgmap.viewBox.baseVal.width)/2;
			svgmap.viewBox.baseVal.y = (mapsize.height - svgmap.viewBox.baseVal.height)/2;
		}
	};
	
	/**
	 * Rozšíření jQuery pro práci s SVG (má jiný DOM, než HTML).
	 */
	jQuery.fn.extend({
		/**
		* Přidání třídy SVG elementu.
		* @param value Název třídy.
		*/
		addSvgClass: function (value) {
			return this.each(function () {
				value && (this.className.baseVal += ' ' + value);
			});
		},
		/**
		* Odstranění třídy SVG elementu.
		* @param value Název třídy.
		*/
		removeSvgClass: function (value) {
			return this.each(function () {
				value && (this.className.baseVal = this.className.baseVal.replace(new RegExp('\\s*\\b' + value + '\\b', 'g'), ''));
			});
		}
	});
	
	/**
	 * Vyznačení míst na mapě.
	 * @param selector Selektor místa.
	 */
	var pointAreas = function (selector) {
		var found = $(svgmap).find(selector);
		var originalpointer = $('#search-pointer')
		var bBox = {top: Infinity, right: -Infinity, bottom: -Infinity, left: Infinity}; //oblast, na kterou bude přesunuto
		found.each(function () {
			$(this).addSvgClass('point');
			
			if ($(this).css('visibility') === 'hidden')
				$(this).closest('.floor').addSvgClass('visible').closest('.building').addSvgClass('hidden');
			$(this).closest('.floor, .building').parentsUntil($(svgmap)).andSelf().siblings().addSvgClass('unimportant');
			
			var pointer = originalpointer.clone();
			pointer.removeAttr('id');
			pointer.attr('transform', 'translate(' +
				(this.getBBox().x + this.getBBox().width/2) + ' ' +
				(this.getBBox().y + this.getBBox().height/2) + ')');
			pointer.addSvgClass('search-pointer');
			$(svgmap).append(pointer);
			
			(this.getBBox().y < bBox.top) && (bBox.top = this.getBBox().y);
			(this.getBBox().x + this.getBBox().width > bBox.right) && (bBox.right = this.getBBox().x + this.getBBox().width);
			(this.getBBox().y + this.getBBox().height > bBox.bottom) && (bBox.bottom = this.getBBox().y + this.getBBox().height);
			(this.getBBox().x < bBox.left) && (bBox.left = this.getBBox().x);
		});
		if (found.length >= 1) {
			move(svgToViewPosition({x: (bBox.left + bBox.right)/2, y: (bBox.top + bBox.bottom)/2}));
			scale(Math.min(svgmap.viewBox.baseVal.width/(bBox.right - bBox.left), svgmap.viewBox.baseVal.height/(bBox.bottom - bBox.top)) * 1/7);
		}
	};
	/**
	 * Odznačení všech míst na mapě.
	 */
	var unpointAreas = function () {
		map.find('*').removeSvgClass('point').removeSvgClass('visible').removeSvgClass('hidden').removeSvgClass('unimportant');
		$('.search-pointer').remove();
	};
	
	/**
	 * Převedení pozice ze zobrazované části mapy na neškálovanou a neořezanou.
	 * @param viewp Pozice {x, y} v px na zobrazené škálované výseči.
	 * @return Pozice {x, y} v px na SVG mapě (jako kdyby nebyla ořezaná a škálovaná).
	 */
	var viewToSvgPosition = function (viewp) {
		var svgp = {}; //souřadnice x, y
		
		viewp && ('x' in viewp) && (svgp.x = svgmap.viewBox.baseVal.x + svgmap.viewBox.baseVal.width * viewp.x/svgmap.width.baseVal.value);
		viewp && ('y' in viewp) && (svgp.y = svgmap.viewBox.baseVal.y + svgmap.viewBox.baseVal.height * viewp.y/svgmap.height.baseVal.value);
		
		return svgp;
	}
	
	/**
	 * Převedení pozice z neškálované neořezané mapy na zobrazovanou část mapy.
	 * @param svgp Pozice {x, y} v px na SVG mapě (jako kdyby nebyla ořezaná a škálovaná).
	 * @return Pozice {x, y} v px na zobrazené škálované výseči.
	 */
	var svgToViewPosition = function (svgp) {
		var viewp = {}; //souřadnice x, y
		
		svgp && ('x' in svgp) && (viewp.x = (svgp.x - svgmap.viewBox.baseVal.x)*(svgmap.width.baseVal.value/svgmap.viewBox.baseVal.width));
		svgp && ('y' in svgp) && (viewp.y = (svgp.y - svgmap.viewBox.baseVal.y)*(svgmap.height.baseVal.value/svgmap.viewBox.baseVal.height));
			
		return viewp;
	};
	
	/**
	 * Převedení zeměpisných souřadnic na pozici na originální mapě.
	 * Metoda není vhodná na rozsáhlá území - aproximuje na vizualizaci plochy.
	 * @param geop Souřadnice {lon, lat}.
	 * @return Pozice {x, y} na mapě.
	 */
	var geoToSvgPosition = function (geop) {
		var svgp = {}; //souřadnice x, y
		
		geop && ('lon' in geop) && (svgp.x = (geop.lon - config.map.corners.northwest.lon)*(mapsize.width/(config.map.corners.southeast.lon - config.map.corners.northwest.lon)));
		geop && ('lat' in geop) && (svgp.y = (config.map.corners.northwest.lat - geop.lat)*(mapsize.height/(config.map.corners.northwest.lat - config.map.corners.southeast.lat)));
		
		return svgp;
	};
	
	/**
	 * Převedení zeměpisných souřadnic na pozici na zobrazované mapě.
	 * Metoda není vhodná na rozsáhlá území - aproximuje na vizualizaci plochy.
	 * @param geop Souřadnice {lon, lat}.
	 * @return Pozice {x, y} na mapě.
	 */
	var geoToViewPosition = function (geop) {
		var viewp = {}; //souřadnice x, y
		
		geop && ('lon' in geop) && (viewp.x = svgToViewPosition({x: geoToSvgPosition({lon: geop.lon}).x}).x);
		geop && ('lat' in geop) && (viewp.y = svgToViewPosition({y: geoToSvgPosition({lat: geop.lat}).y}).y);
		
		return viewp;
	};
	
	/**
	 * Určení, zda se souřadnice nachází v rozsahu mapy.
	 * Metoda není vhodná na rozsáhlá území - aproximuje na vizualizaci plochy.
	 * @param geo Ověřované souřadnice.
	 * @return Pozice se nachází na mapě.
	 */
	var geoInMapRange = function (geo) {
		if (geo.lat >= config.map.corners.northwest.lat) return false;
		if (geo.lon <= config.map.corners.northwest.lon) return false;
		if (geo.lat <= config.map.corners.southeast.lat) return false;
		if (geo.lon >= config.map.corners.southeast.lon) return false;
		return true;
	}
	
	position.click(function () {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function (pos) {
				var geo = {lat: pos.coords.latitude, lon: pos.coords.longitude};
// 				var geo = {lat: 50.104575, lon: 14.387451};///
				if (geoInMapRange(geo)) {
					var pointer = $('#position-pointer');
					pointer[0].setAttribute('transform', 'translate(' +
						(geoToSvgPosition({lon: geo.lon}).x - pointer[0].getBBox().width/2) + ', ' +
						(geoToSvgPosition({lat: geo.lat}).y - pointer[0].getBBox().height/2) + ')');
					pointer.css('visibility', 'visible');
					move(geoToViewPosition(geo));
				} else {
					alert('Nacházíte se mimo mapu (pozice: ' + pos.coords.latitude + ', ' + pos.coords.longitude + ').');
				}
			});
		} else {
			alert('Prohlížeč nepodporuje Geolocation API.');
		}
		return false;
	});
	
	scaleup.click(function () {
		scale(3/2);
		return false;
	});
	scaledown.click(function () {
		scale(2/3);
		return false;
	});
	
	center.click(function () {
		move();
		return false;
	});
	moveup.click(function () {
		move({y: 0});
		return false;
	});
	moveright.click(function () {
		move({x: svgmap.width.baseVal.value});
		return false;
	});
	movedown.click(function () {
		move({y: svgmap.height.baseVal.value});
		return false;
	});
	moveleft.click(function () {
		move({x: 0});
		return false;
	});
	
	mapcontrol.append(position, scaleup, scaledown);
	mapcontrol.append(moveup, movedown, moveleft, moveright); //center - odebráno, nebylo využíváno
	
	return $('<div/>').append($('<div class="group"/>').append(form), mapcontrol, map);
};
