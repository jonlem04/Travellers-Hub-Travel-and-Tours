const express = require('express');
const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');  // Adjust the path according to your project structure
const { verifyToken, restrictTo } = require('../middleware/auth');

const router = express.Router();

// Route for creating an admin (restricted to SuperAdmin)
router.post('/create-admin', verifyToken, restrictTo(['SuperAdmin']), async (req, res) => {
    const { name, email, contactNumber, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = new Admin({ name, email, contactNumber, password: hashedPassword, role });
        await admin.save();
        res.status(201).send('Admin created successfully');
    } catch (error) {
        res.status(500).send('Error creating admin');
    }
});

// Route for modifying an admin (restricted to SuperAdmin and Admin)
router.post('/modify-admin', verifyToken, restrictTo(['SuperAdmin', 'Admin']), async (req, res) => {
    const { name, email, contactNumber, password, role } = req.body;
    try {
        const updatedFields = {};
        if (name) updatedFields.name = name;
        if (email) updatedFields.email = email;
        if (contactNumber) updatedFields.contactNumber = contactNumber;
        if (password) updatedFields.password = await bcrypt.hash(password, 10);
        if (role) updatedFields.role = role;

        const admin = await Admin.findOneAndUpdate({ email }, updatedFields, { new: true });
        if (!admin) return res.status(404).send('Admin not found');
        res.status(200).send('Admin updated successfully');
    } catch (error) {
        res.status(500).send('Error updating admin');
    }
});

module.exports = router;
