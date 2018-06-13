var fetch = require('node-fetch');
var sparqlqueries = require('./sparql');
var wellknown = require('wellknown');
var turf = require('@turf/turf');

exports.location = async function (newStoryData) {
  // Fetch the street Wkts for selected location and timestamp:
  var fetchStreetWkts = async function () {
    var url = sparqlqueries.url(sparqlqueries.getStreetWkts(newStoryData.wkt));

    return await fetch(url)
      .then((resp => resp.json()))
      .then(function (data) {
        return data.results.bindings;
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  var streetWkts = await fetchStreetWkts();

  var streets = streetWkts.map(function (wkt) {
    var parseWkt = wellknown(wkt.streetWkt.value);
    var point = turf.point([4.895168, 52.370216]);
    var line;

    if (parseWkt.type == 'MultiLineString') {
      line = turf.multiLineString(parseWkt.coordinates);
    } else if (parseWkt.type == 'LineString') {
      line = turf.lineString(parseWkt.coordinates);
    } else {
      return;
    }

    var nearestPoint = turf.nearestPointOnLine(line, point, {units: 'kilometers'});

    return {
      'street': wkt.street.value,
      'streetLabel': wkt.streetLabel.value,
      'distance': nearestPoint.properties.dist * 1000
    };
  });

  // Sort the streets by distance to centerpoint (closes first):
  streets.sort(function (a, b) {
    return a.distance - b.distance;
  });

  // Get the street closest to centerpoint:
  function getCenterPoint() {
    return streets[0];
  }

  // Get the streets in the neighbourhood:
  function getNeighbourhood() {
    var filter = Math.round((streets.length - 1) / 4);
    return streets.filter(function (street, i) {
      if (i >= 1 && i <= filter) {
        return street;
      }
    });
  }

  // Fetch the images for selected location and timestamp:
  var fetchLocationAndTimestamp = async function () {
    var url = sparqlqueries.url(sparqlqueries.getLocationAndTimestamp(newStoryData));

    return await fetch(url)
	    .then((resp) => resp.json()) // transform the data into json
      .then(function (data) {
			  return data.results.bindings;
      }).catch(function (error) {
        console.log(error);
      });
  }

  var allData = await fetchLocationAndTimestamp();

  var allDataMapped = {
    years: {}
  };

  allData.forEach(function(item, i, self) {
    var year = item.start.value.split('-')[0];
    var chapter;

    if (item.street.value == streets[0].street) {
      chapter = streets[0].streetLabel;
    } else {
      chapter = 'de overige straten';
    }

    if (!allDataMapped.years[year]) {
      allDataMapped.years[year] = {};
    }
    if (!allDataMapped.years[year][chapter]) {
      allDataMapped.years[year][chapter] = [];
    }

    allDataMapped.years[year][chapter].push(item);
  });

  return allDataMapped;
};
