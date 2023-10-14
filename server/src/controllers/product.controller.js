const md5 = require("md5");
const productModel = require("../models/product.model");
const moment = require("moment/moment");
const { SERVER_LINK } = require("../configs/env");
const valuehistoryModel = require("../models/valuehistory.model");
const settingModel = require("../models/setting.model");
const adsModel = require("../models/ads.model");
const fs = require('fs');
const shopModel = require("../models/shop.model");
const bot = require("../bot/app");
// const path = require('path');
const viewModel = require("../models/view.model");
const path = require("path");
// const { Input } = require("telegraf");
module.exports = {
    create: async (req, res) => {
        const { title, for_operators, about, price, original_price, category, value, for_admins, coin } = req.body;
        const video = req?.files?.video;
        const images = !req?.files?.images[0] ? [req?.files?.images] : [...req?.files?.images];
        if (!title || !about || !price || !video || !category || !original_price || !value || !for_admins || !for_operators) {
            res.send({
                ok: false,
                msg: "Qatorlarni to'ldiring!"
            });
        } else if (!images) {
            res.send({
                ok: false,
                msg: "Rasm yuklang min: 1, max: 5"
            });
        } else if (images?.length > 5) {
            res.send({
                ok: false,
                msg: "Rasm max: 5 ta"
            });
        } else {
            const imgs = [];
            const $products = await productModel.find().countDocuments()
            images?.forEach((img, i) => {
                const filePath = `/public/products/${md5(img?.name + new Date() + i)}.png`;
                imgs.push(filePath);
                img.mv(`.${filePath}`);
            });
            const videoPath = `/public/videos/${md5(new Date())}.mp4`;
            video.mv(`.${videoPath}`);
            new productModel({
                title,
                id: $products + 1,
                about,
                price,
                original_price,
                video: videoPath,
                category,
                images: imgs,
                value,
                coin,
                for_admins,
                for_operators,
                created: moment.now() / 1000
            }).save().then(($saved) => {
                new valuehistoryModel({
                    product: $saved._id,
                    value,
                    created: moment.now() / 1000
                }).save().then(() => {
                    res.send({
                        ok: true,
                        msg: "Saqlandi!"
                    });
                });
            });
        }
    },
    addValue: (req, res) => {
        const { value } = req.body;
        const { id } = req.params;
        if (!value || value < 1) {
            res.send({
                ok: false,
                msg: "Miqdor kiriting!"
            });
        } else {
            try {
                new valuehistoryModel({
                    product: id,
                    value,
                    created: moment.now() / 1000
                }).save().then(async () => {
                    const $product = await productModel.findById(id);
                    $product.set({ value: $product.value + value }).save().then(() => {
                        res.send({
                            ok: true,
                            msg: "Miqdor kiritildi!"
                        });
                    });
                }).catch(() => {
                    res.send({
                        ok: false,
                        msg: "Nimadir hato!"
                    })
                })
            } catch (error) {
                res.send({
                    ok: false,
                    msg: "Nimadir hato!"
                })
            }
        }
    },
    //
    edit: async (req, res) => {
        const { id } = req.params;
        try {
            const $product = await productModel.findById(id);
            $product.set(req.body).save().then(() => {
                res.send({
                    ok: true,
                    msg: "Saqlandi!"
                })
            })
        } catch (error) {
            console.log(error);
            res.send({
                ok: false,
                msg: "Nimadir hato!"
            })
        }
    },
    editVideo: async (req, res) => {
        const video = req?.files?.video;
        const { id } = req.params;
        try {
            const $product = await productModel.findById(id);
            fs.unlink(`.${$product?.video}`, () => { });
            const videoPath = `/public/videos/${md5(new Date())}.mp4`;
            video.mv(`.${videoPath}`);
            $product.set({ video: videoPath }).save().then(() => {
                res.send({
                    ok: true,
                    msg: "Video o'zgartirildi!"
                });
            }).catch(err => {
                console.log(err);
                res.send({
                    ok: false,
                    msg: "Nimadir xato!"
                })
            })
        } catch (err) {
            console.log(err);
            res.send({
                ok: false,
                msg: "Nimadir xato!"
            })
        }
    },
    editImage: async (req, res) => {
        const image = req?.files?.image;
        const { id, index } = req.params;
        try {
            const $product = await productModel.findById(id);
            fs.unlink(`.${$product?.images[index]}`, () => { });
            const filePath = `/public/products/${md5(new Date())}.png`;
            let imgs = $product?.images;
            imgs[index] = filePath;
            image.mv(`.${filePath}`);
            $product.set({ images: imgs }).save().then(() => {
                res.send({
                    ok: true,
                    msg: "Rasm o'zgartirildi!"
                });
            }).catch(err => {
                console.log(err);
                res.send({
                    ok: false,
                    msg: "Nimadir xato!"
                })
            })
        } catch (err) {
            console.log(err);
            res.send({
                ok: false,
                msg: "Nimadir xato!"
            })
        }
    },
    newImage: async (req, res) => {
        const image = req?.files?.image;
        const { id } = req.params;
        try {
            const $product = await productModel.findById(id);
            const filePath = `/public/products/${md5(new Date())}.png`;
            let imgs = $product?.images;
            imgs?.push(filePath);
            image.mv(`.${filePath}`);
            $product.set({ images: imgs }).save().then(() => {
                res.send({
                    ok: true,
                    msg: "Rasm Qo'shildi!"
                });
            }).catch(err => {
                console.log(err);
                res.send({
                    ok: false,
                    msg: "Nimadir xato!"
                });
            });
        } catch (err) {
            console.log(err);
            res.send({
                ok: false,
                msg: "Nimadir xato!"
            });
        }
    },
    getAllProductsToAdmin: async (req, res) => {
        const $products = await productModel.find({ hidden: false })
        const $modlist = [];
        for (let p of $products) {
            const $sh = await shopModel.find({ product: p?._id, status: 'delivered' });
            let c = 0;
            $sh?.forEach(co => {
                c += co?.count;
            });
            $modlist.push({
                ...p?._doc,
                id: p?._id,
                solded: c,
                image: SERVER_LINK + p?.images[0],
                created: moment.unix(p?.created).format('YYYY-MM-DD'),
                for_admins: p?.for_admins,
                value: p?.value - c,
                old_price: p?.old_price ? p?.old_price : null,
                sold_price: p?.price,
                bonus: p?.bonus && p?.bonus_duration > moment.now() / 1000,
                bonus_duration: p?.bonus ? moment.unix(p?.bonus_duration).format('DD.MM.YYYY HH:mm') : 0,
                bonus_count: p?.bonus ? p?.bonus_count : 0,
                bonus_given: p?.bonus ? p?.bonus_given : 0,
                category: p?.category
            });
        }
        res.send({
            ok: true,
            data: $modlist
        });
    },
    // 
    getOneToAdmin: async (req, res) => {
        const { id } = req.params;
        try {
            const $p = await productModel.findById(id);
            const product = {
                _id: $p._id,
                id: $p.id,
                title: $p?.title,
                about: $p?.about,
                original_price: $p?.original_price,
                price: $p?.price,
                for_admins: $p?.for_admins,
                for_operators: $p?.for_operators,
                coin: $p?.coin,
                images: [...$p.images.map(e => {
                    return SERVER_LINK + e
                })],
                value: $p.value - $p.solded,
                category: $p?.category
            }
            res.send({
                ok: true,
                data: product
            });
        } catch (error) {
            console.log(error);
            res.send({
                ok: false,
                msg: "Nimadur hato!"
            })
        }
    },
    delete: async (req, res) => {
        const { id } = req.params;
        const $product = await productModel.findById(id);
        $product.set({ hidden: true }).save().then(() => {
            res.send({
                ok: true,
                msg: "O'chirildi!"
            });
        });
    },
    // 
    recovery: async (req, res) => {
        const { id } = req.params;
        const $product = await productModel.findById(id);
        $product.set({ hidden: false }).save().then(() => {
            res.send({
                ok: true,
                msg: "Tiklandi!"
            });
        });
    },
    // 
    setBonus: async (req, res) => {
        const { id } = req.params;
        const { bonus_duration, bonus_about, bonus_count, bonus_given } = req.body;
        if (!bonus_about || !bonus_count || !bonus_duration || !bonus_given) {
            res.send({
                ok: false,
                msg: "Qatorlarni to'ldiring!"
            });
        } else {
            try {
                const $product = await productModel.findById(id);
                $product.set({ bonus: true, bonus_duration: moment.now() / 1000 + (bonus_duration * 86400), bonus_about, bonus_count, bonus_given }).save().then(() => {
                    res.send({
                        ok: true,
                        msg: "Bonus tizimi kiritildi!"
                    })
                })
            } catch (error) {
                console.log(error);
                res.send({
                    ok: false,
                    msg: "Nimadur hato!"
                })
            }
        }
    },
    // 
    removeBonus: async (req, res) => {
        const { id } = req.params;
        try {
            const $product = await productModel.findById(id);
            $product.set({ bonus: false, bonus_duration: 0, bonus_about: '', bonus_count: 0, bonus_given: 0 }).save().then(() => {
                res.send({
                    ok: true,
                    msg: "Bonus tizimi olib tashlandi!"
                })
            })
        } catch (error) {
            console.log(error);
            res.send({
                ok: false,
                msg: "Nimadur hato!"
            })
        }
    },
    setNewPrices: async (req, res) => {
        const { id } = req.params;
        const { price, new_price } = req.body;
        if (!price || !new_price) {
            res.send({
                ok: false,
                msg: "Yangi narxni va eski narxni kiriting!"
            });
        } else {
            const $product = await productModel.findById(id);
            $product.set({ old_price: price, price: new_price }).save().then(() => {
                res.send({
                    ok: true,
                    msg: "Sqalandi!"
                });
            })
        }
    },
    // 
    getOne: async (req, res) => {
        const { id } = req.params;
        const { flow } = req.headers;
        try {
            const $product = await productModel.findOne({ id, hidden: false }).populate('category', 'title background image');
            const product = {
                ...$product._doc,
                id: $product._id,
                images: [...$product.images.map(e => {
                    return SERVER_LINK + e
                })],
                video: SERVER_LINK + $product?.video,
                original_price: 0,
                price: $product?.price,
                value: $product.value - $product.solded,
                old_price: $product?.old_price ? $product?.old_price : 0,
                bonus: $product.bonus && $product.bonus_duration > moment.now() / 1000,
                bonus_duration: $product.bonus ? moment.unix($product.bonus_duration).format('DD.MM.YYYY HH:mm') : 0,
                bonus_count: $product.bonus ? $product.bonus_count : 0,
                bonus_given: $product.bonus ? $product.bonus_given : 0,
            }
            res.send({
                ok: true,
                data: product
            });
            if (flow) {
                const $flow = await viewModel.findOne({ flow, product: $product?._id });
                if (!$flow) {
                    new viewModel({
                        product: $product?._id,
                        flow,
                        views: 1
                    }).save()
                } else {
                    $flow.set({ views: $flow.views + 1 }).save()
                }
            } else {
                const $flow = await viewModel.findOne({ flow: null, product: $product?._id });
                if (!$flow) {
                    new viewModel({
                        product: $product?._id,
                        flow: null,
                        views: 1
                    }).save()
                } else {
                    $flow.set({ views: $flow.views + 1 }).save()
                }
            }
        } catch (error) {
            console.log(error);
            res.send({
                ok: false,
                msg: "Nimadur hato!"
            });
        }
    },
    // 
    getSearch: async (req, res) => {
        const { prefix } = req.params;
        const $products = await productModel.find({ hidden: false }).populate();
        const $modlist = [];
        $products.forEach(p => {
            if (p?.title?.toLowerCase()?.includes(prefix?.toLowerCase()) || p?.about?.toLowerCase()?.includes(prefix?.toLowerCase())) {
                $modlist.push({
                    ...p?._doc,
                    id: p?._id,
                    pid: p?.id,
                    image: SERVER_LINK + p?.images[0],
                    video: SERVER_LINK + p?.video,
                    original_price: 0,
                    price: p?.price,
                    value: p.value - p.solded,
                    old_price: p?.old_price ? p?.old_price : 0,
                    bonus: p?.bonus && p?.bonus_duration > moment.now() / 1000,
                    bonus_duration: p?.bonus ? moment.unix(p?.bonus_duration).format('DD.MM.YYYY HH:mm') : 0,
                    category: {
                        id: p?.category._id,
                        title: p?.category.title,
                        image: SERVER_LINK + p?.category.image
                    }
                });
            }
        });
        res.send({
            ok: true,
            data: $modlist
        });
    },
    getProductsByCategory: async (req, res) => {
        const { id } = req.params;
        if (!id || id.length !== 24) {
            res.send({
                ok: false,
                msg: "LINK O'zgartirildi!"
            })
        } else {
            const $products = await productModel.find({ category: id, hidden: false }).populate('category');
            const $modlist = [];
            $products.forEach(p => {
                $modlist.push({
                    ...p?._doc,
                    id: p?._id,
                    pid: p?.id,
                    image: SERVER_LINK + p?.images[0],
                    video: SERVER_LINK + p?.video,
                    original_price: 0,
                    price: p?.price,
                    value: p.value - p.solded,
                    old_price: p?.old_price ? p?.old_price : null,
                    bonus: p?.bonus && p?.bonus_duration > moment.now() / 1000,
                    bonus_duration: p?.bonus ? moment.unix(p?.bonus_duration).format('DD.MM.YYYY HH:mm') : 0,
                    category: {
                        id: p?.category._id,
                        title: p?.category.title,
                        image: SERVER_LINK + p?.category.image
                    }
                });
            });
            res.send({
                ok: true,
                data: $modlist
            });
        }
    },
    // 
    getVideos: async (req, res) => {
        const $videos = await productModel.find({ hidden: false });
        const $modded = [];
        $videos.forEach(p => {
            $modded.push({
                id: p?.id,
                video: SERVER_LINK + p?.video,
                title: p?.title
            })
        })
        res.send({
            ok: true,
            data: $modded
        })
    },
    //
    setAds: async (req, res) => {
        const { id } = req.params;
        const { about } = req.body;
        const image = req?.files?.image;
        if (!about || !image) {
            res.send({
                ok: false,
                msg: "Qatorlarni to'ldiring yoki rasm tanlang!"
            });
        } else {
            const $ads = await adsModel.findOne({ product: id });
            const filePath = `/public/ads/${md5(image.name + id)}.png`;
            if (!$ads) {
                new adsModel({
                    product: id,
                    about,
                    image: filePath,
                }).save().then(() => {
                    image.mv(`.${filePath}`);
                    res.send({
                        ok: true,
                        msg: "Saqlandi!"
                    });
                });
            } else {
                fs.unlink(`.${$ads.image}`, () => { });
                const filePath = `/public/ads/${md5(image.name + id)}.png`;
                $ads.set({ about, image: filePath }).save().then(() => {
                    res.send({
                        ok: true,
                        msg: "Saqlandi!"
                    })
                });
            }
        }
    },
    // 
    getAllToAdmins: async (req, res) => {
        const { id } = req.params;
        try {
            if (id === 'all') {
                const $products = await productModel.find({ hidden: false }).populate('category');
                const $modlist = [];
                $products.forEach(p => {
                    $modlist.push({
                        ...p?._doc,
                        id: p?._id,
                        pid: p?.id,
                        image: SERVER_LINK + p?.images[0],
                        video: SERVER_LINK + p?.video,
                        original_price: 0,
                        price: p?.price,
                        old_price: p?.old_price ? p?.old_price : null,
                        bonus: p?.bonus && p?.bonus_duration > moment.now() / 1000,
                        bonus_duration: p?.bonus ? moment.unix(p?.bonus_duration).format('DD.MM.YYYY HH:mm') : 0,
                    });
                });
                res.send({
                    ok: true,
                    data: $modlist
                });
            } else {
                const $products = await productModel.find({ category: id, hidden: false }).populate('category');
                const $modlist = [];
                $products.forEach(p => {
                    $modlist.push({
                        ...p?._doc,
                        id: p?._id,
                        pid: p?.id,
                        image: SERVER_LINK + p?.images[0],
                        video: SERVER_LINK + p?.video,
                        original_price: 0,
                        price: p?.price,
                        value: p?.value - p?.solded,
                        old_price: p?.old_price ? p?.old_price : null,
                        bonus: p?.bonus && p?.bonus_duration > moment.now() / 1000,
                        bonus_duration: p?.bonus ? moment.unix(p?.bonus_duration).format('DD.MM.YYYY HH:mm') : 0,
                        category: {
                            id: p?.category._id,
                            title: p?.category.title,
                            image: SERVER_LINK + p?.category.image
                        }
                    });
                });
                res.send({
                    ok: true,
                    data: $modlist
                });
            }
        } catch (error) {
            console.log(error);
            res.send({
                ok: false,
                msg: "Nimadir Xato"
            })
        }
    },
    // 
    getAdsPost: async (req, res) => {
        const { id } = req.params;
        const $ads = await adsModel.find({ product: id }).populate('product');
        if (!$ads[0]) {
            res.send({
                ok: false,
                msg: "Ushbu maxsulot uchun reklama posti mavjud emas!"
            });
        } else {
            $ads?.forEach(a => {
                if (a?.type === 'video') {
                    // console.log(path?.join(__dirname,'../','bot', 'videos', `${a?.media}`));
                    bot.telegram.sendVideo(req?.user?.telegram, { source: path?.join(__dirname, '../', 'bot', 'videos', `${a?.media}`) }, {
                        caption: `${a.about}\n\nhttps://sharqiy.uz/oqim/${req?.user?.uId}/${a?.product?.id}\nhttps://sharqiy.uz/oqim/${req?.user?.uId}/${a?.product?.id}`, parse_mode: 'Markdown', reply_markup: {
                            inline_keyboard: [
                                [{ text: '🛒Sotib olish', url: `https://sharqiy.uz/oqim/${req?.user?.uId}/${a?.product?.id}` }],
                                [{ text: '📋Batafsil', url: `https://sharqiy.uz/oqim/${req?.user?.uId}/${a?.product?.id}` }]
                            ]
                        }
                    }).catch((err) => {
                        console.log(err);
                    })
                } else if (a?.type === 'photo') {
                    bot.telegram.sendPhoto(req?.user?.telegram, { source: path?.join(__dirname, '../', 'bot', 'images', `${a?.media}`) }, {
                        caption: `${a.about}\n\nhttps://sharqiy.uz/oqim/${req?.user?.uId}/${a?.product?.id}\nhttps://sharqiy.uz/oqim/${req?.user?.uId}/${a?.product?.id}`, parse_mode: 'Markdown', reply_markup: {
                            inline_keyboard: [
                                [{ text: '🛒Sotib olish', url: `https://sharqiy.uz/oqim/${req?.user?.uId}/${a?.product?.id}` }],
                                [{ text: '📋Batafsil', url: `https://sharqiy.uz/oqim/${req?.user?.uId}/${a?.product?.id}` }]
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
            // .then(() => {
            //     
            // }).catch(err => {
            //     console.log(err);
            //     res.send({
            //         ok: false,
            //         msg: "Siz telegram botni profilingizga bog'lamagansiz!"
            //     })
            // })
        }
    },
    getProductStatToAdmins: async (req, res) => {
        const $views = await viewModel.find({ flow: req.user.uId }).populate('product')
        const mod = [];
        if (!$views[0]) {
            res.send({
                ok: true,
                data: mod
            });
        } else {
            try {
                for (let v of $views) {
                    const p = v?.product
                    const pending = await shopModel.find({ flow: String(req.user.uId), status: 'pending', product: p?._id }).countDocuments();

                    const success = await shopModel.find({ flow: req.user.uId, status: 'success', product: p?._id }).countDocuments();

                    const sended = await shopModel.find({ flow: req.user.uId, status: 'sended', product: p?._id }).countDocuments();

                    const archived = await shopModel.find({ flow: req.user.uId, status: 'archive', product: p?._id }).countDocuments();

                    const rejected = await shopModel.find({ flow: req.user.uId, status: 'reject', product: p?._id }).countDocuments();

                    const copy = await shopModel.find({ flow: req.user.uId, status: 'copy', product: p?._id }).countDocuments();

                    const delivered = await shopModel.find({ flow: req.user.uId, status: 'delivered', product: p?._id })

                    let profit = 0;

                    delivered?.forEach((d) => {
                        profit += d?.for_admin
                    })
                    mod.push({
                        // ...p?._doc,

                        // id: p?._id,
                        // pid: p?.id,
                        title: p?.title,
                        image: SERVER_LINK + p?.images[0],
                        // original_price: 0,
                        // price: p?.price,
                        // old_price: p?.old_price ? p?.old_price : null,
                        // bonus: p?.bonus && p?.bonus_duration > moment.now() / 1000,
                        // bonus_duration: p?.bonus ? moment.unix(p?.bonus_duration).format('DD.MM.YYYY HH:mm') : 0,
                        // 
                        pending,
                        views: v.views,
                        success,
                        sended,
                        delivered: delivered?.length,
                        archived,
                        rejected,
                        copy,
                        profit
                    });
                }
                res.send({
                    ok: true,
                    data: mod
                });
            } catch (error) {
                res.send({
                    ok: true,
                    data: mod
                })
            }
        }
    }
}