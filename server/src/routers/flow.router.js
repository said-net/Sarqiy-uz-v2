const flowController = require('../controllers/flow.controller');
const authMiddleware = require('../middlewares/auth.middleware');

module.exports = require('express').Router()
    .post('/create', authMiddleware.user, flowController.create)
    .get('/get-my-flows', authMiddleware.user, flowController.getMyFlows)
    .get('/get-ads-post/:id', authMiddleware.user, flowController.getAdsPost)
    .delete('/delete-flow/:id', authMiddleware.user, flowController.deleteFlow)

    .get('/get-flow/:id', flowController.getFlow)