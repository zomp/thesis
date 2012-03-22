var express = require('express');

var port = 1337; //port serveru

var app = express.createServer();

app.get('/jidelnicky', function (req, res) {
	require('./agata.js').process();
	res.send("OK: Source enqueued for processing.\n");
});

app.get('/akce', function (req, res) {
	require('./akce.js').process();
	res.send("OK: Source enqueued for processing.\n");
});

app.get('/rozvrh', function (req, res) {
	require('./timetable.js').process();
	res.send("OK: Source enqueued for processing.\n");
});

app.get('/osoby/:login?', function (req, res) {
	require('./usermap.js').process(req.params.login);
	res.send("OK: Source enqueued for processing.\n");
});

app.get('*', function (req, res) {
	res.send("Error: Service not found.\n", 404);
});

app.listen(port);

console.log("Server running at port: " + port);
