const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { Contact } = require("../models/contact");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");

function authRouter(nav) {
  let msg = "";
  const showLogin = router.get("/", async (req, res) => {
    let contacts = await Contact.find(
      {},
      { address: 1, email: 1, phone: 1, _id: 0 }
    );
    contacts = contacts[0];
    res.status(200).render("auth", {
      contacts,
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

    return res.header("x-auth-token", token).redirect("products/view");
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
