const Router = require('express');
const router = new Router();

const userController = require('../controllers/reportController');

// router.get('/', userController.generateReport);
// router.get('/:startDate.:endDate', userController.generateReport);
router.get('/', userController.generateReport);

module.exports = router;
