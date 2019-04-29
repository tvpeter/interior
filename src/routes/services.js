const express = require("express");
const router = express.Router();
const { Service, validate } = require("../models/services");
const headers = require("../../middlewares/headers");
let pageDetails = {
  current: "Services",
  title: "FMG Furniture | Services",
  header: "Our Services"
};

function servicesRouter(nav, contactDetails) {
  const getServices = router.get("/", headers, async (req, res) => {
    const services = await Service.find({});

    res.status(200).render("services/services", {
      nav,
      pageDetails,
      services,
      contacts: res.locals.contacts
    });
  });

  const getServiceForm = router.get("/create", (req, res) => {
    res.render("services/create", {
      nav,
      pageDetails
    });
  });

  const createService = router.post("/create", async (req, res) => {
    //validate the post that it contains all params
    const { error } = validate(req.body);
    if (error) {
      pageDetails.error = error.details[0].message;
      return res.status(400).render("services/create", { nav, pageDetails });
    }

    //check that the req is not in the db
    const service = await Service.findOne({ title: req.body.title });
    if (service) {
      pageDetails.error = "Service already created";
      return res
        .status(409)
        .render("services/create", { nav, pageDetails, contactDetails });
    }

    //create a new service
    const newService = new Service({
      title: req.body.title,
      description: req.body.description
    });
    try {
      await newService.save();
      return res
        .status(200)
        .render("services/create", { nav, pageDetails, contactDetails });
    } catch (error) {
      pageDetails.error = error;
      return res
        .status(400)
        .render("services/create", { nav, pageDetails, contactDetails });
    }
  });

  return [getServices, getServiceForm, createService];
}

module.exports = servicesRouter;
