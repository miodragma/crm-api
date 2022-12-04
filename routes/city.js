const express = require('express');

const router = express.Router();

const cityController = require('../controllers/city');

const isAuth = require('../middleware/is-auth');

router.get('/all', isAuth, cityController.getAllCities);
router.put('/create', isAuth, cityController.createCity);

module.exports = router;
