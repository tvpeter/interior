const express = require("express");
const router = express.Router();
const { Service } = require("../models/services");
const { Quality } = require("../models/about");
const headers = require("../../middlewares/headers");

pageDetails = {
  current: "Home",
  title: "FMG Furniture | Homepage"
};
module.exports = nav => {
  return router.get("/", headers, async (req, res) => {
    const services = await Service.find({}).limit(3);
    const qualities = await Quality.find({});
    res.status(200).render("index", {
      nav,
      pageDetails,
      services,
      contacts: res.locals.contacts,
      qualities
    });
  });
};
