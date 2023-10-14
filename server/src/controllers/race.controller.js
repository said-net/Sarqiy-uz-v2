const md5 = require("md5");
const raceModel = require("../models/race.model");
const { SERVER_LINK } = require("../configs/env");
const fs = require("fs");
const cointransferModel = require("../models/cointransfer.model");
const shopModel = require("../models/shop.model");
const userModel = require("../models/user.model");
module.exports = {
    create: async (req, res) => {
        const { title, old_price, price } = req.body;
        const image = req?.files?.image;
        if (!title || !old_price || !price) {
            res.send({
                ok: false,
                msg: "Qatorlarni to'ldiring!"
            })
        } else if (!image) {
            res.send({
                ok: false,
                msg: "Poyga sovg'asi rasmini yuklang!"
            })
        } else {
            const filePath = `/public/races/${md5(new Date() + title)}.png`;
            const id = await raceModel.find().countDocuments() + 1;
            new raceModel({
                id,
                title,
                old_price,
                price,
                image: filePath
            }).save().then(() => {
                image.mv(`.${filePath}`);
                res.send({
                    ok: true,
                    msg: "Saqlandi!"
                });
            }).catch(() => {
                res.send({
                    ok: false,
                    msg: "Xatolik!"
                });
            })
        }
    },
    getAll: async (req, res) => {
        const $races = await raceModel.find({ hidden: false })
        const mod = [];
        $races.forEach((r) => {
            mod.push({
                id: r?.id,
                _id: r._id,
                title: r?.title,
                image: SERVER_LINK + r?.image,
                price: r.price,
                old_price: r.old_price,
            });
        });
        res.send({
            ok: true,
            data: mod
        });
    },
    editImage: async (req, res) => {
        const image = req?.files?.image;
        const { id } = req.params;
        try {
            const $race = await raceModel.findById(id);
            fs.unlink(`.${$race.image}`, () => { });
            const filePath = `/public/races/${md5(new Date() + $race?.title)}.png`;
            $race.set({ image: filePath }).save().then(() => {
                image.mv(`.${filePath}`);
                res.send({
                    ok: true,
                    msg: "Saqlandi!"
                })
            })
        } catch (error) {
            console.log(error);
            res.send({
                ok: false,
                msg: "Xatolik!"
            })
        }
    },
    editBody: async (req, res) => {
        const { title, old_price, price } = req.body;
        const { id } = req.params;
        if (!title || !old_price || !price) {
            res.send({
                ok: false,
                msg: "Qatorlarni to'ldiring!"
            });
        } else {
            const $race = await raceModel.findById(id);
            $race.set({ title, old_price, price }).save().then(() => {
                res.send({
                    ok: true,
                    msg: "Saqlandi!"
                });
            });
        }
    },
    delete: async (req, res) => {
        const { id } = req.params;
        const $race = await raceModel.findById(id);
        $race.set({ hidden: true }).save().then(() => {
            res.send({
                ok: true,
                msg: "O'chirildi!"
            })
        })
    },
    getAllToUsers: async (req, res) => {
        const $races = await raceModel.find({ hidden: false }).populate('user');
        const mod = [];
        $races.forEach((r) => {
            mod.push({
                id: r?.id,
                _id: r._id,
                title: r?.title,
                image: SERVER_LINK + r?.image,
                price: r.price,
                old_price: r.old_price,
                user: r?.user?.name
            });
        });
        res.send({
            ok: true,
            data: mod
        });
        console.log(mod);
    },
    shopRace: async (req, res) => {
        const { id } = req?.params;
        const race = await raceModel.findById(id);
        if (req?.user?.coins < race?.price) {
            res.send({
                ok: false,
                msg: "Sizda yetarli coin mavjud emas!"
            });
        } else {
            const $user = await userModel.findById(req?.user?.id);
            race.set({ user: $user?._id }).save().then(() => {
                new cointransferModel({
                    from: $user?._id,
                    coin: -race?.price
                }).save().then(() => {
                    res.send({
                        ok: true,
                        msg: "Tabriklaymiz siz " + race?.title + " ni sotib oldingiz!"
                    });
                })
            });
        }
    }
}