const Sequelize = require('sequelize').Sequelize;

const dbConfig = require('./db.config');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false
    }
  },
  dialect: dbConfig.dialect,
});

module.exports = sequelize;
