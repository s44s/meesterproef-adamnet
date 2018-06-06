var express = require('express');
var router = express.Router();

// Require controller.js:
var controller = require('../controllers/controller.js');

// GET home page:
router.get('/', controller.homePage);

// GET new story page:
router.get('/new-story', controller.newStoryPage);

// POST create story page:
router.post('/create-story', controller.postCreateStoryPage);

// GET create story page:
router.get('/create-story', controller.getCreateStoryPage);

// POST save story page:
router.post('/save-story', controller.saveStoryPage);

// GET login page:
router.get('/login', controller.loginPage);

// GET create account page:
router.get('/create-account', controller.createAccountPage);

module.exports = router;
