require('dotenv').config();
const jwt = require('jsonwebtoken');

// Auth middleware
exports.auth = async (req, resp, next) => {
    try {
        // Extract token from request
        const authHeader = req.header('Authorization');
        const token = req.cookies.mycookie || req.body.token || (authHeader && authHeader.replace('Bearer ', ''));
        
        if (!token) {
            return resp.status(401).json({
                success: false,
                message: 'Authorization failed: No token provided'
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (tokenError) {
            // Handle specific JWT errors
            if (tokenError.name === 'TokenExpiredError') {
                return resp.status(401).json({
                    success: false,
                    message: 'Token expired'
                });
            }
            
            return resp.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }
    } catch (err) {
        console.error('Auth Middleware Error:', err);
        return resp.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// isStudent middleware
exports.isStudent = async (req, resp, next) => {
    try {
        const accountType = req.user.accountType;
        if (accountType !== 'Student') {
            return resp.status(403).json({
                success: false,
                message: 'Access denied: Student access required'
            });
        }
        next();
    } catch (err) {
        console.error('isStudent Middleware Error:', err);
        return resp.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// isInstructor middleware
exports.isInstructor = async (req, resp, next) => {
    try {
        const accountType = req.user.accountType;
        if (accountType !== 'Instructor') {
            return resp.status(403).json({
                success: false,
                message: 'Access denied: Instructor access required'
            });
        }
        next();
    } catch (err) {
        console.error('isInstructor Middleware Error:', err);
        return resp.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// isAdmin middleware
exports.isAdmin = async (req, resp, next) => {
    try {
        const accountType = req.user.accountType;
        if (accountType !== 'Admin') {
            return resp.status(403).json({
                success: false,
                message: 'Access denied: Admin access required'
            });
        }
        next();
    } catch (err) {
        console.error('isAdmin Middleware Error:', err);
        return resp.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};