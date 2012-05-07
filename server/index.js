/**
 * Spouštěcí soubor aplikace. Přes tento soubor se routuje dále.
 */

var express = require('express');

var port = 1337; //port serveru

var app = express.createServer();

app.get('/jidelnicky', function (req, res) {
	require('./sources/agata.js').process();
	res.send("OK: Source enqueued for processing.\n");
});

app.get('/akce', function (req, res) {
	require('./sources/akce.js').process();
	res.send("OK: Source enqueued for processing.\n");
});

app.get('/rozvrh', function (req, res) {
	require('./sources/timetable.js').process();
	res.send("OK: Source enqueued for processing.\n");
});

app.get('/osoby/:login?', function (req, res) {
	require('./sources/usermap.js').process(req.params.login);
	res.send("OK: Source enqueued for processing.\n");
});

app.get('*', function (req, res) {
	res.send("Error: Service not found.\n", 404);
});

app.listen(port);

console.log("Server running at port: " + port);
