const express = require('express');
const router = express.Router();
const {Contact} = require('../models/contact');
const {Quality, validate} = require('../models/about');

let pageDetails = {
    current : "About Us",
    title : "FMG Furniture | About Us",
    header : "About Us"
}

let qualities = "";
function aboutRouter(nav) {
const aboutIndex = router.get('/', async (req, res)=>{
    let contacts = await Contact.find({}, {address:1, email:1, phone:1, _id:0});
    contacts = contacts[0];
    qualities = await Quality.find({});
    res.render('about/about', {
        nav,
        pageDetails, contacts, qualities
    });
});

const qualitiesForm = router.get('/create', async(req, res)=>{
    //fetch all the qualities here
    qualities = await Quality.find({});
    res.status(200).render('about/qualities', {
        nav,
        qualities
    })
});

const createQuality = router.post('/create', async(req, res)=>{
    //validate the request to ensure all params are present
    const {error} = validate(req.body);
    if(error){
        pageDetails.error = error.details[0].message;
        res.status(400).render('about/qualities', {
            nav, pageDetails, qualities
        })
    }

    //check the db that it is not already created
    const qualityInDb = await Quality.findOne({'title':req.body.title});

    if(qualityInDb){
        pageDetails.error = "Quality already listed";
        res.status(400).render('about/qualities', {
            nav, pageDetails, qualities
        })
    }
    
    //create a new quality
    const newQuality = new Quality({
        title: req.body.title,
        description: req.body.description
    });

    try {
        await newQuality.save();
        res.status(200).render('about/qualities', {
            nav, pageDetails, qualities
        })
    } catch (error) {
        pageDetails.error = error;
        res.status(500).render('about/qualities', {
            nav, pageDetails, qualities
        })
    }

});

return [aboutIndex, qualitiesForm, createQuality];

}

module.exports = aboutRouter;