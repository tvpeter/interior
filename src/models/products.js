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
  price: { type: Number },
  category: [String],
  description: { type: String, minlength: 15, maxlength: 250, required: true },
  img: { data: Buffer, contentType: String }
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
      .max(250)
      .trim()
      .required()
  };
  return Joi.validate(product, schema);
};

exports.Product = Product;
exports.validate = validateProduct;
