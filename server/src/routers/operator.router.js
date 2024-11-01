const operatorController = require('../controllers/operator.controller');
const authMiddleware = require('../middlewares/auth.middleware');

module.exports = require('express').Router()
    .post('/create', authMiddleware.boss, operatorController.create)
    .get('/getall', authMiddleware.boss, operatorController.getAll)
    .put('/edit/:id', authMiddleware.boss, operatorController.edit)
    .delete('/delete/:id', authMiddleware.boss, operatorController.delete)
    .post('/set-super/:id', authMiddleware.boss, operatorController.setSuper)

    // 
    .post('/sign-in', operatorController.signIn)
    .get('/verify-session', authMiddleware.operator, operatorController.verifySession)
    // 
    .get('/get-stats', authMiddleware.operator, operatorController.getStats)
    .get('/get-my-orders', authMiddleware.operator, operatorController.getMyOrders)
    .get('/get-history-my-orders', authMiddleware.operator, operatorController.getHistoryOrders)
    .get('/get-info-order/:id', authMiddleware.operator, operatorController.getInfoOrder)
    .post('/set-status/:id', authMiddleware.operator, operatorController.setStatus)
    .get('/get-wait-orders', authMiddleware.operator, operatorController.getWaitOrders)
    .get('/get-rejected-orders', authMiddleware.operator, operatorController.getRejectedOrders)
    // 
    .post('/create-pay', authMiddleware.operator, operatorController.createPay)
    .get('/get-pays', authMiddleware.operator, operatorController.getHistoryPay)
    .put('/edit-order/:id', authMiddleware.operator, operatorController.editOrder)
    .get('/search-base/:search', authMiddleware.operator, operatorController.searchOrder)
    .get('/get-history-user/:phone', authMiddleware.operator, operatorController.getHistoryUser)
    // 
    .post('/set-new-order', authMiddleware.operator, operatorController.setNewOrder)