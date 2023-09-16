const md5 = require("md5");
const categoryModel = require("../models/category.model");
const { SERVER_LINK } = require("../configs/env");
const fs = require("fs");
const productModel = require("../models/product.model");
module.exports = {
    create: (req, res) => {
        const { title, background } = req.body;
        const image = req?.files?.image;
        if (!image) {
            res.send({
                ok: false,
                msg: "Rasm tanlang!"
            });
        } else if (!title) {
            res.send({
                ok: false,
                msg: "Nom kiriting!"
            });
        } else {
            const filePath = `/public/categories/${md5(image.name + title)}.png`;
            new categoryModel({
                title,
                image: filePath,
                background
            }).save().then(() => {
                image.mv(`.${filePath}`);
                res.send({
                    ok: true,
                    msg: "Category created!"
                });
            }).catch(() => {
                res.send({
                    ok: false,
                    msg: "Error saving category!"
                });
            });
        }
    },
    // 
    getAll: async (req, res) => {
        const $categories = await categoryModel.find();
        const $modded = [];
        for (let e of $categories) {
            const products = await productModel.find({ category: e._id, hidden: false }).countDocuments()
            $modded.push({
                id: e._id,
                image: SERVER_LINK + e.image,
                title: e.title,
                background: e.background,
                products
            });
        }
        res.send({
            ok: true,
            data: $modded
        });
    },
    getOne: async (req, res) => {
        try {
            const { id } = req.params
            const $c = await categoryModel.findById(id);
            res.send({
                ok: true,
                data: {
                    title: $c?.title,
                    image: SERVER_LINK + $c?.image,
                }
            });
        } catch (error) {
            res.send({
                ok: false,
                msg: "Xatolik!"
            })
        }
    },
    // 
    edit: async (req, res) => {
        const { id, type } = req.params;
        const { title } = req.body;
        const image = req?.files?.image;
        try {
            const $category = await categoryModel.findById(id);
            if (type === 'image') {
                fs.unlink(`.${$category.image}`, () => { });
                const filePath = `/public/categories/${md5(image.name + new Date())}.png`;
                $category.set({ image: filePath }).save().then(() => {
                    image.mv(`.${filePath}`);
                    res.send({
                        ok: true,
                        msg: "Rasm o'zgardi!"
                    })
                })
            } else if (type === 'title') {
                $category.set({ title }).save().then(() => {
                    res.send({
                        ok: true,
                        msg: "Nomi o'zgardi!"
                    })
                })
            }
        } catch (error) {
            console.log(error);
            res.send({
                ok: false,
                msg: "Nimadir hato!"
            })
        }
    },
    // 
    delete: async (req, res) => {
        const { id } = req.params;
        const $category = await categoryModel.findById(id);
        $category.set({ hidden: true }).save().then(() => {
            res.send({
                ok: true,
                msg: "O'chirildi!"
            });
        });
    },
    // 
    recovery: async (req, res) => {
        const { id } = req.params;
        const $category = await categoryModel.findById(id);
        $category.set({ hidden: false }).save().then(() => {
            res.send({
                ok: true,
                msg: "Tiklandi!"
            });
        });
    }
}