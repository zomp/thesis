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
	var submit = $('<a href="#">Hledej!</a>');
	var form = $('<form id="search" action="#"></form>');
	
	//ovládací prvky mapy - pozice, škálování, posun
	var position = $('<a href="#" class="button">Aktuální poloha</a>');
	var scaleup = $('<a href="#" class="button">Zvětšit</a>');
	var scaledown = $('<a href="#" class="button">Zmenšit</a>');
	var center = $('<a href="#" class="button">Centrovat</a>');
	var moveup = $('<a href="#" class="button">Nahoru</a>');
	var moveright = $('<a href="#" class="button">Doprava</a>');
	var movedown = $('<a href="#" class="button">Dolů</a>');
	var moveleft = $('<a href="#" class="button">Doleva</a>');
	var mapcontrol = $('<div class="group" id="mapcontrol"></div>');
	
	//mapa
	var svgmap = null; //kořen SVG mapy
	var mapsize = {width: null, height: null}; //původní velikost SVG mapy
	var map = $('<div class="group" id="map"><p>Zdá se, že aplikace nefunguje úplně správně &ndash; místo tohoto upozornění by se měla zobrazit mapa. Podporuje Váš prohlížeč SVG? V případě přetrvávajích problémů se, prosím, ozvěte autorovi, pokusí se Vám pomoci.</p></div>');
	
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
			case 2:
				scale(3/2);
				break;
			case 3:
				scale(2/3);
		}
	});
	$(svgmap).bind('contextmenu', function (e) {
		e.preventDefault();
		return false;
	});
	
	/**
	 * Vyhledání dotazu a vizualizace výsledků.
	 */
	var search = function () {
		unpointAllAreas();
		
		
		pointArea(query.val());
		
		return false;
	};
	
	form.submit(search);
	submit.click(search);
	
	form.append(query);
	form.append(submit);
	
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
	 * Vyznačení místa na mapě.
	 * @param id Identifikátor místa.
	 */
	var pointArea = function (id) {
		$('#' + id.replace(/:/g, '-'), $(svgmap)).each(function () {
			$(this).addSvgClass('point');
			
			var pointer = $('#search-pointer');
			pointer[0].setAttribute('transform', 'translate(' +
				(this.getBBox().x + this.getBBox().width/2) + ' ' +
				(this.getBBox().y + this.getBBox().height/2) + ')');
			pointer.css('visibility', 'visible');
			
			$(this).css('visibility') === 'hidden' && $(this).closest('.floor').addSvgClass('visible').closest('.building').addSvgClass('hidden');
			$(this).closest('.floor, .building').parentsUntil($(svgmap)).andSelf().siblings().addSvgClass('unimportant');
			move(svgToViewPosition({x: this.getBBox().x+this.getBBox().width/2, y: this.getBBox().y+this.getBBox().height/2}));
// 			$(this).closest('.floor, .building').length && scale(2);
		});
	};
	/**
	 * Odznačení místa na mapě.
	 * Není úplným protikladem pointArea()!
	 * @param id Identifikátor místa.
	 */
	var unpointArea = function (id) {
		$('#' + id.replace(/:/g, '-'), map).removeSvgClass('point');
	};
	/**
	 * Odznačení všech míst na mapě.
	 */
	var unpointAllAreas = function () {
		map.find('*').removeSvgClass('point').removeSvgClass('visible').removeSvgClass('hidden').removeSvgClass('unimportant');
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
		
		svgp && ('x' in svgp) && (viewp.x = (svgp.x - svgmap.viewBox.baseVal.x)*(svgmap.viewBox.baseVal.width/svgmap.width.baseVal.value));
		svgp && ('y' in svgp) && (viewp.y = (svgp.y - svgmap.viewBox.baseVal.y)*(svgmap.viewBox.baseVal.height/svgmap.height.baseVal.value));
		
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
	var inMapRange = function (geo) {
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
				if (inMapRange(geo)) {
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
	
	mapcontrol.append(position);
	mapcontrol.append(scaleup);
	mapcontrol.append(scaledown);
	mapcontrol.append(center);
	mapcontrol.append(moveup);
	mapcontrol.append(movedown);
	mapcontrol.append(moveleft);
	mapcontrol.append(moveright);
	
	return $('<div></div>').append($('<div class="group"></div>').append(form)).append(mapcontrol).append(map);
};
