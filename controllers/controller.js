var fetch = require('node-fetch');
var sparqlqueries = require('./sparql');

exports.homePage = function (req, res, next) {
  res.render('index');
}

exports.newStoryPage = function (req, res, next) {
  var rows = [];

	if(Object.keys(rows).length === 0) {
    var url = sparqlqueries.url(sparqlqueries.getAllStreets);
		fetch(url)
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
  newStoryData = req.body;
  console.log(newStoryData);
  res.redirect('/');
}

exports.getCreateStoryPage = function (req, res, next) {
  var rows = [];

  // Fetch the images for selected location and timestamp:
  if (Object.keys(rows).length === 0) {
    var url = sparqlqueries.url(sparqlqueries.getLocationAndTimestamp(newStoryData));

    fetch(url)
      .then((res) => res.json())
      .then(function (data) {
        res.render('create-story', {
          dataFirstQuery: data
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  } else {
    res.render('create-story', {
      dataFirstQuery: rows
    });
  }
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
