const jwt = require('jsonwebtoken');

function authenticateJWT(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header
    if (!token) {
        return res.status(401).json({ message: 'Authorization header missing or invalid.' });
    }
    jwt.verify(token, process.env.JWT_KEY, (err, decodedToken) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token.' });
        }
        req.user = decodedToken; // Attach decoded token payload to request object
        next();
    });
}

module.exports = authenticateJWT;