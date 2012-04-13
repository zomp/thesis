//navigace

tab.navigation = {}; //globální rozhraní tohoto souboru

tab.navigation.getName = function () {
	return 'Navigace';
};

tab.navigation.getContent = function () {
	var query = $('<input type="text" value="T9:349">');
	var submit = $('<a href="#">Hledej!</a>');
	var form = $('<form id="search" action="#"></form>');
	
	var ressults = $('<div class="group" id="ressults"></div>');
	
	var position = $('<a href="#" class="button">Aktuální poloha</a>');
	var scaleup = $('<a href="#" class="button">Zvětšit</a>');
	var scaledown = $('<a href="#" class="button">Zmenšit</a>');
	var center = $('<a href="#" class="button">Centrovat</a>');
	var moveup = $('<a href="#" class="button">Nahoru</a>');
	var moveright = $('<a href="#" class="button">Doprava</a>');
	var movedown = $('<a href="#" class="button">Dolů</a>');
	var moveleft = $('<a href="#" class="button">Doleva</a>');
	var mapcontrol = $('<div class="group" id="mapcontrol"></div>');
	
	var svgmap = null; //kořen SVG mapy
	var mapsize = {width: null, height: null}; //původní velikost SVG mapy
	var map = $('<div class="group" id="map"><p>Zdá se, že aplikace nefunguje úplně správně &ndash; místo tohoto upozornění by se měla zobrazit mapa. Podporuje Váš prohlížeč SVG? V případě přetrvávajích problémů se, prosím, ozvěte autorovi, pokusí se Vám pomoci.</p></div>');
	
	map.load('data/map.svg', function () {
		svgmap = $('#svgmap', map)[0];
		
		mapsize.width = svgmap.width.baseVal.valueAsString;
		mapsize.height = svgmap.height.baseVal.valueAsString;
		
		svgmap.width.baseVal.valueAsString = map.width();
		svgmap.height.baseVal.valueAsString = $(window).height();
		
		$(window).resize(function() {
			var center = {
				x: svgmap.viewBox.baseVal.width/2,
				y: svgmap.viewBox.baseVal.height/2
			};
			
			svgmap.width.baseVal.valueAsString = map.width();
			svgmap.height.baseVal.valueAsString = $(window).height();
			
			svgmap.viewBox.baseVal.width = svgmap.width.baseVal.valueAsString;
			svgmap.viewBox.baseVal.height = svgmap.height.baseVal.valueAsString;
			
			move(center);
		});
		
		/*$(svgmap).click(function (e) {
			alert('click');///
			move({
				x: e.pageX - Math.round(map.offset().left) - 2,
				y: e.pageY - Math.round(map.offset().top) - 2
			});
		});
		$(svgmap).dblclick(function (e) { //vyvolá i click!
			move({
				x: e.pageX - Math.round(map.offset().left) - 2,
				y: e.pageY - Math.round(map.offset().top) - 2
			});
			scale(3/2);
		});
		$(svgmap).bind('contextmenu', function (e) {
			e.preventDefault();
			move({
				x: e.pageX - Math.round(map.offset().left) - 2,
				y: e.pageY - Math.round(map.offset().top) - 2
			});
			scale(2/3);
			return false;
		});*/
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
	
		scale();
		move()
	});
	
	/**
	 * Vyhledání dotazu a vizualizace výsledků.
	 */
	var search = function () {
		ressults.html('<p>Vyhledávám...</p>');
		
		unpointAllAreas();
		pointArea(query.val());
		
		querySparql(query.val(), function (data) {
			ressults.html('<pre>' + JSON.stringify(data, null, 4) + '</pre>');
		}, function (error) {
			ressults.html('<p class="error">' + error + '</p>');
		});
		
		return false;
	};
	
	form.submit(search);
	submit.click(search);
	
	form.append(query);
	form.append(submit);
	
	/**
	 * Vyznačení místa na mapě.
	 * @param id Identifikátor místa.
	 */
	var pointArea = function (id) {
		$('#' + id.replace(/:/g, '-'), map).each(function () {
			this.className.baseVal += ' point';
		});
	};
	/**
	 * Odznačení místa na mapě.
	 * @param id Identifikátor místa.
	 */
	var unpointArea = function (id) {
		$('#' + id.replace(/:/g, '-'), map).each(function () {
			this.className.baseVal = this.className.baseVal.replace(/ ?\bpoint\b/g, '');
		});
	};
	/**
	 * Odznačení všech míst na mapě.
	 */
	var unpointAllAreas = function () {
		map.find('*').each(function () {
			this.className.baseVal = this.className.baseVal.replace(/ ?\bpoint\b/g, '');
		});
	};
	
	position.click(function () {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function (position) {
				ressults.append("<p>[" + position.coords.latitude + " ; " + position.coords.longitude + "]</p>");
			});
		} else {
			ressults.append('<p class="error">Prohlížeč nepodporuje Geolocation API.</p>');
		}
		return false;
	});
	
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
		var w = vb.width || svgmap.width.baseVal.valueAsString;
		var h = vb.height || svgmap.height.baseVal.valueAsString;
		
		vb.x = x + w*(1 - 1/s)/2;
		vb.y = y + h*(1 - 1/s)/2;
		vb.width = w/s;
		vb.height = h/s;
	};
	
	scaleup.click(function () {
		scale(3/2);
		return false;
	});
	scaledown.click(function () {
		scale(2/3);
		return false;
	});
	
	/**
	 * Vycentrování mapy do daného bodu.
	 * V případě jediné souřadnice posouvá pouze po této ose.
	 * Bez souřadnic vycentruje na střed mapy.
	 * @param center Bod o souřadnicích x a y udávající střed vycentrování.
	 */
	var move = function (center) {
		center || (mapsize.width && (svgmap.viewBox.baseVal.x = (mapsize.width - svgmap.viewBox.baseVal.width)/2));
		center || (mapsize.height && (svgmap.viewBox.baseVal.y = (mapsize.height - svgmap.viewBox.baseVal.height)/2));
		center && ('x' in center) && (svgmap.viewBox.baseVal.x += svgmap.viewBox.baseVal.width * (center.x/svgmap.width.baseVal.valueAsString - 1/2));
		center && ('y' in center) && (svgmap.viewBox.baseVal.y += svgmap.viewBox.baseVal.height * (center.y/svgmap.height.baseVal.valueAsString - 1/2));
	};
	
	center.click(function () {
		move();
		return false;
	});
	moveup.click(function () {
		move({y: 0});
		return false;
	});
	moveright.click(function () {
		move({x: svgmap.width.baseVal.valueAsString});
		return false;
	});
	movedown.click(function () {
		move({y: svgmap.height.baseVal.valueAsString});
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
	
	return $('<div></div>').append($('<div class="group"></div>').append(form)).append(ressults).append(mapcontrol).append(map);
};
