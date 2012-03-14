var path = require('path');
var server = require(path.dirname(require.resolve('rdfstore')) + '/server').Server;

//výchozí konfigurace
options = {
	"port": {desc:"server port", def: "8080", validate: function(arg){ return(arg.match(/^[0-9]+$/) != null) } },
	"protocol": {desc:"protocol to use http | https", def: "http", validate: function(arg){return arg==='https' || arg==='http'} },
	"path": {desc:"Path where the SPARQL endpoint will be accessible", def:"/sparql", validate: function(arg){ return true} },
	"ssl-key": {desc:"Path to the SSL private key file", def:"./ssl/privatekye.pem", validate: function(arg){ return true} },
	"ssl-cert": {desc:"Path to the SSL certfiviate file", def:"./ssl/certificate.pem", validate: function(arg){ return true} },
	"cors-enabled": {desc:"Should the server accept CORS requests", def:"true", validate: function(arg){ return arg==='true' || arg==='false'} },
	"store-engine": {desc:"What backend should the store use: 'memory' and 'mongodb' are possible values", def:'memory', validate: function(arg){ return arg==='memory' || arg==='
mongodb'} },
	"store-tree-order": {desc:"BTree index tree order used in the in memory backend", def:'15', validate:function(arg){ return(arg.match(/^[0-9]+$/) != null) } },
	"store-name": {desc:"Name to be used to store the quad data in the persistent backend", def:'rdfstore_js', validate:function(arg){ return arg.match(/-\./) == null }},
	"store-overwrite": {desc:"If set to 'true' previous data in the persistent storage will be removed at startup", def:'false', validate:function(arg){ return arg==='true' || ar
g==='false' }},
	"store-mongo-domain": {desc:"If store-engine is set to 'mongodb', location of the MongoDB server", def:'localhost', validate:function(arg){ return true} },
	"store-mongo-port": {desc:"If store-engine is set to 'mongodb', port where the MongoDB server is running", def:'27017', validate:function(arg){ return(arg.match(/^[0-9]+$/) !
= null) } },
	"media-type": {desc:"When loading a local RDF file or loading from input stream, media type of the data to load", def:"application/rdf+xml", validate:function(arg){ return true} }
};



server.startStore(options, function () {
	if (options['protocol'] === 'http') {
		http.createServer(Server.routeRequest(options)).listen(parseInt(options['port']));
	} else if (options['protocol'] === 'https') {
		var httpsOptions = {
			key: fs.readFileSync(options['ssl-key']),
			cert: fs.readFileSync(options['ssl-cert']),
			requestCert: false
		};
		https.createServer(httpsOptions,Server.routeRequest(options)).listen(parseInt(options['port']));
	}
});
