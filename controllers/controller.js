var fetch = require('node-fetch');
var uuid = require('uuid/v1');
var shortid = require('shortid');
var sparqlqueries = require('./sparql');
var chapters = require('./chapters.js');

/*
  Story data structure:
  ---------------------

  story: {
    "id": 0001,
    "key": "A0B1CC2",
    "title": "Mijn verhaal van Amsterdam",
    "meta": {
      "name": "Anne Frank",
      "birthyear": 1929
    },
    "data": {
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
    },
    "selection": {
      "1940": {
        "de buurt": [img]
      }
    }
  }
*/

var database = [];

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

  // Create a stories array in session:
  if (!req.session.stories) {
    req.session.stories = [];
  }

  // Create id for new story:
  var id = shortid.generate();

  // Create a story object, which we will fill in later:
  var story = {
    "id": id,
    "key": null,
    "title": null,
    "meta": {},
    "newStoryData": req.body,
    "data": {},
    "selection": {}
  };

  // Push story object in stories array in session:
  req.session.stories.push(story);

  res.redirect('/create-story/' + id);
}

exports.getCreateStoryPage = async function (req, res, next) {
  // Return the current story:
  var findCurrentStory = function (arr) {
    return arr.find(function (story) {
      return story.id == req.params.id;
    });
  }

  // Check if given id exists in database:
  var checkDatabase = database.some(function (story) {
    return story.id == req.params.id;
  });

  var data;
  var selection;

  if (checkDatabase) {
    var currentStory = findCurrentStory(database);
    data = currentStory.data;
    selection = currentStory.selection;
  } else {
    var currentStory = findCurrentStory(req.session.stories);
    var result = await chapters.location(currentStory.newStoryData);

    currentStory.data = result.years;
    data = currentStory.data;
    selection = currentStory.selection;
  }

  res.render('create-story', {
    dataFirstQuery: data,
    selection: selection,
    id: req.params.id
  });
}

exports.myStoryPage = function (req, res, next) {
  // Return the current story:
  var findCurrentStory = function (arr) {
    return arr.find(function (story) {
      return story.id == req.params.id;
    });
  }

  // Check if given id exists in database:
  var checkDatabase = database.some(function (story) {
    return story.id == req.params.id;
  });

  var selection;

  if (checkDatabase) {
    var currentStory = findCurrentStory(database);
    selection = currentStory.selection;
  } else {
    var currentStory = findCurrentStory(req.session.stories);
    selection = currentStory.selection;
  }

  res.render('my-story', {
    selection: selection,
    id: req.params.id,
    edit: currentStory.edit
  });
}

exports.saveStoryPage = function (req, res, next) {
  // Generate new key:
  var key = uuid();

  var currentStory = req.session.stories.find(function (story) {
    return story.id == req.params.id;
  });

  // Add key to story data:
  currentStory.key = key;

  currentStory.edit = false;

  // Temporary empty database for dev:
  // database.splice(0, database.length);

  // Push the story object in temporary database:
  database.push(currentStory);

  // Create the new url:
  var url = req.get('host') + '/my-story/' + req.params.id;

  res.redirect('/my-story/' + req.params.id);

  // res.render('save-story', {
  //   url: url,
  //   key: key
  // });
}

exports.editStoryPage = function (req, res, next) {
  var currentStory = req.session.stories.find(function (story) {
    return story.id == req.params.id;
  });
  currentStory.edit = true;
  res.redirect('/my-story/' + req.params.id);
}
