const express = require('express');
const router = express.Router();

const user_controller = require('../controllers/userController');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send('GET request for index page');
});

router.post('/login', user_controller.login);

module.exports = router;
