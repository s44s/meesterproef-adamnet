var fetch = require('node-fetch');
var uuid = require('uuid/v1');
var shortid = require('shortid');
var sparqlqueries = require('./sparql');
var chapters = require('./chapters.js');

var newStoryData = {};

var database = [];

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
  console.log('client post works');
  newStoryData = req.body;

  // Create a stories array in session:
  req.session.stories = [];

  // Create id for new story:
  var id = shortid.generate();

  // Create a story object, which we will fill in later:
  var story = {
    "id": id,
    "key": null,
    "title": null,
    "meta": {},
    "years": {}
  };

  // Push story object in stories array in session:
  req.session.stories.push(story);

  res.redirect('/create-story/' + id);
}

exports.getCreateStoryPage = async function (req, res, next) {
  // Check if given id exists in database:
  var checkDatabase = stories.filter(function (story) {
    if (story.id == req.params.id) {
      return story;
    }
  });

  if (checkDatabase[0] !== undefined) {
    console.log('edit existing story: ', checkDatabase[0].id);
  } else {
    console.log('create new story with id: ', req.params.id);
  }




  var result = await chapters.location(newStoryData);

  // Add the id to the story object:
  req.session.story.id = req.params.id;

  // Add the data to the story object:
  req.session.story.years = result.years;

  res.render('create-story', {
    dataFirstQuery: result,
    id: req.session.story.id
  });
}

exports.saveStoryPage = function (req, res, next) {
  // Generate new key:
  var key = uuid();

  // Add key to story data:
  req.session.story.key = key;

  // Temporary empty database for dev:
  // stories.splice(0, stories.length);

  // Push the story object in temporary database:
  stories.push(req.session.story);

  // Create the new url:
  var url = req.get('host') + '/story/' + req.params.id;

  res.render('save-story', {
    url: url,
    key: key
  });
}

exports.storyPage = function (req, res, next) {
  var id = req.params.id;
  var story = stories.filter(function (story) {
    if (story.id == id) {
      return story;
    }
  });

  res.render('story', {
    dataFirstQuery: story[0],
    id: id
  });
}
