const express = require('express');
const router = express.Router();

const user_controller = require('../controllers/userController');

//GET request for displaying author detail
router.get('/:authorId', user_controller.get_author_by_id);

//GET request for displaying all authors
router.get('/', user_controller.get_authors);

module.exports = router;