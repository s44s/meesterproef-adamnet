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

exports.getCreateStoryPage = function (req, res, next) {
  var rows = [];

  // Fetch the images for selected location and timestamp:
  if (Object.keys(rows).length === 0) {
    var url = sparqlqueries.url(sparqlqueries.getLocationAndTimestamp(newStoryData));

    fetch(url)
		.then((resp) => resp.json()) // transform the data into json
      .then(function (data) {
        console.log(data.results.bindings);

        // First data filter:

        /*
        * Order the streets by distance to centerPoint (closest first)
        * This gives us the order of the chapters based on location.
        *
        * Chapters based on location:
        * ---------------------------
        * 1. Closest street to centerPoint: probably your old/current street
        * 2. Streets within a range of 25% from centerPoint: probably your neighbourhood
        * 3. Other streets surrounding your neighbourhood
        */

        /*
        * First chapter:
        * --------------
        * Filter the data for every image that has the following timestamp and location:
        *
        * Timestamp:
        * ----------
        * If timestamp <= 5: filter per year
        * If timestamp > 5 & <= 20: filter per 2 years
        * If timestamp > 20: filter per 5 years
        *
        * Location:
        * ---------
        * Take closest street to centerPoint as main location
        */

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
