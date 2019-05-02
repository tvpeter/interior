const config = require("config");
const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
  //this is going
  const token = req.header("x-auth-token");
  //const token = req.header("x-auth-token");

  if (!token) {
    return res.send("No token provided");
  }

  console.log(token);

  try {
    const decoded = jwt.verify(token, config.get("jwtInteriorKey"));
    req.user = decoded;
    next();
  } catch (error) {
    return res.send("Invalid token");
  }
};
