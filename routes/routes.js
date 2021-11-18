const express = require("express");
const {
  addProduk,
  getProduct,
  addToCart,
  register,
  login,
  checkOut,
  removeFromCart,
  viewCart,
} = require("../controllers/user");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const auth = require("../middleware/auth");
var fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    var datetimestamp = Date.now();
    cb(
      null,
      file.originalname.split(".")[0] +
        "-" +
        datetimestamp +
        path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: fileStorage,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
      return callback(new Error("Only images are allowed"));
    }
    callback(null, true);
  },
});
router.post("/addProduct", upload.single("imgProduk"), addProduk);

router.post("/register", register);
router.post("/login", login);
router.get("/products", getProduct);

router.get("/viewCart", viewCart);
router.post("/addToCart/:id", addToCart);
router.post("/removeFromCart/:invoiceId/:productId", removeFromCart);
router.post("/checkOut/:id", checkOut);

module.exports = router;
