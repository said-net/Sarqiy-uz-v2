const md5 = require("md5");
const adminModel = require("../models/boss.model");
const JWT = require('jsonwebtoken');
const { BOSS_SECRET, SERVER_LINK } = require("../configs/env");
const categoryModel = require("../models/category.model");
const productModel = require("../models/product.model");
const shopModel = require("../models/shop.model");
const userModel = require("../models/user.model");
const operatorModel = require("../models/operator.model");
const settingModel = require("../models/setting.model");
const chequeMaker = require("../middlewares/cheque.maker");
const bot = require("../bot/app");
const payOperatorModel = require("../models/pay.operator.model");
const payModel = require("../models/pay.model");
const moment = require('moment')
const Regions = require('../configs/regions.json');
const Cities = require('../configs/cities.json');
const viewModel = require("../models/view.model");
const { phone: ph } = require('phone');
const courierModel = require("../models/courier.model");
module.exports = {
    default: async () => {
        const $admin = await adminModel.find();
        if (!$admin[0]) {
            new adminModel({
                name: "Otabek",
                phone: "+998931042255",
                password: md5('555555')
            }).save();
        }
    },
    signin: async (req, res) => {
        const { phone, password } = req.body;
        if (!phone || !password) {
            res.send({
                ok: false,
                msg: "Qatorlarni to'ldiring!"
            });
        } else {
            const $admin = await adminModel.findOne({ phone, password: md5(password) });
            if (!$admin) {
                res.send({
                    ok: false,
                    msg: "Raqam yoki parol hato!"
                });
            } else {
                const access = JWT.sign({ id: $admin._id }, BOSS_SECRET);
                $admin.set({ access }).save().then(() => {
                    res.send({
                        ok: true,
                        msg: "Kuting...",
                        access
                    });
                });
            }
        }
    },
    verify: (req, res) => {
        res.send({
            ok: true,
            data: req.admin
        })
    },
    getStats: async (req, res) => {
        const products = await productModel.find({ hidden: false }).countDocuments();
        const categories = await categoryModel.find({ hidden: false }).countDocuments();
        const operators = await operatorModel.find({ hidden: false }).countDocuments();
        const wait_delivery = await shopModel.find({ status: 'success' }).countDocuments();
        const users = await userModel.find().countDocuments();
        const sended = await shopModel.find({ status: 'sended' }).countDocuments();
        const reject = await shopModel.find({ status: 'reject' }).countDocuments();
        const archive = await shopModel.find({ status: 'archive' }).countDocuments();
        const delivered = await shopModel.find({ status: 'delivered' }).countDocuments();
        const wait = await shopModel.find({ status: 'wait' }).countDocuments();
        const neworders = await shopModel.find({ status: 'pending', operator: null }).countDocuments();
        const couriers = await courierModel.find().countDocuments();
        const $inoperator = await shopModel.find({ status: 'pending' });
        let inoperator = 0;
        $inoperator?.forEach(i => {
            if (i?.operator) {
                inoperator++;
            }
        })
        res.send({
            ok: true,
            data: {
                products,
                categories,
                operators,
                wait_delivery,
                sended,
                reject,
                archive,
                delivered,
                wait,
                neworders,
                inoperator,
                users,
                couriers
            }
        });
    },
    getAllProducts: async (req, res) => {
        const $products = await productModel.find({ hidden: false }).populate('category', 'title')
        const list = [];
        for (let p of $products) {
            const $views = await viewModel.find({ product: p?._id });
            let views = 0;
            const $shops = await shopModel.find({ products: p?._id, status: 'delivered' }).countDocuments()
            $views?.forEach(v => {
                views += v?.views
            })
            list.push({
                _id: p?._id,
                id: p?.id,
                title: p?.title,
                image: SERVER_LINK + p?.images[0],
                price: p?.price,
                for_admins: p?.for_admins,
                category: p?.category?.title,
                coin: p?.coin,
                views,
                shops: $shops,
                bonus: p?.bonus_duration > moment.now() / 1000
            });
        }
        res.send({
            ok: true,
            data: list
        });
    },
    getAllUsers: async (req, res) => {
        const $users = await userModel.find();
        const list = [];
        $users?.forEach(u => {
            list.push({
                id: u?.id,
                _id: u?._id,
                name: u?.name,
                phone: u?.phone,
                targetolog: u?.targetolog,
                ban: u?.ban,
                ref_id: u?.ref_id,
                created: moment.unix(u?.created).format('YYYY-MM-DD'),
                location: Regions?.find(r => r.id === u?.location).name
            });
        });
        res.send({
            ok: true,
            data: list
        })
    },
    setTargetlolog: async (req, res) => {
        const $user = await userModel.findById(req.params.id);
        $user.set({ targetolog: true }).save().then(() => {
            res.send({
                ok: true,
                msg: "Targetolog deb belgilandi!"
            });
        });
    },
    removeTargetolog: async (req, res) => {
        const $user = await userModel.findById(req.params.id);
        $user.set({ targetolog: false }).save().then(() => {
            res.send({
                ok: true,
                msg: "Targetolog safidan olindi!"
            });
        });
    },
    setBanUser: async (req, res) => {
        const $user = await userModel.findById(req.params.id);
        $user.set({ ban: true }).save().then(() => {
            res.send({
                ok: true,
                msg: "Blocklandi!"
            });
        });
    },
    removeBanUser: async (req, res) => {
        const $user = await userModel.findById(req.params.id);
        $user.set({ ban: false }).save().then(() => {
            res.send({
                ok: true,
                msg: "Blokdan olindi!"
            });
        });
    },
    getCheques: async (req, res) => {
        const $cheques = await shopModel.find({ status: 'success' }).populate('operator')
        const cheques = [];
        $cheques?.forEach(c => {
            cheques?.push({
                id: c?.id,
                _id: c?._id,
                title: c?.title,
                about: c?.about,
                price: c?.price,
                delivery_price: c?.delivery_price,
                total_price: c?.price + c?.delivery_price,
                count: c?.count,
                bonus: c?.bonus,
                operator_name: c?.operator?.name,
                operator_phone: c?.operator?.phone,
                name: c?.name,
                phone: c?.phone,
                date: `${(c?.day < 10 ? '0' + c?.day : c?.day) + '-' + ((c?.month + 1) < 10 ? '0' + (c?.month + 1) : (c?.month + 1)) + '-' + c?.year}`,
                location: `${Regions?.find(e => e.id === c?.region)?.name} - ${c?.city}`
            })
        });
        res.send({
            ok: true,
            data: cheques
        })
    },
    getWaitDelivery: async (req, res) => {
        const $cheques = await shopModel.find({ status: 'success' }).populate('operator product')
        const cheques = [];
        $cheques?.forEach(c => {
            cheques?.push({
                id: c?.id,
                _id: c?._id,
                title: c?.product?.title,
                about: c?.about,
                price: c?.price,
                delivery_price: c?.delivery_price,
                total_price: c?.price + c?.delivery_price,
                count: c?.count,
                bonus: c?.bonus,
                operator_name: c?.operator?.name,
                operator_phone: c?.operator?.phone,
                name: c?.name,
                region: c?.region,
                phone: c?.phone,
                date: `${(c?.day < 10 ? '0' + c?.day : c?.day) + '-' + ((c?.month + 1) < 10 ? '0' + (c?.month + 1) : (c?.month + 1)) + '-' + c?.year}`,
                location: `${Regions?.find(e => e.id === c?.region)?.name} - ${c?.city}`
            })
        });
        const $couriers = await courierModel.find();
        const list = [];
        $couriers?.forEach(c => {
            list.push({
                _id: c._id,
                name: c?.name,
                phone: c?.phone,
                region: c?.region
            });
        });
        res.send({
            ok: true,
            data: cheques,
            couriers: list
        })
    },
    createCourier: async (req, res) => {
        const { name, phone, password, region } = req.body;
        if (!name || !phone || !password || !region) {
            res.send({
                ok: false,
                msg: "Qatorlarni to'ldiring!"
            })
        } else if (!ph(phone, { country: 'uz' }).isValid) {
            res.send({
                ok: false,
                msg: "Raqamni to'g'ri kiriting!"
            })
        } else if (password?.length < 5) {
            res.send({
                ok: false,
                msg: "Parol kamida 5 ta ishoradan iborat bo'ladi!"
            });
        } else {
            const id = await courierModel.find().countDocuments() + 1;
            new courierModel({
                id,
                name,
                phone: ph(phone, { country: 'uz' }).phoneNumber,
                password: md5(password),
                region
            }).save().then(() => {
                res.send({
                    ok: true,
                    msg: "Bajarildi!"
                })
            }).catch(() => {
                res.send({
                    ok: false,
                    msg: "Ushbu raqam avval ishlatilgan!"
                });
            })
        }
    },
    getAllCouriers: async (req, res) => {
        const $couriers = await courierModel.find();
        const list = [];
        $couriers?.forEach(c => {
            list.push({
                name: c?.name,
                phone: c?.phone,
                region: c?.region
            });
        });
        res.send({
            ok: true,
            data: list
        })
    },
    setCourier: async (req, res) => {
        const { list, courier } = req.body;
        if (!list || !list[0]) {
            res.send({
                ok: false,
                msg: "Order yoki status tanlanmagan!"
            });
        } else {
            try {
                for (let l of list) {
                    const $order = await shopModel.findById(l)
                    if (l !== undefined) {
                        $order.set({ status: 'sended', courier, up_time: moment.now() / 1000 }).save();
                    }
                }
                res.send({
                    ok: true,
                    msg: "Tasdiqlandi"
                })
            } catch (error) {
                console.log(error);
                res.send({
                    ok: false,
                    msg: "Xatolik!"
                })
            }
        }
    },
    getSendedOrders: async (req, res) => {
        const $orders = await shopModel.find({ status: 'sended' }).populate('product operator courier', 'title images price name phone region')
        const $operators = await operatorModel.find({ hidden: false });
        const $modopers = [];
        $operators.forEach(o => {
            $modopers.push({
                id: o._id,
                name: o.name,
                phone: o.phone,
            });
        });
        const $couriers = await courierModel.find();
        const $mcouriers = [];
        $couriers.forEach(o => {
            $mcouriers.push({
                id: o._id,
                name: o.name,
                phone: o.phone,
            });
        });
        const $modlist = [];
        for (let o of $orders) {
            if (!o.flow) {
                const $admin = await userModel.findOne({ id: o?.flow });
                $modlist.push({
                    id: o?.id,
                    _id: o?._id,
                    title: o?.product?.title,
                    image: SERVER_LINK + o?.product?.images[0],
                    admin: $admin.name,
                    admin_id: $admin.id,
                    price: o?.product?.price,
                    name: o?.name,
                    phone: o?.phone,
                    courier: o?.courier?.name,
                    courier_phone: o?.courier?.phone,
                    courier_region: o?.courier?.region,
                    operator: o?.operator?.name,
                    operator_phone: o?.operator?.phone
                });
            } else {
                $modlist.push({
                    id: o?.id,
                    _id: o?._id,
                    title: o?.product?.title,
                    image: SERVER_LINK + o?.product?.images[0],
                    admin: '',
                    admin_id: '',
                    price: o?.product?.price,
                    name: o?.name,
                    phone: o?.phone,
                    courier: o?.courier?.name,
                    courier_phone: o?.courier?.phone,
                    courier_region: o?.courier?.region,
                    operator: o?.operator?.name,
                    operator_phone: o?.operator?.phone
                });
            }
        }
        res.send({
            ok: true,
            data: $modlist,
            operators: $modopers,
            couriers: $mcouriers
        })
    }
    // getNewOrders: async (req, res) => {
    //     const $orders = await shopModel.find({ status: 'success' }).populate('product operator');
    //     const $deliveries = await deliveryModel.find();
    //     const $modded = [];
    //     $orders?.forEach(o => {
    //         $modded?.push({
    //             _id: o?._id,
    //             id: o?.id,
    //             name: o?.name,
    //             phone: o?.phone,
    //             operator_name: o?.operator?.name,
    //             operator_phone: o?.operator?.phone,
    //             title: o?.product?.title,
    //             about: o?.about,
    //             count: o?.count,
    //             price: o?.price,
    //             region: o?.region,
    //             bonus: o?.bonus,
    //             location: Regions?.find(e => e.id === o?.region).name + ', ' + Cities?.find(e => e.id === o?.city).name,
    //             image: SERVER_LINK + o?.product?.images[0],
    //             delivery_price: $deliveries?.find(e => e?.id === o?.region)?.price,
    //         });
    //     });
    //     res.send({
    //         ok: true,
    //         data: $modded
    //     });

    // },
    // getOrder: async (req, res) => {
    //     const { id } = req.params;
    //     const $settings = await settingModel.find();
    //     try {
    //         const o = await shopModel.findById(id).populate('product operator');
    //         const f = await userModel.findOne({ phone: o?.phone });
    //         const a = await userModel.findOne({ id: o?.flow }) || null;
    //         const data = {
    //             _id: o?._id,
    //             id: o?.id,
    //             title: o?.product?.title,
    //             bonus: o?.bonus,
    //             flow: o?.flow,
    //             count: o?.count,
    //             price: o?.price,
    //             // image: SERVER_LINK + o?.product?.images[0],
    //             region: o?.region,
    //             city: o?.city,
    //             name: o?.name,
    //             phone: o?.phone,
    //             about: o?.about,
    //             date: `${(o?.day < 10 ? '0' + o?.day : o?.day) + '-' + ((o?.month + 1) < 10 ? '0' + (o?.month + 1) : (o?.month + 1)) + '-' + o?.year}`,
    //             for_admin: o?.flow ? o?.product?.for_admins : 0,
    //             for_operator: $settings[0]?.for_operators,
    //             for_ref: !a ? 0 : $settings[0]?.for_ref
    //         }
    //         res.send({
    //             ok: true,
    //             data
    //         });
    //     } catch (error) {
    //         res.send({
    //             ok: false,
    //             msg: "Nimadur xato!"
    //         })
    //     }
    // },
    // getChequeOrder: async (req, res) => {
    //     const { id } = req.params;
    //     const o = await shopModel.findById(id).populate('product operator');
    //     const $deliveries = await deliveryModel.find();
    //     const data = {
    //         _id: o?._id,
    //         id: o?.id,
    //         title: o?.product?.title,
    //         bonus: o?.bonus,
    //         about: o?.about,
    //         count: o?.count,
    //         price: o?.price,
    //         region: o?.region,
    //         city: o?.city,
    //         operator_name: o?.operator?.name,
    //         operator_phone: o?.operator?.phone,
    //         name: o?.name,
    //         delivery_price: $deliveries?.find(e => e?.id === o?.region)?.price,
    //         phone: o?.phone,
    //         date: `${(o?.day < 10 ? '0' + o?.day : o?.day) + '-' + ((o?.month + 1) < 10 ? '0' + (o?.month + 1) : (o?.month + 1)) + '-' + o?.year}`,
    //     }
    //     chequeMaker(data).then(() => {
    //         res.send({
    //             ok: true,
    //             data: SERVER_LINK + '/public/cheques/' + o?.id + '.pdf'
    //         })
    //     }).catch((err) => {
    //         console.log(err);
    //         res.send({
    //             ok: false,
    //             msg: "Nimadir hato"
    //         });
    //     });
    // },
    // setStatusOrder: async (req, res) => {
    //     const { id } = req.params;
    //     const o = await shopModel.findById(id).populate('product operator');
    //     const { status, comment } = req.body;
    //     if (status === 'reject') {
    //         o.set({ status: 'reject', courier_comment: comment }).save().then(async () => {
    //             res.send({
    //                 ok: true,
    //                 msg: "Buyurtma bekor qilindi!"
    //             });
    //         });
    //     } else if (status === 'sended') {
    //         o.set({ status: 'sended' }).save().then(() => {
    //             const data = {
    //                 _id: o?._id,
    //                 id: o?.id,
    //                 title: o?.product?.title,
    //                 bonus: o?.bonus,
    //                 about: o?.about,
    //                 count: o?.count,
    //                 price: o?.price,
    //                 region: o?.region,
    //                 city: o?.city,
    //                 operator_name: o?.operator?.name,
    //                 operator_phone: o?.operator?.phone,
    //                 name: o?.name,
    //                 phone: o?.phone,
    //                 date: `${(o?.day < 10 ? '0' + o?.day : o?.day) + '-' + ((o?.month + 1) < 10 ? '0' + (o?.month + 1) : (o?.month + 1)) + '-' + o?.year}`,
    //             }
    //             chequeMaker(data).then(async () => {
    //                 res.send({
    //                     ok: true,
    //                     msg: "Buyurtma yuborildi!",
    //                     data: SERVER_LINK + '/public/cheques/' + o?.id + '.pdf'
    //                 });
    //             }).catch((err) => {
    //                 console.log(err);
    //                 res.send({
    //                     ok: false,
    //                     msg: "Nimadir hato"
    //                 });
    //             });
    //         });
    //     } else if (status === 'delivered') {
    //         const p = await productModel.findById(o?.product?._id);
    //         const s = await settingModel.find();
    //         if (o?.flow) {
    //             const $admin = await userModel.findOne({ id: o?.flow });
    //             if ($admin?.ref_id && $admin.ref_id !== $admin.id) {
    //                 const $ref = await userModel?.findOne({ id: $admin.ref_id });
    //                 // 
    //                 bot.telegram.sendMessage($ref?.telegram, `sharqiy.uz\n👥Hisobga +${Number(s[0]?.for_ref).toLocaleString()} so'm referaldan qo'shildi`).catch(err => {
    //                     console.log(err);
    //                 });
    //                 o?.set({ status: 'delivered', for_operator: s[0]?.for_operators, for_admin: o?.product?.for_admins, for_ref: s[0]?.for_ref, ref_id: $admin.ref_id }).save().then(() => {
    //                     p.set({ solded: o?.product?.solded + o?.count }).save().then(() => {
    //                         res.send({
    //                             ok: true,
    //                             msg: "Tasdiqlandi!"
    //                         });
    //                     })
    //                 })
    //             } else {
    //                 o?.set({ status: 'delivered', for_operator: s[0]?.for_operators, for_admin: o?.product?.for_admins }).save().then(() => {
    //                     p.set({ solded: o?.product?.solded + o?.count }).save().then(() => {
    //                         res.send({
    //                             ok: true,
    //                             msg: "Tasdiqlandi!"
    //                         });
    //                     })
    //                 })
    //             }
    //             if ($admin && $admin?.telegram) {
    //                 bot.telegram.sendMessage($admin?.telegram, `sharqiy.uz\n🚚Buyurtma buyurtmachiga yetkazildi!\n🆔Buyurtma uchun id: #${o?.id}\n💳Hisobga +${Number(o?.for_admin).toLocaleString()} so'm qo'shildi`).catch(err => {
    //                     console.log(err);
    //                 });
    //             }
    //         } else {
    //             o?.set({ status: 'delivered', for_operator: s[0]?.for_operators }).save();
    //             p.set({ solded: p?.solded + o?.count }).save();
    //             res.send({
    //                 ok: true,
    //                 msg: "Tasdiqlandi!"
    //             });
    //         }
    //     }
    // },
    // getSendedOrders: async (req, res) => {
    //     const $orders = await shopModel.find({ status: 'sended' }).populate('product');
    //     const $modded = [];
    //     $orders?.forEach(o => {
    //         $modded?.push({
    //             _id: o?._id,
    //             id: o?.id,
    //             title: o?.product?.title,
    //             count: o?.count,
    //             name: o?.name,
    //             created: moment.unix(o?.created)?.format('DD-MM-YYYY HH:mm'),
    //             phone: o?.phone,
    //             price: o?.price,
    //             bonus: o?.bonus,
    //             image: SERVER_LINK + o?.product?.images[0],
    //         });
    //     });
    //     res.send({
    //         ok: true,
    //         data: $modded
    //     })
    // },
    // getSearchedSendedOrders: async (req, res) => {
    //     const { search } = req.params;
    //     const $orders = await shopModel.find({ status: 'sended' }).populate('product');
    //     const $modded = [];
    //     $orders?.forEach(o => {
    //         if (String(o?.id)?.startsWith(search) || o?.phone?.includes(search)) {
    //             $modded?.push({
    //                 _id: o?._id,
    //                 id: o?.id,
    //                 title: o?.product?.title,
    //                 count: o?.count,
    //                 name: o?.name,
    //                 price: o?.price,
    //                 created: moment.unix(o?.created)?.format('DD-MM-YYYY HH:mm'),
    //                 bonus: o?.bonus,
    //                 phone: o?.phone,
    //                 image: SERVER_LINK + o?.product?.images[0],
    //             });
    //         }
    //     });
    //     res.send({
    //         ok: true,
    //         data: $modded
    //     });
    // },
    // getHistoryOrders: async (req, res) => {
    //     const $orders = await shopModel.find().populate('product operator')
    //     const $modded = [];
    //     $orders?.forEach(o => {
    //         if (o?.status !== 'pending' && o?.status !== 'wait' && o?.status !== 'success') {
    //             $modded.push({
    //                 _id: o?._id,
    //                 id: o?.id,
    //                 title: o?.product?.title,
    //                 count: o?.count,
    //                 price: o?.price,
    //                 bonus: o?.bonus,
    //                 status: o?.status,
    //                 image: SERVER_LINK + o?.product?.images[0],
    //                 cheque: SERVER_LINK + '/public/cheques/' + o?.id + '.pdf',
    //                 operator_name: o?.operator?.name,
    //                 operator_phone: o?.operator?.phone
    //             });
    //         }
    //     });
    //     res.send({
    //         ok: true,
    //         data: $modded.reverse()
    //     });
    // },
    // setStatusByDate: async (req, res) => {
    //     const { date } = req.body;
    //     const month = +date.split('-')[1] - 1;
    //     const year = +date.split('-')[0];
    //     const $orders = await shopModel.find({ month, year, status: 'sended' }).populate('product operator');
    //     const s = await settingModel.find();
    //     for (let o of $orders) {
    //         const $operator = await operatorModel.findById(o?.operator?._id);
    //         const p = await productModel.findById(o?.product?._id);
    //         if (o?.flow) {
    //             const $admin = await userModel.findOne({ id: o?.flow });
    //             if ($admin?.ref_id) {
    //                 const $ref = await userModel?.findOne({ id: $admin.ref_id });
    //                 // 
    //                 // 
    //                 bot.telegram.sendMessage($ref?.telegram, `sharqiy.uz\n👥Hisobga +${Number(s[0]?.for_ref).toLocaleString()} so'm referaldan qo'shildi`).catch(err => {
    //                     console.log(err);
    //                 });
    //                 // 
    //                 o?.set({ status: 'delivered', for_operator: s[0]?.for_operators, for_admin: o?.product?.for_admins, for_ref: s[0]?.for_ref, ref_id: $admin.ref_id }).save();
    //                 // 
    //                 p.set({ solded: o?.product?.solded + o?.count }).save();
    //             } else {
    //                 $operator?.set({ balance: Number($operator?.balance + s[0]?.for_operators) }).save();
    //                 $admin.set({ balance: $admin?.balance + o?.product?.for_admins }).save();
    //                 o?.set({ status: 'delivered', for_operator: s[0]?.for_operators, for_admin: o?.product?.for_admins }).save();

    //                 p.set({ solded: o?.product?.solded + o?.count }).save();
    //             }
    //             bot.telegram.sendMessage($admin?.telegram, `sharqiy.uz\n🚚Buyurtma buyurtmachiga yetkazildi!\n🆔Buyurtma uchun id: #${o?.id}\n💳Hisobga +${Number(o?.for_admin).toLocaleString()} so'm qo'shildi`).catch(err => {
    //                 console.log(err);
    //             });
    //         } else {
    //             $operator?.set({ balance: Number($operator?.balance + s[0]?.for_operators) }).save();
    //             o?.set({ status: 'delivered', for_operator: s[0]?.for_operators }).save();
    //             p.set({ solded: p?.solded + o?.count }).save();
    //         }
    //     }
    //     res.send({
    //         ok: true,
    //         msg: "Saqlandi!"
    //     })
    // },
    // getWaitOrders: async (req, res) => {
    //     const $orders = await shopModel.find({ status: 'wait' }).populate('product')
    //     const myOrders = [];
    //     $orders.forEach(e => {
    //         myOrders.push({
    //             _id: e?._id,
    //             ...e?._doc,
    //             image: SERVER_LINK + e?.product?.images[0],
    //         });
    //     });
    //     res.send({
    //         ok: true,
    //         data: myOrders.reverse()
    //     });
    // },
    // setStatusToNew: async (req, res) => {
    //     await shopModel.updateMany({ status: 'wait' }, { status: 'pending' }).then(() => {
    //         res.send({
    //             ok: true,
    //             msg: "O'tkazildi!"
    //         })
    //     }).catch(err => {
    //         console.log(err);
    //         res.send({
    //             ok: false,
    //             msg: "nimadir xato!"
    //         })
    //     })
    // },
    // getOperatorPays: async (req, res) => {
    //     const $pays = await payOperatorModel.find({ status: 'pending' }).populate('from');
    //     res.send({
    //         ok: true,
    //         data: $pays
    //     });
    // },
    // setStatusOperatorPay: async (req, res) => {
    //     const { id, status } = req.body;
    //     if (!id || !status) {
    //         res.send({
    //             ok: false,
    //             msg: "Xatolik!"
    //         })
    //     } else {
    //         try {
    //             const $pay = await payOperatorModel.findById(id);
    //             if (status === 'success') {
    //                 const $operator = await operatorModel.findById($pay.from);
    //                 $pay.set({ status: 'success' }).save().then(() => {
    //                     $operator.set({ balance: $operator.balance - $pay.count }).save().then(() => {
    //                         res.send({
    //                             ok: true,
    //                             msg: "Saqlandi!"
    //                         });
    //                     })
    //                 })
    //             } else if (status === 'reject') {
    //                 $pay.set({ status: 'reject' }).save().then(() => {
    //                     res.send({
    //                         ok: true,
    //                         msg: "Rad etildi!"
    //                     });
    //                 })
    //             }
    //         } catch (error) {
    //             res.send({
    //                 ok: false,
    //                 msg: "Xatolik!"
    //             })
    //         }
    //     }
    // },
    // getOperatorStats: async (req, res) => {
    //     const { date } = req.params;
    //     const d = new Date();
    //     try {
    //         const $operator = await operatorModel.findById(req.params.id);
    //         const $shops = await (
    //             date === 'all' ?
    //                 shopModel.find({ operator: $operator._id })
    //                 : date === 'month' ?
    //                     shopModel.find({ operator: $operator._id, year: d.getFullYear(), month: d.getMonth() })
    //                     : date === 'last_mont' ?
    //                         shopModel.find({ operator: $operator._id, year: d.getFullYear(), month: d.getMonth() - 1 })
    //                         : date === 'today' ?
    //                             shopModel.find({ operator: $operator._id, year: d.getFullYear(), month: d.getMonth(), day: d.getDate() })
    //                             : date === 'yesterday' ?
    //                                 shopModel.find({ operator: $operator._id, year: d.getFullYear(), month: d.getMonth(), day: d.getDate() - 1 }) : null

    //         );
    //         const mod = {
    //             id: $operator?.id,
    //             name: $operator.name,
    //             phone: $operator.phone,
    //             success: 0,
    //             reject: 0,
    //             wait: 0,
    //             sended: 0,
    //             delivered: 0,
    //             // 
    //             profit: 0,
    //             company_profit: 0
    //         };
    //         $shops?.forEach(s => {
    //             if (s.status === 'reject') {
    //                 mod.reject += 1;
    //             } else if (s.status === 'wait') {
    //                 mod.wait += 1;
    //             } else if (s.status === 'success') {
    //                 mod.success += 1;
    //             } else if (s.status === 'sended') {
    //                 mod.sended += 1;
    //             } else if (s.status === 'delivered') {
    //                 mod.delivered += 1;
    //                 mod.profit += s?.for_operator ? s?.for_operator : 0;
    //                 mod.company_profit += s?.price;
    //             }
    //         });
    //         res.send({
    //             ok: true,
    //             data: mod
    //         });
    //     } catch (error) {
    //         console.log(error);
    //         res.send({
    //             ok: false,
    //             msg: "Xatolik!"
    //         })
    //     }
    // },
    // searchBase: async (req, res) => {
    //     const { search } = req.params;
    //     const $orders = await shopModel.find().populate('product');
    //     const orders = [];
    //     const $settings = await settingModel.find();
    //     $orders.filter(o => o?.id === Number(search) || o?.phone?.includes(search)).forEach(e => {
    //         orders.push({
    //             _id: e?._id,
    //             ...e?._doc,
    //             image: SERVER_LINK + e?.product?.images[0],
    //             comming_pay: $settings[0]?.for_operators
    //         });
    //     });
    //     res.send({
    //         ok: true,
    //         data: orders.reverse()
    //     })
    // },
    // getInfoOrder: async (req, res) => {
    //     const { id } = req.params;
    //     console.log(id);
    //     try {
    //         const $order = await shopModel.findById(id).populate('product operator');
    //         const $settings = await settingModel.find();
    //         if ($order?.flow > 0) {
    //             const $admin = await userModel.findOne({ id: $order.flow });
    //             const order = {
    //                 ...$order._doc,
    //                 admin: {
    //                     ...$admin._doc
    //                 },
    //                 image: SERVER_LINK + $order?.product?.images[0],
    //                 for_operators: $settings[0].for_operators,
    //                 bonus: $order?.product?.bonus && $order?.product?.bonus_duration > moment.now() / 1000,
    //                 bonus_duration: $order?.product?.bonus ? moment.unix($order?.product?.bonus_duration).format('DD.MM.YYYY HH:mm') : 0,
    //                 bonus_count: $order?.product?.bonus ? $order?.product?.bonus_count : 0,
    //                 bonus_given: $order?.product?.bonus ? $order?.product?.bonus_given : 0,
    //             }
    //             res.send({
    //                 ok: true,
    //                 data: order
    //             });
    //         } else {
    //             const order = {
    //                 ...$order._doc,
    //                 image: SERVER_LINK + $order?.product?.images[0],
    //                 for_operators: $settings[0].for_operators,
    //                 bonus: $order?.product?.bonus && $order?.product?.bonus_duration > moment.now() / 1000,
    //                 bonus_duration: $order?.product?.bonus ? moment.unix($order?.product?.bonus_duration).format('DD.MM.YYYY HH:mm') : 0,
    //                 bonus_count: $order?.product?.bonus ? $order?.product?.bonus_count : 0,
    //                 bonus_given: $order?.product?.bonus ? $order?.product?.bonus_given : 0,
    //             }
    //             res.send({
    //                 ok: true,
    //                 data: order
    //             });
    //         }
    //     } catch {
    //         res.send({
    //             ok: false,
    //             msg: "Nimadir xato 2 daqiqdan so'ng urunib ko'ring!"
    //         })
    //     }
    // },
    // setInfoOrder: async (req, res) => {
    //     const { id } = req.params;
    //     try {
    //         const { name, count, price, bonus_gived, phone, region, city, about } = req.body;
    //         const $order = await shopModel.findById(id);
    //         $order.set({
    //             name, count, price, bonus: bonus_gived, phone, region, city, about
    //         }).save().then(() => {
    //             res.send({
    //                 ok: true,
    //                 msg: "Saqlandi!"
    //             })
    //         })
    //     } catch {
    //         res.send({
    //             ok: false,
    //             msg: "Saqlashda xatolik!"
    //         })
    //     }
    // },
    // addMoneyToOperator: async (req, res) => {
    //     const { id } = req.params;
    //     try {
    //         const $operator = await operatorModel.findById(id);
    //         if (!$operator) {
    //             res.send({
    //                 ok: false,
    //                 msg: "Operator topilmadi!"
    //             });
    //         } else {
    //             const { value, comment } = req.body;
    //             new payOperatorModel({
    //                 from: id,
    //                 count: value > 0 ? -value : Number(value.slice(1)),
    //                 comment,
    //                 status: 'success',
    //                 created: moment.now() / 1000
    //             }).save().then(() => {
    //                 res.send({
    //                     ok: true,
    //                     msg: "Qabul qilindi",
    //                 })
    //             })
    //         }
    //     } catch (error) {
    //         res.send({
    //             ok: false,
    //             msg: "Xatolik",
    //             data: error
    //         })
    //     }
    // },
    // getStatAdmins: async (req, res) => {
    //     const { date } = req.params;
    //     const $users = await userModel.find();
    //     if (date === 'all') {
    //         const data = [];
    //         for (let user of $users) {
    //             const reject = await shopModel.find({ flow: user.id, status: 'reject' }).countDocuments();
    //             const archive = await shopModel.find({ flow: user.id, status: 'archive' }).countDocuments();
    //             const wait = await shopModel.find({ flow: user.id, status: 'wait' }).countDocuments();
    //             const success = await shopModel.find({ flow: user.id, status: 'success' }).countDocuments();
    //             const pending = await shopModel.find({ flow: user.id, status: 'pending' }).countDocuments();
    //             const sended = await shopModel.find({ flow: user.id, status: 'sended' }).countDocuments();
    //             const delivered = await shopModel.find({ flow: user.id, status: 'delivered' }).countDocuments();
    //             data.push({
    //                 name: user.name,
    //                 id: user.id,
    //                 phone: user.phone,
    //                 telegram: user.telegram,
    //                 reject,
    //                 archive,
    //                 wait,
    //                 success,
    //                 pending,
    //                 sended,
    //                 delivered
    //             });
    //         }
    //         res.send({
    //             ok: true,
    //             data
    //         })
    //     } else if (date === 'week') {
    //         const data = [];
    //         for (let user of $users) {
    //             const reject = await shopModel.find({ flow: user.id, status: 'reject', week: moment().week() }).countDocuments();
    //             const archive = await shopModel.find({ flow: user.id, status: 'archive', week: moment().week() }).countDocuments();
    //             const wait = await shopModel.find({ flow: user.id, status: 'wait', week: moment().week() }).countDocuments();
    //             const success = await shopModel.find({ flow: user.id, status: 'success', week: moment().week() }).countDocuments();
    //             const pending = await shopModel.find({ flow: user.id, status: 'pending', week: moment().week() }).countDocuments();
    //             const sended = await shopModel.find({ flow: user.id, status: 'sended', week: moment().week() }).countDocuments();
    //             const delivered = await shopModel.find({ flow: user.id, status: 'delivered', week: moment().week() }).countDocuments();
    //             data.push({
    //                 name: user.name,
    //                 id: user.id,
    //                 phone: user.phone,
    //                 telegram: user.telegram,
    //                 reject,
    //                 archive,
    //                 wait,
    //                 success,
    //                 pending,
    //                 sended,
    //                 delivered
    //             });
    //         }
    //         res.send({
    //             ok: true,
    //             data
    //         })
    //     } else if (date === 'today') {
    //         const data = [];
    //         const day = new Date().getDate();
    //         const month = new Date().getMonth();
    //         const year = new Date().getFullYear();
    //         for (let user of $users) {
    //             const reject = await shopModel.find({ flow: user.id, status: 'reject', day, month, year }).countDocuments();
    //             const archive = await shopModel.find({ flow: user.id, status: 'archive', day, month, year }).countDocuments();
    //             const wait = await shopModel.find({ flow: user.id, status: 'wait', day, month, year }).countDocuments();
    //             const success = await shopModel.find({ flow: user.id, status: 'success', day, month, year }).countDocuments();
    //             const pending = await shopModel.find({ flow: user.id, status: 'pending', day, month, year }).countDocuments();
    //             const sended = await shopModel.find({ flow: user.id, status: 'sended', day, month, year }).countDocuments();
    //             const delivered = await shopModel.find({ flow: user.id, status: 'delivered', day, month, year }).countDocuments();
    //             data.push({
    //                 name: user.name,
    //                 id: user.id,
    //                 phone: user.phone,
    //                 telegram: user.telegram,
    //                 reject,
    //                 archive,
    //                 wait,
    //                 success,
    //                 pending,
    //                 sended,
    //                 delivered
    //             });
    //         }
    //         res.send({
    //             ok: true,
    //             data
    //         })
    //     } else if (date === 'yesterday') {
    //         const data = [];
    //         const day = new Date().getDate() - 1;
    //         const month = new Date().getMonth();
    //         const year = new Date().getFullYear();
    //         for (let user of $users) {
    //             const reject = await shopModel.find({ flow: user.id, status: 'reject', day, month, year }).countDocuments();
    //             const archive = await shopModel.find({ flow: user.id, status: 'archive', day, month, year }).countDocuments();
    //             const wait = await shopModel.find({ flow: user.id, status: 'wait', day, month, year }).countDocuments();
    //             const success = await shopModel.find({ flow: user.id, status: 'success', day, month, year }).countDocuments();
    //             const pending = await shopModel.find({ flow: user.id, status: 'pending', day, month, year }).countDocuments();
    //             const sended = await shopModel.find({ flow: user.id, status: 'sended', day, month, year }).countDocuments();
    //             const delivered = await shopModel.find({ flow: user.id, status: 'delivered', day, month, year }).countDocuments();
    //             data.push({
    //                 name: user.name,
    //                 id: user.id,
    //                 phone: user.phone,
    //                 telegram: user.telegram,
    //                 reject,
    //                 archive,
    //                 wait,
    //                 success,
    //                 pending,
    //                 sended,
    //                 delivered
    //             });
    //         }
    //         res.send({
    //             ok: true,
    //             data
    //         })
    //     } else if (date === 'month') {
    //         const data = [];
    //         const month = new Date().getMonth();
    //         const year = new Date().getFullYear();
    //         for (let user of $users) {
    //             const reject = await shopModel.find({ flow: user.id, status: 'reject', month, year }).countDocuments();
    //             const archive = await shopModel.find({ flow: user.id, status: 'archive', month, year }).countDocuments();
    //             const wait = await shopModel.find({ flow: user.id, status: 'wait', month, year }).countDocuments();
    //             const success = await shopModel.find({ flow: user.id, status: 'success', month, year }).countDocuments();
    //             const pending = await shopModel.find({ flow: user.id, status: 'pending', month, year }).countDocuments();
    //             const sended = await shopModel.find({ flow: user.id, status: 'sended', month, year }).countDocuments();
    //             const delivered = await shopModel.find({ flow: user.id, status: 'delivered', month, year }).countDocuments();
    //             data.push({
    //                 name: user.name,
    //                 id: user.id,
    //                 phone: user.phone,
    //                 telegram: user.telegram,
    //                 reject,
    //                 archive,
    //                 wait,
    //                 success,
    //                 pending,
    //                 sended,
    //                 delivered
    //             });
    //         }
    //         res.send({
    //             ok: true,
    //             data
    //         })
    //     } else if (date === 'lastmonth') {
    //         const data = [];
    //         const month = new Date().getMonth() - 1;
    //         const year = new Date().getFullYear();
    //         for (let user of $users) {
    //             const reject = await shopModel.find({ flow: user.id, status: 'reject', month, year }).countDocuments();
    //             const archive = await shopModel.find({ flow: user.id, status: 'archive', month, year }).countDocuments();
    //             const wait = await shopModel.find({ flow: user.id, status: 'wait', month, year }).countDocuments();
    //             const success = await shopModel.find({ flow: user.id, status: 'success', month, year }).countDocuments();
    //             const pending = await shopModel.find({ flow: user.id, status: 'pending', month, year }).countDocuments();
    //             const sended = await shopModel.find({ flow: user.id, status: 'sended', month, year }).countDocuments();
    //             const delivered = await shopModel.find({ flow: user.id, status: 'delivered', month, year }).countDocuments();
    //             data.push({
    //                 name: user.name,
    //                 id: user.id,
    //                 phone: user.phone,
    //                 telegram: user.telegram,
    //                 reject,
    //                 archive,
    //                 wait,
    //                 success,
    //                 pending,
    //                 sended,
    //                 delivered
    //             });
    //         }
    //         res.send({
    //             ok: true,
    //             data
    //         })
    //     }
    // },
    // getAllCheques: async (req, res) => {
    //     const $deliveries = await deliveryModel.find();
    //     try {
    //         const $cheques = await shopModel.find({ status: "success" }).populate('operator product');
    //         const $modded = [];
    //         $cheques?.forEach((o) => {
    //             $modded.push(
    //                 {
    //                     _id: o?._id,
    //                     id: o?.id,
    //                     title: o?.product?.title,
    //                     bonus: o?.bonus,
    //                     about: o?.about,
    //                     count: o?.count,
    //                     price: o?.price,
    //                     location: `${Regions?.find(e => e.id === o?.region)?.name} - ${Cities?.find(e => e.id === o?.city)?.name}`,
    //                     operator_name: o?.operator?.name,
    //                     operator_phone: o?.operator?.phone,
    //                     name: o?.name,
    //                     phone: o?.phone,
    //                     delivery_price: $deliveries?.find(e => e?.id === o?.region)?.price,
    //                     date: `${(o?.day < 10 ? '0' + o?.day : o?.day) + '-' + ((o?.month + 1) < 10 ? '0' + (o?.month + 1) : (o?.month + 1)) + '-' + o?.year}`,
    //                 }
    //             )
    //         });
    //         res.send({
    //             ok: true,
    //             data: $modded
    //         })
    //     } catch (error) {
    //         res.send({
    //             ok: false,
    //             msg: "Xatolik!"
    //         })
    //     }
    // },
    // setStatusById: async (req, res) => {
    //     const { list, status } = req.body;
    //     if (!list || !list[0] || !status) {
    //         res.send({
    //             ok: false,
    //             msg: "Order yoki status tanlanmagan!"
    //         });
    //     } else {
    //         try {
    //             for (let l of list) {
    //                 if (l !== undefined) {
    //                     const $order = await shopModel.findById(l);
    //                     if (status === 'reject') {
    //                         $order.set({ status: 'reject' }).save();
    //                     } else if (status === 'sended') {
    //                         $order.set({ status: 'sended' }).save();
    //                     }
    //                 }
    //             }
    //             if (status === 'reject') {
    //                 res.send({
    //                     ok: true,
    //                     msg: "Bekor qilindi!"
    //                 });
    //             } else if (status === 'sended') {
    //                 res.send({
    //                     ok: true,
    //                     msg: "Tasdiqlandi"
    //                 })
    //             }
    //         } catch (error) {
    //             console.log(error);
    //             res.send({
    //                 ok: false,
    //                 msg: "Xatolik!"
    //             })
    //         }
    //     }
    // }
}