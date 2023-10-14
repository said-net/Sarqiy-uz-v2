const raceController = require('../controllers/race.controller');
const authMiddleware = require('../middlewares/auth.middleware');

module.exports = require('express').Router()
    .post(`/create`, authMiddleware.boss, raceController.create)
    .get(`/get-all`, authMiddleware.boss, raceController.getAll)
    .put(`/edit-image/:id`, authMiddleware.boss, raceController.editImage)
    .put(`/edit-body/:id`, authMiddleware.boss, raceController.editBody)
    .delete(`/delete/:id`, authMiddleware.boss, raceController.delete)
    // 
    .get(`/get-all-to-users`, authMiddleware.user, raceController.getAllToUsers)
    .get(`/shop-race/:id`, authMiddleware.user, raceController.shopRace)

