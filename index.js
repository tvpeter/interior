const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
const app = express();
const config = require("config");
const cookieParser = require("cookie-parser");

app.use(cookieParser());
// override with POST having ?_method=DELETE
app.use(methodOverride("_method"));
app.set("views", "./src/views/");
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public/")));
app.use("/css", express.static(path.join(__dirname, "public/css/")));
app.use("/js", express.static(path.join(__dirname, "public/js/")));
app.use("/images", express.static(path.join(__dirname, "public/images/")));

const port = process.env.PORT || 3000;

require("./startup/db")();

if (!config.get("jwtInteriorKey")) {
  throw new Error("Fatal: jwtInteriorKey");
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const nav = [
  { link: "/", title: "Home" },
  { link: "/about", title: "About Us" },
  { link: "/services", title: "Services" },
  { link: "/products", title: "Products" },
  { link: "/contact", title: "Contact" }
];

app.get("/logout", (req, res) => {
  res.clearCookie["fmgnerd"];
  return res.redirect("/");
});

const users = require("./src/routes/user");
const about = require("./src/routes/about")(nav);
const services = require("./src/routes/services")(nav);
const contact = require("./src/routes/contact")(nav);
const products = require("./src/routes/products")(nav);
const index = require("./src/routes/index")(nav);
const category = require("./src/routes/category")(nav);
const auth = require("./src/routes/auth")(nav);

app.use("/users", users);
app.use("/about", about);
app.use("/services", services);
app.use("/contact", contact);
app.use("/products", products);
app.use("/category", category);
app.use("/auth", auth);
app.use("/", index);

const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = server;
