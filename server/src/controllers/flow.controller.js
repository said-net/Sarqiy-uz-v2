const { SERVER_LINK } = require("../configs/env");
const flowModel = require("../models/flow.model");
const productModel = require("../models/product.model");
const moment = require('moment');
const shopModel = require("../models/shop.model");
const adsModel = require("../models/ads.model");
const bot = require("../bot/app");
const path = require('path')
module.exports = {
    create: async (req, res) => {
        const { title, sale, product } = req?.body;
        if (!title) {
            res.send({
                ok: false,
                msg: "Oqim nomini kiriting!"
            });
        } else {
            const $p = await productModel.findById(product);
            const id = await flowModel.find()?.countDocuments() + 1;
            if (sale) {
                if (($p?.for_admins - sale) < 5000) {
                    res.send({
                        ok: false,
                        msg: "Admin uchun qoladigon eng kam miqdor 5 000 so'm bo'lishi lozim!"
                    });
                } else {
                    new flowModel({
                        id,
                        title,
                        product,
                        from: req?.user?.id,
                        price: $p?.price - sale,
                        for_admin: ($p?.for_admins - sale),
                        created: moment.now() / 1000
                    }).save().then(() => {
                        res.send({
                            ok: true,
                            msg: "Oqim yaratildi!"
                        })
                    })
                }
            } else {
                new flowModel({
                    id,
                    title,
                    product,
                    from: req?.user?.id,
                    price: $p?.price,
                    for_admin: $p?.for_admins,
                    created: moment.now() / 1000
                }).save().then(() => {
                    res.send({
                        ok: true,
                        msg: "Oqim yaratildi!"
                    })
                })
            }
        }
    },
    getMyFlows: async (req, res) => {
        try {
            const $flows = await flowModel.find({ hidden: false, from: req?.user?.id }).populate('product')
            const mod = [];
            for (let f of $flows) {
                const o = await shopModel.find({ flow_id: f?._id });
                let profit = 0;
                o?.filter(o => o?.status === 'delivered')?.forEach(o => {
                    profit += o?.for_admin
                })
                mod.unshift({
                    id: f.id,
                    _id: f?._id,
                    title: f.title,
                    product: f?.product?.title,
                    image: SERVER_LINK + f?.product?.images[0],
                    // price: f?.price,
                    // old_price: f?.product?.price,
                    // 
                    views: f?.views || 0,
                    archived_orders: o?.filter(o => o?.status === 'archive')?.length,
                    copy_orders: o?.filter(o => o?.status === 'copy')?.length,
                    rejected_orders: o?.filter(o => o?.status === 'reject')?.length,
                    new_orders: o?.filter(o => o?.status === 'pending')?.length,
                    success_orders: o?.filter(o => o?.status === 'success')?.length,
                    sended_orders: o?.filter(o => o?.status === 'sended')?.length,
                    delivered_orders: o?.filter(o => o?.status === 'delivered')?.length,
                    // 
                    created: moment.unix(f?.created).format('DD.MM.YYYY | HH:mm'),
                    profit
                });
            }
            res.send({
                ok: true,
                data: mod
            });
        } catch (error) {
            console.log(error);
            res.send({
                ok: false,
                msg: "Xatolik"
            })
        }
    },
    getAdsPost: async (req, res) => {
        const { id } = req.params;
        try {
            const $f = await flowModel.findById(id);
            const $ads = await adsModel.find({ product: $f?.product }).populate('product');
            if (!$ads[0]) {
                res.send({
                    ok: false,
                    msg: "Ushbu maxsulot uchun reklama posti mavjud emas!"
                });
            } else {
                $ads?.forEach(a => {
                    if (a?.type === 'video') {
                        bot.telegram.sendVideo(req?.user?.telegram, { source: path?.join(__dirname, '../', 'bot', 'videos', `${a?.media}`) }, {
                            caption: `${a.about}\n\nhttps://sharqiy.uz/link/${$f?.id}\nhttps://sharqiy.uz/link/${$f?.id}`, parse_mode: 'Markdown', reply_markup: {
                                inline_keyboard: [
                                    [{ text: '🛒Sotib olish', url: `https://sharqiy.uz/link/${$f?.id}` }],
                                    [{ text: '📋Batafsil', url: `https://sharqiy.uz/link/${$f?.id}` }]
                                ]
                            }
                        }).catch((err) => {
                            console.log(err);
                        })
                    } else if (a?.type === 'photo') {
                        bot.telegram.sendPhoto(req?.user?.telegram, { source: path?.join(__dirname, '../', 'bot', 'images', `${a?.media}`) }, {
                            caption: `${a.about}\n\nhttps://sharqiy.uz/link/${$f?.id}\nhttps://sharqiy.uz/link/${$f?.id}`, parse_mode: 'Markdown', reply_markup: {
                                inline_keyboard: [
                                    [{ text: '🛒Sotib olish', url: `https://sharqiy.uz/link/${$f?.id}` }],
                                    [{ text: '📋Batafsil', url: `https://sharqiy.uz/link/${$f?.id}` }]
                                ]
                            }
                        }).catch((err) => {
                            console.log(err);
                        })
                    }

                })
                res.send({
                    ok: true,
                    msg: "Telegramga yuborildi!"
                })
            }
        } catch (error) {
            console.log(error);
            res.send({
                ok: false,
                msg: "Xatolik!"
            })
        }
    },
    deleteFlow: async (req, res) => {
        try {
            const $flow = await flowModel.findById(req?.params?.id);
            $flow.set({
                hidden: true,
            }).save().then(() => {
                res.send({
                    ok: true,
                    msg: "O'chirildi!"
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
    getFlow: async (req, res) => {
        const { id } = req?.params;
        try {
            const f = await flowModel.findOne({ id }).populate('from product');
            res.send({
                ok: true,
                data: {
                    id: f?.product?._id,
                    flow_id: f?._id,
                    flow: f?.from?.id,
                    title: f?.product?.title,
                    images: [...f?.product?.images?.map(e => {
                        return SERVER_LINK + e
                    })],
                    video: SERVER_LINK + f?.product?.video,
                    about: f?.product?.about,
                    old_price: f?.product?.price,
                    price: f?.price,
                }
            });
            f.set({ views: f?.views + 1 || 1 }).save();
        } catch (error) {
            console.log(error);
            res.send({
                ok: false,
                msg: "Nimadir xato!"
            });
        }
    },
}