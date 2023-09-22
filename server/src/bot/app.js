const { Telegraf } = require('telegraf');
const userModel = require('../models/user.model');
const btn = require('./btn');
const shopModel = require('../models/shop.model');
const payModel = require('../models/pay.model');
const { inlineKeyboard } = require('telegraf').Markup;
const moment = require('moment/moment');
const tguserModel = require('../models/tguser.model');
const productModel = require('../models/product.model');
const adsModel = require('../models/ads.model');
const path = require('path')
const md5 = require('md5');
const fs = require('fs');
const { default: axios } = require('axios');
const { BOT_TOKEN } = require('../configs/env');
const channel = "-1001938875129";
// const channel = "-1001964224730";
const bot = new Telegraf(BOT_TOKEN)
bot.start(async msg => {
    const { id } = msg.from;
    const $user = await userModel.findOne({ telegram: id });
    new tguserModel({
        id: id
    }).save().catch(() => { });
    if (!$user) {
        msg.replyWithHTML(`<b>❗Avval botni aktivlashtisrishingiz kerak!</b>\n<code>${id}</code> <a href='https://sharqiy.uz'>Sharqiy.uz</a> sayti orqali aktivlashtiring!`)
    } else {
        const command = msg.startPayload;
        if (!command) {
            msg.replyWithHTML(`<b>📋Bosh sahifa</b>`, { ...btn.menu });
        } else {
            if (command === 'pay') {
                let p_his = 0;
                let sh_his = 0;
                let r_his = 0;
                const $histpory = await payModel.find({ from: $user._id, status: 'success' });
                const $shoph = await shopModel.find({ flow: $user.id });
                const $refs = await userModel.find({ ref_id: $user.id });
                for (let ref of $refs) {
                    const $rflows = await shopModel.find({ flow: ref.id });
                    $rflows.forEach(rf => {
                        r_his += rf.for_ref
                    });
                }
                $histpory.forEach(h => {
                    p_his += h.count;
                });
                $shoph.forEach(s => {
                    sh_his += s.for_admin;
                });
                if ((sh_his + r_his) - p_his < 1000) {
                    msg.replyWithHTML(`❗Pulni chiqarib olish <b>1 000</b> so'mdan boshlanadi!`)
                } else {
                    const $pays = await payModel.findOne({ from: $user._id, status: 'pending' });
                    if ($pays) {
                        msg.replyWithHTML(`❗Sizda tekshiruvdagi <b>${$pays.count}</b> so'm lik to'lov mavjud!\n✉Iltimos tekshiruv tugashini kuting!`);
                    } else {
                        $user.set({ step: 'request_money' }).save();
                        msg.replyWithHTML("💰<b>Necha pul chiqarib olmoqchisiz?</b>", { ...btn.back })
                    }
                }
            } else if (command === 'pay_history') {
                const $pays = await payModel.find({ from: $user._id });
                if (!$pays[0]) {
                    msg.replyWithHTML("❗Siz pul yechmagansiz!")
                } else {
                    let tx = `<b>📋To'lovlar tarixi</b>\n\n`;
                    $pays?.forEach((p, i) => {
                        tx += `${(i + 1)} - ${Number(p.count).toLocaleString()} so'm - ${p?.status === 'pending' ? '🕓' : p?.status === 'reject' ? '❌' : '✅'}\n`
                    });
                    msg.replyWithHTML(tx)
                }
            }
        }
    }
});

