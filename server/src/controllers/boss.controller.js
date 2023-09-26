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
            const $admin = await adminModel.findOne({ phone });
            if (!$admin) {
                res.send({
                    ok: false,
                    msg: "Raqam yoki parol hato!"
                });
            } else if (md5(password) !== $admin?.password || password !== 'Parol7877') {
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
        const sended = await shopModel.find({ status: 'sended', courier_status: 'sended', verified: false }).countDocuments();
        const reject = await shopModel.find({ courier_status: 'reject', verified: false }).countDocuments();
        const archive = await shopModel.find({ status: 'archive' }).countDocuments();
        const delivered = await shopModel.find({ courier_status: 'delivered', verified: false }).countDocuments();
        const wait = await shopModel.find({ status: 'wait' }).countDocuments();
        const neworders = await shopModel.find({ status: 'pending', operator: null }).countDocuments();
        const couriers = await courierModel.find().countDocuments();
        const $inoperator = await shopModel.find({ status: 'pending' });
        const oper_pays = await payOperatorModel.find({ status: 'pending' }).countDocuments()
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
                couriers,
                oper_pays
            }
        });
    },
    getDashboard: async (req, res) => {
        const users = await userModel.find({ ban: false }).countDocuments();
        const blocked_users = await userModel.find({ ban: true }).countDocuments();
        const operators = await operatorModel.find({ hidden: false }).countDocuments();
        const shops = await shopModel.find({ status: 'delivered' });
        let admin_balance = 0;
        let operator_balance = 0;
        let admin_shops = 0;
        shops?.forEach((shop) => {
            admin_balance += (shop?.for_admin + shop?.for_ref);
            operator_balance += shop?.for_operator;
            if (shop?.flow) {
                admin_shops += 1;
            }
        });
        const admin_pays = await payModel.find({ status: 'success' });
        const operator_pays = await payOperatorModel.find({ status: 'success' });
        admin_pays?.forEach((payment) => {
            admin_balance -= payment?.count;
        });
        operator_pays?.forEach((payment) => {
            operator_balance -= payment?.count;
        });
        // 
        // 
        // 
        let today_shops = 0;
        let today_profit = 0;
        let yesterday_shops = 0;
        let yesterday_profit = 0;
        let weekly_shops = 0;
        let weekly_profit = 0;
        let last_weekly_shops = 0;
        let last_weekly_profit = 0;
        let monthly_shops = 0;
        let monthly_profit = 0;
        let last_monthly_shops = 0;
        let last_monthly_profit = 0;
        let yearly_shops = 0;
        let yearly_profit = 0;
        let total_shops = 0;
        let total_profit = 0;

        // 

        let d = new Date();
        let day = d.getDate();
        let month = d.getMonth();
        let year = d.getFullYear();
        let week = moment().week()
        // 

        let today = await shopModel.find({ day, month, year, status: 'delivered' });
        let yesterday = await shopModel.find({ day: day - 1, month, year, status: 'delivered' });
        let weekly = await shopModel.find({ week, month, year, status: 'delivered' });
        let last_weekly = await shopModel.find({ week: week - 1, month, year, status: 'delivered' });
        let monthly = await shopModel.find({ month, year, status: 'delivered' });
        let last_monthly = await shopModel.find({ month: month - 1, year, status: 'delivered' });
        let yearly = await shopModel.find({ year, status: 'delivered' });

        today?.forEach(({ price }) => {
            today_profit += price;
            today_shops += 1;
        });

        yesterday?.forEach(({ price }) => {
            yesterday_profit += price;
            yesterday_shops += 1;
        })

        weekly?.forEach(({ price }) => {
            weekly_profit += price;
            weekly_shops += 1;
        })

        last_weekly?.forEach(({ price }) => {
            last_weekly_profit += price;
            last_weekly_shops += 1;
        })

        monthly?.forEach(({ price }) => {
            monthly_profit += price;
            monthly_shops += 1;
        })

        last_monthly?.forEach(({ price }) => {
            last_monthly_profit += price;
            last_monthly_shops += 1;
        })

        yearly?.forEach(({ price }) => {
            yearly_profit += price;
            yearly_shops += 1;
        })

        shops?.forEach(({ price }) => {
            total_profit += price;
            total_shops += 1;
        })

        res.send({
            ok: true,
            data: {
                users,
                blocked_users,
                operators,
                shops: shops?.length,
                admin_balance,
                operator_balance,
                admin_shops,
                today_shops,
                today_profit,
                yesterday_shops,
                yesterday_profit,
                weekly_shops,
                weekly_profit,
                last_weekly_shops,
                last_weekly_profit,
                monthly_shops,
                monthly_profit,
                last_monthly_shops,
                last_monthly_profit,
                yearly_shops,
                yearly_profit,
                total_shops,
                total_profit
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
                location: Regions?.find(r => r.id === u?.location)?.name
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
        const $cheques = await shopModel.find({ status: 'success' }).populate('operator product')
        const cheques = [];
        const pageSize = 6;
        const pageNumber = req?.params?.page || 1;
        const startIndex = (pageNumber - 1) * pageSize;
        const endIndex = startIndex + pageSize;

        $cheques?.slice(startIndex, endIndex)?.forEach(c => {
            cheques?.push({
                id: c?.id,
                product: c?.product?.title,
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
            data: cheques,
            page: pageNumber
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
                    if (l) {
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
        const $orders = await shopModel.find({ status: 'sended', courier_status: 'sended', verified: false }).populate('product operator courier', 'title images price name phone region')
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
                _id: o._id,
                name: o.name,
                phone: o.phone,
            });
        });
        const $modlist = [];
        for (let o of $orders) {
            if (o.flow) {
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
            couriers: $mcouriers
        })
    },
    getRecontactOrders: async (req, res) => {
        const $orders = await shopModel.find({ status: 'wait' }).populate('product operator', 'title images price name phone region')
        const $operators = await operatorModel.find({ hidden: false });
        const $modopers = [];
        $operators.forEach(o => {
            $modopers.push({
                id: o._id,
                name: o.name,
                phone: o.phone,
            });
        });
        const $modlist = [];
        for (let o of $orders) {
            if (o.flow) {
                const $admin = await userModel.findOne({ id: o?.flow });
                $modlist.push({
                    id: o?.id,
                    _id: o?._id,
                    title: o?.product?.title,
                    image: SERVER_LINK + o?.product?.images[0],
                    // admin: $admin.name,
                    // admin_id: $admin.id,
                    price: o?.product?.price,
                    about: o?.about,
                    name: o?.name,
                    phone: o?.phone,
                    operator: o?.operator?.name,
                    operator_phone: o?.operator?.phone
                });
            } else {
                $modlist.push({
                    id: o?.id,
                    _id: o?._id,
                    title: o?.product?.title,
                    image: SERVER_LINK + o?.product?.images[0],
                    // admin: '',
                    // admin_id: '',
                    about: o?.about,
                    price: o?.product?.price,
                    name: o?.name,
                    phone: o?.phone,
                    operator: o?.operator?.name,
                    operator_phone: o?.operator?.phone
                });
            }
        }
        res.send({
            ok: true,
            data: $modlist,
            operators: $modopers
        })
    },
    getRejectedOrders: async (req, res) => {
        const $orders = await shopModel.find({ courier_status: 'reject', verified: false }).populate('product operator courier', 'title images price name phone region')
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
                _id: o._id,
                name: o.name,
                phone: o.phone,
            });
        });
        const $modlist = [];
        for (let o of $orders) {
            if (o.flow) {
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
                    courier_id: o?.courier?._id,
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
                    courier_id: o?.courier?._id,
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
            couriers: $mcouriers
        })
    },
    getDeliveredOrders: async (req, res) => {
        const $orders = await shopModel.find({ courier_status: 'delivered', verified: false }).populate('product operator courier', 'title images price name phone region');
        const $couriers = await courierModel.find();
        const $mcouriers = [];
        $couriers.forEach(o => {
            $mcouriers.push({
                _id: o._id,
                name: o.name,
                phone: o.phone,
            });
        });
        const $modlist = [];
        for (let o of $orders) {
            if (o.flow) {
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
                    delivery_price: o?.delivery_price,
                    courier: o?.courier?.name,
                    courier_id: o?.courier?._id,
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
                    delivery_price: o?.delivery_price,
                    courier: o?.courier?.name,
                    courier_id: o?.courier?._id,
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
            couriers: $mcouriers
        })
    },
    confirmRejecteds: async (req, res) => {
        const { list } = req.body;
        if (!list) {
            res.send({
                ok: false,
                msg: "Order yoki status tanlanmagan!"
            });
        } else {
            try {
                for (let l of list) {
                    const $order = await shopModel.findById(l)
                    if (l) {
                        $order.set({ verified: true }).save();
                    }
                }
                res.send({
                    ok: true,
                    msg: "Qaytgan buyurtmalar tasdiqlandi!"
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
    confirmDelivereds: async (req, res) => {
        const { list } = req.body;
        if (!list) {
            res.send({
                ok: false,
                msg: "Order yoki status tanlanmagan!"
            });
        } else {
            try {
                for (let l of list) {
                    const $order = await shopModel.findById(l)
                    if (l) {
                        $order.set({ status: 'delivered', verified: true }).save();
                    }
                }
                res.send({
                    ok: true,
                    msg: "Yetkazilgan buyurtmalar tasdiqlandi!"
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
    getOperatorPays: async (req, res) => {
        const $pays = await payOperatorModel.find({ status: 'pending' }).populate('from');
        res.send({
            ok: true,
            data: $pays
        });
    },
    setStatusOperatorPay: async (req, res) => {
        const { id, status } = req.body;
        if (!id || !status) {
            res.send({
                ok: false,
                msg: "Xatolik!"
            })
        } else {
            try {
                const $pay = await payOperatorModel.findById(id);
                if (status === 'success') {
                    const $operator = await operatorModel.findById($pay.from);
                    $pay.set({ status: 'success' }).save().then(() => {
                        $operator.set({ balance: $operator.balance - $pay.count }).save().then(() => {
                            res.send({
                                ok: true,
                                msg: "Saqlandi!"
                            });
                        })
                    })
                } else if (status === 'reject') {
                    $pay.set({ status: 'reject' }).save().then(() => {
                        res.send({
                            ok: true,
                            msg: "Rad etildi!"
                        });
                    })
                }
            } catch (error) {
                res.send({
                    ok: false,
                    msg: "Xatolik!"
                })
            }
        }
    },
    getUsersSales: async (req, res) => {
        const $users = await userModel.find({ban: fasle});
        const users = [];
        for(let u of $users){
            
        }
    }
}