// middleware/auth.js
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Role = require('../models/Role');

const auth = {};

auth.verifyToken = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Access Denied: No Token Provided!' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.findById(decoded.id).populate('role');
        if (!admin) throw new Error('Admin not found');
        req.admin = admin;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid Token' });
    }
};

// Middleware to check for specific roles
auth.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.admin.role.name)) {
            return res.status(403).json({ message: 'Forbidden: You do not have the required permissions.' });
        }
        next();
    };
};

module.exports = auth;
