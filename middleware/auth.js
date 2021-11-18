const auth = (req, res, next) => {
  const user = req.cookies.token;
  console.log(user);
  if (user) {
    next();
  } else {
    return res.json({
      succes: false,
      message: "silahkan login terlebih dahulu",
    });
  }
};

module.exports = auth;
