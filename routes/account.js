const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../schemas/userSchema');
const JWT = require('../middlewares/jwtAuth');

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userData = { _id: new mongoose.mongo.ObjectId(), name: name, email: email, password: password };
        var user = await User.findUserByEmail(email);
        if (!user) {
            var data = await User.create(userData);
            res.json({ user: data });
        } else res.json({ error: 'User is already registered' });
    } catch (e) { res.json({ error: e.message }); }
});

router.post('/auth', async (req, res) => {
    const { email, password } = req.body;
    try {
        var user = await User.findUserByCredentials(email, password);
        if (!user) return res.json({ error: 'User is not registered' });
        var token = await user.generateAuthToken();
        res.json({ token: token });
    } catch (e) { res.json({ error: e.message }); }
});

router.get('/profile', JWT, async (req, res) => {
    try {
        const { _id } = req.token;
        var user = await User.findUserById(_id);
        if (!user) return res.json({ error: 'User is not registered' });
        res.json({ user: user });
    } catch (e) { res.json({ error: e.message }); }
});

module.exports = router;