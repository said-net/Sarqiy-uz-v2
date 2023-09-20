const md5 = require("md5");
const courierModel = require("../models/courier.model");
const { COURIER_SECRET } = require("../configs/env");

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
    }
}