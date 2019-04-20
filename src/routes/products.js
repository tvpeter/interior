const express = require("express");
const router = express.Router();
const { Contact } = require("../models/contact");

let pageDetails = {
  current: "Products",
  title: "FMG Furniture | Products",
  header: "Our Products"
};

function productsRouter(nav) {
  const productDetails = router.get("/details", async (req, res) => {
    let contacts = await Contact.find(
      {},
      { email: 1, phone: 1, address: 1, _id: 0 }
    );
    contacts = contacts[0];

    res.render("details", {
      nav,
      current: "Products",
      title: "FMG Furniture | Products",
      header: "Product Details",
      contacts
    });
  });
  const productIndex = router.get("/", async (req, res) => {
    let contacts = await Contact.find(
      {},
      { email: 1, phone: 1, address: 1, _id: 0 }
    );
    contacts = contacts[0];
    res.render("products", {
      nav,
      pageDetails,
      contacts
    });
  });
  return [productIndex, productDetails];
}

module.exports = productsRouter;
