const Post = require('../models/post');

const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");

//display posts on GET
exports.get_posts = asyncHandler(async (req, res, next) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : null;

    let allPosts;
    if (limit) {
        allPosts = await Post.find({ isPublished: true })
            .sort({ createdAt: -1 })
            .populate('author')
            .limit(limit)
            .exec();
    } else {
        allPosts = await Post.find({ isPublished: true })
            .sort({ createdAt: -1 })
            .populate('author')
            .exec();
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
    const post = await Post.findOne({ _id: req.params.postId, })
        .populate('author')
        .exec();

    if (post === null) {
        // No results.
        const err = new Error("Post not found");
        err.status = 404;
        return next(err);
    }

    if (post.isPublished === false) {
        if (req.user && req.user.id === post.author.id) {
            return res.json({ message: `Post retrieved successfully`, post });
        } else {
            const err = new Error("Post not found");
            err.status = 404;
            return next(err);
        }
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
        .optional()
        .trim()
        .isLength({ min: 1 })
        .withMessage('Title Must Be Specified')
        .escape(),
    body('description')
        .optional()
        .trim()
        .isLength({ min: 1, max: 500 })
        .withMessage('Description must be between 1-500 characters.')
        .escape(),
    body('text')
        .optional()
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

        const postId = req.params.postId;

        // Find the post by ID
        const post = await Post.findById(postId);

        if (!post) {
            const err = new Error('Post not found');
            err.status = 404;
            return next(err);
        }

        // Update the document dynamically based on req.body
        Object.keys(req.body).forEach((key) => {
            if (key !== '_id' && key !== 'updatedBy') {
                post[key] = req.body[key];
            }
        });

        // Save the updated post
        await post.save();


        res.json({ message: 'Post updated successfully', post });
    })
];

//delete post on DELETE
exports.post_delete = asyncHandler(async (req, res, next) => {
    const postId = req.params.postId;

    const post = await Post.findByIdAndDelete(postId).exec();

    res.json({ message: 'Post Deleted Successfully', post });
});