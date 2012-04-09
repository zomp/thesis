var rdfstore = require('rdfstore');
	
var store = rdfstore.create({
	persistent: true, 
	engine: 'mongodb', 
	name: 'pruvodcefitcvut',
	overwrite: false,///
	mongoDomain: 'localhost',
	mongoPort: 27017
}, function (store2) {
	console.log(store2);
	console.log(store === store2);
});
console.log(store.engine.client._state);

for (var x = 0; x < 1000000; x += 0.001) 1+x;

console.log(store.engine.client._state);

doAction(action) {
	
}