const express = require("express");
const app = express();
const routes = require("./routes/routes");
const con = require("./util/database");
const path = require("path");
const cookiesParser = require("cookie-parser");


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookiesParser());

app.use(express.static("./methods-public"));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/clonner", routes);

con.sync().then(() => {
  app.listen(5040, () => {
    console.log("server is listening to port 5040");
  });
});
