const mongoose = require('mongoose'); //Middleware for Node and MongoDB
const bcrypt = require('bcryptjs'); //Hashing Password

// Function to generate readable userId
function generateUserId() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure two digits
    const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits
    const randomNumber = Math.floor(10000 + Math.random() * 90000); // Generate a random 5-digit number
    return `USER-${year}${month}${day}-${randomNumber}`;
}

// User Schema
const UserSchema = new mongoose.Schema({

    userId: {
        type: String,
        unique: true,
        default: generateUserId, },
    
    firstName: { 
        type: String, 
        required: true },

    middleName: { 
        type: String },

    lastName: { type: String, 
        required: true },

    email: { type: String, 
        required: true, 
        unique: true },

    password: { type: String, 
        required: true },

    phoneNumber: { type: String, 
        required: true },

    birthDate: { type: Date, 
        required: true },

    address: { type: String, 
        required: true },

});


// Password hashing middleware
UserSchema.pre('save', async function(next) {

    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();

});



module.exports = mongoose.model('Client', UserSchema, 'Client');