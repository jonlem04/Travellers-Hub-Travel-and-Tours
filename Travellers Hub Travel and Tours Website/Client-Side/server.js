const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://TravellersHubTT:adminpassword@databasecluster.9hbza.mongodb.net/THTTDb', {
})
.then(() => console.log("Database Connected"))
.catch(err => console.error("Database connection error:", err));

// Other imports
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRoutes');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);

// Serve static files (HTML, CSS, JS, etc.)
app.use(express.static(path.join(__dirname, 'Client')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Root route to serve Homepage.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Homepage', 'Homepage.html'));
});

const jwtSecret = process.env.JWT_SECRET; // Ensure this is set in your .env file

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
