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
  var url = sparqlqueries.url(sparqlqueries.getLocationBySearch(req.body.searchLocation));

  fetch(url)
    .then((res) => res.json())
    .then(function (data) {
      var rows = data.results.bindings;

      function removeDuplicates(arr) {
        let unique_array = [];
 				for (var i = 0; i < arr.length; i++) {
          if (unique_array.indexOf(arr[i]) == -1) {
            unique_array.push(arr[i]);
 					}
 				}
        return unique_array;
 			}

      var arr = [];

      rows.forEach(function (row) {
        console.log(Object.values(rows));
      });

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
	// console.log('halllooo', JSON.stringify(result));
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
