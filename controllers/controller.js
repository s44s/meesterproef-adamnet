var fetch = require('node-fetch');
var sparqlFile = require('./sparql');

var rows = [];

exports.homePage = function (req, res, next) {
  res.render('index');
}

exports.newStoryPage = function (req, res, next) {
	var host = sparqlFile.data;

	if(Object.keys(rows).length === 0) {
		fetch(host)
		.then((resp) => resp.json()) // transform the data into json
			.then(function(data) {
				res.render('new-story', {
					streets: data
				});
			}).catch(function(error) {
				// if there is any error you will catch them here
				console.log(error);
			});

	} else {
	 res.render('new-story', {
		 streets: rows
	 });
	}
}

exports.createStoryPage = function (req, res, next) {
  // Use bodyParser to get the submitted params
  res.render('create-story');
}

exports.saveStoryPage = function (req, res, next) {
  // Use bodyParser to get the submitted story id
  res.render('save-story');
}

exports.loginPage = function (req, res, next) {
  res.render('login');
}

exports.createAccountPage = function (req, res, next) {
  res.render('create-account');
}
