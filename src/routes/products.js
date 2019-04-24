const express = require("express");
const router = express.Router();
const fs = require("fs");
const { Contact } = require("../models/contact");
const { Category } = require("../models/category");
const { Product, validate } = require("../models/products");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  }
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 500000 }
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
        img: req.file.path,
        qty: req.body.qty
      });

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
  const deleteProduct = router.delete("/", async (req, res) => {
    const product = await Product.findByIdAndDelete(req.body._id);

    if (!product) {
      pageDetails.error = "Product not found";
      return res.status(404).redirect("/products/view");
    }
    fs.unlinkSync(product.img);
    pageDetails.success = "Product deleted successfully";
    return res.status(200).redirect("/products/view");
  });

  const singleProduct = router.get("/:id", async (req, res) => {
    //need to validate that its a valid object id

    const product = await Product.findById(req.params.id);

    if (!product) {
      pageDetails.error = "Product not found";
      return res.status(404).redirect("/products/view");
    }
    return res.status(200).render("products/single", {
      nav,
      pageDetails,
      product
    });
  });

  return [
    showCreateForm,
    productIndex,
    productDetails,
    createProduct,
    viewProducts,
    deleteProduct,
    singleProduct
  ];
}

module.exports = productsRouter;
