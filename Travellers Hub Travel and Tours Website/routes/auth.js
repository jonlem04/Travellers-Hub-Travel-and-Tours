const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
    const { firstName, middleName, lastName, email, password, confirmPassword, phoneNumber, birthDate, address } = req.body;

    // Check if password matches confirmPassword
    if (password !== confirmPassword) {
        return res.status(400).json ({msg: 'Passwords do not match' });
    }

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json ({msg:'User already exists' });

        user = new User({
            firstName,
            middleName,
            lastName,
            email,
            password,
            phoneNumber,
            birthDate,
            address
        });

        await user.save();
        res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json ({ error: err.message });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const payload = {
            user: {
                id: user.id
            }
        };
        
        jwt.sign(payload, 'secret', { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            //res.json({ token });

            // Option 1: Redirect to Destination Pick.html without token in URL
            // Assuming Destination Pick.html is in the Client folder
            //res.redirect('/DestinationPick.html');

            // Option 2: If you want to pass the token as part of the query string (optional)
             res.redirect(`/DestinationPick.html?token=${token}`);

            // Option 3: Set the token in a cookie (optional)
            // res.cookie('token', token, { httpOnly: true }).redirect('/DestinationPick.html');
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

    

});

module.exports = router;
