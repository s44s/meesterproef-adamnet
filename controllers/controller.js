var fetch = require('node-fetch');
var sparqlqueries = require('./sparql');
var chapters = require('./chapters.js');

var newStoryData = {};

var stories = [];

/*
  Story data structure:
  ---------------------

  story: {
    "id": 0001,
    "key": "A0B1CC2",
    "type": "person",
    "title": "Mijn verhaal van Amsterdam",
    "name": "Anne Frank",
    "birthyear": 1929,
    "years": {
      "1940": {
        "de buurt": [img, img],
        "de overige straten": [img, img]
      },
      "1941": {
        "Sint Agnietenstraat": [img],
        "de buurt": [img, img],
        "de overige straten": [img, img],
        "basisschool": [img, img],
        "posters": [img, img]
      }
    }
  }
*/

exports.homePage = function (req, res, next) {
  res.render('index');
}

exports.newStoryPage = function (req, res, next) {
  res.render('new-story', {
    data: req.session.searchResults
  });
}

exports.searchLocationPage = function (req, res, next) {
  var url = sparqlqueries.url(sparqlqueries.getLocationBySearch(req.body.searchLocation));

  fetch(url)
    .then((resp) => resp.json())
    .then(function (data) {
      var rows = data.results.bindings;
      req.session.searchResults = rows;
      res.redirect('/new-story');
    })
    .catch(function (error) {
      console.log(error);
    });
}

exports.postCreateStoryPage = function (req, res, next) {
  newStoryData = req.body;
  res.redirect('/create-story');
}

exports.getCreateStoryPage = async function (req, res, next) {
  console.log('title:', req.params.title);
  console.log('id:', req.params.id);
  var result = await chapters.location(newStoryData);

  res.render('create-story', {
    dataFirstQuery: result
  });
}

exports.saveStoryPage = function (req, res, next) {

}

exports.storyPage = function (req, res, next) {
  
}
