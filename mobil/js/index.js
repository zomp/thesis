
var tab = {}; //moduly menu

//přepínání modulů menu
var setTab = function (name) {
	$('#content').html(tab[name].getContent());
};

//akce prováděné po načtení stránky
$(document).ready(function () {
	var tabnames = config.tab.used; //použité moduly menu
	
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
