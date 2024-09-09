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
app.use(express.urlencoded({extended: true}));
//app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://TravellersHubTT:adminpassword@databasecluster.9hbza.mongodb.net/THTTDb', {
}).then(() => console.log("Database Connected"))
  .catch(err => console.log(err));


// Other imports
const authRoutes = require('./routes/auth');

// Use Routes
app.use('/api/auth', authRoutes);


// Serve static files (DestinaionPick.html)
app.use(express.static(path.join(__dirname, 'Client')));
// Serve static file for css 
app.use(express.static(path.join(__dirname, 'assets')));



const jwtSecret = process.env.JWT_SECRET;
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
