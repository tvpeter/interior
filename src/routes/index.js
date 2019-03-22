const express = require('express');
const router = express.Router();
const {Service} = require('../models/services');

pageDetails = {
    current: "Home",
    title: "FMG Furniture | Homepage"
}
module.exports = nav => {
return router.get('/', async (req, res)=>{
const services = await Service.find({}).limit(3);

res.status(200).render('index', {
    nav,
    pageDetails,
    services
})

});
}
