const md5 = require("md5");
const courierModel = require("../models/courier.model");
const { COURIER_SECRET } = require("../configs/env");
const shopModel = require("../models/shop.model");
const regions = require('../configs/regions.json');
const moment = require('moment');
const bot = require("../bot/app");
const userModel = require("../models/user.model");
module.exports = {
    signIn: async (req, res) => {
        const { phone, password } = req.body;
        if (!phone || !password) {
            res.send({
                ok: false,
                msg: "Qatorlarni to'ldiring!"
            })
        } else {
            const $courier = await courierModel.findOne({ phone, password: md5(password) });
            if (!$courier) {
                res.send({
                    ok: false,
                    msg: "Kuryer topilmadi!"
                });
            } else {
                const token = require('jsonwebtoken').sign({ id: $courier._id }, COURIER_SECRET);
                $courier.set({ access: token }).save().then(() => {
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
            data: req?.courier
        })
    },
    getStats: async (req, res) => {
        const new_orders = await shopModel.find({ courier: req?.courier?.id, status: 'sended', courier_status: 'sended', verified: false }).countDocuments();
        const re_contacts = await shopModel.find({ courier: req?.courier?.id, status: 'sended', courier_status: 'wait' }).countDocuments();
        const rejecteds = await shopModel.find({ courier: req?.courier?.id, status: 'sended', courier_status: 'reject', verified: false }).countDocuments();
        res.send({
            ok: true,
            data: {
                new_orders,
                re_contacts,
                rejecteds
            }
        })
    },
    getMyOrders: async (req, res) => {
        const $orders = await shopModel.find({ status: 'sended', courier_status: 'sended', courier: req?.courier?.id, verified: false }).populate('product operator');
        const list = [];
        $orders?.forEach(e => {
            list.push({
                _id: e?._id,
                id: e?.id,
                name: e?.name,
                phone: e?.phone,
                operator_name: e?.operator?.name,
                operator_phone: e?.operator?.phone,
                location: regions?.find(r => r?.id === e?.region).name + ' ' + e?.city,
                product: e?.product?.title,
                product_id: e?.product?.id,
                about: e?.about || "Opertor izoh qo'ymagan",
                count: e?.count,
                price: e?.price,
                delivery_price: e?.delivery_price,
                courier_comment: e?.courier_comment || "Yangi pochta",
                created: moment.unix(e?.created).format("DD.MM.YYYY | HH:mm"),
            });
        });
        res.send({
            ok: true,
            data: list
        })
    },
    setStatus: async (req, res) => {
        const _id = req?.params?.id;
        const { status, courier_comment, recontact } = req.body;
        if (status === 'wait') {
            if (!recontact) {
                res.send({
                    ok: false,
                    msg: "Qayta aloqa sanasini kiriting!"
                })
            } else {
                const $order = await shopModel?.findById(_id);
                $order.set({ courier_status: 'wait', recontact: moment.utc(recontact).unix(), up_time: moment.now() / 1000 }).save().then(() => {
                    res.send({
                        ok: true,
                        msg: "Qayta aloqa sanasi belgilandi!"
                    })
                });
            }
        } else if (status === 'reject') {
            if (!courier_comment) {
                res.send({
                    ok: false,
                    msg: "Buyurtma nima uchun bekor qilinganini yozing!"
                });
            } else {
                const $order = await shopModel?.findById(_id);
                $order.set({ courier_status: 'reject', courier_comment, up_time: moment.now() / 1000 }).save().then(() => {
                    res.send({
                        ok: true,
                        msg: "Qayta aloqa sanasi belgilandi!"
                    })
                });
            }
        } else if (status === 'delivered') {
            const $order = await shopModel?.findById(_id);
            $order.set({ courier_status: 'delivered', courier_comment, status: 'delivered', up_time: moment.now() / 1000 }).save().then(async () => {
                res.send({
                    ok: true,
                    msg: "Bajarildi!"
                });
                try {
                    const $admin = await userModel.findOne({ id: $order?.flow });
                    bot.telegram.sendMessage($admin?.telegram, `sharqiy.uz\n🚚Buyurtma buyurtmachiga yetkazildi!\n🆔Buyurtma uchun id: #${$order?.id}\n💳Hisobga +${Number($order?.for_admin).toLocaleString()} so'm qo'shildi`).catch(err => {
                        console.log(err);
                    });
                } catch (error) {
                    console.log(error);
                }
            });
        }
    },
    getRejectedOrders: async (req, res) => {
        const $orders = await shopModel.find({ status: 'sended', courier_status: 'reject', courier: req?.courier?.id, verified: false }).populate('product operator');
        const list = [];
        $orders?.forEach(e => {
            list.push({
                _id: e?._id,
                id: e?.id,
                name: e?.name,
                phone: e?.phone,
                operator_name: e?.operator?.name,
                operator_phone: e?.operator?.phone,
                location: regions?.find(r => r?.id === e?.region).name + ' ' + e?.city,
                product: e?.product?.title,
                product_id: e?.product?.id,
                about: e?.about || "Opertor izoh qo'ymagan",
                count: e?.count,
                price: e?.price,
                delivery_price: e?.delivery_price,
                courier_comment: e?.courier_comment || "Otkaz pochta",
                created: moment.unix(e?.created).format("DD.MM.YYYY | HH:mm"),
                up_time: moment.unix(e?.up_time).format("DD.MM.YYYY | HH:mm")
            });
        });
        res.send({
            ok: true,
            data: list
        })
    },
    getWaitOrders: async (req, res) => {
        const $orders = await shopModel.find({ status: 'sended', courier_status: 'wait', courier: req?.courier?.id, verified: false }).populate('product operator');
        const list = [];
        $orders?.forEach(e => {
            list.push({
                _id: e?._id,
                id: e?.id,
                name: e?.name,
                phone: e?.phone,
                operator_name: e?.operator?.name,
                operator_phone: e?.operator?.phone,
                location: regions?.find(r => r?.id === e?.region).name + ' ' + e?.city,
                product: e?.product?.title,
                product_id: e?.product?.id,
                about: e?.about || "Operator izoh yozmagan",
                count: e?.count,
                price: e?.price,
                delivery_price: e?.delivery_price,
                courier_comment: e?.courier_comment || "Qayta aloqa",
                created: moment.unix(e?.created).format("DD.MM.YYYY | HH:mm"),
                up_time: moment.unix(e?.up_time).format("DD.MM.YYYY | HH:mm"),
                recontact: moment.unix(e?.recontact).format("DD.MM.YYYY")
            });
        });
        res.send({
            ok: true,
            data: list
        })
    },
}