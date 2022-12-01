const Sequelize = require('sequelize');

const sequelize = require('../db/dabatase');

const Customer = sequelize.define('customer', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  firstName: {
    type: Sequelize.STRING,
    allowNull: true
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: true
  },
  telephone: {
    type: Sequelize.STRING,
    allowNull: true
  },
  email: {
    type: Sequelize.STRING,
    allowNull: true
  },
  remindOn: {
    type: Sequelize.STRING,
    allowNull: true
  },
  notes: {
    type: Sequelize.ARRAY(Sequelize.JSON),
    allowNull: true
  }
});

module.exports = Customer;
