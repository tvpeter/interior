const express = require("express");
const router = express.Router();
const { Contact, validate } = require("../models/contact");
const headers = require("../../middlewares/headers");
const auth = require("../../middlewares/auth");

let pageDetails = {
  current: "Contact",
  title: "FMG Furniture | Contact",
  header: "Contact Us"
};

function contactRouter(nav) {
  const contactIndex = router.get("/", headers, async (req, res) => {
    res.render("contact/contact", {
      nav,
      pageDetails,
      contacts: res.locals.contacts
    });
  });

  const contactForm = router.get("/create", auth, (req, res) => {
    res.render("contact/create");
  });

  const createContact = router.post("/create", auth, async (req, res) => {
    // validate that the details are complete
    const { error } = validate(req.body);
    if (error) {
      pageDetails.error = error.details[0].message;
      return res
        .status(400)
        .render("contact/create", { nav, pageDetails, contactDetails });
    }

    //check that it's not in the db
    const contact = await Contact.findOne({ address: req.body.address });

    const phone = await Contact.find({
      phone: { $elemMatch: { $eq: req.body.phone } }
    });

    const email = await Contact.findOne({ email: req.body.email });
    if (contact || email || phone) {
      pageDetails.error = "contact already created";
      return res
        .status(400)
        .render("contact/create", { nav, pageDetails, contactDetails });
    }

    // create and save the contact
    const newContact = new Contact({
      address: req.body.address,
      phone: [req.body.phone, req.body.secondline],
      email: req.body.email
    });

    try {
      await newContact.save();
      return res
        .status(200)
        .render("contact/create", { nav, pageDetails, contactDetails });
    } catch (error) {
      pageDetails.error = error;
      return res
        .status(500)
        .render("contact/create", { nav, pageDetails, contactDetails });
    }
  });

  return [contactIndex, contactForm, createContact];
}

module.exports = contactRouter;
