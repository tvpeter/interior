const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const headers = require("../../middlewares/headers");
const jwt = require("jsonwebtoken");
const config = require("config");

function authRouter(nav) {
  let msg = "";
  const showLogin = router.get("/", headers, async (req, res) => {
    res.status(200).render("auth", {
      contacts: res.locals.contacts,
      nav,
      msg
    });
  });
  const login = router.post("/", async (req, res) => {
    const { error } = validate(req.body);

    if (error) {
      msg = "Supply username and password";
      return res.status(400).redirect("auth");
    }

    //check for the existence of the mail in the db
    const user = await User.findOne({ email: req.body.useremil });
    if (!user) {
      msg = "Wrong username/password";
      return res.status(400).redirect("auth");
    }

    const validPassword = await bcrypt.compare(req.body.pwd, user.password);
    if (!validPassword) {
      msg = "Wrong username/password";
      return res.status(401).redirect("auth");
    }
    const token = user.generateAuthToken();

    //const products = await Product.find({});

    //req.setHeader("x-auth-token", token);
    // res.cookie('jwt', jwt, { httpOnly: true, secure: true });

    res
      .header("x-auth-token", token)
      .status(200)
      .redirect("products/view");
  });

  return [showLogin, login];
}
const validate = function(req) {
  const schema = {
    useremil: Joi.string()
      .email()
      .required(),
    pwd: Joi.string()
      .required()
      .min(4)
      .max(30)
  };
  return Joi.validate(req, schema);
};

module.exports = authRouter;
