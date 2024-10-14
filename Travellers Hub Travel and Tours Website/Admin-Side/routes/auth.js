// routes/auth.js
const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const Role = require('../models/Role');
const jwt = require('jsonwebtoken');

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.findOne({ email }).populate('role');
        if (!admin) return res.status(400).json({ message: 'Invalid email or password' });

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

        const token = jwt.sign({ id: admin._id, role: admin.role.name }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role.name } });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Create Admin Route (Protected and restricted to Super Admin)
router.post('/create', auth.verifyToken, auth.authorizeRoles('SuperAdmin'), async (req, res) => {
    const { name, email, contactNumber, password, role } = req.body;
    try {
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) return res.status(400).json({ message: 'Admin with this email already exists' });

        const adminRole = await Role.findOne({ name: role });
        if (!adminRole) return res.status(400).json({ message: 'Invalid role selected' });

        const newAdmin = new Admin({ name, email, contactNumber, password, role: adminRole._id });
        await newAdmin.save();
        res.status(201).json({ message: 'Admin created successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Modify Admin Route (Protected and restricted based on roles)
router.put('/modify/:id', auth.verifyToken, auth.authorizeRoles('SuperAdmin', 'Admin'), async (req, res) => {
    const { id } = req.params;
    const { name, email, contactNumber, password, role } = req.body;
    try {
        const admin = await Admin.findById(id);
        if (!admin) return res.status(404).json({ message: 'Admin not found' });

        if (name) admin.name = name;
        if (email) admin.email = email;
        if (contactNumber) admin.contactNumber = contactNumber;
        if (password) admin.password = password;
        if (role) {
            const adminRole = await Role.findOne({ name: role });
            if (!adminRole) return res.status(400).json({ message: 'Invalid role selected' });
            admin.role = adminRole._id;
        }

        await admin.save();
        res.json({ message: 'Admin updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get All Admins Route (Protected and restricted based on roles)
router.get('/admins', auth.verifyToken, auth.authorizeRoles('SuperAdmin', 'Admin', 'Manager'), async (req, res) => {
    try {
        const admins = await Admin.find().populate('role').select('-password');
        res.json(admins);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
