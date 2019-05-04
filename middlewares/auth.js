const config = require("config");
const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
  // Cookies that have not been signed
  const token = req.cookies["fmgnerd"];
  if (!token) {
    return res.send("No token provided");
  }
  try {
    const decoded = jwt.verify(token, config.get("jwtInteriorKey"));
    //need to break and check the user id, retrieve the name and attach the access level

    req.user = decoded;
    next();
  } catch (error) {
    return res.send(error);
  }
};
