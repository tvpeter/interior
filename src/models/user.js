const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const ACCESSLEVEL = ["admin", "user"];
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 4,
    maxlength: 45,
    unique: true
  },
  email: { type: String, required: true, unique: true, trim: true },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 11,
    maxlength: 15
  },
  password: { type: String, required: true, minlength: 6, maxlength: 1024 },
  access: { type: String, required: true, enum: ACCESSLEVEL }
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    { _id: this._id, access: this.access },
    config.get("jwtInteriorKey"),
    {
      expiresIn: 86400
    }
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string()
      .min(4)
      .max(45)
      .required(),
    email: Joi.string()
      .email({ minDomainAtoms: 2 })
      .required(),
    phone: Joi.string()
      .min(11)
      .max(14)
      .required(),
    password: Joi.string()
      .min(6)
      .max(24)
      .required(),
    password_confirmation: Joi.string()
      .required()
      .valid(Joi.ref("password"))
      .options({
        language: {
          any: {
            allowOnly: " do  not match"
          }
        }
      }),
    access: Joi.string()
      .valid("admin", "user")
      .required()
  };
  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
