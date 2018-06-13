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
      'distance': nearestPoint.properties.dist * 100
    };
  });

  streets.forEach(function (street) {
    console.log(street);
  });

  /*
  *   Next:
  *   -----
  *   1. Add leaflet node.js package
  *   2. Try to calc distance between street wkts and centerpoint circle
  *   3. Add the distance to every street as a property
  */

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

    if (item.street.value == allData[0].street.value) {
      chapter = allData[0].streetLabel.value;
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
