const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signup = async (req, res, next) => {

  try {

    const userId = req.userId;
    const adminUser = await User.findByPk(userId)
    if (!adminUser) {
      const error = new Error('A user with this email could not be found');
      error.statusCode = 401;
      throw error;
    }

    if (!adminUser.isAdmin) {
      const error = new Error("You don't have permission to create user!");
      error.statusCode = 403;
      throw error;
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error
    }

    const { password, username, firstName, lastName } = req.body;

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.build({
      firstName,
      lastName,
      email: '',
      password: hashedPassword,
      username,
      isAdmin: true
    }).save();

    const newUser = { username: user.username, fullName: `${user.firstName} ${user.lastName}`, userId: user.id };
    res.status(201).json({ message: 'User created!', user: newUser })

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }

};

exports.login = async (req, res, next) => {

  try {

    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } })
    if (!user) {
      const error = new Error('A user with this username could not be found');
      error.statusCode = 401;
      throw error;
    }

    const isEqual = await bcrypt.compare(password, user.password)
    if (!isEqual) {
      const error = new Error('Wrong password');
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        email: user.email,
        userId: user.id.toString()
      },
      `${process.env.JWT}`,
      { expiresIn: '24h' });
    const loggedUser = {
      username: user.username,
      fullName: `${user.firstName} ${user.lastName}`,
      isAdmin: user.isAdmin,
      userId: user.id,
      token
    };
    res.status(201).json({ user: loggedUser })

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getUser = async (req, res, next) => {

  try {

    const userId = req.userId;
    const user = await User.findByPk(userId)
    if (!user) {
      const error = new Error('A user with this username could not be found');
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        email: user.email,
        userId: user.id.toString()
      },
      `${process.env.JWT}`,
      { expiresIn: '24h' });
    const loggedUser = {
      username: user.username,
      fullName: `${user.firstName} ${user.lastName}`,
      isAdmin: user.isAdmin,
      userId: user.id,
      token
    };
    res.status(201).json({ user: loggedUser })

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
