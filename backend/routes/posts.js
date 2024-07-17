const express = require('express');
const router = express.Router();

const post_controller = require('../controllers/postController');
const { authenticateJWT, requireAuthor, modifyPostAuthorization, optionalAuthenticateJWT } = require('../middlewares/authMiddleware');

/* GET Posts. */
router.get('/', post_controller.get_posts);

//GET request for individual post
router.get('/:postId', optionalAuthenticateJWT, post_controller.get_post_by_id);

//POST request for creating post
router.post('/', authenticateJWT, requireAuthor, post_controller.post_create);

//PUT request for updating post
router.put('/:postId', authenticateJWT, modifyPostAuthorization, post_controller.post_update);

//DELETE request for deleting post
router.delete('/:postId', authenticateJWT, modifyPostAuthorization, post_controller.post_delete);

module.exports = router;
