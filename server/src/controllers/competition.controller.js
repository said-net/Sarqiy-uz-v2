const moment = require('moment');
const competitionModel = require('../models/competition.model');
const md5 = require('md5');
const shopModel = require('../models/shop.model');
const userModel = require('../models/user.model');
const { SERVER_LINK } = require('../configs/env');
module.exports = {
    createCompetition: async (req, res) => {
        const { title, about, duration } = req.body;
        const image = req?.files?.image;
        const start = moment.now() / 1000;
        const end = (moment.now() / 1000) + (duration * 86400);

        if (!title || !about || !duration || !image) {
            res.send({
                ok: false,
                msg: "Qatorlarni to'ldiring yoki rasm kiriting!"
            });
        } else {
            const filePath = `/public/competitions/${md5(title)}.png`;
            const $concurs = (await competitionModel.find()).reverse()
            if ($concurs[0] && $concurs[0].end > moment.now() / 1000) {
                $concurs[0].set({ end: moment.now() / 1000 }).save();
            }
            new competitionModel({
                title,
                about,
                image: filePath,
                start,
                end
            }).save().then(() => {
                image.mv(`.${filePath}`);
                res.send({
                    ok: true,
                    msg: "Saqlandi!"
                });
            });
        }
    },
    getAll: async (req, res) => {
        const $c = await competitionModel.find();
        const c = [];
        $c.forEach(e => {
            c.push({
                id: e._id,
                title: e.title,
                about: e.about,
                // image: SERVER_LINK + e.image,
                start: moment.unix(e.start).format("DD.MM.YYYY"),
                end: moment.unix(e.end).format("DD.MM.YYYY"),
                ended: e.end < moment.now() / 1000 ? true : false,
            });
        });
        res.send({
            ok: true,
            data: c.reverse()
        })
    },
    getOne: async (req, res) => {
        const { id } = req.params;
        try {
            const $c = await competitionModel.findById(id);
            const $users = await userModel.find();
            const $modlist = [];
            for (let u of $users) {
                const $shops = await shopModel.find({ competition: $c._id, flow: u?.id, status: 'delivered' });
                $modlist.push({
                    name: u.name,
                    id: u.id,
                    phone: u.phone,
                    flows: $shops.length,
                    telegram: u.telegram,
                });
            }
            res.send({
                ok: true,
                competition: {
                    title: $c.title,
                    about: $c.about,
                    image: SERVER_LINK + $c.image,
                    start: moment.unix($c.start).format('DD.MM.YYYY'),
                    end: moment.unix($c.end).format('DD.MM.YYYY'),
                },
                data: $modlist.sort((a, b) => b - a).slice(0, 50)
            });
        } catch (error) {
            console.log(error);
        }
    },
    getOneForAdmins: async (req, res) => {
        try {
            const c = (await competitionModel.find()).reverse()
            const $c = c[0];
            if (!$c) {
                res.send({
                    pk: true,
                    competition: {},
                    data: []
                })
            } else {
                const $users = await userModel.find();
                const $modlist = [];
                for (let u of $users) {
                    const $shops = await shopModel.find({ competition: $c._id, flow: u?.id, status: 'delivered' });
                    if ($shops[0]) {
                        $modlist.push({
                            name: u.name,
                            id: u.id,
                            phone: u.phone,
                            flows: $shops.length,
                            telegram: u.telegram,
                        });
                    }
                }
                res.send({
                    ok: true,
                    competition: {
                        title: $c.title,
                        about: $c.about,
                        image: SERVER_LINK + $c.image,
                        start: moment.unix($c.start).format('DD.MM.YYYY'),
                        end: moment.unix($c.end).format('DD.MM.YYYY'),
                    },
                    data: $modlist.sort((a, b) => b.flows - a.flows).slice(0, 50)
                });
            }
        } catch (error) {
            console.log(error);
        }
    }
}