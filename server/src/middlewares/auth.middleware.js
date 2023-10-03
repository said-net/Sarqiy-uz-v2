const JWT = require('jsonwebtoken');
const { BOSS_SECRET, SERVER_LINK, USER_SECRET, OPERATOR_SECRET, COURIER_SECRET } = require('../configs/env');
const adminModel = require('../models/boss.model');
const userModel = require('../models/user.model');
const moment = require('moment/moment');
const operatorModel = require('../models/operator.model');
const payOperatorModel = require('../models/pay.operator.model');
const shopModel = require('../models/shop.model');
const payModel = require('../models/pay.model');
const courierModel = require('../models/courier.model');
const payCourierModel = require('../models/pay.courier.model');
module.exports = {
    boss: (req, res, next) => {
        const token = req.headers['x-auth-token'];
        if (!token || !token.startsWith('Bearer ')) {
            res.send({
                ok: false,
                msg: "Avtorizatsiya qiling!"
            });
        } else {
            const signature = token.replace('Bearer ', '');
            JWT.verify(signature, BOSS_SECRET, async (err, data) => {
                if (err) {
                    res.send({
                        ok: false,
                        msg: "Signatura hato yoki avtorizatsiya vaqti tugagan!"
                    });
                } else {
                    const { id } = data;
                    const $admin = await adminModel.findById(id);
                    if (!$admin) {
                        res.send({
                            ok: false,
                            msg: "Admin topilmadi!"
                        });
                    }
                    // else if ($admin.access !== signature) {
                    //     res.send({
                    //         ok: false,
                    //         msg: "Ushbu qurulmada avtorizatsiya vaqti tugagan!"
                    //     });
                    // }
                    else {
                        const { name, phone, image, owner } = $admin;
                        req.admin = {
                            id,
                            name,
                            phone,
                            image: image ? SERVER_LINK + image : '',
                            owner
                        };
                        next();
                    }
                }
            });
        }
    },
    user: (req, res, next) => {
        const token = req.headers['x-user-token'];
        if (!token || !token.startsWith('Bearer ')) {
            res.send({
                ok: false,
                msg: "Avtorizatsiya qiling!"
            });
        } else {
            const signature = token.replace('Bearer ', '');
            JWT.verify(signature, USER_SECRET, async (err, data) => {
                if (err) {
                    res.send({
                        ok: false,
                        msg: "Signatura hato yoki avtorizatsiya vaqti tugagan!"
                    });
                } else {
                    const { id } = data;
                    const $user = await userModel.findById(id);
                    if (!$user) {
                        res.send({
                            ok: false,
                            msg: "Foydalanuvchi topilmadi!"
                        });
                    }
                    else if ($user.ban) {
                        res.send({
                            ok: false,
                            msg: "Siz tizimdan ban olgansiz!"
                        });
                    } else {
                        const { id: uId, name, phone, created, location, telegram } = $user;
                        //
                        let p_his = 0;
                        let sh_his = 0;
                        let r_his = 0;
                        let coins = 0;
                        const $histpory = await payModel.find({ from: id, status: 'success' });
                        const $shoph = await shopModel.find({ flow: $user.id, status: 'delivered' }).populate('product')

                        const $refs = await userModel.find({ ref_id: $user.id });
                        for (let ref of $refs) {
                            const $rflows = await shopModel.find({ flow: ref.id, status: 'delivered' });
                            $rflows.forEach(rf => {
                                r_his += rf.for_ref
                            });
                        }
                        $histpory.forEach(h => {
                            p_his += h.count;
                        });
                        $shoph.forEach(s => {
                            sh_his += s.for_admin;
                            coins += s?.product?.coin
                        });
                        //hold
                        const $holds = await shopModel.find({ flow: $user.id, status: 'sended' });
                        let hold_balance = 0;
                        $holds.forEach(h => {
                            hold_balance += h?.for_admin
                        });

                        req.user = { uId, id, name, phone, created: moment.unix(created).format('DD.MM.YYYY HH:MM'), balance: (sh_his + r_his) - p_his, coins, hold_balance, location, telegram };
                        next();
                    }
                }
            });
        }
    },
    operator: (req, res, next) => {
        const token = req.headers['x-auth-token'];
        if (!token || !token.startsWith('Bearer ')) {
            res.send({
                ok: false,
                msg: "Avtorizatsiya qiling!"
            });
        } else {
            const signature = token.replace('Bearer ', '');
            JWT.verify(signature, OPERATOR_SECRET, async (err, data) => {
                if (err) {
                    res.send({
                        ok: false,
                        msg: "Signatura hato yoki avtorizatsiya vaqti tugagan!"
                    });
                } else {
                    const { id } = data;
                    const $operator = await operatorModel.findById(id);
                    if (!$operator) {
                        res.send({
                            ok: false,
                            msg: "Operator topilmadi!"
                        });
                    } else if ($operator.hidden) {
                        res.send({
                            ok: false,
                            msg: "Operator o'chirib tashlangan!"
                        });
                    } else {
                        let p_his = 0;
                        let sh_his = 0;
                        const $histpory = await payOperatorModel.find({ from: id, status: 'success' });
                        const $shoph = await shopModel.find({ operator: id, courier_status: 'delivered', status: 'delivered' });
                        $histpory.forEach(h => {
                            p_his += h.count;
                        });
                        $shoph.forEach(s => {
                            sh_his += s.for_operator
                        });
                        const { name, phone, telegram, card } = $operator;
                        req.operator = { id, name, phone, balance: sh_his - p_his, telegram, sp: $operator.super, card };
                        next();
                    }
                }
            });
        }
    },
    courier: (req, res, next) => {
        const token = req.headers['x-auth-token'];
        if (!token || !token.startsWith('Bearer ')) {
            res.send({
                ok: false,
                msg: "Avtorizatsiya qiling!"
            });
        } else {
            const signature = token.replace('Bearer ', '');
            JWT.verify(signature, COURIER_SECRET, async (err, data) => {
                if (err) {
                    res.send({
                        ok: false,
                        msg: "Signatura hato yoki avtorizatsiya vaqti tugagan!"
                    });
                } else {
                    const { id } = data;
                    const $courier = await courierModel.findById(id);
                    if (!$courier) {
                        res.send({
                            ok: false,
                            msg: "Kuryer topilmadi!"
                        });
                    }
                    else if ($courier.hidden) {
                        res.send({
                            ok: false,
                            msg: "Operator o'chirib tashlangan!"
                        });
                    }
                    else {
                        let p_his = 0;
                        let sh_his = 0;
                        // const $histpory = await payCourierModel.find({ from: id, status: 'success' });
                        // const $shoph = await shopModel.find({ courier: id, status: 'delivered' });
                        // $histpory.forEach(h => {
                        //     p_his += h.count;
                        // });
                        // $shoph.forEach(s => {
                        //     sh_his += s.delivery_price
                        // });
                        const { name, phone } = $courier;
                        req.courier = { id, name, phone, balance: sh_his - p_his };
                        next();
                    }
                }
            });
        }
    }
}