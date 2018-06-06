var fetch = require('node-fetch');
var sparqlqueries = require('./sparql');

var rows = [];

exports.homePage = function (req, res, next) {
  res.render('index');
}

exports.newStoryPage = function (req, res, next) {
	if(Object.keys(rows).length === 0) {
		fetch(sparqlqueries.url(sparqlqueries.getAllStreets))
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

var newStoryData = {};

exports.postCreateStoryPage = function (req, res, next) {
  // Use bodyParser to get the submitted params
  // console.log(req.body);
  newStoryData = req.body;
  res.redirect('/');
}

exports.getCreateStoryPage = function (req, res, next) {
  console.log(newStoryData);
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
