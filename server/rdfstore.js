var rdfstore = require('rdfstore');

var store = rdfstore.create({
	persistent: true, 
	engine: 'mongodb', 
	name: 'pruvodcefitcvut', // quads in MongoDB will be stored in a DB named myappstore
	overwrite: false,    // delete all the data already present in the MongoDB server
	mongoDomain: 'localhost', // location of the MongoDB instance, localhost by default
	mongoPort: 27017 // port where the MongoDB server is running, 27017 by default
}, function (store) {
	store.execute('INSERT DATA { <http://example/person1> <http://xmlns.com/foaf/0.1/name> "Celia2" }', function(result, msg){           
		store.execute('SELECT * { ?s ?p ?o }', function(success,results) {
			console.log('select returned ' + success + ' and results ' + JSON.stringify(results) );
		});
	});
});



/*store.execute('INSERT DATA {  <http://example/person1> <http://xmlns.com/foaf/0.1/name> "Celia" }', function(result, msg) {
   store.registerDefaultProfileNamespaces();

   store.execute('SELECT * { ?s foaf:name ?name }', function(success,results) {
       test.ok(success === true);
       test.ok(results.length === 1);
       test.ok(results[0].name.value === "Celia");
   });
});*/


/*// simple query execution
store.execute("SELECT * { ?s ?p ?o }", function(success, results){
  if(success) {
    // process results        
    if(results[0].s.token === 'uri') {
      console.log(results[0].s.value);
    }       
  }
});*/


/*// execution with an explicit default and named graph
var defaultGraph = [{'token':'uri', 'vaue': graph1}, {'token':'uri', 'value': graph2}];
var namedGraphs  = [{'token':'uri', 'vaue': graph3}, {'token':'uri', 'value': graph4}];

store.executionWithEnvironment("SELECT * { ?s ?p ?o }",defaultGraph,
  namedGraphs, function(success, results) {
  if(success) {
    // process results
  }
});*/
