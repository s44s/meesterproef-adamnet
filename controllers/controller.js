var fetch = require('node-fetch');
var sparqlFile = require('./sparql');

exports.homePage = function (req, res, next) {
  res.render('index');
}

exports.storyPage = function (req, res, next) {
	var host = sparqlFile.data;

	if(Object.keys(rows).length === 0) {
		fetch(host)
		.then((resp) => resp.json()) // transform the data into json
			.then(function(data) {
				res.render('story', {
					streets: data
				});
			}).catch(function(error) {
				// if there is any error you will catch them here
				console.log(error);
			});

	} else {
	 res.render('story', {
		 streets: []
	 });
	}
}
