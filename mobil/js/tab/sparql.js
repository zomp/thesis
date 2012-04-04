//SPARQL

tab.sparql = {}; //globální rozhraní tohoto souboru

tab.sparql.getName = function () {
	return 'SPARQL';
};

tab.sparql.getContent = function () {
	return 'Zde bude text input pro zadání dotazu a vizualizace výsledků.';
};


// $(document).ready(function () {
// 	$.ajax({
// 		url: config.sparql.url,
// 		accepts: 'application/json',
// 		data: {
// 			query: 'select * { ?s ?p ?o }'
// 		},
// 		dataType: 'json',
// 		success: function (data) {
// 			alert(JSON.stringify(data));
// 		}
// 	});
// });
