const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const Comment = require('../models/comment');

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
        req.user = decodedToken; // Attach decoded token payload to request object
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
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
        const err = new Error("Comment not found");
        err.status = 404;
        return next(err);
    }

    if (comment.user.toString() !== currentUser.id && currentUser.accountType !== 'author') {
        const err = new Error("User not authorized to delete this comment");
        err.status = 403;
        return next(err);
    }

    // Attach comment to the request object for further processing
    req.comment = comment;
    next();
});

const deleteUserAuthorization = asyncHandler(async (req, res, next) => {
    const currentUser = req.user;

    const userToDelete = await User.findById(req.params.userId).exec();

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

    // Attach user to delete to the request object for further processing
    req.userToDelete = userToDelete;
    next();
});

module.exports = {
    authenticateJWT,
    requireAuthor,
    deleteCommentAuthorization,
    deleteUserAuthorization
};