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
  category: { type: Array, required: true },
  description: { type: String, minlength: 15, maxlength: 250 },
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
    category: Joi.array().items(Joi.string())
  };
};

exports.Product = Product;
exports.validateProduct = validate;
