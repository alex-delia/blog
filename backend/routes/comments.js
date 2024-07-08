const express = require('express');
const router = express.Router({ mergeParams: true });

const comment_controller = require('../controllers/commentController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

//GET request for comments on a post
router.get('/', comment_controller.get_comments);

//POST request for creating comment
router.post('/', authenticateJWT, comment_controller.comment_create);

//DELETE request for deleting comment
router.delete('/:commentId', authenticateJWT, comment_controller.comment_delete);

module.exports = router;
