<?php

/**
 * Proxy pro načítání HTML stránek (a jiných zdrojů) z jiných domén (Cross-domain).
 * Proxy zároveň pročistí nebezpečný obsah - elementy, atributy...
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
	'http://agata.suz.cvut.cz/jidelnicky/nove/index.php?clPodsystem=7',
	'http://agata.suz.cvut.cz/jidelnicky/nove/index.php?clPodsystem=8',
	'http://agata.suz.cvut.cz/jidelnicky/nove/index.php?clPodsystem=9',
	'http://agata.suz.cvut.cz/jidelnicky/nove/index.php?clPodsystem=10',
	'http://akce.cvut.cz/'
);

$charset = 'UTF-8'; //kódování, na které se mají stránky převést

header('Content-type: application/x-javascript; charset='.$charset);


/**
 * Ošetření vstupů
 */

$site = (isset($_GET['url']) ? $_GET['url'] : false);
$callback = (isset($_GET['callback']) ? $_GET['callback'] : false);

if (!$site) {
	exit(($callback ? $callback.'(' : '').'{"error": "Uvedte v parametru \'url\' URL pozadovane stranky."}'.($callback ? ')' : ''));
}
if (!in_array($site, $allowedUris)) {
	exit(($callback ? $callback.'(' : '').'{"error": "Pristup k pozadovane URL neni z bezpecnostnich duvodu povolen."}'.($callback ? ')' : ''));
}


/**
 * Získání a zpracování stránky
 */

//získání stránky
$ch = curl_init($site);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$output = curl_exec($ch);
curl_close($ch);

$encoding = 'UTF-8';
if (preg_match('/charset=([-a-zA-Z0-9_]+)/s', $output, $match)) {
	$encoding = $match[1]; //zjištění kódování stránky
}
if ($encoding != $charset && $encoding != strtolower($charset)) {
	$output = iconv($encoding, $charset.'//TRANSLIT', $output); //změna kódování stránky na $charset
}

//pročištění stránky
require_once 'php/htmlpurifier/HTMLPurifier.auto.php';
$config = HTMLPurifier_Config::createDefault();
$config->set('Attr.EnableID', true);
// $config->set('Core.Encoding', $encoding);
// $config->set('HTML.Doctype', 'HTML 4.01 Transitional');
$config->set('URI.Base', $site);
$config->set('URI.MakeAbsolute', true);
$purifier = new HTMLPurifier($config);
$output = $purifier->purify($output);

echo ($callback ? $callback.'(' : '').'{"sitecontent": '.json_encode($output).'}'.($callback ? ')' : '');

?>
