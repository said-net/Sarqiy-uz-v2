module.exports = require('express').Router()
    .use('/boss', require('./routers/boss.router'))
    .use('/setting', require('./routers/setting.router'))
    .use('/category', require('./routers/category.router'))
    .use('/product', require('./routers/product.router'))
    .use('/operator', require('./routers/operator.router'))
    .use('/courier', require('./routers/courier.router'))
    .use('/shop', require('./routers/shop.router'))
    .use('/main', require('./routers/main.router'))
    .use('/competition', require('./routers/competition.router'))
    .use('/race', require('./routers/race.router'))
    // 
    .use('/user', require('./routers/user.router'))
    .use('/flow', require('./routers/flow.router'))
