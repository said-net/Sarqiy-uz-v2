const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

module.exports = require('express').Router()
    .post('/request-sms', userController.requestSMS)
    .post('/verify-code', userController.verifyCode)
    .post('/signin-with-pass', userController.signInWithPassword)
    // 
    .get('/verify-auth', authMiddleware.user, userController.verifyAuth)
    .post('/edit-informations', authMiddleware.user, userController.editInformations)
    // 
    .get('/get-shop-history', authMiddleware.user, userController.getShopHistory)
    .get('/set-like/:id', authMiddleware.user, userController.setLike)
    .get('/get-likes', authMiddleware.user, userController.getLikes)
    .get('/get-my-likes', authMiddleware.user, userController.getMyLikes)
    .get('/get-stats/:date', authMiddleware.user, userController.getStats)
    .get('/get-refs', authMiddleware.user, userController.getRefs)
    .post('/set-telegram', authMiddleware.user, userController.setTelegram)
    .get('/get-requests', authMiddleware.user, userController.getRequests)
    .post('/set-status-my-sales', authMiddleware.user, userController.setStatusMySales)
    .post('/set-status-my-sale/:id', authMiddleware.user, userController.setStatusMySale)
    // 
    .post('/request-pay', authMiddleware.user, userController.requestPay)
