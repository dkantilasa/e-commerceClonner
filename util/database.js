const Sequelize = require("sequelize");

const connection = new Sequelize("clonner_database", "root", "password", {
  host: "localhost",
  port: "3306",
  dialect: "mysql",
});

module.exports = connection;
