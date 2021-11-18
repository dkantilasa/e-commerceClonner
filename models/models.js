const { DataTypes } = require("sequelize");
const con = require("../util/database");

const product = con.define("product", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  imgProduct: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const cart = con.define("cart", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

const invoice = con.define("invoice", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  totalPrice: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "WAITING",
  },
});

const user = con.define("user", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
// one to many relationship
user.hasMany(cart, {
  foreignKey: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});
cart.belongsTo(user);

user.hasMany(invoice, {
  foreignKey: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});
invoice.belongsTo(user);

invoice.hasMany(cart, {
  foreignKey: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});
cart.belongsTo(invoice);

product.hasMany(cart, {
  foreignKey: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});
cart.belongsTo(product);

module.exports = { product, cart, invoice, user };
