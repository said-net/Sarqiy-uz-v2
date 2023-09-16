const mainController = require('../controllers/main.controller');
const authMiddleware = require('../middlewares/auth.middleware');

module.exports = require('express').Router()
    .post('/create-post', authMiddleware.boss, mainController.createPost)
    .get('/get-all', authMiddleware.boss, mainController.getMainMenu)
    .delete('/delete-post/:id', authMiddleware.boss, mainController.deletePost)
    .get('/get-for-client', mainController.getMainForClient)