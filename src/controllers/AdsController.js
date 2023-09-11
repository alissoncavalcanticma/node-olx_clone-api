const Category = require('../models/Category');

module.exports = {
    getCategories: async(req, res) => {
        const cats = await Category.find();

        let categories = [];

        for (let i in cats) {
            categories.push({

                ...cats[i]._doc, //"_doc" faz referência apenas aos dados principais
                img: `${process.env.Base}/assets/images/${cats[i].slug}.png`
            });
        }

        res.json({ categories });
    },
    addAction: async(req, res) => {
        return true;
    },
    getList: async(req, res) => {
        return true;
    },
    getItem: async(req, res) => {
        return true;
    },
    editAction: async(req, res) => {
        return true;
    }
};