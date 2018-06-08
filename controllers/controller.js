var fetch = require('node-fetch');
var sparqlqueries = require('./sparql');
var chapters = require('./chapters.js');

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
        rows = data.results.bindings;

        // Map the data:
        var streets = rows.map(function (street) {
          var streetName = street.name.value;
          var uri = street.street.value;
          var slug = uri.slice((uri.indexOf('street/') + 7), uri.lastIndexOf('/'));
          var geo = street.wkt.value;

          return {
            'type': 'Feature',
            'properties': {
              'streetName': streetName,
              'slug': slug,
              'uri': uri
            },
            'geo': geo
          };
        });

				res.render('new-story', {
					streets: streets
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
  res.redirect('/');
}

exports.getCreateStoryPage = async function (req, res, next) {
  var result = await chapters.location(newStoryData);
  console.log('result: ', result);

  res.render('create-story', {
    dataFirstQuery: result
  });
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
