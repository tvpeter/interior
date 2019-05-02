const express = require("express");
const router = express.Router();
const fs = require("fs");
const { Category } = require("../models/category");
const { Product, validate } = require("../models/products");
const multer = require("multer");
const auth = require("../../middlewares/auth");
const headers = require("../../middlewares/headers");

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
  const productIndex = router.get("/", headers, async (req, res) => {
    const products = await Product.find({});
    const categories = await Category.find({}, { name: 1, _id: 0 });
    res.render("products/products", {
      nav,
      pageDetails,
      contacts: res.locals.contacts,
      categories,
      products
    });
  });
  const showUserProduct = router.get("/v/:id", headers, async (req, res) => {
    const categories = await Category.find({}, { name: 1, _id: 0 });
    const product = await Product.findById(req.params.id);
    const related = await Product.find({ category: product.category[0] });
    //return res.send(related);
    return res.render("products/details", {
      nav,
      pageDetails,
      product,
      contacts: res.locals.contacts,
      categories,
      related
    });
  });
  const showCreateForm = router.get("/create", auth, async (req, res) => {
    const categories = await Category.find({}, { name: 1, _id: 0 });
    pageDetails.header = "Create Product";
    res.render("products/create", { pageDetails, nav, categories });
  });
  const createProduct = router.post(
    "/create",
    upload.single("img"),
    auth,
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

    res.render("products/view", {
      title: "Products View",
      products
    });
  });
  const deleteProduct = router.delete("/", auth, async (req, res) => {
    const product = await Product.findByIdAndDelete(req.body._id);

    if (!product) {
      pageDetails.error = "Product not found";
      return res.status(404).redirect("/products/view");
    }
    fs.unlinkSync(product.img);
    pageDetails.success = "Product deleted successfully";
    return res.status(200).redirect("/products/view");
  });

  const singleProduct = router.get("/:id", auth, async (req, res) => {
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
    createProduct,
    viewProducts,
    deleteProduct,
    singleProduct,
    showUserProduct
  ];
}

module.exports = productsRouter;
