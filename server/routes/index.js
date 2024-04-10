const Router = require('express');
const jsonServer = require('json-server');
const reportRouter = require('./reportRouter');

const router = new Router();

router.use('/dataBase', jsonServer.router('dataBase.json'));
router.use('/report', reportRouter);

module.exports = router;
