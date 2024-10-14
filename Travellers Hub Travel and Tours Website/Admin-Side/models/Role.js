// models/Role.js
const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
    name: {
        type: String,
        enum: ['SuperAdmin', 'Admin', 'Manager'],
        required: true,
    },
    permissions: {
        type: [String], // Define specific permissions if needed
        default: [],
    },
});

module.exports = mongoose.model('Role', RoleSchema);
