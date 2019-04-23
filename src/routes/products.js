const express = require("express");
const router = express.Router();
const fs = require("fs");
const { Contact } = require("../models/contact");
const { Category } = require("../models/category");
const { Product, validate } = require("../models/products");
const multer = require("multer");

const upload = multer({
  limits: { fileSize: 500000 },
  dest: "./public/images/"
});

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
    const categories = await Category.find({}, { name: 1, _id: 0 });
    res.render("products/products", {
      nav,
      pageDetails,
      contacts,
      categories
    });
  });
  const showCreateForm = router.get("/create", async (req, res) => {
    const categories = await Category.find({}, { name: 1, _id: 0 });
    pageDetails.header = "Create Product";
    res.render("products/create", { pageDetails, nav, categories });
  });
  const createProduct = router.post(
    "/create",
    upload.single("img"),
    async (req, res) => {
      //check if there was an image attached
      if (req.file == null) {
        pageDetails.error = "Select a product image";
        return res.status(400).redirect("/products/create");
      }

      //check if category1 and category2 are same

      if (req.body.category1 === req.body.category2) {
        pageDetails.error = "selected categories are same";
        return res.status(400).redirect("/products/create");
      }

      //check that the req is complete
      const { error } = validate(req.body);
      if (error) {
        pageDetails.error = error.details[0].message;
        return res.status(400).redirect("/products/create");
      }

      //check db for the item
      const dbProduct = await Product.findOne({ name: req.body.name });
      //const dbProductImg = await Product.findOne({'img': req.file.originalname});

      if (dbProduct) {
        pageDetails.error = "Product already created";
        return res.status(400).redirect("/products/create");
      }
      //create the item
      const newProduct = new Product({
        name: req.body.name,
        price: req.body.price,
        category: [req.body.category1, req.body.category2],
        description: req.body.description,
        qty: req.body.qty
      });
      //base 64 encoding of images
      //need to check for output of these before finalizing cos different binary encoding with same size
      //newProduct.img.data = fs.readFileSync(req.file.path).toString("base64");

      newProduct.img.data = Buffer(
        fs.readFileSync(req.file.path).toString("base64"),
        "base64"
      );
      newProduct.img.contentType = req.file.mimetype;
      try {
        await newProduct.save();
        pageDetails.error = "successfully saved";
        return res.status(200).redirect("/products/create");
      } catch (error) {
        pageDetails.error = error;
        return res.status(409).redirect("/products/create");
      }
    }
  );
  const viewProducts = router.get("/view", async (req, res) => {
    const products = await Product.find({});
    //res.contentType("image/png");
    res.render("products/view", {
      nav,
      current: "Products",
      title: "Products View",
      header: "Product Details",
      products
    });
  });
  return [
    showCreateForm,
    productIndex,
    productDetails,
    createProduct,
    viewProducts
  ];
}

module.exports = productsRouter;
