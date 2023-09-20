const shopController = require('../controllers/shop.controller');
const authMiddleware = require('../middlewares/auth.middleware');

module.exports = require('express').Router()
    .post('/create', shopController.create)
    // 
    .get('/get-new-orders', authMiddleware.boss, shopController.getNewOrders)
    .get('/get-new-orders-operator', authMiddleware.operator, shopController.getNewOrders)
    .get('/get-owned-orders', authMiddleware.boss, shopController.getOwnedOrders)
    // 
    .post('/transfer-order/:id/:operator', authMiddleware.boss, shopController.transferOrder)
    .post('/transfer-courier/:id/:courier', authMiddleware.boss, shopController.transferCourier)
    .post('/transfer-order-operator/:id/:operator', authMiddleware.operator, shopController.transferOrder)
    .post('/transfer-selected-orders', authMiddleware.boss, shopController.transferSelecteds)
// 
