const express = require('express');
const router = express.Router();
const {Service} = require('../models/services');
const { Contact } = require('../models/contact');

pageDetails = {
    current: "Home",
    title: "FMG Furniture | Homepage"
}
module.exports = (nav) => {
return router.get('/', async (req, res)=>{
const services = await Service.find({}).limit(3);
let contacts = await Contact.find({}, {email:1, phone:1, address:1, _id:0});
contacts = contacts[0];
res.status(200).render('index', {
    nav,
    pageDetails,
    services,
    contacts
})

});
}
