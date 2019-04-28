const mongoose = require("mongoose");
const Joi = require("joi");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 60,
    trim: true
  },
  qty: { type: Number, required: true, min: 1 },
  price: { type: Number },
  category: [String],
  description: { type: String, minlength: 15, maxlength: 350, required: true },
  img: { type: String, required: true }
});

const Product = mongoose.model("Product", productSchema);

const validateProduct = product => {
  const schema = {
    name: Joi.string()
      .trim()
      .min(5)
      .max(60)
      .required(),
    price: Joi.number(),
    category1: Joi.string().required(),
    category2: Joi.string(),
    description: Joi.string()
      .min(15)
      .max(700)
      .trim()
      .required(),
    qty: Joi.number()
      .min(1)
      .required(),
    img: Joi.string()
  };
  return Joi.validate(product, schema);
};

exports.Product = Product;
exports.validate = validateProduct;
