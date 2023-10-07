const express = require('express');
const router = express.Router();
const controller = require('../../app_server/controllers/travel');

/* GET home page. */
router.get('/', controller.travelList);
module.exports = router;