const express = require("express");
const router = express.Router();
const { Service } = require("../models/services");
const { Quality } = require("../models/about");
const headers = require("../../middlewares/headers");
const { Category } = require("../models/category");
const { Product } = require("../models/products");

pageDetails = {
  current: "Home",
  title: "FMG Furniture | Homepage"
};
module.exports = nav => {
  return router.get("/", headers, async (req, res) => {
    const services = await Service.find({}, { _id: 0 }).limit(3);
    const qualities = await Quality.find({}, { _id: 0 });
    const categories = await Category.find({}, { _id: 0 });
    const products = await Product.find({}, { name: 1, img: 1, _id: 1 }).limit(
      6
    );
    res.status(200).render("index", {
      nav,
      pageDetails,
      services,
      contacts: res.locals.contacts,
      qualities,
      categories,
      products
    });
  });
};
