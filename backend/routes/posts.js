var express = require('express');
var router = express.Router();

const post_controller = require('../controllers/postController');

/* GET Posts. */
router.get('/', post_controller.posts_list);

//GET request for individual post
router.get('/:postId', post_controller.post_detail);

//POST request for creating post
router.post('/', post_controller.post_create);

//PUT request for updating post
router.put('/:postId', post_controller.post_update);

//DELETE request for deleting post
router.delete('/:postId', post_controller.post_delete);

module.exports = router;
