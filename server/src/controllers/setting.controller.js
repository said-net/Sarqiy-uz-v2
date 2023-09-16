const settingModel = require("../models/setting.model")
const Regions = require('../configs/regions.json');
const deliveryModel = require("../models/delivery.model");
module.exports = {
    default: async () => {
        const $setting = await settingModel.find();
        if (!$setting[0]) {
            new settingModel({
                for_operators: 1000
            }).save();
        }
    },
    createDelivery: async () => {
        for (let r of Regions) {
            const $delivery = await deliveryModel.findOne({ id: r.id });
            if (!$delivery) {
                new deliveryModel({
                    id: r.id,
                    name: r.name,
                    price: 25000
                }).save();
            }
        }
    },
    setSettings: async (req, res) => {
        const $setting = await settingModel.find();
        $setting[0].set(req.body).save().then(() => {
            res.send({
                ok: true,
                msg: "O'zgartirildi!"
            });
        })
    },
    getSettings: async (req, res) => {
        const $setting = await settingModel.find();
        const $deliveries = await deliveryModel.find();
        res.send({
            ok: true,
            data: $setting[0],
            delivery: $deliveries
        });
    },
    setDelivery: async (req, res) => {
        const { list } = req.body;
        if (!list || !list[0]) {
            res.send({
                ok: false,
                msg: "Qatorlarni to'ldiring!"
            });
        } else {
            try {
                for (let l of list) {
                    const $delivery = await deliveryModel.findOne({id: l?.id});
                    $delivery.set(l).save();
                }
                res.send({
                    ok: true,
                    msg: "O'zgartirildi!"
                })
            } catch {
                res.send({
                    ok: false,
                    msg: "Xatolik!"
                });
            }
        }
    }
}