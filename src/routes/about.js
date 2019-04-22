const express = require("express");
const router = express.Router();
const { Contact } = require("../models/contact");
const {
  Quality,
  validateQuality,
  AboutUs,
  validateAboutUs
} = require("../models/about");
const upload = require("../../startup/upload");

let pageDetails = {
  current: "About Us",
  title: "FMG Furniture | About Us",
  header: "About Us"
};

let qualities = "";
function aboutRouter(nav) {
  const aboutIndex = router.get("/", async (req, res) => {
    let contacts = await Contact.find(
      {},
      { address: 1, email: 1, phone: 1, _id: 0 }
    );
    contacts = contacts[0];
    qualities = await Quality.find({});
    res.render("about/about", {
      nav,
      pageDetails,
      contacts,
      qualities
    });
  });

  const qualitiesForm = router.get("/create", async (req, res) => {
    //fetch all the qualities here
    qualities = await Quality.find({});
    res.status(200).render("about/create", {
      nav,
      qualities
    });
  });

  const createQuality = router.post("/create", async (req, res) => {
    //validate the request to ensure all params are present
    const { error } = validateQuality(req.body);
    if (error) {
      pageDetails.error = error.details[0].message;
      res.status(400).render("about/create", {
        nav,
        pageDetails,
        qualities
      });
    }

    //check the db that it is not already created
    const qualityInDb = await Quality.findOne({ title: req.body.title });

    if (qualityInDb) {
      pageDetails.error = "Quality already listed";
      res.status(400).render("about/create", {
        nav,
        pageDetails,
        qualities
      });
    }

    //create a new quality
    const newQuality = new Quality({
      title: req.body.title,
      description: req.body.description
    });

    try {
      await newQuality.save();
      res.status(200).render("about/create", {
        nav,
        pageDetails,
        qualities
      });
    } catch (error) {
      pageDetails.error = error;
      res.status(500).render("about/qualities", {
        nav,
        pageDetails,
        qualities
      });
    }
  });

  const createStory = router.post(
    "/story",
    upload.single("aboutimg"),
    async (req, res) => {
      // validate all params are available
      // check the db
      //insert in the db
      const newAbt = new AboutUs({
        description: req.body.description,
        aboutimg: req.file
      });

      await newAbt.save();

      res.status(200).render("about/create", {
        nav,
        qualities
      });
    }
  );

  return [aboutIndex, qualitiesForm, createQuality, createStory];
}

module.exports = aboutRouter;
