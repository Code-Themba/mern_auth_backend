const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protectRoutes = asyncHandler(async (req, res, next) => {
    let token;
    token = req.cookies.authToken;

    if (token) {
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decode.userId).select('-password');
            next();
        } catch (err) {
            res.status(401);
            throw new Error('Not authorized, invalid token.');
        }
    } else {
        res.status(401);
            throw new Error('Not authorized, no token.');
    }
});
module.exports = protectRoutes;