const settingModel = require("../models/setting.model")
module.exports = {
    default: async () => {
        const $setting = await settingModel.find();
        if (!$setting[0]) {
            new settingModel({
                for_operators: 1000
            }).save();
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
        res.send({
            ok: true,
            data: $setting[0],
        });
    },
}