const express = require('express');
const router = express.Router();

const comment_controller = require('../controllers/commentController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

//GET request for comments on a post
router.get('/:postId/comments', comment_controller.post_comments);

//POST request for creating comment
router.post('/:postId/comments', authenticateJWT, comment_controller.comment_create);

//DELETE request for deleting comment
router.delete(':postId/comments/:commentId', comment_controller.comment_delete);

module.exports = router;