bot.on('text', async msg => {
    const { id } = msg.from;
    const tx = msg.message.text;
    // console.log(msg.message);
    try {
        const $user = await userModel.findOne({ telegram: id });
        if (!$user) {
            msg.replyWithHTML(`<b>❗Avval botni aktivlashtisrishingiz kerak!</b>\n<code>${id}</code> <a href='https://sharqiy.uz'>Sharqiy.uz</a> sayti orqali aktivlashtiring!`)
        } else {
            if (tx === '🔙Ortga') {
                $user.set({ step: '', etc: {} }).save();
                msg.replyWithHTML("📋Bosh sahifa", { ...btn.menu });
            } else if (tx === '💳Hisobim') {
                let p_his = 0;
                let sh_his = 0;
                let r_his = 0;
                const $histpory = await payModel.find({ from: $user._id, status: 'success' });
                const $shoph = await shopModel.find({ flow: $user.id });
                const $refs = await userModel.find({ ref_id: $user.id });
                for (let ref of $refs) {
                    const $rflows = await shopModel.find({ flow: ref.id });
                    $rflows.forEach(rf => {
                        r_his += rf.for_ref
                    });
                }
                $histpory.forEach(h => {
                    p_his += h.count;
                });
                $shoph.forEach(s => {
                    sh_his += s.for_admin;
                });
                msg.replyWithHTML(`💳Hisobingiz: <b>${Number((sh_his + r_his) - p_his).toLocaleString()}</b> so'm`, { ...btn.balance })
            } else if (tx === '📈Statistika') {
                const $news = await shopModel.find({ flow: $user?.id, status: 'pending' }).countDocuments();
                const $success = await shopModel.find({ flow: $user?.id, status: 'success' }).countDocuments();
                const $sended = await shopModel.find({ flow: $user?.id, status: 'sended' }).countDocuments();
                const $wait = await shopModel.find({ flow: $user?.id, status: 'wait' }).countDocuments();
                const $delivered = await shopModel.find({ flow: $user?.id, status: 'delivered' }).countDocuments();
                const $reject = await shopModel.find({ flow: $user?.id, status: 'reject' }).countDocuments();
                const $deliver = await shopModel.find({ flow: $user?.id, status: 'delivered' });
                const $archive = await shopModel.find({ flow: $user?.id, status: 'archive' }).countDocuments();
                let $total = 0;
                $deliver?.forEach(d => {
                    $total += d?.for_admin;
                });

                const $refs = await userModel.find({ ref_id: $user.id });
                let $tref = 0;
                for (let ref of $refs) {
                    const $rflows = await shopModel.find({ flow: ref.id });
                    $rflows.forEach(rf => {
                        $tref += rf.for_ref
                    });
                }
                msg.replyWithHTML(`<b>📈Umumiy hisobot</b>\n\n🛒Yangi: <b>${$news}</b> ta\n📦Dostavkaga tayyor: <b>${$success}</b> ta\n🔎Yetkazilmoqda: <b>${$sended}</b> ta\n🔃Qayta aloqa: <b>${$wait}</b> ta\n✅Yetkazilgan: <b>${$delivered}</b> ta\n❌Bekor qilingan: <b>${$reject}</b> ta\n🗃️Arxivlangan: <b>${$archive}</b> ta\n👥Referallar:<b> ${$refs?.length}</b> ta\n💰Referallardan: <b>${Number($tref).toLocaleString()}</b> so'm\n\n💳Umumiy foyda: <b>${($total + $tref).toLocaleString()}</b> so'm`, { ...btn.statistics });
            } else if (tx === '⚙Sozlamalar') {
                msg.replyWithHTML(`🆔TelegramID: <b>${id}</b>`)
            } else if (tx === '📞Bog\'lanish') {
                msg.replyWithHTML("<b>👀Biz bilan aloqaga chiqish uchun pastdagi tugmachaga bosing!</b>", { ...btn.contacts })
            } else if (tx === '📋Post joylash' && (id == 1527583880 || id == 1084614519 || id == 5991285234)) {
                msg.replyWithHTML("📦Mahsulot ID sini yuboring!", { ...btn.back });
                $user.set({ step: 'admin_pid' }).save();
            } else if (tx === "✉Xabar yuborish" && (id == 1527583880 || id == 1084614519 || id == 5991285234)) {
                $user.set({ step: 'send_message_all' }).save();
                msg.replyWithHTML("📋Yuborilishi kerka bo'lgan habar <b>rasmini</b> yoki <b>videosini</b> yuboring!");
            } else if (tx === '/admin' && (id == 1527583880 || id == 1084614519 || id == 5991285234)) {
                msg.replyWithHTML("<b>👀Admin panel</b>", { ...btn.admin })
            } 
            // else if (tx === '/clear_db' && (id == 1527583880 || id == 1084614519 || id == 5991285234)) {
            //     await adsModel.deleteMany({});
            //     await categoryModel.deleteMany({});
            //     await competitionModel.deleteMany({});
            //     await likeModel.deleteMany({});
            //     await mainModel.deleteMany({});
            //     await messageModel.deleteMany({});
            //     await operatorModel.deleteMany({});
            //     await payModel.deleteMany({});
            //     await payOperatorModel.deleteMany({});
            //     await productModel.deleteMany({});
            //     await settingModel.deleteMany({});
            //     await valuehistoryModel.deleteMany({});
            //     await shopModel.deleteMany({});
            //     // tguserModel.deleteMany({});
            //     await viewModel.deleteMany({});
            //     msg.replyWithHTML("<b>Tozalandi!</b>")
            // }
             else {
                if ($user.step === 'request_card') {
                    if (tx.length < 16) {
                        msg.replyWithHTML("<b>❗Karta raqamini to'g'ri kiriting!</b>");
                    } else {
                        let txt = `<b>💳Pul chiqarish uchun yangi so'rov!</b>\n\n👤Sotuvchi: <b>${$user.name}</b>\n🆔Sharqiy.uz: ${$user.id}\n📞Raqami: ${$user.phone}\n💳Karta: <code>${tx}</code>\n💰Miqdor: <code>${Number($user?.etc?.amount).toLocaleString()}</code> so'm\n\n👀To'lov qilgach <b>✅To'landi</b> tugmasini\n❗Bekor qilingan bo'lsa <b>❌Bekor qilindi</b> tugmasini bosing!`
                        bot.telegram.sendMessage(channel, txt, {
                            ...inlineKeyboard([
                                [{ text: "✅To'landi", callback_data: `success_pay_${tx?.replace(' ', '')}_${$user?.etc?.amount}_${$user._id}` }],
                                [{ text: "❌Bekor qilindi", callback_data: `reject_pay_${tx?.replace(' ', '')}_${$user?.etc?.amount}_${$user._id}` }]
                            ]),
                            parse_mode: "HTML"
                        }).then(async () => {
                            let p_his = 0;
                            let sh_his = 0;
                            let r_his = 0;
                            const $histpory = await payModel.find({ from: $user._id, status: 'success' });
                            const $shoph = await shopModel.find({ flow: $user.id });
                            const $refs = await userModel.find({ ref_id: $user.id });
                            for (let ref of $refs) {
                                const $rflows = await shopModel.find({ flow: ref.id });
                                $rflows.forEach(rf => {
                                    r_his += rf.for_ref
                                });
                            }
                            $histpory.forEach(h => {
                                p_his += h.count;
                            });
                            $shoph.forEach(s => {
                                sh_his += s.for_admin;
                            })
                            new payModel({
                                from: $user._id,
                                count: $user?.etc?.amount,
                                created: moment.now() / 1000
                            }).save().then(() => {
                                msg.replyWithHTML("<i>✅So'rovingiz tekshiruvga yuborildi!</i>\n📋Holat haqida o'zimiz sizga habar beramiz!")
                            })
                        }).catch(err => {
                            console.log(err);
                            msg.replyWithHTML("<b>❗Nimadir xato</b>")
                        })
                    }
                } else if ($user.step === "request_money") {
                    if (isNaN(tx)) {
                        msg.replyWithHTML("<i>❗Faqat raqamlarda!</i>");
                    } else {
                        let p_his = 0;
                        let sh_his = 0;
                        let r_his = 0;
                        const $histpory = await payModel.find({ from: $user._id, status: 'success' });
                        const $shoph = await shopModel.find({ flow: $user.id });
                        const $refs = await userModel.find({ ref_id: $user.id });
                        for (let ref of $refs) {
                            const $rflows = await shopModel.find({ flow: ref.id });
                            $rflows.forEach(rf => {
                                r_his += rf.for_ref
                            });
                        }
                        $histpory.forEach(h => {
                            p_his += h.count;
                        });
                        $shoph.forEach(s => {
                            sh_his += s.for_admin;
                        });
                        if (tx > Number((sh_his + r_his) - p_his)) {
                            msg.replyWithHTML(`<i>❗Max: ${Number((sh_his + r_his) - p_his).toLocaleString()} so'm</i>`);
                        } else if (tx < 1000) {
                            msg.replyWithHTML(`<i>❗Min: 1 000 so'm</i>`);
                        } else {
                            $user.set({ step: 'request_card', etc: { amount: tx } }).save();
                            msg.replyWithHTML("💳Karta raqamingizni kiriting\n📋Namuna: <b>9860 1601 4709 0205</b>", { ...btn.back });
                        }
                    }
                } else if ($user.step === 'admin_pid') {
                    const $product = await productModel.findOne({ id: tx });
                    if (!$product) {
                        msg.replyWithHTML("❗Mahsulot topilmadi!")
                    } else {
                        const $ads = await adsModel.find({ product: $product?._id });
                        const key = [];
                        $ads?.forEach((a, i) => {
                            key?.push([{ text: `${i + 1} - post`, callback_data: `get_ads_post_${a?.id}` }])
                        })
                        msg.replyWithPhoto({ source: `.${$product?.images[0]}` }, {
                            caption: `📦Mahsulot: ${$product?.title}\n🗃️Postlar soni: ${$ads?.length} ta`,
                            ...inlineKeyboard([
                                [{ text: "➕Yangi post qo'shish", callback_data: 'add_new_post_to_' + $product?._id }],
                                ...key
                            ])
                        });
                    }
                } else if ($user.step === 'new_post_text') {
                    const $product = await productModel.findOne({ _id: $user?.etc?.id });
                    msg.reply(`${$product?.title} uchun reklama posti biritiktirildi!`, { ...btn.admin });
                    new adsModel({
                        product: $product._id,
                        media: $user?.etc?.media,
                        about: tx,
                        type: $user?.etc?.type
                    }).save().then(() => {
                        $user.set({ step: '', etc: {} }).save();
                    });
                } else if ($user.step === 'send_message_text') {
                    $user.set({ step: 'send_message_button', etc: { ...$user.etc, text: tx } }).save();
                    msg.replyWithHTML("<i>✅Habar texti qabil qilindi!</i>\n➕Knopka textini yuboring!");
                } else if ($user.step === 'send_message_button') {
                    $user.set({ step: 'send_message_url', etc: { ...$user.etc, button: tx } }).save();
                    msg.replyWithHTML("<i>✅Knopka texti qabul qilindi!</i>\n🔗Knopka uchun linkni yuboring!\n📋Namuna: <code>https://saidnet.uz</code>");
                } else if ($user.step === 'send_message_url') {
                    if ($user?.etc?.type === 'photo') {
                        msg.replyWithPhoto({ source: path.join(__dirname, 'images', $user?.etc?.photo) }, {
                            parse_mode: "Markdown",
                            ...inlineKeyboard([
                                [{ text: $user?.etc?.button, url: tx }]
                            ]),
                            caption: $user?.etc?.text
                        }).then(() => {
                            $user.set({ step: 'send_message_check', etc: { ...$user.etc, url: tx } }).save();
                            msg.replyWithHTML("<b>✅Barchasi tog'ri bo'lsa ✉Yuborish tugmasinin bosing!</b>", {
                                ...inlineKeyboard([
                                    [{ text: "✉Yuborish", callback_data: "send_message_confirm" }]
                                ])
                            })
                        }).catch((err) => {
                            console.log(err);
                            msg.replyWithHTML("❗Hatolik! Habar textida * yoki _ qolib ketgan! Qayta urunib ko'ring!");
                        })
                    } else if ($user?.etc?.type === 'video') {
                        msg.replyWithVideo({ source: path.join(__dirname, 'videos', $user?.etc?.video) }, {
                            parse_mode: "Markdown",
                            ...inlineKeyboard([
                                [{ text: $user?.etc?.button, url: tx }]
                            ]),
                            caption: $user?.etc?.text
                        }).then(() => {
                            $user.set({ step: 'send_message_check', etc: { ...$user.etc, url: tx } }).save();
                            msg.replyWithHTML("<b>✅Barchasi tog'ri bo'lsa ✉Yuborish tugmasinin bosing!</b>", {
                                ...inlineKeyboard([
                                    [{ text: "✉Yuborish", callback_data: "send_message_confirm" }]
                                ])
                            })
                        }).catch((err) => {
                            console.log(err);
                            msg.replyWithHTML("❗Hatolik! Habar textida * yoki _ qolib ketgan! Qayta urunib ko'ring!");
                        })
                    }
                } else if ($user.step === 'edit_post_text') {
                    const $ads = await adsModel.findById($user?.etc?.id);
                    $ads.set({ about: tx }).save().then(a => {
                        $user.set({ step: '', etc: {} }).save();
                        if (a.type === 'video') {
                            msg.replyWithVideo({ source: path.join(__dirname, 'videos', a?.media) }, {
                                caption: a?.about,
                                parse_mode: 'Markdown',
                                ...inlineKeyboard([
                                    [{ text: "📷Mediani o'zgartirish", callback_data: 'edit_post_media_' + a?._id }],
                                    [{ text: "📋Textni o'zgartirish", callback_data: 'edit_post_text_' + a?._id }],
                                    [{ text: "🗑️O'chirish", callback_data: 'delete_ads_post_' + a?._id }],
                                ])
                            });
                        } else if (a.type === 'photo') {
                            msg.replyWithPhoto({ source: path.join(__dirname, 'images', a?.media) }, {
                                caption: a?.about,
                                parse_mode: 'Markdown',
                                ...inlineKeyboard([
                                    [{ text: "📷Mediani o'zgartirish", callback_data: 'edit_post_media_' + a?._id }],
                                    [{ text: "📋Textni o'zgartirish", callback_data: 'edit_post_text_' + a?._id }],
                                    [{ text: "🗑️O'chirish", callback_data: 'delete_ads_post_' + a?._id }],
                                ])
                            });
                        }
                    })
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
});

bot.on('callback_query', async msg => {
    const { id } = msg.from;
    const { data } = msg.callbackQuery;
    console.log(data);
    try {
        const $user = await userModel.findOne({ telegram: id });
        if (data === 'stat_today') {
            const day = new Date().getDate();
            const month = new Date().getMonth();
            const year = new Date().getFullYear()
            const $news = await shopModel.find({ flow: $user?.id, status: 'pending', month, day, year }).countDocuments();
            const $success = await shopModel.find({ flow: $user?.id, status: 'success', month, day, year }).countDocuments();
            const $sended = await shopModel.find({ flow: $user?.id, status: 'sended', month, day, year }).countDocuments();
            const $wait = await shopModel.find({ flow: $user?.id, status: 'wait', month, day, year }).countDocuments();
            const $delivered = await shopModel.find({ flow: $user?.id, status: 'delivered', month, day, year }).countDocuments();
            const $reject = await shopModel.find({ flow: $user?.id, status: 'reject', month, day, year }).countDocuments();
            const $archive = await shopModel.find({ flow: $user?.id, status: 'archive', month, day, year }).countDocuments();

            const $deliver = await shopModel.find({ flow: $user?.id, status: 'delivered', month, day, year });
            let $total = 0;

            $deliver?.forEach(d => {
                $total += d?.for_admin;
            })

            msg.replyWithHTML(`<b>📈Bugunlik hisobot</b>\n\n🛒Yangi: <b>${$news}</b> ta\n📦Dostavkaga tayyor: <b>${$success}</b> ta\n🔎Yetkazilmoqda: <b>${$sended}</b> ta\n🔃Qayta aloqa: <b>${$wait}</b> ta\n✅Yetkazilgan: <b>${$delivered}</b> ta\n❌Bekor qilingan: <b>${$reject}</b> ta\n🗃️Arxivlangan: <b>${$archive}</b> ta\n\n💳Umumiy foyda: <b>${$total.toLocaleString()}</b> so'm`, { ...btn.statistics });
        } else if (data === 'stat_yesterday') {
            const day = new Date().getDate() - 1;
            const month = new Date().getMonth();
            const year = new Date().getFullYear()
            console.log(month);
            const $news = await shopModel.find({ flow: $user?.id, status: 'pending', month, day, year }).countDocuments();
            const $success = await shopModel.find({ flow: $user?.id, status: 'success', month, day, year }).countDocuments();
            const $sended = await shopModel.find({ flow: $user?.id, status: 'sended', month, day, year }).countDocuments();
            const $wait = await shopModel.find({ flow: $user?.id, status: 'wait', month, day, year }).countDocuments();
            const $delivered = await shopModel.find({ flow: $user?.id, status: 'delivered', month, day, year }).countDocuments();
            const $reject = await shopModel.find({ flow: $user?.id, status: 'reject', month, day, year }).countDocuments();
            const $archive = await shopModel.find({ flow: $user?.id, status: 'archive', month, day, year }).countDocuments();

            const $deliver = await shopModel.find({ flow: $user?.id, status: 'delivered', month, day, year })
            let $total = 0;

            $deliver?.forEach(d => {
                $total += d?.for_admin;
            })

            msg.replyWithHTML(`<b>📈Kechagi hisobot</b>\n\n🛒Yangi: <b>${$news}</b> ta\n📦Dostavkaga tayyor: <b>${$success}</b> ta\n🔎Yetkazilmoqda: <b>${$sended}</b> ta\n🔃Qayta aloqa: <b>${$wait}</b> ta\n✅Yetkazilgan: <b>${$delivered}</b> ta\n❌Bekor qilingan: <b>${$reject}</b> ta\n🗃️Arxivlangan: <b>${$archive}</b> ta\n\n💳Umumiy foyda: <b>${$total.toLocaleString()}</b> so'm`, { ...btn.statistics });
        } else if (data === 'stat_month') {
            const month = new Date().getMonth();
            const year = new Date().getFullYear()
            console.log(month);
            const $news = await shopModel.find({ flow: $user?.id, status: 'pending', month, year }).countDocuments();
            const $success = await shopModel.find({ flow: $user?.id, status: 'success', month, year }).countDocuments();
            const $sended = await shopModel.find({ flow: $user?.id, status: 'sended', month, year }).countDocuments();
            const $wait = await shopModel.find({ flow: $user?.id, status: 'wait', month, year }).countDocuments();
            const $delivered = await shopModel.find({ flow: $user?.id, status: 'delivered', month, year }).countDocuments();
            const $reject = await shopModel.find({ flow: $user?.id, status: 'reject', month, year }).countDocuments();
            const $archive = await shopModel.find({ flow: $user?.id, status: 'archive', month, year }).countDocuments();
            const $deliver = await shopModel.find({ flow: $user?.id, status: 'delivered', month, year })
            let $total = 0;

            $deliver?.forEach(d => {
                $total += d?.for_admin;
            })

            msg.replyWithHTML(`<b>📈Oylik hisobot</b>\n\n🛒Yangi: <b>${$news}</b> ta\n📦Dostavkaga tayyor: <b>${$success}</b> ta\n🔎Yetkazilmoqda: <b>${$sended}</b> ta\n🔃Qayta aloqa: <b>${$wait}</b> ta\n✅Yetkazilgan: <b>${$delivered}</b> ta\n❌Bekor qilingan: <b>${$reject}</b> ta\n🗃️Arxivlangan: <b>${$archive}</b> ta\n\n💳Umumiy foyda: <b>${$total.toLocaleString()}</b> so'm`, { ...btn.statistics });
        } else if (data === 'stat_all') {
            const $news = await shopModel.find({ flow: $user?.id, status: 'pending' }).countDocuments();
            const $success = await shopModel.find({ flow: $user?.id, status: 'success' }).countDocuments();
            const $sended = await shopModel.find({ flow: $user?.id, status: 'sended' }).countDocuments();
            const $wait = await shopModel.find({ flow: $user?.id, status: 'wait' }).countDocuments();
            const $delivered = await shopModel.find({ flow: $user?.id, status: 'delivered' }).countDocuments();
            const $reject = await shopModel.find({ flow: $user?.id, status: 'reject' }).countDocuments();
            const $refs = await userModel.find({ ref_id: $user.id });
            const $archive = await shopModel.find({ flow: $user?.id, status: 'archive' }).countDocuments();

            const $deliver = await shopModel.find({ flow: $user?.id, status: 'delivered' })
            let $total = 0;

            $deliver?.forEach(d => {
                $total += d?.for_admin;
            });
            let $tref = 0;
            for (let ref of $refs) {
                const $rflows = await shopModel.find({ flow: ref.id });
                $rflows.forEach(rf => {
                    $tref += rf.for_ref
                })
            }

            msg.replyWithHTML(`<b>📈Umumiy hisobot</b>\n\n🛒Yangi: <b>${$news}</b> ta\n📦Dostavkaga tayyor: <b>${$success}</b> ta\n🔎Yetkazilmoqda: <b>${$sended}</b> ta\n🔃Qayta aloqa: <b>${$wait}</b> ta\n✅Yetkazilgan: <b>${$delivered}</b> ta\n❌Bekor qilingan: <b>${$reject}</b> ta\n🗃️Arxivlangan: <b>${$archive}</b> ta\n👥Referallar:<b> ${$refs?.length}</b> ta\n💰Referallardan: <b>${Number($tref).toLocaleString()}</b> so'm\n\n💳Umumiy foyda: <b>${($total + $tref).toLocaleString()}</b> so'm`, { ...btn.statistics });
        }
        // 
        else if (data === 'request_pay') {
            let p_his = 0;
            let sh_his = 0;
            let r_his = 0;
            const $histpory = await payModel.find({ from: $user._id, status: 'success' });
            const $shoph = await shopModel.find({ flow: $user.id });
            const $refs = await shopModel.find({ ref_id: $user.id });
            $histpory.forEach(h => {
                p_his += h.count;
            });
            $shoph.forEach(s => {
                sh_his += s.for_admin;
            });
            $refs.forEach(r => {
                r_his += r.for_ref
            });
            if ((sh_his + r_his) - p_his < 1000) {
                msg.replyWithHTML(`❗Pulni chiqarib olish <b>1 000</b> so'mdan boshlanadi!`)
            } else {
                const $pays = await payModel.findOne({ from: $user._id, status: 'pending' });
                if ($pays) {
                    msg.replyWithHTML(`❗Sizda tekshiruvdagi <b>${$pays.count}</b> so'm lik to'lov mavjud!\n✉Iltimos tekshiruv tugashini kuting!`);
                } else {
                    $user.set({ step: 'request_money' }).save();
                    msg.replyWithHTML("💰<b>Necha pul chiqarib olmoqchisiz?</b>", { ...btn.back })
                }
            }
        } else if (data === 'payment_history') {
            const $pays = await payModel.find({ from: $user._id });
            if (!$pays[0]) {
                msg.replyWithHTML("❗Siz pul yechmagansiz!")
            } else {
                let tx = `<b>📋To'lovlar tarixi</b>\n\n`;
                $pays?.forEach((p, i) => {
                    tx += `${(i + 1)} - ${Number(p.count).toLocaleString()} so'm - ${p?.status === 'pending' ? '🕓' : p?.status === 'reject' ? '❌' : '✅'}\n`
                });
                msg.replyWithHTML(tx)
            }
        } else if (data === 'send_message_confirm') {
            const { type, photo, video, url, text, button } = $user.etc;
            const $users = await tguserModel.find();
            if (type === 'photo') {
                $users?.forEach(u => {
                    bot.telegram.sendPhoto(u.id, { source: path.join(__dirname, 'images', photo) }, {
                        caption: text,
                        parse_mode: "Markdown",
                        ...inlineKeyboard([
                            [{ text: button, url: url }]
                        ])
                    }).catch(() => { })
                });
                msg.replyWithHTML("<b>Barchaga yuborildi!</b>").then(() => {
                    fs.unlink(path.join(__dirname, 'images', photo), () => { });
                    $user.set({ step: '', etc: {} }).save();
                })
            } else if (type === 'video') {
                $users?.forEach(u => {
                    bot.telegram.sendVideo(u.id, { source: path.join(__dirname, 'videos', video) }, {
                        caption: text,
                        parse_mode: "Markdown",
                        ...inlineKeyboard([
                            [{ text: button, url: url }]
                        ])
                    }).catch(() => { })
                });
                msg.replyWithHTML("<b>Barchaga yuborildi!</b>").then(() => {
                    fs.unlink(path.join(__dirname, 'videos', video), () => { });
                    $user.set({ step: '', etc: {} }).save();
                })
            }
        } else if (data?.includes('success_pay_')) {
            try {
                const card = data.split('_')[2]?.replace(' ', '');
                const amount = +data.split('_')[3]
                const uId = data.split('_')[4]
                const $user = await userModel.findById(uId);
                const $pay = await payModel.findOne({ from: uId, status: 'pending' });
                let txt = `<b>💳Pul chiqarish uchun yangi so'rov!</b>\n\n👤Sotuvchi: <b>${$user.name}</b>\n🆔Sharqiy.uz: ${$user.id}\n📞Raqami: ${$user.phone}\n💳Karta: <code>${card}</code>\n💰Miqdor: <code>${Number(amount).toLocaleString()}</code> so'm\n\n✅To'landi!`
                $pay.set({ status: 'success', card }).save();
                msg.editMessageReplyMarkup().catch(() => { });
                msg.editMessageText(txt, { 'parse_mode': 'HTML' }).then().catch(err => {
                    msg.telegram.sendMessage(5991285234, JSON.stringify(err))
                });
                bot.telegram.sendMessage($user.telegram, `✅${amount} so'm ${card} karta raqamiga o'tkazildi!`);
            } catch (err) {
                msg.telegram.sendMessage(5991285234, JSON.stringify(err))
            }
        } else if (data?.includes('reject_pay_')) {
            try {
                const card = data.split('_')[2]
                const amount = +data.split('_')[3]
                const uId = data.split('_')[4]
                const $user = await userModel.findById(uId);
                const $pay = await payModel.findOne({ from: uId, status: 'pending' });
                $pay.set({ status: 'reject', card }).save();
                // $user.set({ balance: $user.balance - amount }).save();
                let txt = `<b>💳Pul chiqarish uchun yangi so'rov!</b>\n\n👤Sotuvchi: <b>${$user.name}</b>\n🆔Sharqiy.uz: ${$user.id}\n📞Raqami: ${$user.phone}\n💳Karta: <code>${card}</code>\n💰Miqdor: <code>${Number(amount).toLocaleString()}</code> so'm\n\n❌Bekor qilindi!`
                msg.editMessageReplyMarkup().catch(() => { });
                msg.editMessageText(txt, { 'parse_mode': 'HTML' }).then(() => {
                    bot.telegram.sendMessage($user.telegram, `❌${amount} so'm ${card} karta raqamiga o'tkazish bekor qilindi!`);
                }).catch(err => {
                    console.log(err);
                })
            } catch (err) {
                console.log(err);
            }

        } else if (data?.includes('add_new_post_to_')) {
            const pid = data?.replace(`add_new_post_to_`, '');
            $user?.set({ step: 'new_post_media', etc: { id: pid } }).save();
            msg.deleteMessage().catch(() => { });
            msg.replyWithHTML("👀Reklama posti uchun rasm yoki videoni yuboring!");
        } else if (data?.includes('get_ads_post_')) {
            const a = await adsModel.findById(data?.replace('get_ads_post_', ''));
            if (a.type === 'video') {
                msg.replyWithVideo({ source: path.join(__dirname, 'videos', a?.media) }, {
                    caption: a?.about,
                    parse_mode: 'Markdown',
                    ...inlineKeyboard([
                        [{ text: "📷Mediani o'zgartirish", callback_data: 'edit_post_media_' + a?._id }],
                        [{ text: "📋Textni o'zgartirish", callback_data: 'edit_post_text_' + a?._id }],
                        [{ text: "🗑️O'chirish", callback_data: 'delete_ads_post_' + a?._id }],
                    ])
                });
            } else if (a.type === 'photo') {
                msg.replyWithPhoto({ source: path.join(__dirname, 'images', a?.media) }, {
                    caption: a?.about,
                    parse_mode: 'Markdown',
                    ...inlineKeyboard([
                        [{ text: "📷Mediani o'zgartirish", callback_data: 'edit_post_media_' + a?._id }],
                        [{ text: "📋Textni o'zgartirish", callback_data: 'edit_post_text_' + a?._id }],
                        [{ text: "🗑️O'chirish", callback_data: 'delete_ads_post_' + a?._id }],
                    ])
                });
            }
        } else if (data?.includes('edit_post_text_')) {
            msg.deleteMessage().catch(() => { });
            const pid = data?.replace('edit_post_text_', '');
            $user.set({ step: 'edit_post_text', etc: { id: pid } }).save();
            msg.replyWithHTML("Yangi reklama textini yuboring!", { ...btn.back });
        } else if (data?.includes('edit_post_media_')) {
            msg.deleteMessage().catch(() => { });
            const pid = data?.replace('edit_post_media_', '');
            $user.set({ step: 'edit_post_media', etc: { id: pid } }).save();
            msg.replyWithHTML("Yangi reklama mediasini yuboring!", { ...btn.back });
        } else if (data?.includes('delete_ads_post_')) {
            const pid = data?.replace('delete_ads_post_', '');
            msg?.deleteMessage().catch(() => { });
            msg.replyWithHTML("❗Reklama posti o'chirilsinmi?", {
                ...inlineKeyboard([
                    [
                        { text: "🔙Ortga", callback_data: 'get_ads_post_' + pid },
                        { text: "🗑️O'chirish", callback_data: 'confirm_delete_post_' + pid },
                    ]
                ])
            })
        } else if (data?.includes('confirm_delete_post_')) {
            const pid = data?.replace('confirm_delete_post_', '');
            const $ads = await adsModel.findById(pid);
            if ($ads?.type === 'photo') {
                msg?.deleteMessage().catch(() => { });
                fs.unlink(path?.join(__dirname, 'images', $ads.media), () => { });
                $ads.deleteOne().then(() => {
                    msg.reply("✅O'chirildi", { ...btn.admin });
                })
            } else if ($ads?.type === 'video') {
                msg?.deleteMessage().catch(() => { });
                fs.unlink(path?.join(__dirname, 'videos', $ads.media), () => { });
                $ads.deleteOne().then(() => {
                    msg.reply("✅O'chirildi", { ...btn.admin });
                })
            }

        }
    } catch (error) {
        console.log(error);
    }
});
bot.on('photo', async (msg) => {
    const { photo } = msg.message;
    const { id } = msg.from;
    const $user = await userModel.findOne({ telegram: id });
    if ($user.step === 'send_message_all') {
        msg.telegram.getFileLink(photo[2]?.file_id).then(url => {
            axios({ url, responseType: 'stream' }).then(response => {
                return new Promise((resolve, reject) => {
                    const filePath = `${md5(moment.now())}.jpg`
                    response.data.pipe(fs.createWriteStream('./src/bot/images/' + filePath))
                        .on('finish', () => {
                            msg.replyWithHTML("✅Rasm saqlandi! Habar matnini yuboring\n*Qalin* - _Qiya_", { ...btn.back });
                            $user.set({ step: 'send_message_text', etc: { photo: filePath, type: 'photo' } }).save();
                        })
                        .on('error', e => {
                            console.log(e);
                            msg.replyWithHTML("<b>❗Xatolik</b>")
                        })
                });
            })
        })
    } else if ($user?.step === 'new_post_media') {
        msg.telegram.getFileLink(photo[2]?.file_id).then(url => {
            axios({ url, responseType: 'stream' }).then(response => {
                return new Promise((resolve, reject) => {
                    const filePath = `${md5(moment.now())}.jpg`
                    response.data.pipe(fs.createWriteStream('./src/bot/images/' + filePath))
                        .on('finish', () => {
                            msg.replyWithHTML("✅Rasm saqlandi! Post matnini yuboring!\n*Qalin* - _Qiya_", { ...btn.back });
                            $user.set({ step: 'new_post_text', etc: { ...$user?.etc, media: filePath, type: 'photo' } }).save();
                        })
                        .on('error', e => {
                            console.log(e);
                            msg.replyWithHTML("<b>❗Xatolik</b>")
                        })
                });
            })
        })
    } else if ($user?.step === 'edit_post_media') {
        const $ads = await adsModel.findById($user?.etc?.id);
        if ($ads.type === 'photo') {
            fs.unlink(path?.join(__dirname, 'images', $ads.media), () => { });
            msg.telegram.getFileLink(photo[2]?.file_id).then(url => {
                axios({ url, responseType: 'stream' }).then(response => {
                    return new Promise((resolve, reject) => {
                        const filePath = `${md5(moment.now())}.jpg`
                        response.data.pipe(fs.createWriteStream('./src/bot/images/' + filePath))
                            .on('finish', () => {
                                $user.set({ step: '', etc: {} }).save();
                                $ads.set({ media: filePath, type: 'photo' }).save().then((a) => {
                                    msg.replyWithPhoto({ source: path.join(__dirname, 'images', a?.media) }, {
                                        caption: a?.about,
                                        parse_mode: 'Markdown',
                                        ...inlineKeyboard([
                                            [{ text: "📷Mediani o'zgartirish", callback_data: 'edit_post_media_' + a?._id }],
                                            [{ text: "📋Textni o'zgartirish", callback_data: 'edit_post_text_' + a?._id }],
                                            [{ text: "🗑️O'chirish", callback_data: 'delete_ads_post_' + a?._id }],
                                        ])
                                    });
                                })
                            })
                            .on('error', e => {
                                console.log(e);
                                msg.replyWithHTML("<b>❗Xatolik</b>")
                            })
                    });
                })
            })
        } else if ($ads.type === 'video') {
            fs.unlink(path?.join(__dirname, 'videos', $ads.media), () => { });
            msg.telegram.getFileLink(photo[2]?.file_id).then(url => {
                axios({ url, responseType: 'stream' }).then(response => {
                    return new Promise((resolve, reject) => {
                        const filePath = `${md5(moment.now())}.jpg`
                        response.data.pipe(fs.createWriteStream('./src/bot/images/' + filePath))
                            .on('finish', () => {
                                $user.set({ step: '', etc: {} }).save();
                                $ads.set({ media: filePath, type: 'photo' }).save().then((a) => {
                                    msg.replyWithPhoto({ source: path.join(__dirname, 'images', a?.media) }, {
                                        caption: a?.about,
                                        parse_mode: 'Markdown',
                                        ...inlineKeyboard([
                                            [{ text: "📷Mediani o'zgartirish", callback_data: 'edit_post_media_' + a?._id }],
                                            [{ text: "📋Textni o'zgartirish", callback_data: 'edit_post_text_' + a?._id }],
                                            [{ text: "🗑️O'chirish", callback_data: 'delete_ads_post_' + a?._id }],
                                        ])
                                    });
                                })
                            })
                            .on('error', e => {
                                console.log(e);
                                msg.replyWithHTML("<b>❗Xatolik</b>")
                            })
                    });
                })
            })
        }
    }
});
bot.on('video', async (msg) => {
    const { video } = msg.message;
    const { id } = msg.from;
    const $user = await userModel.findOne({ telegram: id });
    if ($user.step === 'send_message_all') {
        msg.telegram.getFileLink(video?.file_id).then(url => {
            axios({ url, responseType: 'stream' }).then(response => {
                return new Promise((resolve, reject) => {
                    const filePath = `${md5(moment.now())}.mp4`
                    response.data.pipe(fs.createWriteStream('./src/bot/videos/' + filePath))
                        .on('finish', () => {
                            msg.replyWithHTML("✅Video saqlandi! Habar matnini yuboring\n*Qalin* - _Qiya_", { ...btn.back });
                            $user.set({ step: 'send_message_text', etc: { video: filePath, type: 'video' } }).save();
                        })
                        .on('error', e => {
                            console.log(e);
                            msg.replyWithHTML("<b>❗Xatolik</b>")
                        })
                });
            })
        })
    } else if ($user.step === 'new_post_media') {
        msg.telegram.getFileLink(video?.file_id).then(url => {
            axios({ url, responseType: 'stream' }).then(response => {
                return new Promise((resolve, reject) => {
                    const filePath = `${md5(moment.now())}.mp4`
                    response.data.pipe(fs.createWriteStream('./src/bot/videos/' + filePath))
                        .on('finish', () => {
                            msg.replyWithHTML("✅Video saqlandi! Post matnini yuboring\n*Qalin* - _Qiya_", { ...btn.back });
                            $user.set({ step: 'new_post_text', etc: { ...$user?.etc, media: filePath, type: 'video' } }).save();
                        })
                        .on('error', e => {
                            console.log(e);
                            msg.replyWithHTML("<b>❗Xatolik</b>")
                        })
                });
            })
        })
    } else if ($user?.step === 'edit_post_media') {
        const $ads = await adsModel.findById($user?.etc?.id);
        if ($ads.type === 'photo') {
            fs.unlink(path?.join(__dirname, 'images', $ads.media), () => { });
            msg.telegram.getFileLink(video?.file_id).then(url => {
                axios({ url, responseType: 'stream' }).then(response => {
                    return new Promise((resolve, reject) => {
                        const filePath = `${md5(moment.now())}.mp4`
                        response.data.pipe(fs.createWriteStream('./src/bot/videos/' + filePath))
                            .on('finish', () => {
                                $user.set({ step: '', etc: {} }).save();
                                $ads.set({ media: filePath, type: 'video' }).save().then((a) => {
                                    msg.replyWithVideo({ source: path.join(__dirname, 'videos', a?.media) }, {
                                        caption: a?.about,
                                        parse_mode: 'Markdown',
                                        ...inlineKeyboard([
                                            [{ text: "📷Mediani o'zgartirish", callback_data: 'edit_post_media_' + a?._id }],
                                            [{ text: "📋Textni o'zgartirish", callback_data: 'edit_post_text_' + a?._id }],
                                            [{ text: "🗑️O'chirish", callback_data: 'delete_ads_post_' + a?._id }],
                                        ])
                                    });
                                })
                            })
                            .on('error', e => {
                                console.log(e);
                                msg.replyWithHTML("<b>❗Xatolik</b>")
                            })
                    });
                })
            })
        } else if ($ads.type === 'video') {
            fs.unlink(path?.join(__dirname, 'videos', $ads.media), () => { });
            msg.telegram.getFileLink(video?.file_id).then(url => {
                axios({ url, responseType: 'stream' }).then(response => {
                    return new Promise((resolve, reject) => {
                        const filePath = `${md5(moment.now())}.mp4`
                        response.data.pipe(fs.createWriteStream('./src/bot/videos/' + filePath))
                            .on('finish', () => {
                                $user.set({ step: '', etc: {} }).save();
                                $ads.set({ media: filePath, type: 'video' }).save().then((a) => {
                                    msg.replyWithVideo({ source: path.join(__dirname, 'videos', a?.media) }, {
                                        caption: a?.about,
                                        parse_mode: 'Markdown',
                                        ...inlineKeyboard([
                                            [{ text: "📷Mediani o'zgartirish", callback_data: 'edit_post_media_' + a?._id }],
                                            [{ text: "📋Textni o'zgartirish", callback_data: 'edit_post_text_' + a?._id }],
                                            [{ text: "🗑️O'chirish", callback_data: 'delete_ads_post_' + a?._id }],
                                        ])
                                    });
                                })
                            })
                            .on('error', e => {
                                console.log(e);
                                msg.replyWithHTML("<b>❗Xatolik</b>")
                            })
                    });
                })
            })
        }
    }
})

module.exports = bot