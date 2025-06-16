const mongoose = require('mongoose');
const Question = require('./models/Question');
const questions = require('./questions.json');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
    await Question.deleteMany({});
    await Question.insertMany(questions);
    console.log("Seeded successfully!");
    process.exit();
});
