/**
 * Panel nápověda
 */

tab.help = {}; //globální rozhraní tohoto souboru

tab.help.getName = function () {
	return 'Nápověda';
};

tab.help.getContent = function () {
	return $('<div>' +
		'<div class="group">' +
		'<h3>Nápověda</h3>' +
		'<h4>Průvodce</h4>' +
		'<div class="innergroup">' +
		'<p>Pod záložkou <em>Průvodce</em> naleznete rozhraní pro přístup k nejvíce využívaným informacím.' +
		' Data jsou získávána přímo z oficiálních zdrojů, je tedy vyžadováno internetové připojení.</p>' +
		'</div>' +
		'<h4>Navigace</h4>' +
		'<div class="innergroup">' +
		'<p>Pod záložkou <em>Navigace</em> naleznete vyhledávací sekci a mapu dejvického campusu. Mapu lze' +
		' používat samostatně, sekce pro vyhledávání ale možnosti podstatně rozšíří. Vyhledávat lze:</p>' +
		'<ul>' +
		' <li>Budovy, například <em>T9</em>.</li>' +
		' <li>Neoficiální názvy budov, například <em>Modrá menza</em>.</li>' +
		' <li>Místnosti, například <em>T9:349</em>.</li>' +
		' <li>Alternativní názvy místností, například <em>Gočár</em>.</li>' +
		' <li>Body zájmu, například <em>občerstvení</em>.</li>' +
		' <li>&hellip;</li>' +
		'</ul>' +
		'<p>Při vyhledávání nezáleží na velikosti písmen a lze používat JavaScriptové regulární výrazy,' +
		' například <code>^T9.*8$</code> pro vyhledání objektu začínajícího (<code>^</code>) řetězcem' +
		' T9, po kterém následuje libovolný znak (<code>.</code>) opakující se nula až neomezeněkrát' +
		' (<code>*</code>), pak následuje znak 8, kterým název objektu končí (<code>$</code>).' +
		' Podrobný návod naleznete na webu <a href="http://www.regularnivyrazy.info/serial-javascript-regexp.html"' +
		' target="_blank">Regulární výrazy</a>.</p>' +
		'<p>Mapu lze ovládat (přibližovat, posouvat) ovládacími prvky z menu umístěného nad ní nebo gesty,' +
		' například klikem na mapu dojde k vycentrování mapy na místo kliku.</p>' +
		'</div>' +
		'<h4>SPARQL</h4>' +
		'<div class="innergroup">' +
		'<p>Pod záložkou <em>SPARQL</em> naleznete rozhraní pro dotazování nad <em>SPARQL endpointem</em>' +
		' sémantické databáze vytvořené podle ontologie reprezentující Fakultu informačních technologií' +
		' Českého vysokého učení technického v Praze.</p>' +
		'<p><em>SPARQL</em> (<em>SPARQL Protocol and RDF Query Language</em>) zahrnuje dotazovací jazyk nad' +
		' <em>RDF</em> (<em>Resource Description Framework</em>), tedy frameworkem pro modelování informací.</p>' +
		'<p>Vezměme si pro ukázku jednoduchý dotaz <code>SELECT * { ?s ?p ?o }</code>, ten reprezentuje' +
		' požadavek na výběr trojice ve vztahu <em>subjekt</em>, <em>predikát</em> a <em>objekt</em>.' +
		' Tyto entity jsou zastoupeny proměnnou, proto dojde k vyhledání všech těchto trojic v databázi.</p>' +
		'<p>Pokročilejším případem je vyhledání všech osob, zde využijeme dotaz:</p>' +
		'<pre>\n' +
		'PREFIX foaf: &lt;http://xmlns.com/foaf/0.1/&gt;\n' +
		'SELECT ?name ?email\n' +
		'WHERE {\n' +
		'	?person a foaf:Person.\n' +
		'	?person foaf:name ?name.\n' +
		'	?person foaf:mbox ?email.\n' +
		'}\n' +
		'</pre>' +
		'<p>Vyžadujeme dvě proměnné <code>?name</code> a <code>?email</code>, které jsou objektem k subjektu' +
		' <code>?person</code> majícím za predikát vlastnosti <code>foaf:name</code> a <code>foaf:mbox</code>.' +
		' Co je důležité, <code>?person</code> musí mít zároveň vlastnost <code>a</code> (být typem) hodnoty' +
		' <code>foaf:Person</code>.</p>' +
		'<p>Bližší informace o dotazovacím jazyku SPARQL získáte v kurzu <a target="_blank"' +
		' href="https://edux.fit.cvut.cz/courses/MI-SWE/">MI-SWE &ndash; Sémantický web</a>.</p>' +
		'</div>' +
		'</div>' +
		'<div class="group">' +
		'<h3>Autorská práva</h3>' +
		'<p>Data pod záložkou <em>Průvodce</em> jsou získávána z oficiálních zdrojů, autorská práva náleží jim.</p>' +
		'<p>Mapové podklady pod záložkou <em>Navigace</em> vytvořil Jan Molnár, jsou uvolněny pod' +
		' <a href="license-map.html" target="_blank">CC BY-NC-SAv3</a>.</p>' +
		'<p>Aplikaci vytvořil Jan Molnár, je uvolněna pod <a href="license-app.html" target="_blank">GNU GPLv3</a>.</p>' +
		'</div>' +
		'<div class="group">' +
		'<h3>O aplikaci</h3>' +
		'<p><em>Verze 12-04-28.</em></p>' +
		'<p><a href="http://webdev.fit.cvut.cz/~molnaja2/thesis/">Aktuální verze</a> (online).</p>' +
		'<p>V případě problémů kontaktujte Jana Molnára' +
		' (<a href="mailto:molnaja2@fit.cvut.cz" target="_blank">molnaja2@fit.cvut.cz</a>).</p>' +
		'<p>&copy; 2011-2012 Jan Molnár.' +
		' Aplikace je šířena pod <a href="license-app.html" target="_blank">GNU GPLv3</a>,' +
		' mapové podklady pod <a href="license-map.html" target="_blank">CC BY-NC-SAv3</a>.</p>' +
		'</div>' +
		'</div>');
};
