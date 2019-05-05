const config = require("config");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { User } = require("../src/models/user");

module.exports = async function(req, res, next) {
  const token = req.cookies["fmgnerd"];
  if (!token) {
    return res.send("No token provided");
  }
  try {
    const decoded = jwt.verify(token, config.get("jwtInteriorKey"));
    //need to break and check the user id, retrieve the name and attach the access level
    req.user = decoded;

    //check the validity of the userid
    if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
      return res.redirect("/");
    }
    //check if it exists
    const check = await User.findById(req.user._id);
    if (!check) {
      return res.redirect("/");
    }
    res.locals.uname = req.user.name;
    next();
  } catch (error) {
    return res.redirect("/");
  }
};
