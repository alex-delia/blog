const req = require('express/lib/request');
const jwt = require('jsonwebtoken');

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
    if (req.user && req.user.accountType === 'author') {
        return next();
    }
    const err = new Error('User is not an author');
    err.status = 401;
    return next(err);
}

module.exports = {
    authenticateJWT,
    requireAuthor,
};