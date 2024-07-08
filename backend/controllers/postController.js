const Post = require('../models/post');

const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");
const { findByIdAndUpdate } = require('../models/user');

//display posts on GET
exports.get_posts = asyncHandler(async (req, res, next) => {
    const allPosts = await Post.find().populate('author').exec();

    if (allPosts.length === 0) {
        const err = new Error("No Posts found");
        err.status = 404;
        return next(err);
    }

    res.json({ message: 'Posts retrieved successfully', data: allPosts });
});

//display individual post on GET
exports.get_post_by_id = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id).populate('author').exec();

    if (post === null) {
        // No results.
        const err = new Error("Post not found");
        err.status = 404;
        return next(err);
    }

    res.json({ message: `Post retrieved successfully`, data: post });
});

//create post on POST
exports.post_create = [
    body('title')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Title Must Be Specified')
        .escape(),
    body('text')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Post Text Must Be Specified')
        .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const err = new Error('Form Data is invalid');
            err.status = 400;
            err.details = errors.array();
            return next(err);
        }

        const post = new Post({
            title: req.body.title,
            text: req.body.text,
            author: req.user.id
        });

        await post.populate({
            path: 'author',
            select: 'firstName lastName'
        });
        // Data from form is valid.
        // Save post.
        await post.save();

        res.json({ message: 'Post created successfully', data: post });
    })
];

//update post on PUT
exports.post_update = [
    body('title')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Title Must Be Specified')
        .escape(),
    body('text')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Post Text Must Be Specified')
        .escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const err = new Error('Form Data is invalid');
            err.status = 400;
            err.details = errors.array();
            return next(err);
        }

        const postId = req.postToModify.id;

        const post = new Post({
            _id: postId,
            title: req.body.title,
            text: req.body.text,
            author: req.postToModify.author,
            isPublished: req.postToModify.isPublished,
            updatedBy: req.user.id
        });

        const updatedPost = await Post.findByIdAndUpdate(postId, post, { new: true, runValidators: true });

        res.json({ message: 'Post updated successfully', data: updatedPost });
    })
];

//delete post on DELETE
exports.post_delete = asyncHandler(async (req, res, next) => {
    res.send(`DELETE request for deleting post: ${req.params.postId}`);
});