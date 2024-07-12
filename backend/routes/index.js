const express = require('express');
const router = express.Router();

const user_controller = require('../controllers/userController');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send('GET request for index page');
});

//POST request for logging in
router.post('/login', user_controller.login);

//POST request for creating user
router.post('/register', user_controller.user_create);

module.exports = router;
