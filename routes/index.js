var express = require('express');
var router = express.Router();

// Require controller.js:
var controller = require('../controllers/controller.js');

/* GET home page. */
router.get('/', controller.homePage);

// GET story page:
router.get('/story', controller.storyPage);

module.exports = router;
