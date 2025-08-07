const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // Ensure this path is correct

// Protect route middleware
exports.protect = async (req, res, next) => {
    let token;

    // Check if Authorization header exists and starts with Bearer
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract token from header
            token = req.headers.authorization.split(' ')[1];
            console.log("Token received:", token);
            
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Decoded token:", decoded);

            // Find the user associated with the token
            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                console.error('User not found');
                return res.status(404).json({ message: 'User not found' });
            }

            // Proceed to the next middleware or route handler
            next();
        } catch (error) {
            console.error('Token verification failed:', error.message);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        console.error('Authorization header not found or does not start with Bearer');
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Authorize middleware based on roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            console.error(`User role ${req.user?.role} is not authorized`);
            return res.status(403).json({ message: `User role ${req.user?.role} is not authorized` });
        }
        // Proceed to the next middleware or route handler
        next();
    };
};

// Admin only middleware
exports.admin = exports.authorize('admin');
