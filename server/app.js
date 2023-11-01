process.env.NODE_ENV !== 'production' && require('dotenv').config();
const { APP_PORT, MONGO_URI } = require('./src/configs/env');
const express = require('express');
const file = require('express-fileupload');
const cors = require('cors');
const router = require('./src/router');
const shopController = require('./src/controllers/shop.controller');
const shopModel = require('./src/models/shop.model');
const cointransferModel = require('./src/models/cointransfer.model');
const app = express();
require('mongoose').connect(MONGO_URI);
require('./src/controllers/boss.controller').default();
require('./src/controllers/setting.controller').default();
require('./src/configs/folder.config')()
app.use(cors());
app.use(express.json());
app.use(file());
app.use('/public', express.static('public'));
app.post('/target', shopController.getTargetApi);
app.post('/target/v2', shopController.FlowTarget);
app.get('/wait-to-new', shopController.waitToNew)
app.get('/transfer/:order/:user', async (req, res) => {
    try {
        const { user, order } = req?.params;
        const $order = await shopModel.findOne({ id: +order });
        $order.set({ flow: user }).save().then(() => {
            res.send({
                ok: true,
                msg: "OK"
            })
        })
    } catch (error) {
        console.log(error);
        res.send({
            ok: false,
            msg: "Xatolik!"
        })
    }
})
try {
    app.use('/api', router);
} catch (error) {
    console.log(error);
}
app.listen(APP_PORT, () => {
    try {
        require('./src/bot/app').launch()
    } catch (error) {
        console.log(error);
    }
});
