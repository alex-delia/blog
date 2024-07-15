const Post = require('../models/post');

const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");

//display posts on GET
exports.get_posts = asyncHandler(async (req, res, next) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : null;

    let allPosts;
    if (limit) {
        allPosts = await Post.find({ isPublished: true }).populate('author').limit(limit).exec();
    } else {
        allPosts = await Post.find({ isPublished: true }).populate('author').exec();
    }

    if (allPosts.length === 0) {
        const err = new Error("No Posts found");
        err.status = 404;
        return next(err);
    }

    res.json({ message: 'Posts retrieved successfully', posts: allPosts });
});

//display individual post on GET
exports.get_post_by_id = asyncHandler(async (req, res, next) => {
    const post = await Post.findOne({
        _id: req.params.postId,
        isPublished: true
    }).populate('author').exec();

    if (post === null) {
        // No results.
        const err = new Error("Post not found");
        err.status = 404;
        return next(err);
    }

    res.json({ message: `Post retrieved successfully`, post });
});

//create post on POST
exports.post_create = [
    body('title')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Title Must Be Specified')
        .escape(),
    body('description')
        .trim()
        .isLength({ min: 1, max: 500 })
        .withMessage('Description must be between 1-500 characters.')
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
            description: req.body.description,
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
    body('description')
        .trim()
        .isLength({ min: 1, max: 500 })
        .withMessage('Description must be between 1-500 characters.')
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
            description: req.body.description,
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
    const postId = req.postToModify.id;

    const post = await Post.findByIdAndDelete(postId).exec();

    res.json({ message: 'Post Deleted Successfully', data: post });
});