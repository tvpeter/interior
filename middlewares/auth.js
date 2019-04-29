const config = require("config");
const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
  let msg;
  const token = req.header("x-auth-token");
  if (!token) {
    msg = "Access denied";
    return res.status(401).redirect("/");
  }

  try {
    const decoded = jwt.verify(token, "sekretKey");
    req.user = decoded;
    next();
  } catch (error) {
    msg = "Provide valid token";
    return res.status(400).redirect("/");
  }
};
