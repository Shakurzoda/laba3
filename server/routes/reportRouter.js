const Router = require('express');
const router = new Router();

const userController = require('../controllers/reportController');

router.get('/', userController.generateReport);

module.exports = router;
