const express = require("express");
const router = express.Router();
const { Category, validate } = require("../models/category");
const auth = require("../../middlewares/auth");

const headers = {
  header: "Create Products Category"
};

const categoryRouter = nav => {
  const categoryForm = router.get("/", auth, async (req, res) => {
    const categories = await Category.find({});

    res.status(200).render("category", {
      nav,
      headers,
      categories
    });
  });

  const createCategory = router.post("/", auth, async (req, res) => {
    const categories = await Category.find({});
    //check name is supplied
    const { error } = validate(req.body);
    if (error) {
      headers.error = error.details[0].message;
      return res.status(400).render("category", { nav, headers, categories });
    }

    //check it is not in the db
    const categoryInDb = await Category.findOne({ name: req.body.name });
    if (categoryInDb) {
      headers.error = "Category name already exist";
      return res.status(400).render("category", { nav, headers, categories });
    }

    //create a new category
    const newCategory = new Category({
      name: req.body.name
    });

    try {
      await newCategory.save();
      //return res.status(200).render("category", { nav, headers, categories });
      return res.status(200).redirect("/category");
    } catch (error) {
      headers.error = error;
      res.status(500).render("category", {
        nav,
        headers,
        categories
      });
    }
  });

  const deleteCategory = router.delete("/", auth, async (req, res) => {
    //const categories = await Category.find({});
    //return res.send(req.body);
    const category = await Category.findOneAndDelete(req.body._id);

    if (!category) {
      headers.error = "category not found";
      return res.status(404).redirect("/category");
    }
    return res.redirect("/category");
  });

  return [categoryForm, createCategory, deleteCategory];
};

module.exports = categoryRouter;
