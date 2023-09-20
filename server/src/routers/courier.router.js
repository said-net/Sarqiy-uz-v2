const courierController = require('../controllers/courier.controller');
const authMiddleware = require('../middlewares/auth.middleware');

module.exports = require('express').Router()
    .post('/sign-in', courierController.signIn)
    .get('/verify-session', authMiddleware.courier, courierController.verifySession)
    .get('/get-stats', authMiddleware.courier, courierController.getStats)
    .get('/get-my-orders', authMiddleware.courier, courierController.getMyOrders)
    .get('/get-rejected-orders', authMiddleware.courier, courierController.getRejectedOrders)
    .get('/get-wait-orders', authMiddleware.courier, courierController.getWaitOrders)
    .post('/set-status-order/:id', authMiddleware.courier, courierController.setStatus)