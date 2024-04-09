const Router = require('express');
const router = new Router();
const jsonServer = require('json-server');

router.use('/dataBase', jsonServer.router('dataBase.json'));

module.exports = router;
