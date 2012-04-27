<?php

/**
 * Proxy pro načítání HTML stránek (a jiných zdrojů) z jiných domén (cross-origin).
 * Proxy zároveň pročistí nebezpečný obsah - elementy, atributy... (white-listing).
 */


/**
 * Konfigurace
 */

$allowedUris = array( //povolená URI
	'http://agata.suz.cvut.cz/jidelnicky/nove/index.php?clPodsystem=1',
	'http://agata.suz.cvut.cz/jidelnicky/nove/index.php?clPodsystem=2',
	'http://agata.suz.cvut.cz/jidelnicky/nove/index.php?clPodsystem=3',
	'http://agata.suz.cvut.cz/jidelnicky/nove/index.php?clPodsystem=4',
	'http://agata.suz.cvut.cz/jidelnicky/nove/index.php?clPodsystem=5',
	'http://agata.suz.cvut.cz/jidelnicky/nove/index.php?clPodsystem=6',
	'http://agata.suz.cvut.cz/jidelnicky/nove/index.php?clPodsystem=8',
	'http://agata.suz.cvut.cz/jidelnicky/nove/index.php?clPodsystem=9',
	'http://agata.suz.cvut.cz/jidelnicky/nove/index.php?clPodsystem=10',
	'http://agata.suz.cvut.cz/jidelnicky/nove/oteviraci-doby.php',
	'http://agata.suz.cvut.cz/jidelnicky/nove/kontakty.php',
	'http://fit.cvut.cz/',
	'http://fit.cvut.cz/student/studijni/kontakt',
	'http://fit.cvut.cz/student/studijni/harmonogram',
	'http://fit.cvut.cz/student/studijni/formulare',
	'http://fit.cvut.cz/student/odkazy',
	'http://fit.cvut.cz/fakulta/pravidelne-akce',
	'http://fit.cvut.cz/fakulta/struktura/dekanat',
	'http://fit.cvut.cz/fakulta/struktura/katedry/kti',
	'http://fit.cvut.cz/fakulta/struktura/katedry/ksi',
	'http://fit.cvut.cz/fakulta/struktura/katedry/kcn',
	'http://fit.cvut.cz/fakulta/struktura/katedry/kps',
	'http://fit.cvut.cz/fakulta/struktura/katedry/kam',
	'http://akce.cvut.cz/',
	'https://timetable.fit.cvut.cz/public/cz/studenti/index.html',
	'https://timetable.fit.cvut.cz/public/cz/ucitele/index.html',
	'https://timetable.fit.cvut.cz/public/cz/mistnosti/index.html',
	'https://timetable.fit.cvut.cz/public/cz/predmety/indexa.html',
	'https://timetable.fit.cvut.cz/public/cz/akce/index.html',
	'https://edux.fit.cvut.cz/contacts/start',
	'http://www.cips.cvut.cz/',
	'http://www.cvut.cz/informace-pro-studenty/prukazy',
	'http://www.techlib.cz/cs/61-oteviraci-doby/',
	'http://www.suz.cvut.cz/kontakt/telefonni-a-e-mailovy-seznam',
	'http://teplomer.ok.cvut.cz/'
);

$charset = 'UTF-8'; //kódování, na které se mají stránky převést

header('Content-type: application/javascript; charset='.$charset);


/**
 * Ošetření vstupů
 */

$site = (isset($_GET['url']) ? $_GET['url'] : false); //parametr 'url' - adresa požadovaného zdroje
$callback = (isset($_GET['callback']) ? $_GET['callback'] : false); //parametr 'callback' - JSONP parametr

if ($callback && preg_match('/\W/', $callback)) {
// 	header('HTTP/1.1 400 Bad Request'); //JavaScript na straně klienta nedokáže odchytit
	exit('Parametr \'callback\' obsahuje nepatricny znak (povoleno \'a-z\', \'A-Z\', \'0-9\' a \'_\'), zablokovano jako prevence pred XSS.');
}
if (!$site) {
// 	header('HTTP/1.1 400 Bad Request'); //JavaScript na straně klienta nedokáže odchytit
	exit(($callback ? $callback.'(' : '').'{"error": "Uvedte v parametru \'url\' URL pozadovane stranky (pripadne v parametru \'callback\' JSONP parametr)."}'.($callback ? ')' : ''));
}
if (!in_array($site, $allowedUris)) {
// 	header('HTTP/1.1 403 Forbidden'); //JavaScript na straně klienta nedokáže odchytit
	exit(($callback ? $callback.'(' : '').'{"error": "Pristup k pozadovane URL neni z bezpecnostnich duvodu povolen."}'.($callback ? ')' : ''));
}


/**
 * Získání a zpracování stránky
 */

//získání stránky
$ch = curl_init($site);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$output = curl_exec($ch);
$error = curl_error($ch);
$info = curl_getinfo($ch);
curl_close($ch);

//ohlášení chyby ve spojení se druhou stranou
if ($error !== '') {
// 	header('HTTP/1.1 500 Internal Server Error'); //JavaScript na straně klienta nedokáže odchytit
	exit(($callback ? $callback.'(' : '').'{"error": "Chyba proxy pri spojeni proxy se zdrojem."}'.($callback ? ')' : ''));
}
if ($info['http_code'] !== 200) {
// 	header('HTTP/1.1 502 Bad Gateway'); //JavaScript na straně klienta nedokáže odchytit
	exit(($callback ? $callback.'(' : '').'{"error": "Chyba ve spojeni proxy se zdrojem."}'.($callback ? ')' : ''));
}

//zjištění kódování stránky
$encoding = 'UTF-8';
if (preg_match('/charset=([-a-zA-Z0-9_]+)/s', $output, $match)) {
	$encoding = $match[1];
}
//změna kódování stránky na $charset
if ($encoding != $charset && $encoding != strtolower($charset)) {
	$output = iconv($encoding, $charset.'//TRANSLIT', $output);
}

//pročištění stránky
require_once 'php/htmlpurifier/HTMLPurifier.auto.php';
$config = HTMLPurifier_Config::createDefault();
$config->set('Attr.EnableID', true);
$config->set('Attr.IDPrefix', 'ap-'); //prefix ID dokumentu - aby se nemotala s existujícími
// $config->set('AutoFormat.RemoveEmpty', true); //"komprese" dokumentu - nebezpečné
// $config->set('Core.Encoding', $encoding);
// $config->set('HTML.Doctype', 'HTML 4.01 Transitional');
// $config->set('HTML.TargetBlank', true); //záležitostí pouze 'externích' odkazů (viz doc.)
$config->set('URI.Base', $site);
$config->set('URI.MakeAbsolute', true);
$purifier = new HTMLPurifier($config);
$output = $purifier->purify($output);

echo ($callback ? $callback.'(' : '').'{"sitecontent": '.json_encode($output).'}'.($callback ? ')' : '');

?>
