var soap = require('soap');
require('date-utils');

console.log(soap);
var url = 'http://agata.suz.cvut.cz/jidelnicky/soap/ISoap.wsdl';
var args = {TJidla: null, PodsystemID: 1, JidelnicekID: 1, Datum: (new Date()).toFormat('YYYY-MM-DD')};
soap.createClient(url, function (err, client) {
	if (err) {
		console.log(err.stack);
		return;
	}
	else {
		console.log(client);
	}
	
	
	client.GetJidla(args, function (err, result) {
		console.log(result);
	});
});
