const State = require('../models/State');
const User = require('../models/User');
const Category = require('../models/Category');
const Ad = require('../models/Ad');

//Import Validators Objects
const { validationResult, matchedData } = require('express-validator');

// Import Mongoose
const mongoose = require('mongoose');

//import bcrypt
const bcrypt = require('bcrypt');



module.exports = {

    getStates: async(req, res) => {
        let states = await State.find();
        res.json({ states });
    },

    info: async(req, res) => {
        let token = req.body.token;

        const user = await User.findOne({ token });
        const state = await State.findById(user.state);
        const ads = await Ad.find({ idUser: user._id.toString });

        let adList = [];
        for (let i in ads) {
            const cat = await Category.findById(ads[i].category);

            // Alista abaixo também pode ser feita assim
            //adList.push({...ads[i], category: cat.slug });

            adList.push({
                id: ads[i]._id,
                status: ads[i].status,
                images: ads[i].images,
                dateCreated: ads[i].dateCreated,
                title: ads[i].title,
                price: ads[i].price,
                priceNegotiable: ads[i].priceNegotiable,
                description: ads[i].description,
                views: ads[i].views,
                category: cat.slug
            });
        }


        res.json({
            'name': user.name,
            'e-mail': user.email,
            'state': state.name,
            'ads': adList
        });
    },

    editAction: async(req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ error: errors.mapped() });
            return;
        }

        const data = matchedData(req);

        const user = User.findOne({ token: data.token });

        let fieldUpdates = {};

        if (data.name) {
            fieldUpdates.name = data.name;
        }

        if (data.email) {
            const emailCheck = await User.findOne({ email: data.email });
            if (emailCheck) {
                res.status(400).json({ error: "Email já existe!" });
                return;
            }

            fieldUpdates.email = data.email;
        }

        if (data.state) {
            if (mongoose.Types.ObjectId.isValid(data.state)) {
                const stateCheck = await State.findById(data.state);
                if (!stateCheck) {
                    res.json({ error: 'Estado não encontrado!' });
                    return;
                }
                fieldUpdates.state = data.state;
            } else {
                res.status(400).json({ error: 'Estado inválido!' });
                return;
            }
        }

        if (data.password) {
            fieldUpdates.passwordHash = await bcrypt.hash(data.password, 10);
        }


        await User.findOneAndUpdate({ token: data.token }, { $set: fieldUpdates });

        res.json({ msg: 'Update realizado com sucesso', fieldUpdates });
        return;
    }
};