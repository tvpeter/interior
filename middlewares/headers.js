const { Contact } = require("../src/models/contact");

module.exports = async function(req, res, next) {
  let contacts = await Contact.find(
    {},
    { address: 1, email: 1, phone: 1, _id: 0 }
  );

  contacts = contacts[0];
  res.locals.contacts = contacts;
  next();
};
