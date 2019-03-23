const express = require('express');
const router = express.Router();
const {Contact} = require('../models/contact');

let pageDetails = {
    current : "About Us",
    title : "FMG Furniture | About Us",
    header : "About Us"
}


function aboutRouter(nav) {
const aboutIndex = router.get('/', async (req, res)=>{
    let contacts = await Contact.find({}, {address:1, email:1, phone:1, _id:0});
    contacts = contacts[0];
    res.render('about/about', {
        nav,
        pageDetails, contacts
    });
});

const qualitiesForm = router.get('/create', async(req, res)=>{
    let contacts = await Contact.find({}, {address:1, email:1, phone:1, _id:0});
    contacts = contacts[0];
    res.status(200).render('about/qualities', {
        nav,
        pageDetails, contacts
    })
});

// const createQuality = router.post('/create', async(req, res)=>{

// });

return [aboutIndex, qualitiesForm];

}

module.exports = aboutRouter;