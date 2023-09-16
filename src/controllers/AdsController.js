const { v4: uuid } = require('uuid');
// import jimp, biblioteca de imagens
const jimp = require('jimp');

const Ad = require('../models/Ad');
const Category = require('../models/Category');
const User = require('../models/User');
const StateModel = require('../models/State');

const addImage = async(buffer) => {
    let newName = `${uuid()}.jpg`;
    let tmpImg = await jimp.read(buffer);
    tmpImg.cover(500, 500).quality(80).write(`./public/media/${newName}`);
    return newName;
}

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
        let { title, price, priceneg, desc, cat, token } = req.body;

        const user = User.findOne({ token });

        if (!title || !cat) {
            res.status(400).json({ error: 'Títulos e/ou Categoria não preenchida!' });
            return;
        }

        if (price) {
            price = price.replace('.', '').replace(',', '.').replace('R$ ', '');
            price = parseFloat(price);
        } else {
            price = '0';
        }


        const newAd = new Ad();
        newAd.status = true;
        console.log(user.state);
        newAd.idUser = user._id;
        newAd.state = user.state;
        newAd.dateCreated = new Date();
        newAd.title = title;
        newAd.category = cat;
        newAd.price = price;
        newAd.priceNegotiable = (priceneg == 'true') ? true : false;
        newAd.description = desc;
        newAd.views = 0;

        if (req.files && req.files.img) {
            if (req.files.img.length == undefined) {
                if (['image/jpeg', 'image/jpg', 'image/png'].includes(req.files.img.mimetype)) {
                    let url = await addImage(req.files.img.data);
                    newAd.images.push({
                        url,
                        default: false
                    })
                }
            } else {
                for (let i = 0; i < req.files.img.length; i++) {
                    if (['image/jpeg', 'image/jpg', 'image/png'].includes(req.files.img[i].mimetype)) {
                        let url = await addImage(req.files.img[i].data);
                        newAd.images.push({
                            url,
                            default: false
                        })
                    }
                }
            }

            if (newAd.images.length > 0) {
                newAd.images[0].default = true;
            }
        }


        const info = await newAd.save();
        res.json({ id: info._id });
        return;

    },

    getList: async(req, res) => {
        //q filter = parametro de pesquisa (palavra)
        let { sort = 'asc', offset = 0, limit = 8, q, cat, state } = req.query;
        let filters = { status: true }
            //total de registros para paginação
        let total = 0;

        //filtros
        if (q) {
            //usando regex com opção case "insesitive"
            filters.title = { '$regex': q, '$options': 'i' };
        }
        if (cat) {
            const c = await Category.findOne({ slug: cat }).exec();
            if (c) {
                filters.category = c._id.toString();
            }
        }
        if (state) {
            const s = await StateModel.findOne({ name: state.toUpperCase() }).exec();
            if (s) {
                filters.state = s._id.toString();
            }
        }

        //consultando o total de registros
        const adsTotal = await Ad.find(filters).exec();
        total = adsTotal.length;


        //montagem da consulta
        const adsData = await Ad.find(filters)
            .sort({ dateCreated: (sort == 'desc' ? -1 : 1) })
            .skip(parseInt(offset))
            .limit(parseInt(limit))
            .exec();

        let ads = [];

        for (let i in adsData) {

            let image;
            let defaultImg = adsData[i].images.find(e => e.default);
            if (defaultImg) {
                image = `${process.env.BASE}/media/${defaultImg.url}`;
            } else {
                image = `${process.env.BASE}/media/default.jpg`;
            }

            ads.push({
                id: adsData[i]._id,
                title: adsData[i].title,
                price: adsData[i].price,
                priceNegotiable: adsData[i].priceNegotiable,
                image
            });
        }

        res.json({ ads, total });
        return;
    },
    getItem: async(req, res) => {
        return true;
    },
    editAction: async(req, res) => {
        return true;
    }
};