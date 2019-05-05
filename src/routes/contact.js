const express = require("express");
const router = express.Router();
const { Contact, validate } = require("../models/contact");
const headers = require("../../middlewares/headers");
const auth = require("../../middlewares/auth");
const nodemailer = require("nodemailer");
const Joi = require("joi");
const { Category } = require("../models/category");

function contactRouter(nav) {
  const contactIndex = router.get("/", headers, async (req, res) => {
    const pageDetails = {
      current: "Contact",
      title: "FMG Furniture | Contact",
      header: "Contact Us"
    };
    const categories = await Category.find({}, { _id: 0 });
    res.render("contact/contact", {
      nav,
      pageDetails,
      contacts: res.locals.contacts,
      categories
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
      return res.status(400).redirect("contact/create");
    }

    //check that it's not in the db
    const contact = await Contact.findOne({ address: req.body.address });

    const phone = await Contact.find({
      phone: { $elemMatch: { $eq: req.body.phone } }
    });

    const email = await Contact.findOne({ email: req.body.email });
    if (contact || email || phone) {
      pageDetails.error = "contact already created";
      return res.status(400).redirect("contact/create");
    }

    // create and save the contact
    const newContact = new Contact({
      address: req.body.address,
      phone: [req.body.phone, req.body.secondline],
      email: req.body.email
    });

    try {
      await newContact.save();
      return res.status(200).redirect("contact/create");
    } catch (error) {
      pageDetails.error = error;
      return res.status(500).render("contact/create");
    }
  });

  const viewContacts = router.get("/view", auth, async (req, res) => {
    const contacts = await Contact.find({}, { _id: 0 });
    res.render("contact/view", {
      contacts
    });
  });

  const customerMail = router.post("/mail", async (req, res) => {
    const { error } = validateMail(req.body);
    if (error) {
      msg = error;
      console.log(error);
      return res.redirect("/");
    }

    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: "veda1@ethereal.email",
        pass: "nYwckung5GFfQxh7Du"
      }
    });

    const mailOptions = {
      from: "aondonguemma@gmail.com",
      to: "withtvpeter@gmail.com",
      subject: `Mail from Customer: ${req.body.name}`,
      text: `Product Category: ${req.body.category}, 
        Customer Name: ${req.body.name},
        Customer Email: ${req.body.email},
        Customer Phone: ${req.body.phone},
        Message: ${req.body.message}`
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.log(error);
    }
    pageDetails.error = "You mail has been received. Thank you.";
    return res.redirect("/");
  });

  return [contactIndex, contactForm, createContact, viewContacts, customerMail];
}

function validateMail(mail) {
  const schema = {
    category: Joi.string().required(),
    name: Joi.string()
      .min(4)
      .max(32)
      .required(),
    email: Joi.string()
      .email({ minDomainAtoms: 2 })
      .required(),
    phone: Joi.string()
      .trim()
      .min(11)
      .max(13)
      .required(),
    message: Joi.string().required()
  };
  return Joi.validate(mail, schema);
}

module.exports = contactRouter;
