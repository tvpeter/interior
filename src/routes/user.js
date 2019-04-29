const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const auth = require("../../middlewares/auth");

function userRouter(nav, contactDetails) {
  const showUserForm = router.get("/register", auth, (req, res) => {
    res.render("users/register");
  });

  const createUser = router.post("/", auth, async (req, res) => {
    const result = errorCode => {
      return res.status(errorCode).redirect("users/register");
    };

    //return if request does not contain all params
    const { error } = validate(req.body);
    if (error) {
      pageDetails.error = error.details[0].message;
      return result(400);
    }

    //return if password and confirmation does not match
    if (req.body.password !== req.body.password_confirmation) {
      pageDetails.error = "Password confirmation does not match";
      return result(400);
    }

    //return if user name or email or phone exists
    const userName = await User.findOne({ name: req.body.name });
    if (userName) {
      pageDetails.error = "User already registered";
      return result(409);
    }

    const userMail = await User.findOne({ email: req.body.email });
    if (userMail) {
      pageDetails.error = "User already exist with given mail";
      return result(409);
    }

    const userPhone = await User.findOne({ phone: req.body.phone });
    if (userPhone) {
      pageDetails.error = "User already exist with given phone number";
      return result(409);
    }

    //create a new user
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      access: req.body.access
    });
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(req.body.password, salt);

    try {
      await newUser.save();
      pageDetails.error = "User created successfully";
      return result(200);
    } catch (error) {
      pageDetails.error = "Oops something went wrong, try again";
      return result(500);
    }
  });

  const getUsers = router.get("/", auth, async (req, res) => {
    const users = await User.find({});
    return res.status(200).render("users/users", { users });
  });

  return [showUserForm, createUser];
}

module.exports = userRouter;
