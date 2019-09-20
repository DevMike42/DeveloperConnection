const jwt = require('jsonwebtoken');
const config = require('config');

// Exports a middleware function that contains the req, res object
module.exports = function (req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if no token
    if (!token) {
        return res.status(401).json({ msg: 'No Token, authorization denied' })
    }

    // Verify token 
    try {
        // Decodes the token
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        // Take decoded object containing the user info and 
        // stores is in req.user to be used in other routes
        req.user = decoded.user;
        next();
    } catch (err) {
        // If token is not valid run this error and send message
        res.status(401).json({ msg: 'Token is not valid' });
    }
}