/**
 * Diakritika a další náhrady pro normalizaci
 */

var diacriticsjs = {
	'á': 'a',
	'č': 'c',
	'ď': 'd',
	'ě': 'e',
	'é': 'e',
	'í': 'i',
	'ň': 'i',
	'ó': 'o',
	'ř': 'r',
	'š': 's',
	'ť': 't',
	'ú': 'u',
	'ů': 'u',
	'ý': 'y',
	'ž': 'z',
	'\'': '-',
	'/': '-',
	'"': '',
	' ': '-',
	'-': '-',
	'_': '-',
	':': '',
	',': '',
	'.': ''
};

module.exports.diacritics = diacriticsjs;
