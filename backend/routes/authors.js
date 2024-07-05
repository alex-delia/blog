const express = require('express');
const router = express.Router();

const user_controller = require('../controllers/userController');

//GET request for displaying author detail
router.get('/:authorId', user_controller.author_detail);

//GET request for displaying all authors
router.get('/', user_controller.author_list);

module.exports = router;