const express = require('express');
const router = express.Router();
const {Contact} = require('../models/contact');

let pageDetails = {
    current : "About Us",
    title : "FMG Furniture | About Us",
    header : "About Us"
}


function aboutRouter(nav) {
return router.get('/', async (req, res)=>{
    let contacts = await Contact.find({}, {address:1, email:1, phone:1, _id:0});
    contacts = contacts[0];
    res.render('about', {
        nav,
        pageDetails, contacts
    });
});
}

module.exports = aboutRouter;