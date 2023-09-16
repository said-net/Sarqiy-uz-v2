const categoryController = require('../controllers/category.controller');
const authMiddleware = require('../middlewares/auth.middleware');

module.exports = require('express').Router()
    //  title, image, background
    .post('/create', authMiddleware.boss, categoryController.create)

    // return data[{id: string, title: string, image: string, background: string, hidden:boolean}]
    .get('/getall', categoryController.getAll)

    .get('/getone/:id', categoryController.getOne)

    // param: id; body: title, background, image?
    .put('/edit/:id/:type', authMiddleware.boss, categoryController.edit)

    // param: id;
    .delete('/delete/:id', authMiddleware.boss, categoryController.delete)

    // param: id;
    .put('/recovery/:id', authMiddleware.boss, categoryController.recovery)
