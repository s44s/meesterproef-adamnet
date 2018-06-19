var express = require('express');
var router = express.Router();

// Require controller.js:
var controller = require('../controllers/controller.js');

// GET home page:
router.get('/', controller.homePage);

// GET new story page:
router.get('/new-story', controller.newStoryPage);

// POST search location page:
router.post('/search-location', controller.searchLocationPage);

// POST create story page:
router.post('/create-story', controller.postCreateStoryPage);

// GET create story page:
router.get('/create-story/:id', controller.getCreateStoryPage);

// GET save story page:
router.get('/save-story/:id', controller.saveStoryPage);

// GET story page:
router.get('/story/:id', controller.storyPage);

module.exports = router;
