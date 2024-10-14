// server.js or app.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/auth');

dotenv.config();

const app = express();

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Routes
app.use('/api/auth', authRoutes);

// Protected Route Example
app.get('/api/protected', authMiddleware.verifyToken, (req, res) => {
    res.json({ message: `Hello ${req.admin.name}, you have access to this protected route!` });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
