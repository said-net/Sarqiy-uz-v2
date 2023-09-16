const settingController = require('../controllers/setting.controller');
const authMiddleware = require('../middlewares/auth.middleware');

module.exports = require('express').Router()
    .post('/set-settings', authMiddleware.boss, settingController.setSettings)
    .get('/get-settings', authMiddleware.boss, settingController.getSettings)
    .post('/set-delivery', authMiddleware.boss, settingController.setDelivery)