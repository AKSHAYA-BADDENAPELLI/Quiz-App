const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const User = require('../models/User');

router.post('/questions', async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    const all = await Question.find();
    const filtered = all.filter(q => !user.previousQuestions.includes(q._id.toString()));
    const random = filtered.sort(() => 0.5 - Math.random()).slice(0, 10);

    user.previousQuestions.push(...random.map(q => q._id.toString()));
    await user.save();

    res.json(random.map(q => ({
        _id: q._id,
        question: q.question,
        options: q.options
    })));
});

router.post('/submit', async (req, res) => {
    const { answers } = req.body;
    let score = 0;

    for (let a of answers) {
        const q = await Question.findById(a.qid);
        if (q && q.answer === a.ans) score++;
    }

    res.json({ score });
});

router.post('/reset', async (req, res) => {
    const { email } = req.body;
    await User.updateOne({ email }, { $set: { previousQuestions: [] } });
    res.json({ message: 'Reset complete' });
});

module.exports = router;
