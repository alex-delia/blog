const Post = require('../models/post');

const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");

const authenticateJWT = require('../middlewares/authenticateToken');

//display posts on GET
exports.posts_list = asyncHandler(async (req, res, next) => {
    const allPosts = await Post.find().populate('author').exec();
    res.json({ post_list: allPosts });
});

//display individual post on GET
exports.post_detail = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id).populate('author').exec();

    if (post === null) {
        // No results.
        const err = new Error("Post not found");
        err.status = 404;
        return next(err);
    }

    res.json({ post });
});

//create post on POST
exports.post_create = [
    //verify the JWT Token, then serve the route
    authenticateJWT,

    asyncHandler(async (req, res, next) => {
        // If JWT authentication succeeds, req.user will contain the decoded token payload
        res.json({ message: 'You accessed the protected route!', user: req.user });
    })
];

//update post on PUT
exports.post_update = asyncHandler(async (req, res, next) => {
    res.send(`PUT request for updating post: ${req.params.postId}`);
});

//delete post on DELETE
exports.post_delete = asyncHandler(async (req, res, next) => {
    res.send(`DELETE request for deleting post: ${req.params.postId}`);
});