const User = require('../models/user');

const City = require('../models/city');

exports.createCity = async (req, res, next) => {
  try {

    const userId = req.userId;
    const user = await User.findByPk(userId)
    if (!user) {
      const error = new Error('A user with this username could not be found');
      error.statusCode = 401;
      throw error;
    }

    const { value } = req.body;

    const isCity = await City.findOne({ where: { value } })

    if (isCity) {
      const error = new Error(`${isCity.value} is exist.`);
      error.statusCode = 422;
      throw error;
    }

    const city = await City.build({
      value
    }).save();

    res.status(201).json(city);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getAllCities = async (req, res, next) => {
  try {

    const userId = req.userId;
    const user = await User.findByPk(userId)
    if (!user) {
      const error = new Error('A user with this username could not be found');
      error.statusCode = 401;
      throw error;
    }

    const cities = await City.findAll();

    res.status(201).json(cities);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
