const Sequelize = require('sequelize');

const sequelize = require('../db/dabatase');

const City = sequelize.define('city', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  value: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = City;
