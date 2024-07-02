const Post = require('../models/post');

const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");

//display posts on GET
exports.posts_list = asyncHandler(async (req, res, next) => {
    res.send('GET request for posts list');
});

//display individual post on GET
exports.post_detail = asyncHandler(async (req, res, next) => {
    res.send(`GET request for individual post: ${req.params.postId}`);
});

//create post on POST
exports.post_create = asyncHandler(async (req, res, next) => {
    res.send(`POST request for new post`);
});

//update post on PUT
exports.post_update = asyncHandler(async (req, res, next) => {
    res.send(`PUT request for updating post: ${req.params.postId}`);
});

//delete post on DELETE
exports.post_delete = asyncHandler(async (req, res, next) => {
    res.send(`DELETE request for deleting post: ${req.params.postId}`);
});