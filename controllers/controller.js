var fetch = require('node-fetch');
var sparqlqueries = require('./sparql');
var chapters = require('./chapters.js');

var newStoryData = {};

exports.homePage = function (req, res, next) {
  res.render('index');
}

exports.newStoryPage = function (req, res, next) {
  res.render('new-story');
}

exports.searchLocationPage = function (req, res, next) {
  var url = sparqlqueries.url(sparqlqueries.getAllStreets());

  fetch(url)
    .then((res) => res.json())
    .then(function (data) {
      var rows = data.results.bindings;



      res.redirect('/new-story');
    })
    .catch(function (error) {
      console.log(error);
    });
}

exports.postCreateStoryPage = function (req, res, next) {
  newStoryData = req.body;
  res.redirect('/');
}

exports.getCreateStoryPage = async function (req, res, next) {
  var result = await chapters.location(newStoryData);

  res.render('create-story', {
    dataFirstQuery: result
  });
}
