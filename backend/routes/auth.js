const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/login', async (req, res) => {
    const { name, phone, email, password } = req.body;
    let user = await User.findOne({ email });

    if (!user) {
        user = new User({ name, phone, email, password, previousQuestions: [] });
        await user.save();
    }

    res.json(user);
});

module.exports = router;
