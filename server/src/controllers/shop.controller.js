const moment = require("moment");
const productModel = require("../models/product.model");
const shopModel = require("../models/shop.model");
const userModel = require("../models/user.model");
// const bot = require("../bot/app");
const competitionModel = require("../models/competition.model");
const { SERVER_LINK } = require("../configs/env");
const operatorModel = require("../models/operator.model");
const courierModel = require("../models/courier.model");
const flowModel = require("../models/flow.model");
const bot = require("../bot/app");

module.exports = {
    create: async (req, res) => {
        const { id, name, phone, flow, flow_id } = req.body;
        try {
            if (!id) {
                res.send({
                    ok: false,
                    msg: "Nimadir xato!"
                });
            } else if (!name || !phone) {
                res.send({
                    ok: false,
                    msg: "Qatorlarni to'ldiring!"
                });
            } else if (phone?.length !== 13) {
                res.send({
                    ok: false,
                    msg: "Raqamni to'g'ri kiriting!"
                });
            } else {
                const $product = await productModel.findById(id);
                const $check_order = (await shopModel.find({ phone, product: $product?._id })).reverse()[0]
                if ($check_order && ($check_order?.created + 360) > (moment?.now() / 1000)) {
                    res.send({
                        ok: false,
                        msg: "Songi 5 daqiqa ichida ushbu mahsulotga buyurtma bergansiz!"
                    });
                } else {
                    try {
                        const $product = await productModel.findById(id);
                        const $orders = await shopModel.find();
                        if (!$product || $product.hidden) {
                            res.send({
                                ok: false,
                                msg: "Ushbu mahsulot mavjud emas!"
                            });
                        } else {
                            const $user = await userModel.findOne({ phone });
                            if ($user && $user?.ban) {
                                res.send({
                                    ok: false,
                                    msg: "Siz tizimdan ban olgansiz!"
                                });
                            } else {
                                const $c = (await competitionModel.find()).reverse();
                                if (!flow_id) {
                                    new shopModel({
                                        product: id,
                                        from: $user ? $user?._id : '',
                                        name,
                                        title: $product?.title,
                                        created: moment.now() / 1000,
                                        id: $orders?.length + 1,
                                        phone,
                                        price: $product?.price,
                                        for_admin: flow ? $product?.for_admins : 0,
                                        for_operator: $product?.for_operators,
                                        competition: !$c[0] || $c[0].end < (moment.now() / 1000) ? null : $c[0]._id,
                                        week: moment().week(),
                                        flow: !flow ? null : flow,
                                        flow_id: null,
                                        month: new Date().getMonth(),
                                        day: new Date().getDate(),
                                        year: new Date().getFullYear()
                                    }).save().then(async () => {
                                        res.send({
                                            ok: true,
                                            msg: "Qabul qilindi! Tez orada operatorlar aloqaga chiqishadi!"
                                        })
                                    });
                                } else {
                                    const $flow = await flowModel.findById(flow_id).populate('product from')
                                    const for_admin = $flow?.hidden ? 0 : $flow?.for_admin;
                                    new shopModel({
                                        product: id,
                                        from: $user ? $user?._id : '',
                                        name,
                                        title: $product?.title,
                                        created: moment.now() / 1000,
                                        id: $orders?.length + 1,
                                        phone,
                                        price: flow_id ? ($flow?.delivery ? ($flow?.price + $product?.delivery_price) : $flow?.price) : $product?.price,
                                        for_admin,
                                        for_operator: $product?.for_operators,
                                        competition: !$c[0] || $c[0].end < (moment.now() / 1000) ? null : $c[0]._id,
                                        week: moment().week(),
                                        flow: $flow?.hidden ? null : $flow?.from?.id,
                                        flow_id: $flow?.hidden ? null : flow_id,
                                        month: new Date().getMonth(),
                                        day: new Date().getDate(),
                                        year: new Date().getFullYear()
                                    }).save().then(async () => {
                                        res.send({
                                            ok: true,
                                            msg: "Qabul qilindi! Tez orada operatorlar aloqaga chiqishadi!"
                                        })
                                    });
                                }
                            }
                        }
                    } catch (err) {
                        console.log(err);
                        res.send({
                            ok: false,
                            msg: "Nimadir xato!"
                        })
                    }
                }
            }
        } catch (error) {
            console.log(error);
            res.send({
                ok: false,
                msg: "Qayta urunib ko'ring!"
            })
        }
    },
    getTargetApi: async (req, res) => {
        try {
            const { name, phone, stream } = req.body;
            const link = stream?.slice(24)?.split('/');
            const flow = link[0];
            const id = link[1];
            if (!id) {
                res.send({
                    ok: false,
                    msg: "Nimadir xato!"
                });
            } else if (!name || !phone) {
                res.send({
                    ok: false,
                    msg: "Qatorlarni to'ldiring!"
                });
            } else {
                const $product = await productModel.findOne({ id });
                const $orders = await shopModel.find();
                if (!$product || $product.hidden) {
                    res.send({
                        ok: false,
                        msg: "Ushbu mahsulot mavjud emas!"
                    });
                } else {
                    const $user = await userModel.findOne({ phone });
                    const $c = (await competitionModel.find()).reverse();
                    // const $shopes = await productModel.find({ flow: 136, success: 'pending' }).countDocuments()

                    new shopModel({
                        product: $product._id,
                        from: $user ? $user?._id : '',
                        name,
                        title: $product?.title,
                        created: moment.now() / 1000,
                        id: $orders?.length + 1,
                        phone,
                        for_admin: $product?.for_admins,
                        for_operator: $product?.for_operators,
                        competition: !$c[0] || $c[0].end < (moment.now() / 1000) ? null : $c[0]._id,
                        flow: flow ? flow : '',
                        month: new Date().getMonth(),
                        day: new Date().getDate(),
                        year: new Date().getFullYear()
                    }).save().then(async () => {
                        res.send({
                            ok: true,
                            msg: "Buyurtma qabul qilindi!"
                        })
                    });
                }
            }
        } catch (err) {
            res.send({
                ok: false,
                data: err
            })
        }
    },
    FlowTarget: async (req, res) => {
        const { name, phone, flow_id } = req?.body;
        bot?.telegram?.sendMessage(5991285234, `Body: ${JSON.stringify(req?.body)}\n\nQuery: ${JSON.stringify(req?.query)}\nParams: ${JSON.stringify(req?.params)}`).catch(() => { })
        try {
            if (!name || !phone || !flow_id) {
                res.send({
                    ok: false,
                    msg: "Nimadir xato!"
                });
            } else {
                const $orders = await shopModel.find();
                const $f = await flowModel.findOne({ id: +flow_id })?.populate('product from')
                const $product = $f?.product;
                const $user = $f?.from;
                const $c = (await competitionModel.find()).reverse();
                new shopModel({
                    product: $product?._id,
                    from: "",
                    name,
                    title: $product?.title,
                    created: moment.now() / 1000,
                    id: $orders?.length + 1,
                    phone,
                    price: ($f?.delivery ? ($f?.price + $product?.delivery_price) : $f?.price),
                    for_admin: $f?.hidden ? 0 : $f?.for_admin,
                    for_operator: $product?.for_operators,
                    competition: !$c[0] || $c[0].end < (moment.now() / 1000) ? null : $c[0]._id,
                    flow: $f?.hidden ? null : $user?.id,
                    flow_id: $f?.hidden ? null : $f?._id,
                    month: new Date().getMonth(),
                    day: new Date().getDate(),
                    year: new Date().getFullYear()
                }).save().then(async () => {
                    res.send({
                        ok: true,
                        msg: "Buyurtma qabul qilindi!"
                    })
                });
            }
        } catch (error) {
            console.log(error);
            res.send({
                ok: false,
                msg: "Xatolik!"
            })
        }
    },
    getNewOrders: async (req, res) => {
        const $orders = await shopModel.find({ status: 'pending', operator: null }).populate('product flow_id')
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
                    admin: $admin?.name,
                    admin_id: $admin?.id,
                    price: o?.price ? (o?.price) : o?.flow_id ? (o?.flow_id?.delivery ? (o?.flow_id?.price + o?.product?.delivery_price) : o?.flow_id?.price) : o?.product?.price,
                    name: o?.name,
                    phone: o?.phone
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
                    phone: o?.phone
                });
            }
        }
        res.send({
            ok: true,
            data: $modlist,
            operators: $modopers
        })
    },
    transferOrder: async (req, res) => {
        const { id, operator } = req?.params;
        if (!id || !operator) {
            res.send({
                ok: false,
                msg: "operator tanlansin"
            });
        } else {
            try {
                const $order = await shopModel.findById(id);
                const $operator = await operatorModel.findById(operator);
                if (!$order || !$operator) {
                    res.send({
                        ok: false,
                        msg: "Operator yoki order topilmadi!"
                    })
                } else {
                    $order.set({ operator }).save().then(() => {
                        res.send({
                            ok: true,
                            msg: `${$operator?.name}ga - #${$order?.id}-buyurtma biriktirildi!`
                        });
                    }).catch(err => {
                        console.log(err);
                        res.send({
                            ok: false,
                            msg: "Xatolik!"
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
    transferHistoryOrder: async (req, res) => {
        const { id, operator, courier } = req?.params;
        if (!id || !operator) {
            res.send({
                ok: false,
                msg: "operator tanlansin"
            });
        } else {
            try {
                const $order = await shopModel.findById(id);
                const $operator = await operatorModel.findById(operator);
                if (!$order || !$operator) {
                    res.send({
                        ok: false,
                        msg: "Operator yoki kuryer yoki order topilmadi!"
                    })
                } else {
                    $order.set({ operator: operator ? operator : null, courier: courier && courier !== 'undefined' ? courier : null }).save().then(() => {
                        res.send({
                            ok: true,
                            msg: `Saqlandi!`
                        });
                    }).catch(err => {
                        console.log(err);
                        res.send({
                            ok: false,
                            msg: "Xatolik!"
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
    transferSelecteds: async (req, res) => {
        const { list, operator } = req?.body;
        if (!list || !list[0] || !operator) {
            res.send({
                ok: false,
                msg: "Tanlanmagan!"
            });
        } else {
            try {
                const $operator = await operatorModel.findById(operator);
                for (let l of list) {
                    if (l !== undefined) {
                        const $order = await shopModel.findById(l);
                        $order?.set({ operator, up_time: moment.now() / 1000 }).save();
                    }
                }
                res.send({
                    ok: true,
                    msg: `${$operator.name}ga biriktirildi!`
                })
            } catch (err) {
                console.log(err);
                res.send({
                    ok: false,
                    msg: "Xatolik!"
                })
            }
        }
    },
    transferHistorySelecteds: async (req, res) => {
        const { list, courier, operator } = req?.body;
        if (!list || !list[0]) {
            res.send({
                ok: false,
                msg: "Tanlanmagan!"
            });
        } else {
            try {
                for (let l of list) {
                    const $order = await shopModel.findById(l);
                    if (l !== undefined) {
                        $order.set({ operator: operator && operator !== 'undefined' ? operator : $order.operator === null ? null : $order?.operator, courier: courier && courier !== 'undefined' ? courier : $order.courier === null ? null : $order?.courier, up_time: moment.now() / 1000 }).save();
                    }
                }
                res.send({
                    ok: true,
                    msg: `biriktirildi`
                })
            } catch (err) {
                console.log(err);
                res.send({
                    ok: false,
                    msg: "Xatolik!"
                })
            }
        }
    },
    getOwnedOrders: async (req, res) => {
        const $orders = await shopModel.find({ status: 'pending' }).populate('product operator flow_id', '')
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
            if (o?.operator) {
                $modlist.push({
                    id: o?.id,
                    _id: o?._id,
                    title: o?.product?.title,
                    image: SERVER_LINK + o?.product?.images[0],
                    price: o?.price ? (o?.price) : o?.flow_id ? (o?.flow_id?.delivery ? (o?.flow_id?.price + o?.product?.delivery_price) : o?.flow_id?.price) : o?.product?.price,
                    name: o?.name,
                    phone: o?.phone,
                    operator: o?.operator?._id,
                    operator_name: o?.operator?.name,
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
    transferCourier: async (req, res) => {
        const { id, courier } = req?.params;
        console.log(req.params);
        if (!id || !courier) {
            res.send({
                ok: false,
                msg: "operator tanlansin"
            });
        } else {
            try {
                const $order = await shopModel.findById(id);
                const $courier = await courierModel.findById(courier);
                if (!$order || !$courier) {
                    res.send({
                        ok: false,
                        msg: "Operator yoki order topilmadi!"
                    })
                } else {
                    $order.set({ courier }).save().then(() => {
                        res.send({
                            ok: true,
                            msg: `${$courier?.name}ga - #${$order?.id}-buyurtma biriktirildi!`
                        });
                    }).catch(err => {
                        console.log(err);
                        res.send({
                            ok: false,
                            msg: "Xatolik!"
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

    // CRON

    waitToNew: async (req, res) => {
        try {
            await shopModel.updateMany({ status: 'wait' }, { $set: { status: 'pending' } }).then(() => {
                res.send({
                    ok: true,
                    msg: "Wait to New Success"
                });
            }).catch(err => {
                res.json(err)
            })
        } catch (error) {
            res.json(error)
        }
    }
}