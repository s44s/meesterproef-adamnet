var fetch = require('node-fetch');
var sparqlqueries = require('./sparql');
var chapters = require('./chapters.js');

exports.homePage = function (req, res, next) {
  res.render('index');
}

exports.newStoryPage = function (req, res, next) {
  res.render('new-story');
}

var newStoryData = {};

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
