const mongoose = require("mongoose");
const Joi = require("joi");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 30
  }
});

const Category = mongoose.model("Category", categorySchema);

const validateCategory = category => {
  const schema = {
    name: Joi.string()
      .min(4)
      .max(30)
      .trim()
      .required()
  };
  return Joi.validate(category, schema);
};

exports.Category = Category;
exports.validate = validateCategory;
