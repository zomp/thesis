/**
 * Konfigurace připojení k sémantickému úložišti.
 */

var config = {
	persistent: true, 
	engine: 'mongodb', 
	name: 'pruvodcefitcvut',
	overwrite: false,///
	mongoDomain: 'localhost',
	mongoPort: 27017
};

module.exports.config = config;
