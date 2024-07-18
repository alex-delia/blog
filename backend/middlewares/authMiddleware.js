const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');

const Comment = require('../models/comment');
const User = require('../models/user');
const Post = require('../models/post');

function authenticateJWT(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header
    if (!token) {
        const err = new Error("Unauthorized. Please log in.");
        err.status = 401;
        return next(err);
    }
    jwt.verify(token, process.env.JWT_KEY, (err, decodedToken) => {
        if (err) {
            const error = new Error("Invalid Token");
            error.status = 401;
            return next(error);
        }
        req.user = { ...decodedToken, id: decodedToken.sub }; // Map 'sub' to 'id'
        delete req.user.sub; // Remove 'sub' field
        next();
    });
}

function optionalAuthenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization; // Extract token from Authorization header
    if (!authHeader) {
        return next();
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return next();
    }

    jwt.verify(token, process.env.JWT_KEY, (err, decodedToken) => {
        if (err) {
            return next();
        }
        req.user = { ...decodedToken, id: decodedToken.sub }; // Map 'sub' to 'id'
        delete req.user.sub; // Remove 'sub' field
        next();
    });
}

function requireAuthor(req, res, next) {
    const currentUser = req.user;
    if (currentUser && currentUser.accountType === 'author') {
        return next();
    }
    const err = new Error('User is not an author');
    err.status = 401;
    return next(err);
}

const deleteCommentAuthorization = asyncHandler(async (req, res, next) => {
    const currentUser = req.user;

    const commentId = req.params.commentId;

    // Validate the postId
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        return res.status(400).json({ message: 'Invalid Comment ID' });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        const err = new Error("Comment not found");
        err.status = 404;
        return next(err);
    }

    if (!currentUser.isAdmin && comment.user.toString() !== currentUser.id) {
        const err = new Error("User not authorized to delete this comment");
        err.status = 403;
        return next(err);
    }

    next();
});

const deleteUserAuthorization = asyncHandler(async (req, res, next) => {
    const currentUser = req.user;

    const userId = req.params.userId;

    // Validate the postId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid User ID' });
    }

    const userToDelete = await User.findById(userId).exec();

    if (!userToDelete) {
        // No results.
        const err = new Error("User not found");
        err.status = 404;
        return next(err);
    }

    if (!currentUser.isAdmin && currentUser.id !== userToDelete.id) {
        const err = new Error("You do not have permission to delete user");
        err.status = 404;
        return next(err);
    }

    next();
});

const modifyPostAuthorization = asyncHandler(async (req, res, next) => {
    const currentUser = req.user;

    const postId = req.params.postId;

    // Validate the postId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ message: 'Invalid Post ID' });
    }

    const postToModify = await Post.findById(postId).exec();

    if (!postToModify) {
        // No results.
        const err = new Error("Post not found");
        err.status = 404;
        return next(err);
    }

    if (!currentUser.isAdmin &&
        (currentUser.id !== postToModify.author.toString() && currentUser.accountType === 'author')) {
        const err = new Error("You do not have permission to modify/delete post");
        err.status = 404;
        return next(err);
    }

    next();
});

module.exports = {
    authenticateJWT,
    optionalAuthenticateJWT,
    requireAuthor,
    deleteCommentAuthorization,
    deleteUserAuthorization,
    modifyPostAuthorization
};