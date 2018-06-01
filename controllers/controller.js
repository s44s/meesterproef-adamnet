var fetch = require('node-fetch');
var sparqlFile = require('./sparql');
var rows = [];

exports.homePage = function (req, res, next) {
  res.render('index');
}

exports.detailPage = function (req, res, next) {
  var id = req.params.id
	var host = sparqlFile.data;

	if(Object.keys(rows).length === 0) {
		fetch(host)
		.then((resp) => resp.json()) // transform the data into json
			.then(function(data) {
				res.render('detail', {
					posters: data,
					id: id
				});
			}).catch(function(error) {
				// if there is any error you will catch them here
				console.log(error);
			});

	} else {
	 res.render('detail', {
		 posters: rows,
		 id: id
	 });
	}
}
