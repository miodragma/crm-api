const { Op } = require('sequelize');

const User = require('../models/user');
const Customer = require('../models/customer');
const City = require('../models/city');


exports.create = async (req, res, next) => {

  try {

    const userId = req.userId;
    const user = await User.findByPk(userId)
    if (!user) {
      const error = new Error('User could not be found');
      error.statusCode = 401;
      throw error;
    }

    const { firstName, lastName, telephone, email, remindOn, notes, isPaid, city } = req.body;

    if (!!telephone) {
      const currCustomer = await Customer.findOne({ where: { telephone } })
      if (currCustomer) {
        const error = new Error(`Customer "${currCustomer.firstName}" with telephone: ${telephone} exist.`);
        error.statusCode = 422;
        throw error;
      }
    }

    const customer = await Customer.build({
      firstName,
      lastName,
      telephone,
      email,
      remindOn,
      isPaid,
      city,
      notes,
    }).save();

    res.status(201).json({ message: 'Customer created!', customer })

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }

};

exports.getCustomers = async (req, res, next) => {
  try {

    const userId = req.userId;
    const user = await User.findByPk(userId)
    if (!user) {
      const error = new Error('User could not be found');
      error.statusCode = 401;
      throw error;
    }

    const { limit, offset, ...params } = req.query;
    const where = {};
    for (let key in params) {
      if (!!params[key]) {
        if (params[key] === 'remindOn') {
          if (!!params['remindOn']) {
            where['remindOn'] = {
              [Op.eq]: `${params['remindOn']}`
            }
          }
        } else {
          if (key !== 'isPaid') {
            where[key] = {
              [Op.iLike]: `%${params[key]}%`
            }
          }
        }
      }
      if (key === 'isPaid' && params[key] !== 'all') {
        const isPaid = 'true' === params['isPaid'];
        where['isPaid'] = {
          [Op.eq]: isPaid
        }
      }
    }

    const customers = await Customer.findAndCountAll({
      where,
      order: [
        ['id', 'DESC']
      ],
      offset: req.query.offset,
      limit: req.query.limit
    });

    const itemsPerPage = limit;
    const currentPage = (offset / 10) + 1;

    const paging = {
      total: customers.count,
      currentPage: currentPage,
      lastPage: Math.ceil(customers.count / itemsPerPage)
    }

    res.status(201).json({ message: 'Customers data', customers, paging })

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.edit = async (req, res, next) => {
  try {

    const userId = req.userId;
    const user = await User.findByPk(userId)
    if (!user) {
      const error = new Error('User could not be found');
      error.statusCode = 401;
      throw error;
    }

    const { firstName, lastName, telephone, email, remindOn, isPaid, city, notes, id } = req.body;

    const customer = await Customer.findByPk(id);

    if (!!telephone) {
      const currCustomer = await Customer.findOne({ where: { telephone } })
      if (currCustomer && customer.id !== currCustomer.id) {
        const error = new Error(`Customer "${currCustomer.firstName}" with telephone: ${telephone} exist.`);
        error.statusCode = 422;
        throw error;
      }
    }

    if (!!city) {
      const currCity = await City.findOne({ where: { value: city } });
      if (!currCity) {
        const error = new Error(`Uh oh! City "${city}" is not exist.`);
        error.statusCode = 422;
        throw error;
      }
    }

    const filterNotes = notes.filter(note => !!note.value);

    customer.firstName = firstName;
    customer.lastName = lastName;
    customer.telephone = telephone;
    customer.email = email;
    customer.remindOn = remindOn;
    customer.isPaid = isPaid;
    customer.city = city;
    customer.notes = filterNotes;

    await customer.save();

    res.status(201).json({ message: 'Customer updated!', customer })

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
