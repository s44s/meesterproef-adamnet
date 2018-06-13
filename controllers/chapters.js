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

  streetWkts.forEach(function (wkt) {
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

    console.log(nearestPoint);
  });

  // test:
  /*
  var str = `MULTILINESTRING((4.8920327791427 52.369225857824,4.8921373593052 52.36944638633),(4.8920327791427 52.369225857824,4.8919879689827 52.369061150271),(4.8921373593052 52.36944638633,4.8923190548058 52.369971237533),(4.8919879689827 52.369061150271,4.8920183011857 52.368866773968,4.8922081435031 52.368508535488,4.8923766406063 52.368270786695),(4.8921344936838 52.369088726181,4.8921339921934 52.369133662664,4.892153971872 52.369210357493),(4.892153971872 52.369210357493,4.8926043888105 52.370402896354,4.8927034629388 52.370735855552,4.8927312262584 52.370879774899),(4.8923766406063 52.368270786695,4.8924674329929 52.368200333915,4.8931046766807 52.367672719659,4.8932825629414 52.367520670685,4.8933274095089 52.36744895602),(4.8921344936838 52.369088726181,4.8921501791998 52.368998914607,4.8922109149987 52.368819414218,4.8923753294769 52.368559457698,4.8924797098571 52.368416090425,4.892923985438 52.368076412745,4.8931166562217 52.367915438029,4.8933834365378 52.367691858101,4.893531757784 52.367557660875,4.8935767039874 52.367476958815),(4.8926171146701 52.369261509801,4.8926012295965 52.369369296026,4.8927982728902 52.370134074706),(4.892153971872 52.369210357493,4.8921462675209 52.36934417034,4.8921373593052 52.36944638633),(4.8933619770598 52.372257527089,4.8933908440367 52.37230258603),(4.8932480109527 52.371942481865,4.8933477937465 52.372212529386,4.8933619770598 52.372257527089),(4.8929945861742 52.372282957344,4.8933619770598 52.372257527089),(4.8923190548058 52.369971237533,4.8924762417603 52.370342556732),(4.8924762417603 52.370342556732,4.8925815975676 52.370749430272),(4.8925815975676 52.370749430272,4.89272952097 52.371430570708),(4.89272952097 52.371430570708,4.8927939854243 52.371832249049),(4.8927312262584 52.370879774899,4.8928012363538 52.371185649462,4.89290001324 52.371545570324,4.8929554421907 52.371842396165,4.8929945861742 52.372282957344),(4.8927939854243 52.371832249049,4.892795000845 52.372161410201),(4.8929945861742 52.372282957344,4.8929936849751 52.372363842968,4.8930507175208 52.372516872059,4.8930931668166 52.372660852552,4.8930929665882 52.372678827134),(4.8928209252403 52.372351851176,4.8928927605412 52.372718211499),(4.892795000845 52.372161410201,4.8928209252403 52.372351851176),(4.8927982728902 52.370134074706,4.8928827650049 52.370457985165),(4.8928827650049 52.370457985165,4.8929812405576 52.370844867895),(4.8931220658868 52.371384718326,4.8931919793733 52.371699579923,4.8932480109527 52.371942481865),(4.8929812405576 52.370844867895,4.8930100061068 52.370898914234,4.8931220658868 52.371384718326))`;
  var multilinestr = wellknown(str);
  console.log(multilinestr);
  var point = turf.point([4.895168, 52.370216]);
  var line = turf.multiLineString(multilinestr.coordinates);

  var nearestPoint = turf.nearestPointOnLine(line, point, {units: 'kilometers'});

  console.log(nearestPoint);
  */

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
