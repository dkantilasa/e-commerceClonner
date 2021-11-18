const { DataTypes } = require("sequelize");
const con = require("../util/database");
const User = con.define("User", {
  // Model attributes are defined here
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  firstName: {
    type: DataTypes.STRING,
    //allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    // allowNull defaults to true
  },
  address: {
    type: DataTypes.STRING,
    // allowNull defaults to true
  },
});

const Admin = con.define("Admin", {
  // Model attributes are defined here
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  firstName: {
    type: DataTypes.STRING,
    //allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    // allowNull defaults to true
  },
  address: {
    type: DataTypes.STRING,
    // allowNull defaults to true
  },
});

User.hasOne(Admin, {
  foreignKey: {
    type: DataTypes.UUID,
    allowNull: true,
  },
});

Admin.belongsTo(User);

module.exports = { User, Admin };
