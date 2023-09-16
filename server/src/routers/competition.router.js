const competitionController = require('../controllers/competition.controller');
const authMiddleware = require('../middlewares/auth.middleware');

module.exports = require('express').Router()
    .post('/create', authMiddleware.boss, competitionController.createCompetition)
    .get('/get-all', authMiddleware.boss, competitionController.getAll)
    .get('/get-one/:id', authMiddleware.boss, competitionController.getOne)
    .get('/get-one-for-admins', authMiddleware.user, competitionController.getOneForAdmins)