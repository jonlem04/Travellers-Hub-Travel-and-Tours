const mongoose = require('mongoose'); //Middleware for Node and MongoDB
const bcrypt = require('bcryptjs'); //Hashing Password

// User Schema
const UserSchema = new mongoose.Schema({
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