const bossController = require('../controllers/boss.controller');
const authMiddleware = require('../middlewares/auth.middleware');

module.exports = require('express').Router()
    .post('/signin', bossController.signin)
    .get('/verify', authMiddleware.boss, bossController.verify)
    // 
    .get('/get-stats', authMiddleware.boss, bossController.getStats)
    .get('/get-dashboard', authMiddleware.boss, bossController.getDashboard)
    .get('/get-all-products', authMiddleware.boss, bossController.getAllProducts)
    .get('/get-wait-orders', authMiddleware.boss, bossController.getRecontactOrders)
    .get('/get-all-users', authMiddleware.boss, bossController.getAllUsers)
    .get('/set-targetolog/:id', authMiddleware.boss, bossController.setTargetlolog)
    .get('/remove-targetolog/:id', authMiddleware.boss, bossController.removeTargetolog)
    .get('/set-ban-user/:id', authMiddleware.boss, bossController.setBanUser)
    .get('/remove-ban-user/:id', authMiddleware.boss, bossController.removeBanUser)
    .get('/get-all-cheques/:page', authMiddleware.boss, bossController.getCheques)
    .get('/get-wait-delivery', authMiddleware.boss, bossController.getWaitDelivery)
    .get('/get-sended-orders', authMiddleware.boss, bossController.getSendedOrders)
    .get('/get-archived-orders/:page', authMiddleware.boss, bossController.getArchivedOrders)
    .get('/get-history-orders/:page', authMiddleware.boss, bossController.getHistoryOrders)
    // 
    .post('/create-courier', authMiddleware.boss, bossController.createCourier)
    .put('/edit-courier', authMiddleware.boss, bossController.editCourier)
    .get('/get-all-couriers', authMiddleware.boss, bossController.getAllCouriers)
    .post('/set-courier', authMiddleware.boss, bossController.setCourier)
    // 
    .get('/get-rejected-orders', authMiddleware.boss, bossController.getRejectedOrders)
    .get('/get-delivered-orders', authMiddleware.boss, bossController.getDeliveredOrders)
    .post('/confirm-rejecteds', authMiddleware.boss, bossController.confirmRejecteds)
    .post('/confirm-delivereds', authMiddleware.boss, bossController.confirmDelivereds)
    // 
    .get('/get-operator-pays', authMiddleware.boss, bossController.getOperatorPays)
    .post('/set-operator-pay-status', authMiddleware.boss, bossController.setStatusOperatorPay)
    .get('/search-history-orders/:type/:search', authMiddleware.boss, bossController.searchHistoryOrders)
    // 
    // 
    // 
    .post('/create-owner', authMiddleware.boss, bossController.createOwner)
    .get('/get-all-owners', authMiddleware.boss, bossController.getAllOwners)
    .put('/edit-owner/:id', authMiddleware.boss, bossController.editOwner)
    .delete('/delete-owner/:id', authMiddleware.boss, bossController.deleteOwner)
    // 
    // 
    // 
    .get('/get-stats-users', authMiddleware.boss, bossController.getStatsUsers)
    .get('/get-stats-opers', authMiddleware.boss, bossController.getStatsOpers)

