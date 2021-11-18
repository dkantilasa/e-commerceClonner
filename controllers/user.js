const { product, cart, user, invoice } = require("../models/models");
const path = require("path");

const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (email === "" || password === "") {
      return res.json({
        success: false,
        message: "email dan password tidak boleh kosong",
      });
    }

    const User = await user.create({
      email: email,
      password: password,
    });

    const Invoice = await invoice.create({
      userId: User.id,
    });
    res.json({ success: true, message: "Anda berhasil register" });
  } catch (error) {
    res.json({ success: false, message: "Masukan data dengan benar" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (email === "" || password === "") {
      return res.json({
        success: false,
        message: "email dan password tidak boleh kosong",
      });
    }
    const User = await user.findOne({
      where: {
        email: email,
        password: password,
      },
    });
    console.log(User.id);
    if (User) {
      res.cookie("token", User.id, {
        expires: new Date(Date.now() + 1800000), // cookie will be removed after 30 minutes
      });
      return res.json({ success: true, message: "Anda berhasil login" });
    }
  } catch (error) {
    res.json({
      success: false,
      message: "Email atau password anda belum terdaftar",
    });
  }
};

const getProduct = async (req, res) => {
  console.log("ini cookies", req.cookies.token);
  const Product = await product.findAll();
  res.json([{ status: "success", data: Product }]);
};

const viewCart = async (req, res) => {
  const UserId = req.cookies.token;
  //const UserId = "28808f43-8c71-47b8-bbb9-7c8ab71e2c46";
  console.log("ini cookies", UserId);
  try {
    const Invoice = await invoice.findOne({
      where: {
        userId: UserId,
        status: "WAITING",
      },
    });

    const Cart = await Invoice.getCarts();
    const productId = Cart.map(getProducts);
    function getProducts(item) {
      const Product = item.productId;
      return Product;
    }

    const Products = await product.findAll({
      where: {
        id: productId.map(getId),
      },
    });

    function getId(item) {
      return item;
    }
    res.json({ success: true, cart: Cart, product: Products });
  } catch (error) {
    res.json({ success: false, mesaage: "data tidak ditemukan" });
  }
};

const addToCart = async (req, res) => {
  const { quantity } = req.body;
  const ProductId = req.params.id;
  const UserId = req.cookies.token;
  const Product = await product.findOne({
    where: {
      id: ProductId,
    },
  });

  const price = Product.price * quantity;

  const Invoice = await invoice.findOne({
    where: {
      userId: UserId,
      status: "WAITING",
    },
  });

  const Cart = await Invoice.getCarts({ where: { productId: ProductId } });

  if (Cart) {
    try {
      await cart.update(
        { quantity: Cart[0].quantity + quantity, price: Cart[0].price + price },
        {
          where: {
            id: Cart[0].id,
          },
        }
      );

      await invoice.update(
        { totalPrice: Invoice.totalPrice + price },
        {
          where: {
            id: Invoice.id,
          },
        }
      );
      return res.json({
        data: Product,
        message: "berhasil menambahkan produk di keranjang",
      });
    } catch (error) {
      console.log(error);
    }
  }

  try {
    const Cart = await cart.create({
      quantity: quantity,
      price: price,
      productId: ProductId,
      userId: UserId,
      invoiceId: Invoice.id,
    });
    await Invoice.update(
      { totalPrice: Invoice.totalPrice + price },
      {
        where: {
          id: Invoice.id,
        },
      }
    );
    return res.json({
      data: Product,
      message: "berhasil menambahkan produk di keranjang",
    });
  } catch (error) {
    console.log(error);
  }
};

const removeFromCart = async (req, res) => {
  const { invoiceId, productId } = req.params;
  try {
    const Cart = await cart.findOne({
      where: { invoiceId: invoiceId, productId: productId },
    });
    const Invoice = await Cart.getInvoice();
    await Invoice.update({
      totalPrice: Invoice.totalPrice - Cart.price,
    });
    await Cart.destroy();
    res.json({ success: true, data: Invoice });
  } catch (error) {
    res.json({ success: false, message: "Something wrong" });
  }
};

const checkOut = async (req, res) => {
  const invoiceId = req.params.id;
  const UserId = req.cookies.token;
  try {
    const Invoice = await invoice.findOne({ where: { id: invoiceId } });
    await Invoice.update({ status: "SUCCESS" });
    const newInvoice = await invoice.create({
      userId: UserId,
    });
    res.json({
      success: true,
      message: "Check out berhasil",
      data: newInvoice,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Something wrong" });
  }
};

const addProduk = async (req, res) => {
  console.log(req.body);
  try {
    const Product = await product.create({
      name: req.body.name,
      description: req.body.desc,
      price: req.body.price,
      imgProduct: req.file.path,
    });

    res.status(201).json({ success: true, msg: "insert success" });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, msg: "please provide correct input" });
  }
};

module.exports = {
  register,
  login,
  getProduct,
  addProduk,
  addToCart,
  checkOut,
  removeFromCart,
  viewCart,
};
