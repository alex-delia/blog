const Comment = require('../models/comment');

const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");

//GET all comments for a post
exports.post_comments = asyncHandler(async (req, res, next) => {
    const comments = await Comment.find({ post: req.params.postId }).populate('user');

    if (comments.length === 0) {
        const err = new Error("No Comments found");
        err.status = 404;
        return next(err);
    }

    res.json({ message: 'Comments retrieved successfully', data: comments });
});

//create comment on POST
exports.comment_create = [
    body('text')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Comment text must be specified')
        .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const err = new Error('Form Data is invalid');
            err.status = 400;
            err.details = errors.array();
            return next(err);
        }

        console.log(req.params);

        const comment = new Comment({
            text: req.body.text,
            user: req.user.id,
            post: req.params.postId
        });

        await comment.populate({
            path: 'user',
            select: 'firstName lastName'
        });

        await comment.populate({
            path: 'post',
            select: 'title'
        });

        await comment.save();

        res.json({ message: 'Comment made successfully', data: comment });
    })
];

//delete comment on POST
exports.comment_delete = asyncHandler(async (req, res, next) => {
    res.send(`DELETE request for deleting comment: ${req.params.commentId}`);
});