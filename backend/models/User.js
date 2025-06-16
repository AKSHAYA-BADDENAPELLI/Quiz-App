const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    password: String,
    previousQuestions: [String]
});

module.exports = mongoose.model('User', userSchema);
