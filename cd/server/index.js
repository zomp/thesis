/**
 * This file is part of Průvodce FIT ČVUT.
 * Copyright (C) 2011-2012 Jan Molnár
 *
 * Průvodce FIT ČVUT is free software: you  can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * Průvodce FIT ČVUT is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty
 * of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with Průvodce FIT ČVUT. If not, see <http://www.gnu.org/licenses/>.
 */

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
