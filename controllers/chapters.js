var fetch = require('node-fetch');
var sparqlqueries = require('./sparql');

exports.location = async function (newStoryData) {
  // Fetch the images for selected location and timestamp:
  var url = sparqlqueries.url(sparqlqueries.getLocationAndTimestamp(newStoryData));

  return await fetch(url)
	  .then((resp) => resp.json()) // transform the data into json
    .then(function (data) {

			var dataFilter = data.results.bindings;

			var all = {
				years: {}
			};

			dataFilter.forEach(function(item, i, self) {
		  	var year = item.start.value.split('-')[0];
				var chapter;

				if (item.street.value == dataFilter[0].street.value) {
					chapter = 'het ' + dataFilter[0].streetLabel.value;
				} else {
					chapter = 'de overige straten';
				}

		    if (!all.years[year]) {
		    	all.years[year] = {};
		    }
				if (!all.years[year][chapter]) {
					all.years[year][chapter] = [];
				}

				all.years[year][chapter].push(item);
			});

			return all;


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
    }).catch(function (error) {
      console.log(error);
    });
};
