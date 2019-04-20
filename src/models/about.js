const mongoose = require("mongoose");
const Joi = require("joi");

const qualitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 60,
    trim: true
  },
  description: { type: String, required: true, minlength: 60 }
});

const Quality = mongoose.model("Quality", qualitySchema);

const aboutusSchema = new mongoose.Schema({
  description: { type: String, required: true, minlength: 100 },
  aboutimg: { data: Buffer, contentType: String }
});

const AboutUs = mongoose.model("AboutUs", aboutusSchema);

function validateQuality(quality) {
  const schema = {
    title: Joi.string()
      .min(5)
      .max(60)
      .trim()
      .required(),
    description: Joi.string()
      .min(60)
      .required()
  };
  return Joi.validate(quality, schema);
}

//have to complete this function
function validateAboutUs() {
  const schema = {
    description: Joi.string()
      .min(100)
      .required()
  };
}

exports.Quality = Quality;
exports.AboutUs = AboutUs;
exports.validateQuality = validateQuality;
exports.validateAboutUs = validateAboutUs;
