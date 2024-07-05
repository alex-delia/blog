const Comment = require('../models/comment');

const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");

exports.post_comments = asyncHandler(async (req, res, next) => {
    res.send('GET request for displaying post comments');
});

//create comment on POST
exports.comment_create = asyncHandler(async (req, res, next) => {
    res.send('POST request for new comment');
});

//delete comment on POST
exports.comment_delete = asyncHandler(async (req, res, next) => {
    res.send(`DELETE request for deleting comment: ${req.params.commentId}`);
});