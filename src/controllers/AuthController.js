//Import Validators
const { validationResult, matchedData } = require('express-validator');
//IMport Models
const User = require('../models/User');
const State = require('../models/State');

// Import Mongoose
const mongoose = require('mongoose');

//Import Bcrypt
const bcrypt = require('bcrypt');

module.exports = {
    signin: async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ error: errors.mapped() });
            return;
        }

        const data = matchedData(req);

        //Validando o E-mail
        const user = await User.findOne({ email: data.email });

        if (!user) {
            res.status(400).json({ error: 'E-mail e/oou senha errados!' });
            return;
        }

        // Validando a senha

        const match = await bcrypt.compare(data.password, user.passwordHash);
        if (!match) {
            res.status(400).json({ error: 'E-mail e/oou senha errados!' });
            return;
        }

        // Gerando Token
        const payload = (Date.now() + Math.random()).toString();
        const token = await bcrypt.hash(payload, 10);

        user.token = token;
        await user.save();

        res.json({ token, email: data.email });
    },
    signup: async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ error: errors.mapped() });
            return;
        }

        const data = matchedData(req);

        //Verificação de existência de e-mail
        const user = await User.findOne({ email: data.email });
        if (user) {
            res.json({
                error: { email: { msg: 'Email já existe na base de dados!' } },
            });
            return;
        }

        //Verificação da existência de state
        if (mongoose.Types.ObjectId.isValid(data.state)) {
            const stateItem = await State.findById(data.state);
            if (!stateItem) {
                res.json({
                    error: { state: { msg: 'State não existe' } }
                });
                return;
            }
        } else {
            res.json({
                error: { state: { msg: 'Id do State não é válido!' } }
            });
            return;
        }

        // Sign Up
        const passwordHash = await bcrypt.hash(data.password, 10);

        const payload = (Date.now() + Math.random()).toString();
        const token = await bcrypt.hash(payload, 10);

        const newUser = await User({
            name: data.name,
            email: data.email,
            passwordHash,
            token,
            state: data.state
        }).save();

        res.json({ newUser });
        console.log(data);
    }
};