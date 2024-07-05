const express = require('express');
const router = express.Router();

const comment_controller = require('../controllers/commentController');

//GET request for comments on a post
router.get('/', comment_controller.post_comments);

//POST request for creating comment
router.post('/', comment_controller.comment_create);

//DELETE request for deleting comment
router.delete('/:commentId', comment_controller.comment_delete);

module.exports = router;
