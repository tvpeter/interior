const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/user");

headers = {
  current: "Register",
  title: "Register User",
  header: "Register User"
};
function userRouter(nav, contactDetails) {
  const getUsers = router.get("/", (req, res) => {
    res.render("register", {
      nav,
      headers,
      contactDetails
    });
  });

  const postUsers = router.post("/", async (req, res) => {
    const result = errorCode => {
      return res.status(errorCode).render("register", { nav, pageDetails });
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
      password: req.body.password
    });
    try {
      await newUser.save();
      return result(200);
    } catch (error) {
      pageDetails.error = "Oops something went wrong, try again";
      return result(500);
    }
  });

  return [getUsers, postUsers];
}

module.exports = userRouter;
