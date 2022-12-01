const express = require('express');

const router = express.Router();

const customerController = require('../controllers/customer');

const isAuth = require('../middleware/is-auth');

router.put('/create', isAuth, customerController.create);
router.post('/edit', isAuth, customerController.edit);
router.get('/all-customers', isAuth, customerController.getCustomers);

module.exports = router;
